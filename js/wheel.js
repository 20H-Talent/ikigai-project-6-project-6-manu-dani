const wheel = (function() {
  const defaultGameData = { lifes: 5, difficulty: "easy", ia: "false" };

  const startGame = (params = defaultGameData) => {
    if (params instanceof Object && Object.keys(params).length >= 0) {
      Object.assign(params, defaultGameData);
    }
  };

  const randomQueryGenerator = function() {};

  const isValidUserInput = () =>
    typeof letter === "string" && letter.length > 0;

  const checkUserInput = function(letter) {};
  return {
    start: startGame,
    checkInput: checkUserInput
  };
})();
