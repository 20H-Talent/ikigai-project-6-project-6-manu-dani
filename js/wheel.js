const wheel = (function() {
  const defaultGameData = { lifes: 5, difficulty: "easy", ia: "false" };

  const startGame = (gameData = defaultGameData) => {
    if (gameData instanceof Object && Object.keys(gameData).length >= 0) {
      if (!localStorage.getItem("phrases")) {
        fetchPhrases();
        //ASIGNACION DE FRASES TEMPORAL
        setTimeout(() => {
          gameData["phrases"] = JSON.parse(localStorage.getItem("phrases"));
        }, 150);
      }
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

  const isValidUserInput = userInput => {
    const hasNumber = (str) => /\d/.test(str);
    // const aToZLetters = (str) => /[^a-zA-Z]+/.test(str);

    if (typeof userInput === "string" && userInput.length === 1 && !hasNumber(userInput)) {
      console.log('valid input');
    } else {
      console.log('invalid input');
    }
  }

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
