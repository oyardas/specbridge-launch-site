
(() => {
  "use strict";

  const scene = document.querySelector("[data-v7-scroll]");
  if (!scene) return;

  const root = document.documentElement;
  const body = document.body;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = window.matchMedia("(min-width: 960px)");
  const graph = scene.querySelector("[data-v7-graph]");
  const edgeLayer = scene.querySelector("[data-v7-edges]");
  const nodeLayer = scene.querySelector("[data-v7-nodes]");
  const copies = Array.from(scene.querySelectorAll("[data-v7-copy]"));
  const focusCard = scene.querySelector("[data-v7-focus]");
  const chain = scene.querySelector("[data-v7-chain]");
  const riskBadges = scene.querySelector("[data-v7-risk]");
  const flow = scene.querySelector("[data-v7-flow]");
  const flowTrack = scene.querySelector("[data-v7-flow-track]");
  const flowDot = scene.querySelector("[data-v7-flow-dot]");
  const workspace = scene.querySelector("[data-v7-workspace]");
  const progressThumb = scene.querySelector("[data-v7-progress-thumb]");
  const sticky = scene.querySelector(".v7-sticky");

  const NS = "http://www.w3.org/2000/svg";
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smooth = (value) => {
    const x = clamp(value);
    return x * x * (3 - 2 * x);
  };
  const easeOut = (value) => {
    const x = clamp(value);
    return 1 - Math.pow(1 - x, 3);
  };
  const mix = (a, b, t) => a + (b - a) * t;

  const stageBounds = [
    [0.00, 0.16],
    [0.16, 0.32],
    [0.32, 0.49],
    [0.49, 0.66],
    [0.66, 0.82],
    [0.82, 1.00],
  ];

  const graphNodes = [];
  const graphEdges = [];
  const nodeCount = 78;
  const focusIndex = 11;
  const evidenceIndex = 35;
  const sourceIndex = 61;
  const riskIndices = new Set([4, 17, 23, 29, 46, 52, 67, 71]);

  function seeded(index, salt) {
    const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  function makeNode(index) {
    const phi = Math.acos(1 - 2 * ((index + 0.5) / nodeCount));
    const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);
    const sphere = {
      x: 350 + 205 * Math.sin(phi) * Math.cos(theta),
      y: 300 + 205 * Math.cos(phi),
    };

    const clusterCenters = [
      [175, 120], [350, 120], [515, 190], [225, 300],
      [430, 315], [190, 445], [480, 455],
    ];
    const cluster = clusterCenters[index % clusterCenters.length];
    const graphPoint = {
      x: cluster[0] + (seeded(index, 1) - 0.5) * 92,
      y: cluster[1] + (seeded(index, 2) - 0.5) * 68,
    };

    const rowPoint = {
      x: 230 + (index % 5) * 70 + (seeded(index, 3) - 0.5) * 10,
      y: 165 + (index % 8) * 47 + (seeded(index, 4) - 0.5) * 6,
    };

    const circle = document.createElementNS(NS, "circle");
    circle.setAttribute("r", index === focusIndex ? "5.2" : index === evidenceIndex ? "4.8" : index === sourceIndex ? "4.2" : "2.2");
    circle.classList.add("v7-node");
    if (index % 7 === 0) circle.classList.add("is-cyan");
    if (index % 13 === 0) circle.classList.add("is-soft");
    if (index === focusIndex) circle.classList.add("is-focus");
    if (index === evidenceIndex) circle.classList.add("is-evidence");
    if (index === sourceIndex) circle.classList.add("is-source");
    if (riskIndices.has(index)) circle.classList.add(index % 3 === 0 ? "is-critical" : "is-risk");
    nodeLayer.appendChild(circle);

    return { circle, sphere, graph: graphPoint, row: rowPoint };
  }

  function makeEdge(a, b, highlight) {
    const line = document.createElementNS(NS, "line");
    line.classList.add("v7-edge");
    if (highlight) line.classList.add("is-highlight");
    edgeLayer.appendChild(line);
    return { line, a, b, highlight };
  }

  for (let i = 0; i < nodeCount; i += 1) {
    graphNodes.push(makeNode(i));
  }

  for (let i = 0; i < 43; i += 1) {
    const a = (i * 7 + 3) % nodeCount;
    const b = (a + 1 + (i % 6)) % nodeCount;
    graphEdges.push(makeEdge(a, b, false));
  }
  graphEdges.push(makeEdge(focusIndex, evidenceIndex, true));
  graphEdges.push(makeEdge(evidenceIndex, sourceIndex, true));

  function stageLocal(progress, index) {
    const [start, end] = stageBounds[index];
    return clamp((progress - start) / (end - start));
  }

  function activeStage(progress) {
    for (let i = 0; i < stageBounds.length; i += 1) {
      if (progress <= stageBounds[i][1]) return i;
    }
    return stageBounds.length - 1;
  }

  function copyVisibility(progress, index) {
    const [start, end] = stageBounds[index];
    const feather = 0.018;
    const enter = smooth((progress - start) / feather);
    const leave = smooth((end - progress) / feather);
    return Math.min(enter, leave);
  }

  function pointForNode(node, progress, stage) {
    if (stage === 0) {
      const q = easeOut(stageLocal(progress, 0));
      return {
        x: mix(node.sphere.x, node.graph.x, q),
        y: mix(node.sphere.y, node.graph.y, q),
      };
    }

    if (stage === 1) {
      const q = easeOut(stageLocal(progress, 1));
      if (node === graphNodes[focusIndex]) {
        return { x: mix(node.graph.x, 275, q), y: mix(node.graph.y, 265, q) };
      }
      return {
        x: 350 + (node.graph.x - 350) * (1 + 0.13 * q) - 65 * q,
        y: 300 + (node.graph.y - 300) * (1 + 0.08 * q),
      };
    }

    if (stage === 2) {
      const q = easeOut(stageLocal(progress, 2));
      if (node === graphNodes[focusIndex]) return { x: mix(node.graph.x, 230, q), y: mix(node.graph.y, 205, q) };
      if (node === graphNodes[evidenceIndex]) return { x: mix(node.graph.x, 455, q), y: mix(node.graph.y, 325, q) };
      if (node === graphNodes[sourceIndex]) return { x: mix(node.graph.x, 330, q), y: mix(node.graph.y, 485, q) };
      return { x: node.graph.x - 70 * q, y: node.graph.y };
    }

    if (stage === 3) {
      const pulse = 1 + Math.sin(performance.now() / 520) * 0.012;
      return {
        x: 350 + (node.graph.x - 350) * pulse,
        y: 300 + (node.graph.y - 300) * pulse,
      };
    }

    if (stage === 4) {
      return node.graph;
    }

    const q = easeOut(stageLocal(progress, 5));
    return {
      x: mix(node.graph.x, node.row.x, q),
      y: mix(node.graph.y, node.row.y, q),
    };
  }

  function updateNodes(progress, stage) {
    graphNodes.forEach((node, index) => {
      const point = pointForNode(node, progress, stage);
      node.circle.setAttribute("cx", point.x.toFixed(2));
      node.circle.setAttribute("cy", point.y.toFixed(2));

      let opacity = 0.92;
      if ((stage === 1 || stage === 2) && ![focusIndex, evidenceIndex, sourceIndex].includes(index)) opacity = 0.18;
      if (stage === 4) opacity = 0.12;
      if (stage === 5) opacity = 0.78 * (1 - smooth(stageLocal(progress, 5) * 1.08));
      node.circle.style.opacity = opacity.toFixed(3);
    });

    graphEdges.forEach((edge) => {
      const a = graphNodes[edge.a].circle;
      const b = graphNodes[edge.b].circle;
      edge.line.setAttribute("x1", a.getAttribute("cx"));
      edge.line.setAttribute("y1", a.getAttribute("cy"));
      edge.line.setAttribute("x2", b.getAttribute("cx"));
      edge.line.setAttribute("y2", b.getAttribute("cy"));
      let opacity = edge.highlight && stage === 2 ? 1 : 0.42;
      if (stage === 4) opacity = 0.05;
      if (stage === 5) opacity *= 1 - smooth(stageLocal(progress, 5));
      edge.line.style.opacity = opacity.toFixed(3);
    });
  }

  function setPresence(element, value, y = 18, scale = 1) {
    if (!element) return;
    const v = clamp(value);
    element.style.opacity = v.toFixed(3);
    element.style.transform = `translate3d(0, ${((1 - v) * y).toFixed(2)}px, 0) scale(${(1 + (scale - 1) * (1 - v)).toFixed(4)})`;
  }

  function update(progress) {
    const stage = activeStage(progress);
    scene.dataset.v7Active = String(stage);
    scene.className = scene.className.replace(/\bv7-stage-\d\b/g, "").trim() + ` v7-stage-${stage}`;

    copies.forEach((copy, index) => {
      const visibility = copyVisibility(progress, index);
      const midpoint = (stageBounds[index][0] + stageBounds[index][1]) / 2;
      const direction = progress < midpoint ? 1 : -1;
      copy.style.opacity = visibility.toFixed(3);
      copy.style.transform = `translateY(calc(-50% + ${((1 - visibility) * 34 * direction).toFixed(2)}px))`;
      copy.style.clipPath = `inset(${((1 - visibility) * 18).toFixed(2)}% 0 ${((1 - visibility) * 18).toFixed(2)}% 0)`;
    });

    const focusV = stage === 1 ? smooth(Math.min(stageLocal(progress, 1) * 2.1, (1 - stageLocal(progress, 1)) * 3.0)) : 0;
    const chainV = stage === 2 ? smooth(Math.min(stageLocal(progress, 2) * 2.0, (1 - stageLocal(progress, 2)) * 3.0)) : 0;
    const riskV = stage === 3 ? smooth(Math.min(stageLocal(progress, 3) * 2.0, (1 - stageLocal(progress, 3)) * 3.0)) : 0;
    const flowV = stage === 4 ? smooth(Math.min(stageLocal(progress, 4) * 2.0, (1 - stageLocal(progress, 4)) * 3.0)) : 0;
    const workspaceV = stage === 5 ? smooth(stageLocal(progress, 5) * 1.7) : 0;

    setPresence(focusCard, focusV, 24, 0.97);
    setPresence(chain, chainV, 22, 0.98);
    setPresence(riskBadges, riskV, 16, 1);
    setPresence(flow, flowV, 0, 1);
    setPresence(workspace, workspaceV, 18, 0.94);

    if (stage === 4 && flowTrack) {
      const q = easeOut(stageLocal(progress, 4));
      const rtl = root.dir === "rtl";
      const distance = Math.min(720, Math.max(420, flowTrack.scrollWidth - window.innerWidth * 0.50));
      const signed = rtl ? distance * q : -distance * q;
      flowTrack.style.transform = `translate3d(${signed.toFixed(2)}px, -50%, 0)`;
      if (flowDot) {
        flowDot.style.transform = `translateX(${(q * Math.max(0, window.innerWidth * 0.80)).toFixed(2)}px)`;
      }
    }

    const graphLocal = stage === 0 ? stageLocal(progress, 0) : 1;
    let graphScale = 1;
    let graphTranslate = 0;
    let graphOpacity = 1;

    if (stage === 0) graphScale = 1 + 0.18 * graphLocal;
    if (stage === 1) { graphScale = 1.03; graphTranslate = -28; }
    if (stage === 2) { graphScale = 0.95; graphTranslate = -52; graphOpacity = 0.70; }
    if (stage === 3) { graphScale = 1.04; graphOpacity = 1; }
    if (stage === 4) graphOpacity = 0.18;
    if (stage === 5) graphOpacity = 0.72 * (1 - workspaceV);

    if (graph) {
      graph.style.opacity = graphOpacity.toFixed(3);
      graph.style.transform = `translate3d(${graphTranslate}px, 0, 0) scale(${graphScale.toFixed(4)})`;
    }

    updateNodes(progress, stage);

    if (sticky) {
      sticky.style.setProperty("--v7-grid-x", `${(-progress * 34).toFixed(2)}px`);
      sticky.style.setProperty("--v7-grid-y", `${(-progress * 20).toFixed(2)}px`);
    }

    if (progressThumb) {
      progressThumb.style.setProperty("--v7-progress-y", `${(progress * 550).toFixed(2)}px`);
    }
  }

  let ticking = false;
  let enhanced = false;

  function computeProgress() {
    const rect = scene.getBoundingClientRect();
    const distance = Math.max(1, scene.offsetHeight - window.innerHeight);
    return clamp(-rect.top / distance);
  }

  function render() {
    ticking = false;
    if (!enhanced) return;
    update(computeProgress());
  }

  function requestRender() {
    if (!enhanced && !ticking) return;
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(render);
  }

  function setEnhanced() {
    const next = desktopQuery.matches && !motionQuery.matches;
    enhanced = next;
    body.classList.toggle("v7-enhanced", next);
    if (next) {
      requestRender();
    } else {
      scene.className = scene.className.replace(/\bv7-stage-\d\b/g, "").trim();
    }
  }

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender, { passive: true });
  if (typeof desktopQuery.addEventListener === "function") desktopQuery.addEventListener("change", setEnhanced);
  if (typeof motionQuery.addEventListener === "function") motionQuery.addEventListener("change", setEnhanced);

  const dirObserver = new MutationObserver(requestRender);
  dirObserver.observe(root, { attributes: true, attributeFilter: ["dir"] });

  setEnhanced();
})();
