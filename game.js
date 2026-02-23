let GAME = null;
let currentCase = null;
let currentNodeId = null;

const elSpeaker = document.getElementById("speaker");
const elText = document.getElementById("text");
const elChoices = document.getElementById("choices");
const elStep = document.getElementById("step");
const elTag = document.getElementById("tag");
const elRestart = document.getElementById("restart");

async function loadGame() {
  const res = await fetch("cases.json");
  GAME = await res.json();
  startCase(0);
}

function startCase(index) {
  currentCase = GAME.cases[index];
  currentNodeId = currentCase.start;
  elStep.textContent = currentCase.title;
  render();
}

function render() {
  const node = currentCase.nodes[currentNodeId];

  if (!node || currentNodeId === "END") {
    elSpeaker.textContent = "Narrator";
    elText.textContent = "Case closed. The rain keeps falling. Another signal will surface.";
    elChoices.innerHTML = `<button onclick="startCase(0)">Open Case Again</button>`;
    elTag.textContent = "";
    return;
  }

  elSpeaker.textContent = node.speaker;
  elText.textContent = node.text;
  elTag.textContent = node.tag ? `5A Stage: ${node.tag}` : "";

  elChoices.innerHTML = "";

  node.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.label;
    btn.addEventListener("click", () => {
      currentNodeId = choice.next;
      render();
    });
    elChoices.appendChild(btn);
  });
}

elRestart.addEventListener("click", () => startCase(0));

loadGame();
