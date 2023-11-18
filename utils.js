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
  const fullUUID = uuidv4();
  const shortUUID = fullUUID.substr(0, 3).replace(/-/g, '');
  return shortUUID;
}

module.exports = { shuffle, generateUniqueId };
