const wheel = require("../js/wheel");
/*
BECAUSE THE WHEEL IS ENCAPSULATED ON MODULE REVEALING PATTERN
WE ONLY CAN TEST THE PUBLIC METHODS BUT ALMOST ALL
DEPENDS ON OTHERS SO UNIT TESTS ARE NOT ENOUGHT
TO PROVE THEIR FUNCTIONALITY
*/
describe("UNIT TESTS ON WHEEL MODULE", () => {
  describe("Game state getter without game initialized", () => {
    test("Should be truthy and not return any falsy value", () => {
      expect(wheel.getGameState()).toBeTruthy();
    });

    test("Should have Object constructor and be an empty object", () => {
      const gameState = wheel.getGameState();
      expect(gameState).toMatchObject({});
      expect(gameState).toBeInstanceOf(Object);
      expect(Object.keys(gameState)).toHaveLength(0);
    });
  });
});
