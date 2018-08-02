const input = document.querySelector("#fake-input");
const btnPrimary = document.querySelector("#btn-primary");
const modal = document.querySelector(".modal");
const gameFrame = document.querySelector(".game-frame");
const display = document.querySelector(".phrase-display");
const desktopKeys = document.querySelectorAll(".keyboard-letter");
const failedContainer = document.querySelector(".failed-display");
// Event listeners
btnPrimary.addEventListener("click", startGame);
gameFrame.addEventListener("click", showKeyboard);
input.addEventListener("input", checkLetter);
desktopKeys.forEach(key =>
  key.addEventListener("click", () => addLetterToInput(key.dataset.key))
);

// Game sounds
const sound = setGameSounds();
function setGameSounds() {
  const sound = {};
  const actions = ["click", "fail", "show", "lose", "win"];
  actions.forEach(action => {
    sound[action] = document.querySelector(`#${action}-sound`);
  });
  return sound;
}

// Game Logic
const renderPhrase = phrase => {
  toggleModal();
  display.innerHTML = "";

  phrase.map((letter, index) => {
    display.innerHTML += `<div class="${
      letter.character == " " ? "empty" : "letter"
    }" data-index="${index}">${letter.hidden ? "" : letter.character}</div>`;
  });
};

function startGame(event) {
  sound["click"].play();
  wheel.startGame(getUserSelections());
  const gameState = wheel.getGameState();
  setTimeout(() => {
    renderPhrase(gameState["phrase"]);
  }, 150);
  document.querySelector("#life-number").textContent = gameState["lifes"];
  desktopKeys.forEach(key => key.classList.remove("success", "warning"));
  showFail(gameState["failed"]);
}

function getUserSelections() {
  const select = document.querySelectorAll("select");
  const options = { failed: [] };
  const selections = Array.from(select).map(selection => {
    options[selection.getAttribute("name")] = selection.value;
  });
  options["lifes"] = lifesBasedOnDifficulty(options["difficulty"]);
  return options;
}

function lifesBasedOnDifficulty(level) {
  let lifes;
  switch (level) {
    case "easy":
      lifes = 5;
      break;
    case "normal":
      lifes = 4;
      break;
    case "hard":
      lifes = 3;
      break;
  }
  return lifes;
}
function showKeyboard() {
  input.focus();
}

function toggleModal() {
  modal.classList.toggle("hide");
}

function showLetter(indexes, letter, status) {
  const keyboardLetter = document.querySelector(
    `.keyboard-letter[data-key="${letter}"]`
  );

  if (status === "success") {
    const phraseLetters = document.querySelectorAll(`.letter`);
    const correctLetters = [];

    phraseLetters.forEach(char => {
      if (indexes.includes(parseInt(char.dataset.index))) {
        correctLetters.push(char);
      }
    });

    correctLetters.forEach(char => {
      char.innerHTML = letter;
      char.classList.add("success");
    });
    keyboardLetter.classList.add("success");
  } else if (status === "warning") {
    keyboardLetter.classList.add("warning");
  }
}

function showFail(failedLetters) {
  failedContainer.innerHTML = " ";
  failedLetters.map(letter => {
    generateFailedLetter(letter);
  });
}

function generateFailedLetter(letter) {
  const div = document.createElement("div");
  div.setAttribute("class", "letter warning");
  div.innerText = letter;
  failedContainer.appendChild(div);
}

function checkLetter() {
  const gameState = wheel.getGameState();
  const letter = input.value[input.value.length - 1];
  const indexes = wheel.checkUserInput(letter);
  const failedLetters = gameState["failed"];

  if (indexes.length >= 1) {
    showLetter(indexes, letter, "success");
    sound["show"];
    if (isGameWon(gameState)) {
      finishGame("win");
    }
  } else if (!failedLetters.includes(letter)) {
    wheel.subtractLife();
    document.querySelector("#life-number").textContent = gameState["lifes"];
    if (gameState["lifes"] === 0) {
      finishGame();
    }
    showLetter(null, letter, "warning");
    const failedLettersUpdated = wheel.setFailedLetter(letter);
    showFail(failedLettersUpdated);
    sound["fail"].play();
  }
}

function addLetterToInput(key) {
  sound["click"].play();
  input.value = key;
  checkLetter();
}

function finishGame(status) {
  const h1 = modal.querySelector("h1");
  const button = modal.querySelector("button");
  if (status === "win") {
    modal.classList.remove("warning");
    modal.classList.add("success");
    toggleModal();
    sound["win"].play();
    h1.innerText = "YOU WIN :)";
    button.innerText = "Restart game";
  } else {
    modal.classList.remove("success");
    modal.classList.add("warning");
    toggleModal();
    sound["lose"].play();
    h1.innerText = "YOU LOST :(";
    button.textContent = "Restart game";
  }
}

function isGameWon(gameState) {
  const phrase = gameState["phrase"];
  const lettersFiltered = phrase.filter(letter => !letter.hidden);
  return phrase.length === lettersFiltered.length;
}
