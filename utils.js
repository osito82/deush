const { v4: uuidv4 } = require("uuid");

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

function generateUniqueId(long=4) {
  const fullUUID = uuidv4();
  const shortUUID = fullUUID.substr(0, long).replace(/-/g, "");
  return shortUUID;
}

///[ 'Ks', '8c', 'Js', 'Td', 'Qc' ] =>  [ 'K', '8', 'J', 'T', 'Q' ]
const cardsToNoSymbolValsArray = (cartas) => {
  return cartas.map((carta) => carta.slice(0, -1));
};

///[ 'K', '8', 'J', 'T', 'Q' ] => [ 13, 8, 11, 10, 12 ]
const singleSymbolsToNumsArray = (cartas) => {
  const realValues = cartas.map((carta) => {
    switch (carta) {
      case "T":
        return 10;
      case "J":
        return 11;
      case "Q":
        return 12;
      case "K":
        return 13;
      case "A":
        return 14;
      default:
        return parseInt(carta, 10);
    }
  });
  return realValues;
};

///[ 'Ks', '8c', 'Js', 'Td', 'Qc' ] =>   [ 13, 8, 11, 10, 12 ]
const cardsToSingleNumValsArray = (cartas) => {
  const noSymbol = cardsToNoSymbolValsArray(cartas);
  return singleSymbolsToNumsArray(noSymbol);
};

///[ 13, 8, 11, 10, 12 ] => [ 'K', '8', 'J', 'T', 'Q' ]
const singleValsToSymbolsArray = (singleNumsArray) => {
  return singleNumsArray.map((x) => numberToCard(x));
};

///10 => 'T'
const numberToCard = (number) => {
  switch (number) {
    case 10:
      return "T";
    case 11:
      return "J";
    case 12:
      return "Q";
    case 13:
      return "K";
    case 14:
      return "A";
    default:
      return number.toString();
  }
};

/// [[ 13, 8, 11, 10, 12 ], [ 1, 4, 11, 5, 3 ]] => [ 13, 8, 11, 10, 12 ]
function selectArrayWithBiggestNumbers(arrays) {
  if (!arrays || arrays.length === 0) {
    return null;
  }
  let arrayConMaxNumeros = arrays[0];
  for (const currentArray of arrays) {
    const sumaActual = currentArray.reduce((sum, num) => sum + num, 0);
    const sumaMaxima = arrayConMaxNumeros.reduce((sum, num) => sum + num, 0);
    if (sumaActual > sumaMaxima) {
      arrayConMaxNumeros = currentArray;
    }
  }
  return arrayConMaxNumeros;
}

/// [ 1, 4, 11, 5, 3 ]] => 11
function highestCardNumberFromArray(cartas) {
  const bigestNumber = Math.max(...cartas);
  return numberToCard(bigestNumber);
}

///[ 4, 4, 8, 8 ] => [ 4, 8 ]
function uniqueElementsArray(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

///Remove all elemnets that has a copy in an array
///[ 'Ks', '8c', '8s', 'Js', 'Td', 'Qc' ]
function notRepeatedInIntArray(array) {
  let numbersArray = cardsToSingleNumValsArray(array);
  const uniqueArray = [...numbersArray].filter(
    (item) => numbersArray.indexOf(item) === numbersArray.lastIndexOf(item)
  );

  return uniqueArray;
}

///[ 'K', 'K', 'K', '8', 'K' ] => [ '8' ]
function notRepeatedSymbolnArray(array) {
  const uniqueArray = [...array].filter(
    (item) => array.indexOf(item) === array.lastIndexOf(item)
  );
  return uniqueArray;
}

//borrar despues communicator
function msgBuilder(action, msgType, player, data) {
  const { id: playerId, name: playerName } = player;
  return { action, msgType, playerId: playerId, name: playerName, data };
}

function randomName() {
  const nombres = [
    "Pollito",
    "Osito",
    "Duke",
    "Billy",
    "Dixon",
    "Daniel",
    "Luis",
    "Kenneth",
    "Marco",
    "Uribe",
    "BobbyG",
    "Joshua",
    "Adolfo",
  ];
  const indiceAleatorio = Math.floor(Math.random() * nombres.length);
  const nombreElegido = nombres[indiceAleatorio];
  return nombreElegido + "-" + (Math.random() * 100).toFixed().toString();
}

/// [ 1, 4, 11, 5, 3 ] => 24
const sumArrayNumbers = (array) =>
  array.reduce((suma, numero) => suma + numero, 0);

///compares the singles N array VS complete AlfaNum
const compareArraysNoOrder = (single, completeaN) => {
  const complete = singleValsToSymbolsArray(notRepeatedInIntArray(completeaN));

  if (single.length === 0 || complete.length === 0) {
    return false;
  }

  const sortedSingle = single.slice().sort();
  const sortedComplete = complete.slice().sort();

  return sortedSingle.every((value, index) => value === sortedComplete[index]);
};

//creates a flatMap in an only numers array
const flatToGetNUmbersArray = (singleNumbersArray) => {
  singleNumbersArray.flatMap((item) => {
    if (Array.isArray(item)) {
      return item;
    } else {
      return [item];
    }
  });
};

//creates a flat of Symbols Array
/// [ [ 'As', 'Ah', 'Ac' ], [ 'Jc', 'Jh' ] ] => [ 'A', 'A', 'A', 'J', 'J' ]
const flatToGetSymbolsArray = (singleSymbolsArray) => {
  return cardsToNoSymbolValsArray(singleSymbolsArray.flat());
};

//Get biggest array according to it items sum
/// [[ 1, 4, 2, 5, 3 ],[ 6, 7, 8, 9, 10 ]] => [ 6, 7, 8, 9, 10 ]
function getHigherSumArrayContent(arrays) {
  let sumaMaxima = -Infinity;
  let arregloMaximo = null;

  for (const arreglo of arrays) {
    const sumaActual = arreglo.reduce((acc, num) => acc + num, 0);

    if (sumaActual > sumaMaxima) {
      sumaMaxima = sumaActual;
      arregloMaximo = arreglo;
    }
  }

  return arregloMaximo;
}

module.exports = {
  shuffle,
  compareArraysNoOrder,
  highestCardNumberFromArray,
  generateUniqueId,
  randomName,
  flatToGetNUmbersArray,
  msgBuilder,
  notRepeatedInIntArray,
  cardsToSingleNumValsArray,
  numberToCard,
  sumArrayNumbers,
  singleValsToSymbolsArray,
  uniqueElementsArray,
  cardsToNoSymbolValsArray,
  getHigherSumArrayContent,
  notRepeatedSymbolnArray,
  selectArrayWithBiggestNumbers,
  flatToGetSymbolsArray,
  singleSymbolsToNumsArray,
};
