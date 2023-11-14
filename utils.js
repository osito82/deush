//const { v4 } = require('uuidv4');
const { v4: uuidv4 } = require('uuid')


function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function generateUniqueId() {
  return uuidv4();
}

module.exports = { shuffle, generateUniqueId };
