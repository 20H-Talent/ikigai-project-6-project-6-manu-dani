const wheel = (function() {
  const gameState = {};

  const startGame = (
    gameData = { lifes: 5, difficulty: "easy", ia: "false" }
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
      return { char: character, hidden: true };
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

  const isValidUserInput = userInput => {
    const hasNumber = str => /\d/.test(str);
    // const aToZLetters = (str) => /[^a-zA-Z]+/.test(str);

    if (
      typeof userInput === "string" &&
      userInput.length === 1 &&
      !hasNumber(userInput)
    ) {
      console.log("valid input");
    } else {
      console.log("invalid input");
    }
  };
  const checkUserInput = function(letter) {
    if (isValidUserInput(letter)) {
      return true;
    } else {
      return false;
    }
  };

  return {
    start: startGame,
    checkInput: checkUserInput
  };
})();
