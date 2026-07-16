(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("rc1-js");

  const reducedMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  function setupTabGroup(container, options) {
    if (!container) {
      return null;
    }

    const tabs = Array.from(container.querySelectorAll('[role="tab"][data-rc1-tab]'));
    const scope = options && options.scope ? options.scope : document;
    const panels = Array.from(scope.querySelectorAll("[data-rc1-panel]"));
    const keys = new Set(tabs.map((tab) => tab.dataset.rc1Tab));
    const relevantPanels = panels.filter((panel) => keys.has(panel.dataset.rc1Panel));

    if (!tabs.length || tabs.length !== relevantPanels.length) {
      return null;
    }

    let activeIndex = Math.max(0, tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"));

    function activate(index, focus) {
      activeIndex = (index + tabs.length) % tabs.length;
      tabs.forEach((tab, tabIndex) => {
        const selected = tabIndex === activeIndex;
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.tabIndex = selected ? 0 : -1;
        if (selected && focus) {
          tab.focus();
        }
      });
      relevantPanels.forEach((panel) => {
        panel.hidden = panel.dataset.rc1Panel !== tabs[activeIndex].dataset.rc1Tab;
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(index, false));
      tab.addEventListener("keydown", (event) => {
        let nextIndex = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = activeIndex + 1;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = activeIndex - 1;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        }
        if (nextIndex !== null) {
          event.preventDefault();
          activate(nextIndex, true);
        }
      });
    });

    activate(activeIndex, false);

    return {
      activate,
      count: tabs.length,
      currentIndex: () => activeIndex,
    };
  }

  const story = document.querySelector("[data-rc1-story]");
  const storyGroup = setupTabGroup(story, { scope: story || document });
  const demoGroup = setupTabGroup(document.querySelector("#demo-flow"), { scope: document.querySelector("#demo-flow") || document });
  const roleGroup = setupTabGroup(document.querySelector("#roles"), { scope: document.querySelector("#roles") || document });
  const outputGroup = setupTabGroup(document.querySelector(".rc1-output-explorer"), { scope: document.querySelector(".rc1-output-explorer") || document });

  void demoGroup;
  void roleGroup;
  void outputGroup;

  if (!story || !storyGroup) {
    return;
  }

  const pauseButton = story.querySelector("[data-rc1-pause]");
  let pausedByUser = false;
  let timer = null;

  function prefersReducedMotion() {
    return Boolean(reducedMotion && reducedMotion.matches);
  }

  function stopTimer() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startTimer() {
    stopTimer();
    if (pausedByUser || prefersReducedMotion() || document.hidden) {
      return;
    }
    timer = window.setInterval(() => {
      storyGroup.activate(storyGroup.currentIndex() + 1, false);
    }, 5500);
  }

  function updatePauseLabel() {
    if (!pauseButton) {
      return;
    }
    pauseButton.setAttribute("aria-pressed", pausedByUser ? "true" : "false");
    const pauseLabel = pauseButton.querySelector("[data-rc1-pause-label]");
    const resumeLabel = pauseButton.querySelector("[data-rc1-resume-label]");
    if (pauseLabel) {
      pauseLabel.hidden = pausedByUser;
    }
    if (resumeLabel) {
      resumeLabel.hidden = !pausedByUser;
    }
  }

  if (pauseButton) {
    pauseButton.addEventListener("click", () => {
      pausedByUser = !pausedByUser;
      updatePauseLabel();
      startTimer();
    });
  }

  document.addEventListener("visibilitychange", startTimer);
  if (reducedMotion && typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", startTimer);
  }

  startTimer();
})();
