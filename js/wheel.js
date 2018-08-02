const wheel = (function() {
  const gameState = {};

  const getGameState = () => {
    return gameState;
  };

  const setFailedLetter = letter => {
    gameState["failed"].push(letter);
    return gameState["failed"];
  };

  const startGame = gameData => {
    if (gameData instanceof Object && Object.keys(gameData).length >= 0) {
      Object.assign(gameState, gameData);
      if (!localStorage.getItem("phrases")) {
        fetchPhrases()
          .then(phrases => {
            localStorage.setItem("phrases", JSON.stringify(phrases));
            prepareGameData(phrases);
          })
          .catch(err => console.log(err));
      } else {
        prepareGameData();
      }
    }
  };

  const prepareGameData = function(phrases = []) {
    gameState["phrases"] =
      phrases.length > 0
        ? phrases
        : JSON.parse(localStorage.getItem("phrases"));
    gameState["phrase"] = randomQueryGenerator();
  };

  const randomQueryGenerator = function() {
    const phrases = gameState["phrases"][gameState["difficulty"]];
    const randomPhrase =
      phrases[Math.floor(Math.random() * phrases.length - 1) + 1];
    return randomPhrase.split("").map(character => {
      return {
        character: character.toLowerCase(),
        hidden: character === " " ? false : true
      };
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
  };

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
        gameState["phrase"][index]["hidden"] = false;
        characterIndex.push(index);
      }
    });
    return characterIndex;
  };

  return {
    start: startGame,
    checkInput: checkUserInput,
    subtract: subtractLife,
    getGameState,
    setFailedLetter
  };
})();
