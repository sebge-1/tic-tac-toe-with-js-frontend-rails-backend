// game setup
var turn = 0;
var board = [];
var gameId = 0

const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function player() {
  let symbol = 0;
  if (turn % 2 === 0 || turn === 0) {
    symbol = 'X'
  } else {
    symbol = 'O'
  }
  return symbol;
}

function updateState(square) {
  if ($(this).text() === "") {
    return $(square).text(player());
  }
}

function setMessage(string) {
  $("div#message").append(string)
}

function getBoard() {
  $("td").text((index, square) => (board[index] = square));
}

function winningCombo(array) {
  return array.every(el => el === "X") || array.every(el => el === "O")
}

function checkWinner() {
  let message = ""
  let winner = false;
  getBoard();
  winCombinations.forEach(combo => {
		position1 = board[combo[0]]
		position2 = board[combo[1]]
		position3 = board[combo[2]]

    if (winningCombo([position1, position2, position3])) {
      winner = true;
      message = `Player ${position1} Won!`;
      setMessage(message);
    }
  })
  return winner
}


function doTurn(square) {
  updateState(square);
  turn += 1;

  if (checkWinner()) {
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    resetBoard();
  }
}

function resetBoard() {
  board = [];
  turn = 0;
  $("td").text("")
}

function attachListeners() {
  $("td").on('click', function() {
    if ($(this).text() === "" && !checkWinner()) {
      doTurn(this);
    }
  });
  // $('#previous').on('click', () => previousGames());
  $('#save').on('click', () => saveGame());
  $('#clear').on('click', () => resetBoard());
}

function saveGame() {
  // grab all the table data squares, assemble them into an array, and make new array with only inner text
  let gameData = $("td");
  console.log(gameData)
  let boardState = gameData.map(square => square.text);
  console.log(boardState)
  // post game state to server
  if (gameId) {
    // 'ajax' required here instead of post because PATH method needs to be specified in request
    $.ajax({
      type: 'PATCH',
        // patch to '/games/:id'
      url: `/games/${currentGame}`,
        // 'state' will go into the params hash and is whitelisted by strong params
      data: { state: boardState }
    });
  } else {
    $.post("/games", { state: boardState }).done(function (response) {
      console.log(response);
      currentGame = response.data.id;
    })
  }
}

$(document).ready(function() {
  attachListeners();
});
