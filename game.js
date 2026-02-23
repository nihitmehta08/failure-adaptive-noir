let GAME = null;
let currentCaseIndex = 0;
let currentCase = null;
let currentNodeId = null;

const elSpeaker = document.getElementById("speaker");
const elText = document.getElementById("text");
const elChoices = document.getElementById("choices");
const elTag = document.getElementById("tag");
const elRestart = document.getElementById("restart");
const elCaseSelect = document.getElementById("caseSelect");

async function loadGame() {
  const res = await fetch("cases.json");
  GAME = await res.json();

  // Build dropdown
  elCaseSelect.innerHTML = "";
  GAME.cases.forEach((c, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = c.title || `Case ${i + 1}`;
    elCaseSelect.appendChild(opt);
  });

  elCaseSelect.addEventListener("change", () => {
    const idx = Number(elCaseSelect.value);
    startCase(idx);
  });

  startCase(0);
}

function startCase(index) {
  currentCaseIndex = index;
  currentCase = GAME.cases[currentCaseIndex];
  currentNodeId = currentCase.start;
  elCaseSelect.value = String(currentCaseIndex);
  render();
}

function render() {
  const node = currentCase.nodes[currentNodeId];

  // End screen
  if (!node || currentNodeId === "END") {
    elSpeaker.textContent = "Narrator";
    elText.textContent = "Case closed. The rain keeps falling. Another signal will surface.";
    elTag.textContent = "";

    const nextIndex = (currentCaseIndex + 1) % GAME.cases.length;

    elChoices.innerHTML = "";
    const btnNext = document.createElement("button");
    btnNext.textContent = `Next Case: ${GAME.cases[nextIndex].title || `Case ${nextIndex + 1}`}`;
    btnNext.addEventListener("click", () => startCase(nextIndex));

    const btnReplay = document.createElement("button");
    btnReplay.textContent = "Replay This Case";
    btnReplay.addEventListener("click", () => startCase(currentCaseIndex));

    elChoices.appendChild(btnNext);
    elChoices.appendChild(btnReplay);
    return;
  }

  elSpeaker.textContent = node.speaker || "Narrator";
  elText.textContent = node.text || "";
  elTag.textContent = node.tag ? `5A Stage: ${node.tag}` : "";

  elChoices.innerHTML = "";
  (node.choices || []).forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.label;
    btn.addEventListener("click", () => {
      currentNodeId = choice.next;
      render();
    });
    elChoices.appendChild(btn);
  });
}

elRestart.addEventListener("click", () => startCase(currentCaseIndex));

loadGame().catch(() => {
  elSpeaker.textContent = "Narrator";
  elText.textContent = "Could not load case files. Check cases.json is in the repo root.";
});
