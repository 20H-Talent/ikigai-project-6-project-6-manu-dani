const input = document.querySelector("#fake-input");
const btnPrimary = document.querySelector("#btn-primary");
const modal = document.querySelector(".modal");
const gameFrame = document.querySelector(".game-frame");
const display = document.querySelector(".phrase-display");
const desktopKeys = document.querySelectorAll(".keyboard-letter");
const failedContainer = document.querySelector(".failed-display");

btnPrimary.addEventListener("click", startGame);
gameFrame.addEventListener("click", showKeyboard);
input.addEventListener("input", checkLetter);
desktopKeys.forEach(key =>
  key.addEventListener("click", () => addLetterToInput(key.dataset.key))
);

// Display phrase letters on the page
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
  const options = getUserSelections();
  wheel.start(options);
  renderPhrase(wheel.state.phrase);
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
  console.log(`letter "${letter}", at positions ${indexes}`);
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
    const div = document.createElement("div");
    div.setAttribute("class", "letter warning");
    div.innerText = letter;
    failedContainer.appendChild(div);
  });
}

function checkLetter() {
  const letter = input.value[input.value.length - 1];
  const indexes = wheel.checkInput(letter);
  const failedLetters = wheel.state.failed;
  if (indexes.length >= 1) {
    console.log(indexes);
    showLetter(indexes, letter, "success");
    // input.value = '';
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
  }
}

function addLetterToInput(key) {
  input.value = key;
  checkLetter();
}

function finishGame(status) {
  const h1 = modal.querySelector("h1");
  const button = modal.querySelector("button");
  if (status === "win") {
    modal.classList.add("success");
    toggleModal();
    h1.innerText = "YOU WIN :)";
    button.innerText = "Restart game";
  } else {
    modal.classList.add("warning");
    toggleModal();
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
