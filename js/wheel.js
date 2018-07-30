const wheel = (function() {
  const defaultGameData = { lifes: 5, difficulty: "easy", ia: "false" };

  const startGame = (gameData = defaultGameData) => {
    if (gameData instanceof Object && Object.keys(gameData).length >= 0) {
      if (!localStorage.getItem("phrases")) {
        fetchPhrases();
      }
      gameData["phrases"] = JSON.parse(localStorage.getItem("phrases"));
      console.log(gameData);
    }
  };

  const fetchPhrases = () => {
    const { host, protocol } = window.location;
    const url = `${protocol}//${host}/js/phrases/phrases.json`;
    fetch(url, {
      method: "GET",
      mode: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      referrer: "no-referrer"
    })
      .then(res => res.json())
      .then(phrases => {
        localStorage.setItem("phrases", JSON.stringify(phrases));
      })
      .catch(err => console.log(err));
  };

  const randomQueryGenerator = function() {};

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
