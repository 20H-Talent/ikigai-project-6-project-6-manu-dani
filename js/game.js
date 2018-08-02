const input = document.querySelector("#fake-input");
const btnPrimary = document.querySelector("#btn-primary");
const modal = document.querySelector(".modal");
const gameFrame = document.querySelector(".game-frame");
const display = document.querySelector(".phrase-display");
const desktopKeys = document.querySelectorAll(".keyboard-letter");
const failedContainer = document.querySelector(".failed-display");

// Game sounds
const clickSound = document.querySelector('#click-sound');
const failSound = document.querySelector('#fail-sound');
const showSound = document.querySelector('#show-sound');
const loseSound = document.querySelector('#lose-sound');
const winSound = document.querySelector('#win-sound');

// Event listeners
btnPrimary.addEventListener("click", startGame);
gameFrame.addEventListener("click", showKeyboard);
input.addEventListener("input", checkLetter);
desktopKeys.forEach(key =>
  key.addEventListener("click", () => addLetterToInput(key.dataset.key))
);

// Game Logic
const renderPhrase = phrase => {
  toggleModal();
  display.innerHTML = "";

  phrase.map((letter, index) => {
    if (letter.character !== ' ') {
      display.innerHTML += (`
      <div class="letter-container" data-index="${index}">
        <div class="letter-face letter-face-front"></div>
        <div class="letter-face letter-face-back"></div>
      </div>
      `);
    } else {
      display.innerHTML += (`
      <div class="letter empty"}" data-index="${index}">
      </div>
      `);
    }

  });
};

function startGame(event) {
  clickSound.play();
  const options = getUserSelections();
  wheel.start(options);
  setTimeout(() => {
    renderPhrase(wheel.state.phrase);
  }, 150);
  document.querySelector("#life-number").textContent = wheel.state.lifes;
  desktopKeys.forEach(key => key.classList.remove("success", "warning"));
  showFail(wheel.state.failed);
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
  switch (level) {
    case "easy":
      return 5;
      break;
    case "normal":
      return 4;
      break;
    case "hard":
      return 3;
      break;
  }
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
    const phraseLetters = document.querySelectorAll(`.letter-container`);
    const correctLetters = [];

    phraseLetters.forEach(char => {
      if (indexes.includes(parseInt(char.dataset.index))) {
        correctLetters.push(char);
      }
    });

    correctLetters.forEach(char => {
      char.querySelector('.letter-face-back').innerHTML = letter;
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

function checkLetter() {
  const letter = input.value[input.value.length - 1];
  const indexes = wheel.checkInput(letter);
  const failedLetters = wheel.state.failed;
  if (indexes.length >= 1) {
    showLetter(indexes, letter, "success");
    showSound.play();
    if (isGameWon()) {
      finishGame("win");
    }
  } else if (!failedLetters.includes(letter)) {
    wheel.subtract();
    document.querySelector("#life-number").textContent = wheel.state.lifes;
    if (wheel.state.lifes === 0) {
      finishGame();
    }
    showLetter(null, letter, "warning");
    wheel.state.failed.push(letter);
    showFail(wheel.state.failed);
    failSound.play();
  }
}

function addLetterToInput(key) {
  clickSound.play();
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
    winSound.play();
    h1.innerText = "YOU WIN :)";
    button.innerText = "Restart game";
  } else {
    modal.classList.remove("success");
    modal.classList.add("warning");
    toggleModal();
    loseSound.play();
    h1.innerText = "YOU LOST :(";
    button.textContent = "Restart game";
  }
}

function isGameWon() {
  const phrase = wheel.state.phrase;
  const phraseLength = phrase.length;
  const lettersFiltered = wheel.state.phrase.filter(letter => !letter.hidden);
  return phrase.length === lettersFiltered.length;
}
