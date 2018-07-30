const wheel = (function() {
  const defaultGameData = { lifes: 5, difficulty: "easy", ia: "false" };

  const startGame = (gameData = defaultGameData) => {
    if (gameData instanceof Object && Object.keys(gameData).length >= 0) {
      gameData["phrases"] = fetchPhrases();
      console.log(gameData);
    }
  };

  const fetchPhrases = () => {
    let phrases;
    if (!localStorage.getItem("phrases")) {
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
        .then(data => {
          phrases = data;
          localStorage.setItem("phrases", JSON.stringify(phrases));
        })
        .catch(err => console.log(err));
    } else {
      phrases = JSON.parse(localStorage.getItem("phrases"));
    }
    return phrases;
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
