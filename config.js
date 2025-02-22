const blackRook = '<img src="img/black-rook.png" draggable="true">'
const blackBishop = '<img src="img/black-bishop.png" draggable="true">'
const blackKnight = '<img src="img/black-knight.png" draggable="true">'
const blackQueen = '<img src="img/black-queen.png" draggable="true">'
const blackKing = '<img src="img/black-king.png" draggable="true">'
const blackPawn = '<img src="img/black-pawn.png" draggable="true">'

const whiteRook = '<img src="img/white-rook.png" draggable="true">'
const whiteBishop = '<img src="img/white-bishop.png" draggable="true">'
const whiteKnight = '<img src="img/white-knight.png" draggable="true">'
const whiteQueen = '<img src="img/white-queen.png" draggable="true">'
const whiteKing = '<img src="img/white-king.png" draggable="true">'
const whitePawn = '<img src="img/white-pawn.png" draggable="true">'

const chessboard = document.querySelector(".chessboard")

let playerToMove = 'W'

let pieces = ["Br", "Bh", "Bb", "Bq", "Bk", "Bb", "Bh", "Br",
                  "Bp", "Bp", "Bp", "Bp", "Bp", "Bp", "Bp", "Bp",
                  "", "", "", "", "", "", "", "",
                  "", "", "", "", "", "", "", "",
                  "", "", "", "", "", "", "", "",
                  "", "", "", "", "", "", "", "",
                  "Wp", "Wp", "Wp", "Wp", "Wp", "Wp", "Wp", "Wp",
                  "Wr", "Wh", "Wb", "Wq", "Wk", "Wb", "Wh", "Wr"]

let oldSquare
let oldSquareId
let movingPiece
let nextSquare
let nextSquareId
let nextCheckingSquare  
let column = 1    
let enPassantId = null
let takingEnPassantId   = null                                                      