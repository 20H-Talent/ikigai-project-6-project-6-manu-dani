console.log(wheel.start());

const input = document.querySelector('#fake-input');
const btnPrimary = document.querySelector('#btn-primary');
const modal = document.querySelector('.modal');
const gameFrame = document.querySelector('.game-frame');
const display = document.querySelector('.phrase-display');
const desktopKeys = document.querySelectorAll('.keyboard-letter');
const failedContainer = document.querySelector('.failed-display');

btnPrimary.addEventListener('click', showKeyboard);
gameFrame.addEventListener('click', showKeyboard);
input.addEventListener('input', checkLetter);
desktopKeys.forEach( key => key.addEventListener('click', () => addLetterToInput(key.dataset.key)));

// Display phrase letters on the page
const renderPhrase = (phrase) => {
  phrase.map( (letter, index) => {
    display.innerHTML += `<div class="${letter.character == ' ' ? 'empty' : 'letter'}" data-index="${index}">${letter.hidden ? '' : letter.character}</div>`;
  });
}

function showKeyboard() {
  modal.classList.add('hide');
  input.focus();
}

function showLetter(indexes, letter, status) {
  console.log(`letter "${letter}", at positions ${indexes}`);
  const keyboardLetter = document.querySelector(`.keyboard-letter[data-key="${letter}"]`);


  if (status === 'success') {
    const phraseLetters = document.querySelectorAll(`.letter`);
    const correctLetters = [];

    phraseLetters.forEach( char => {
      if (indexes.includes(parseInt(char.dataset.index))) {
        correctLetters.push(char);
      }
    });

    correctLetters.forEach( char => {
      char.innerHTML = letter
      char.classList.add('success');
    });
    keyboardLetter.classList.add('success');
  } else if (status === 'warning') {
    keyboardLetter.classList.add('warning');
  }
}

function showFail(letter) {
  console.log(letter);
  failedContainer.innerHTML += `<div class="letter warning">${letter}</div>`;
}

function checkLetter() {
  const letter = input.value[input.value.length - 1];
  if (wheel.checkInput(letter).length >= 1) {
    const indexes = wheel.checkInput(letter);
    showLetter(indexes, letter, 'success');
    // input.value = '';
  } else {
    wheel.subtract();
    showLetter(null, letter, 'warning');
    wheel.state.failed.push(letter);
    showFail(letter);
  }
}

function addLetterToInput(key) {
  input.value = key;
  checkLetter();
}

wheel.updateLifes();
renderPhrase(wheel.state.phrase);