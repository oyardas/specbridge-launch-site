#!/usr/bin/env node

"use strict";

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const net = require("node:net");

const BASE_URL = "https://specbridge.co/";
const I18N_URL = "https://specbridge.co/assets/i18n.js";
const CODES = ["tr", "en", "zh", "ru", "ar"];
const BUTTON_CODES = "tr|en|zh|ru|ar";
const BUTTON_LABELS = "Türkçe|English|中文|Русский|العربية";
const FINAL_MARKER = "R-LAUNCH.6-D_NODE_CDP_LIVE_BROWSER_UX_SMOKE_OK";

function assertOk(value, message) {
  if (!value) {
    throw new Error(message);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function browserPath() {
  const candidates = [
    process.env["ProgramFiles"] && path.join(process.env["ProgramFiles"], "Microsoft", "Edge", "Application", "msedge.exe"),
    process.env["ProgramFiles(x86)"] && path.join(process.env["ProgramFiles(x86)"], "Microsoft", "Edge", "Application", "msedge.exe"),
    process.env["LOCALAPPDATA"] && path.join(process.env["LOCALAPPDATA"], "Microsoft", "Edge", "Application", "msedge.exe"),
    process.env["ProgramFiles"] && path.join(process.env["ProgramFiles"], "Google", "Chrome", "Application", "chrome.exe"),
    process.env["ProgramFiles(x86)"] && path.join(process.env["ProgramFiles(x86)"], "Google", "Chrome", "Application", "chrome.exe"),
    process.env["LOCALAPPDATA"] && path.join(process.env["LOCALAPPDATA"], "Google", "Chrome", "Application", "chrome.exe")
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on("error", reject);
  });
}

function readBlock(source, code) {
  const match = new RegExp("\\n\\s*" + code + "\\s*:\\s*\\{", "m").exec(source);
  assertOk(match, "Missing i18n language block: " + code);

  const start = source.indexOf("{", match.index);
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < source.length; i++) {
    const char = source[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (char === "\\") {
        escape = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
    } else if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0) {
        return source.slice(start + 1, i);
      }
    }
  }

  throw new Error("Unclosed i18n language block: " + code);
}

function readString(block, key) {
  const match = new RegExp(key + "\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\"", "m").exec(block);
  assertOk(match, "Missing i18n key: " + key);
  return JSON.parse("\"" + match[1] + "\"");
}

async function liveExpectations() {
  const response = await fetch(I18N_URL, { redirect: "follow" });
  assertOk(response.status === 200, "Live i18n.js status is not 200: " + response.status);

  const source = await response.text();
  const result = {};

  for (const code of CODES) {
    const block = readBlock(source, code);
    result[code] = {
      code,
      lang: readString(block, "lang"),
      dir: readString(block, "dir"),
      hero: readString(block, "hero_title"),
      label: readString(block, "language_label")
    };
  }

  return result;
}

async function json(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(1000) });
  return response.json();
}

function cdpConnect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const pending = new Map();

    ws.onopen = () => {
      resolve({
        seq: 1,
        command(method, params) {
          const id = this.seq++;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((ok, fail) => pending.set(id, { ok, fail }));
        },
        close() {
          try {
            ws.close();
          } catch {}
        }
      });
    };

    ws.onerror = () => reject(new Error("CDP websocket connection failed"));

    ws.onmessage = (event) => {
      const message = JSON.parse(String(event.data));
      const item = pending.get(message.id);
      if (!item) {
        return;
      }

      pending.delete(message.id);

      if (message.error) {
        item.fail(new Error(JSON.stringify(message.error)));
      } else {
        item.ok(message);
      }
    };
  });
}

async function evaluate(client, expression) {
  const response = await client.command("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true
  });

  assertOk(response.result && response.result.result && typeof response.result.result.value === "string", "Runtime.evaluate did not return string");
  return response.result.result.value;
}

async function browserCheck(executable, url, profile) {
  const port = await freePort();

  const child = spawn(executable, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-features=Translate,OptimizationHints,MediaRouter",
    "--remote-debugging-port=" + port,
    "--user-data-dir=" + profile,
    "about:blank"
  ], {
    windowsHide: true,
    stdio: ["ignore", "ignore", "ignore"]
  });

  let client = null;

  try {
    let ready = false;

    for (let i = 0; i < 80; i++) {
      try {
        const version = await json("http://127.0.0.1:" + port + "/json/version");
        if (version.webSocketDebuggerUrl) {
          ready = true;
          break;
        }
      } catch {
        await delay(250);
      }
    }

    assertOk(ready, "Browser DevTools endpoint did not become ready");

    const tabs = await json("http://127.0.0.1:" + port + "/json");
    const page = tabs.find((item) => item.type === "page");
    assertOk(page && page.webSocketDebuggerUrl, "No page target found");

    client = await cdpConnect(page.webSocketDebuggerUrl);
    await client.command("Page.enable", {});
    await client.command("Runtime.enable", {});
    await client.command("Page.navigate", { url });

    const readyScript = "JSON.stringify({href:window.location.href,readyState:document.readyState,bodyTextLength:document.body?document.body.innerText.length:0,h1:(document.querySelector('h1')||{}).innerText||'',htmlLang:document.documentElement.lang,htmlDir:document.documentElement.dir})";

    let loaded = false;
    let state = null;

    for (let i = 0; i < 100; i++) {
      await delay(250);
      state = JSON.parse(await evaluate(client, readyScript));

      if (
        state.href.startsWith("https://specbridge.co/") &&
        state.readyState === "complete" &&
        state.bodyTextLength > 1000 &&
        state.h1
      ) {
        loaded = true;
        break;
      }
    }

    console.log("Loaded href: " + state.href);
    console.log("Loaded readyState: " + state.readyState);
    console.log("Loaded bodyTextLength: " + state.bodyTextLength);
    console.log("Loaded preliminary h1: " + state.h1);
    console.log("Loaded preliminary htmlLang/htmlDir: " + state.htmlLang + "/" + state.htmlDir);

    assertOk(loaded, "Page did not reach expected loaded state");

    const finalScript = "JSON.stringify({href:window.location.href,htmlLang:document.documentElement.lang,htmlDir:document.documentElement.dir,h1:(document.querySelector('h1')||{}).innerText||'',activeLang:Array.from(document.querySelectorAll('[data-lang]')).filter((b)=>b.classList.contains('active')||b.getAttribute('aria-pressed')==='true').map((b)=>b.getAttribute('data-lang')).join('|'),buttonCodes:Array.from(document.querySelectorAll('[data-lang]')).map((b)=>b.getAttribute('data-lang')).join('|'),buttonLabels:Array.from(document.querySelectorAll('[data-lang]')).map((b)=>b.innerText.trim()).join('|'),pressedPairs:Array.from(document.querySelectorAll('[data-lang]')).map((b)=>b.getAttribute('data-lang')+'='+b.getAttribute('aria-pressed')).join('|'),storage:localStorage.getItem('specbridge-language')||'',sampleLinks:Array.from(document.querySelectorAll('a[href]')).map((a)=>a.getAttribute('href')).filter((href)=>href&&(href.includes('sample')||href.includes('download')||href.endsWith('.zip')||href.endsWith('.html'))).join('|')})";

    return JSON.parse(await evaluate(client, finalScript));
  } finally {
    if (client) {
      client.close();
    }

    try {
      child.kill();
    } catch {}

    await delay(750);
  }
}

function checkLanguage(result, expected, requireQuery) {
  assertOk(result.htmlLang === expected.lang, "htmlLang mismatch for " + expected.code);
  assertOk(result.htmlDir === expected.dir, "htmlDir mismatch for " + expected.code);
  assertOk(result.h1 === expected.hero, "hero_title mismatch for " + expected.code);
  assertOk(result.activeLang === expected.code, "activeLang mismatch for " + expected.code);
  assertOk(result.storage === expected.code, "localStorage mismatch for " + expected.code);
  assertOk(result.buttonCodes === BUTTON_CODES, "Language button code set mismatch for " + expected.code);
  assertOk(result.buttonLabels === BUTTON_LABELS, "Language button label set mismatch for " + expected.code);
  assertOk(result.pressedPairs.includes(expected.code + "=true"), "Active aria-pressed mismatch for " + expected.code);

  if (requireQuery) {
    assertOk(result.href.includes("lang=" + expected.code), "href missing language query for " + expected.code);
  }
}

async function checkSampleLinks(sampleLinks) {
  assertOk(sampleLinks && sampleLinks.trim().length > 0, "No sample/download links found");

  const links = Array.from(new Set(sampleLinks.split("|").filter(Boolean)));

  for (const href of links) {
    const absolute = new URL(href, BASE_URL).href;
    const response = await fetch(absolute, { redirect: "follow" });
    assertOk(response.status === 200, "Sample link status is not 200: " + absolute + " status=" + response.status);
    console.log("OK sample link 200: " + absolute);
  }
}

async function main() {
  assertOk(typeof WebSocket !== "undefined", "Global WebSocket is not available. Use Node.js 22+.");

  const executable = browserPath();
  assertOk(executable, "No supported browser found. Expected Microsoft Edge or Google Chrome.");

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "specbridge-launch-browser-smoke-"));

  try {
    console.log("=== BROWSER DISCOVERY ===");
    console.log("Browser: " + executable);
    console.log("");

    console.log("=== LIVE I18N EXPECTATION FETCH ===");
    const expectations = await liveExpectations();

    for (const code of CODES) {
      const expected = expectations[code];
      console.log(code + ": lang=" + expected.lang + ", dir=" + expected.dir + ", hero=" + expected.hero);
    }

    console.log("");
    console.log("=== DEFAULT LANGUAGE SMOKE ===");

    const defaultProfile = path.join(tempRoot, "default");
    fs.mkdirSync(defaultProfile, { recursive: true });

    const defaultResult = await browserCheck(executable, BASE_URL, defaultProfile);

    console.log("Default href: " + defaultResult.href);
    console.log("Default htmlLang: " + defaultResult.htmlLang);
    console.log("Default htmlDir: " + defaultResult.htmlDir);
    console.log("Default h1: " + defaultResult.h1);
    console.log("Default activeLang: " + defaultResult.activeLang);
    console.log("Default storage: " + defaultResult.storage);
    console.log("Default buttonCodes: " + defaultResult.buttonCodes);
    console.log("Default buttonLabels: " + defaultResult.buttonLabels);
    console.log("Default pressedPairs: " + defaultResult.pressedPairs);

    checkLanguage(defaultResult, expectations.tr, false);
    console.log("OK default Turkish render and language buttons");
    console.log("");

    console.log("=== QUERY PARAM LANGUAGE SMOKE ===");

    for (const code of CODES) {
      const profile = path.join(tempRoot, "query-" + code);
      fs.mkdirSync(profile, { recursive: true });

      const result = await browserCheck(executable, BASE_URL + "?lang=" + code, profile);
      console.log(code + ": href=" + result.href + ", htmlLang=" + result.htmlLang + ", htmlDir=" + result.htmlDir + ", activeLang=" + result.activeLang + ", storage=" + result.storage);

      checkLanguage(result, expectations[code], true);
      console.log("OK query language: " + code);
    }

    console.log("");
    console.log("=== LOCALSTORAGE PERSISTENCE SMOKE ===");

    const persistProfile = path.join(tempRoot, "persist");
    fs.mkdirSync(persistProfile, { recursive: true });

    const persistSeed = await browserCheck(executable, BASE_URL + "?lang=ru", persistProfile);
    checkLanguage(persistSeed, expectations.ru, true);

    const persistBase = await browserCheck(executable, BASE_URL, persistProfile);
    checkLanguage(persistBase, expectations.ru, false);

    console.log("OK localStorage persistence via shared browser profile");
    console.log("");

    console.log("=== ARABIC RTL SMOKE ===");

    const arabicProfile = path.join(tempRoot, "arabic");
    fs.mkdirSync(arabicProfile, { recursive: true });

    const arabic = await browserCheck(executable, BASE_URL + "?lang=ar", arabicProfile);
    checkLanguage(arabic, expectations.ar, true);
    assertOk(arabic.htmlDir === "rtl", "Arabic htmlDir is not rtl");
    assertOk(arabic.buttonLabels.includes("العربية"), "Arabic label missing");

    console.log("OK Arabic RTL render");
    console.log("");

    console.log("=== SAMPLE LINK LIVE BEHAVIOR SMOKE ===");
    await checkSampleLinks(defaultResult.sampleLinks);

    console.log("");
    console.log("=== R-LAUNCH.6-D NODE CDP RESULT ===");
    console.log(FINAL_MARKER);
  } finally {
    try {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    } catch {}
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
