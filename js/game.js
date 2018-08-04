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
const renderPhrase = (phrase = []) => {
  toggleModal(null, "WHEEL OF SUCCESS", "Start game");
  display.innerHTML = "";

  phrase.map((letter, index) => {
    if (letter.character !== " ") {
      display.innerHTML += `
      <div class="letter-container" data-index="${index}">
        <div class="letter-face letter-face-front"></div>
        <div class="letter-face letter-face-back"></div>
      </div>
      `;
    } else {
      display.innerHTML += `
      <div class="letter empty"}" data-index="${index}">
      </div>
      `;
    }
  });
};

function startGame(event) {
  sound["click"].play();
  wheel.startGame(getUserSelections(), renderPhrase);
  const gameState = wheel.getGameState();
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

function toggleModal(sound, message, buttonText) {
  if (sound) sound.play();
  window.setTimeout(() => {
    modal.classList.toggle("hide");
  }, 400);
  modal.querySelector("h1").innerText = message;
  modal.querySelector("button").innerText = buttonText;
}

function showLetter(indexes, letter, status) {
  const keyboardLetter = document.querySelector(
    `.keyboard-letter[data-key="${letter}"]`
  );

  if (status === "success") {
    const phraseLetters = document.querySelectorAll(`.letter-container`);
    const correctLetters = [];

    phraseLetters.forEach(char => {
      if (indexes.includes(parseInt(char.dataset.index))) {
        correctLetters.push(char);
      }
    });

    correctLetters.forEach(char => {
      char.querySelector(".letter-face-back").innerHTML = letter;
      char.classList.add("show-backface");
    });
    keyboardLetter.classList.add("success");
  } else if (status === "warning") {
    keyboardLetter.classList.add("warning");
  }
}

function showFail(failedLetters) {
  failedContainer.innerHTML = " ";
  failedLetters.map(letter => {
    const div = document.createElement("div");
    div.setAttribute("class", "letter-container warning-letter");
    div.innerText = letter;
    failedContainer.appendChild(div);
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
    sound["show"].play();
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
  if (status === "win") {
    modal.classList.remove("warning");
    modal.classList.add("success");
    toggleModal(sound["win"], "YOU WIN! :)", "Restart game");
  } else {
    modal.classList.remove("success");
    modal.classList.add("warning");
    toggleModal(sound["lose"], "YOU LOST :(", "Restart game");
  }
}

function isGameWon(gameState) {
  const phrase = gameState["phrase"];
  const lettersFiltered = phrase.filter(letter => !letter.hidden);
  return phrase.length === lettersFiltered.length;
}
