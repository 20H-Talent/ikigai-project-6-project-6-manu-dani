const wheel = (function() {
  const gameState = {};

  const startGame = (
    gameData = { lifes: 5, difficulty: "easy", ia: "false", failed: [] }
  ) => {
    if (gameData instanceof Object && Object.keys(gameData).length >= 0) {
      Object.assign(gameState, gameData);
      if (!localStorage.getItem("phrases")) {
        fetchPhrases()
          .then(phrases => {
            localStorage.setItem("phrases", JSON.stringify(phrases));
            prepareGameData();
          })
          .catch(err => console.log(err));
      } else {
        prepareGameData();
      }
    }
  };

  const prepareGameData = function() {
    gameState["phrases"] = JSON.parse(localStorage.getItem("phrases"));
    gameState["phrase"] = randomQueryGenerator();
    console.log(gameState);
  };

  const randomQueryGenerator = function() {
    const phrases = gameState["phrases"];
    console.log(
      "PHRASES: ",
      phrases,
      phrases.length,
      Math.floor(Math.random() * phrases.length - 1)
    );
    const randomPhrase =
      phrases[Math.floor(Math.random() * phrases.length - 1) + 1].phrase;
    return randomPhrase.split("").map(character => {
      return { character, hidden: true };
    });
  };

  const fetchPhrases = () => {
    const { host, protocol } = window.location;
    const url = `${protocol}//${host}/js/phrases/phrases.json`;
    return fetch(url, {
      method: "GET",
      mode: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      referrer: "no-referrer"
    }).then(res => res.json());
  };

  const subtractLife = () => {
    if (gameState.lifes > 0) gameState.lifes--;
    updateLifesCounter();
  }

  const updateLifesCounter = () => {
    document.querySelector('#life-number').textContent = gameState.lifes;
  }

  const isValidUserInput = userInput => {
    const isALetter = str => /[^a-zA-Z]+/.test(str);

    return !isALetter(userInput) && userInput.length === 1;
  };

  const checkUserInput = function(letter) {
    if (isValidUserInput(letter)) {
      return letterIsOnPhrase(letter);
    }
  };

  // Hay que pasar los caracteres de la frase a minusculas antes de compararlos para evitar errores
  const letterIsOnPhrase = letter => {
    const phrase = gameState["phrase"];
    const characterIndex = [];
    phrase.forEach((content, index) => {
      const { character, hidden } = content;
      if (hidden && letter === character) {
        gameState["phrase"][index]['hidden'] = false;
        characterIndex.push(index);
      }
    });
    return characterIndex;
  };

  return {
    start: startGame,
    checkInput: checkUserInput,
    subtract: subtractLife,
    state: gameState,
    updateLifes: updateLifesCounter
  };
})();
