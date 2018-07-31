console.log(wheel.start());

const input = document.querySelector('#fake-input');
const btnPrimary = document.querySelector('#btn-primary');
const modal = document.querySelector('.modal');
const gameFrame = document.querySelector('.game-frame');

btnPrimary.addEventListener('click', showKeyboard);
gameFrame.addEventListener('click', showKeyboard);
input.addEventListener('input', checkLetter);

function showKeyboard() {
  modal.classList.add('hide');
  input.focus();
}

function checkLetter() {
  console.log(input.value);
  if (wheel.checkInput(input.value)) {
    console.log('valid input');
  }
  input.value = '';
}

