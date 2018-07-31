const wheel = (function() {
  const gameState = {};

  const startGame = (
    gameData = { lifes: 5, difficulty: "easy", ia: "false" }
  ) => {
    if (gameData instanceof Object && Object.keys(gameData).length >= 0) {
      Object.assign(gameState, gameData);
      console.log(gameState);
      if (!localStorage.getItem("phrases")) {
        fetchPhrases()
          .then(phrases => {
            localStorage.setItem("phrases", JSON.stringify(phrases));
            prepareGameData();
          })
          .catch(err => console.log(err));
      }
      prepareGameData();
    }
  };

  const prepareGameData = function() {
    gameState["phrases"] = JSON.parse(localStorage.getItem("phrases"));
    gameState["phrase"] = randomQueryGenerator();
  };

  const randomQueryGenerator = function() {
    const phrases = gameState["phrases"];
    const randomPhrase =
      phrases[Math.round(Math.random() * phrases.length - 1)];
    console.log(randomPhrase);
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

  const isValidUserInput = userInput =>
    typeof letter === "string" && letter.length === 1;

  const checkUserInput = function(letter) {
    if (isValidUserInput(letter)) {
    }
  };
  return {
    start: startGame,
    checkInput: checkUserInput
  };
})();
