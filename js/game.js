console.log(wheel.start());

const input = document.querySelector('#fake-input');
const btnPrimary = document.querySelector('#btn-primary');
const modal = document.querySelector('.modal');
const gameFrame = document.querySelector('.game-frame');
const display = document.querySelector('.phrase-display');

btnPrimary.addEventListener('click', showKeyboard);
gameFrame.addEventListener('click', showKeyboard);
input.addEventListener('input', checkLetter);

// Display phrase letters on the page
const displayedPhrase = wheel.state.phrase;
displayedPhrase.map( letter => {
  display.innerHTML += `<div class="letter">${letter.char}</div>`;
})


function showKeyboard() {
  modal.classList.add('hide');
  input.focus();
}

function checkLetter() {
  if (wheel.checkInput(input.value)) {
    console.log('valid input');
  } else {
    wheel.subtract();
  }
  input.value = '';
}

