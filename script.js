function createChessboard(){
    pieces.forEach((piece, i) => {
        const row = Math.floor((63 - i) / 8) +1

        let square = document.createElement("div")
        square.setAttribute("class", "square")
        square.setAttribute("pieceid", piece)
        initSquareId(row, column, square)

        if (row % 2 === 0){
            square.classList.add(i % 2 === 0 ? "beige" : "brown")
        }
        else{
            square.classList.add(i % 2 === 0 ? "brown" : "beige")
        }
        
        if(piece != ""){
            let newSquare = getPieceImg(piece)
            square.innerHTML = newSquare
            if (piece.charAt(1) === 'p'){
                square.setAttribute("moved", "false")
            }
        }

        chessboard.appendChild(square)
    })
}

function getPieceImg(piece){
    let fullPieceName = ""
    if (piece.charAt(0) === 'B'){
        switch(piece.charAt(1)){
            case 'r': 
                fullPieceName = blackRook
                break;
            case 'b': 
                fullPieceName = blackBishop
                break;
            case 'h': 
                fullPieceName = blackKnight
                break;
            case 'q': 
                fullPieceName = blackQueen
                break;
            case 'k': 
                fullPieceName = blackKing
                break;
            case 'p': 
                fullPieceName = blackPawn
                break;
            default:
                break;
        }
    }
    else{
        switch(piece.charAt(1)){
            case 'r': 
                fullPieceName = whiteRook
                break;
            case 'b': 
                fullPieceName = whiteBishop
                break;
            case 'h': 
                fullPieceName = whiteKnight
                break;
            case 'q': 
                fullPieceName = whiteQueen
                break;
            case 'k': 
                fullPieceName = whiteKing
                break;
            case 'p': 
                fullPieceName = whitePawn
                break;
            default:
                break;
        }
    }

    return fullPieceName
}

createChessboard()

const squares = document.querySelectorAll(".square")


squares.forEach(square => {
    square.addEventListener("dragstart", dragStart)
    square.addEventListener("dragover", dragOver)
    square.addEventListener("drop", dragDrop)
})

function dragStart(e){
    oldSquareId = e.target.parentNode.id
    oldSquare = document.getElementById(oldSquareId)
    oldSquare.classList.add("moving")
    movingPiece = oldSquare.getAttribute("pieceid")
    verifyMove(movingPiece)

    //TEMPORAIRE
    let legalMoves = document.querySelectorAll("[legalMove]")
    let takes = document.querySelectorAll("[take]")

    legalMoves.forEach(move =>{
        move.classList.add("legalMove")
    })

    takes.forEach(take =>{
        take.classList.add("take")
    })
    //TEMPORAIRE
}

function dragOver(e){
    e.preventDefault()
}

function dragDrop(e){
    //TEMPORAIRE
    let legalMoves = document.querySelectorAll(".legalMove")
    let takes = document.querySelectorAll(".take")

    legalMoves.forEach(move =>{
        move.classList.remove("legalMove")
    })

    takes.forEach(take =>{
        take.classList.remove("take")
    })
    //TEMPORAIRE
    oldSquare.classList.remove("moving")

    if(playerToMove === movingPiece.charAt(0)){
        if(e.target.hasAttribute("pieceid")){
            nextSquareId = e.target.id
        }
        else{
            nextSquareId = e.target.parentNode.id
        }
        nextSquare = document.getElementById(nextSquareId)
    
    
        if (nextSquare.hasAttribute("legalMove") || nextSquare.hasAttribute("take")){
            oldSquare.removeChild(oldSquare.firstChild)
            oldSquare.setAttribute("pieceid", "")
            nextSquare.setAttribute("pieceid", movingPiece)
            nextSquare.innerHTML = getPieceImg(movingPiece)
            replacePieceInArray(oldSquareId, nextSquareId, pieces)
    
            if(enPassantId !== null){
                let enPassantSquare = document.getElementById(enPassantId)
                enPassantSquare.removeAttribute("enpassant")
    
                if(takingEnPassantId === nextSquareId){
                    enPassantSquare.removeChild(document.getElementById(enPassantId).firstChild)
                    enPassantSquare.setAttribute("pieceid", "")
                    takingEnPassantId = null
                }
    
                enPassantId = null
            }
    
            if (oldSquare.hasAttribute("moved")){
                if(oldSquare.getAttribute("moved") === "false"){
                    let squareRowDifference = parseInt(oldSquare.id.charAt(0)) - parseInt(nextSquare.id.charAt(0))
                    
                    if(squareRowDifference === 2 || squareRowDifference === -2){
                        nextSquare.setAttribute("enpassant", "")
                        enPassantId = nextSquare.id
                    }
                }
                oldSquare.removeAttribute("moved")
                nextSquare.setAttribute("moved", "true")
            }
        }

        if (playerToMove === 'W'){
            playerToMove = 'B'
        }
        else{
            playerToMove = 'W'
        }
    }
    removeAttribute()
}

function replacePieceInArray(oldIndex, nextIndex, array){
    let pieceName = array[oldIndex]
    array[oldIndex] = ""
    array[nextIndex] = pieceName
}

function initSquareId(rowIndex, columnIndex, square){
    let squareId = rowIndex + "-" + columnIndex
    square.id = squareId
    if (column === 8){
        column = 1
    }
    else{
        column++
    }
}

function verifyMove(piece){
    let oldSquareRow = parseInt(oldSquareId.charAt(0))
    let oldSquareColumn = parseInt(oldSquareId.charAt(2))
    switch(piece.charAt(1)){
        case 'r': 
            verifyRookMove(oldSquareRow, oldSquareColumn)
            break;
        case 'b': 
            verifyBishopMove(oldSquareRow, oldSquareColumn)
            break;
        case 'h': 
            verifyKnightMove(oldSquareRow, oldSquareColumn)
            break;
        case 'q': 
            verifyRookMove(oldSquareRow, oldSquareColumn)
            verifyBishopMove(oldSquareRow, oldSquareColumn)
            break;
        case 'k': 
            verifyKingMove(oldSquareRow, oldSquareColumn)
            break;
        default:
            verifyPawnMove(oldSquareRow, oldSquareColumn) 
            break;
    }
}

function verifyPawnMove(row, column){

    if(movingPiece.charAt(0) === 'W'){
        row++
    }
    else{
        row--
    }

    nextCheckingSquareId = row + "-" + column
    checkForPiece(nextCheckingSquareId)

    if(column < 8){
        nextCheckingSquareId = row + "-" + (column + 1)
        checkForPiece(nextCheckingSquareId)

        if(!nextCheckingSquare.hasAttribute("take")){
            checkEnPassant(nextCheckingSquare)
        }
    }

    if(column > 1){
        nextCheckingSquareId = row + "-" + (column - 1)
        checkForPiece(nextCheckingSquareId)

        if(!nextCheckingSquare.hasAttribute("take")){
            checkEnPassant(nextCheckingSquare)
        }
    }

    if(oldSquare.getAttribute("moved") === "false"){
        if(movingPiece.charAt(0) === 'W'){
            row++
        }
        else{
            row--
        }

        nextCheckingSquareId = row + "-" + column
        checkForPiece(nextCheckingSquareId)
    }
}

function checkEnPassant(square){
    let enPassantRow = parseInt(square.id.charAt(0))
    let enPassantColumn = square.id.charAt(2)

    if(oldSquare.getAttribute("pieceid").charAt(0) === 'W'){
        enPassantRow--
    }
    else{
        enPassantRow++
    }

    let enPassantSquareId = enPassantRow + "-" + enPassantColumn
    let enPassantSquare = document.getElementById(enPassantSquareId)

    if (enPassantSquare.hasAttribute("enpassant") && oldSquare.getAttribute("pieceid").charAt(0) !== enPassantSquare.getAttribute("pieceid").charAt(0)){
        enPassantId = enPassantSquareId
        takingEnPassantId = square.id
        square.setAttribute("take", "")
    }
}

function verifyRookMove(row, column){
    for (i = column + 1; i < 9; i++){
        nextCheckingSquareId = row + "-" + i
        checkForPiece(nextCheckingSquareId)
        
        if(!nextCheckingSquare.hasAttribute("legalMove") || nextCheckingSquare.hasAttribute("take")){
            break;
        }
    }


    for (i = column - 1; i >= 1; i--){
        nextCheckingSquareId = row + "-" + i
        checkForPiece(nextCheckingSquareId)
        
        if(!nextCheckingSquare.hasAttribute("legalMove") || nextCheckingSquare.hasAttribute("take")){
            break;
        }
        
    }

    for (i = row - 1; i >= 1; i--){
        nextCheckingSquareId = i + "-" + column
        checkForPiece(nextCheckingSquareId)
        
        if(!nextCheckingSquare.hasAttribute("legalMove") || nextCheckingSquare.hasAttribute("take")){
            break;
        }
    }

    for (i = row + 1; i < 9; i++){
        nextCheckingSquareId = i + "-" + column
        checkForPiece(nextCheckingSquareId)
        
        if(!nextCheckingSquare.hasAttribute("legalMove") || nextCheckingSquare.hasAttribute("take")){
            break;
        }
    }
}

function verifyKnightMove(row, column){
    if(row < 7){
        if(column > 1){
            nextCheckingSquareId = (row + 2) + "-" + (column - 1)
            checkForPiece(nextCheckingSquareId)
        }

        if(column < 8){
            nextCheckingSquareId = (row + 2) + "-" + (column + 1)
            checkForPiece(nextCheckingSquareId)
        }
    }

    if(row < 8){
        if(column > 2){
            nextCheckingSquareId = (row + 1) + "-" + (column - 2)
            checkForPiece(nextCheckingSquareId)
        }

        if(column < 7){
            nextCheckingSquare = (row + 1) + "-" + (column + 2)
            checkForPiece(nextCheckingSquareId)
        }
    }

    if(row > 1){
        if(column > 2){
            nextCheckingSquareId = (row - 1) + "-" + (column - 2)
            checkForPiece(nextCheckingSquareId)
        }

        if(column < 7){
            nextCheckingSquareId = (row - 1) + "-" + (column + 2)
            checkForPiece(nextCheckingSquareId)
        }
    }

    if(row > 2){
        if(column > 1){
            nextCheckingSquareId = (row - 2) + "-" + (column - 1)
            checkForPiece(nextCheckingSquareId)
        }

        if(column < 8){
            nextCheckingSquareId = (row - 2) + "-" + (column + 1)
            checkForPiece(nextCheckingSquareId)
        }
    }
}

function verifyBishopMove(row, column){
    let tempColumn = column - 1

    for (i = row + 1; i < 9; i++){
        if (tempColumn > 0){
            nextCheckingSquareId = i + "-" + tempColumn
            checkForPiece(nextCheckingSquareId)

            if(!nextCheckingSquare.hasAttribute("legalMove") || nextCheckingSquare.hasAttribute("take")){
                break;
            }
            tempColumn--
        }
        else{
            break
        }
    }

    tempColumn = column + 1

    for (i = row + 1; i < 9; i++){
        if (tempColumn < 9){
            nextCheckingSquareId = i + "-" + tempColumn
            checkForPiece(nextCheckingSquareId)

            if(!nextCheckingSquare.hasAttribute("legalMove") || nextCheckingSquare.hasAttribute("take")){
                break;
            }
            tempColumn++
        }
        else{
            break
        }
    }

    tempColumn = column + 1

    for (i = row - 1; i > 0; i--){
        if (tempColumn < 9){
            nextCheckingSquareId = i + "-" + tempColumn
            checkForPiece(nextCheckingSquareId)

            if(!nextCheckingSquare.hasAttribute("legalMove") || nextCheckingSquare.hasAttribute("take")){
                break;
            }
            tempColumn++
        }
        else{
            break
        }
    }

    tempColumn = column - 1

    for (i = row - 1; i > 0; i--){
        if (tempColumn > 0){
            nextCheckingSquareId = i + "-" + tempColumn
            checkForPiece(nextCheckingSquareId)

            if(!nextCheckingSquare.hasAttribute("legalMove") || nextCheckingSquare.hasAttribute("take")){
                break;
            }
            tempColumn--
        }
        else{
            break
        }
    }
}

function verifyKingMove(row, column){
    if (row < 8){
        row++
        if (column > 1){
            nextCheckingSquareId = row + "-" + (column - 1)
            checkForPiece(nextCheckingSquareId)
        }

        nextCheckingSquareId = row + "-" + column
        checkForPiece(nextCheckingSquareId)

        if (column < 8){
            nextCheckingSquareId = row + "-" + (column + 1)       
            checkForPiece(nextCheckingSquareId)
        }
        row--
    }

    
    if (column < 8){
        nextCheckingSquareId = row + "-" + (column + 1)     
        checkForPiece(nextCheckingSquareId)
    }

    if (column > 1){
        nextCheckingSquareId = row + "-" + (column - 1)   
        checkForPiece(nextCheckingSquareId)
    }

    if (row > 1){
        row--
        if (column > 1){
            nextCheckingSquareId = row + "-" + (column - 1)           
            checkForPiece(nextCheckingSquareId)
        }

        nextCheckingSquareId = row + "-" + column       
        checkForPiece(nextCheckingSquareId)

        if (column < 8){
            nextCheckingSquareId = row + "-" + (column + 1)
            checkForPiece(nextCheckingSquareId)
        }
    }
}

function checkForPiece(squareId){
    nextCheckingSquare = document.getElementById(squareId)
    let squarePieceId = nextCheckingSquare.getAttribute("pieceid")

    if(movingPiece.charAt(1) !== 'p'){
        if(squarePieceId === ""){
            nextCheckingSquare.setAttribute("legalMove", "")
        }
        else{
            if(squarePieceId.charAt(0) !== movingPiece.charAt(0)){
                nextCheckingSquare.setAttribute("take", "")
            }
        }
    }
    else{
        console.log(oldSquareId)
        console.log(squareId)
        if(oldSquareId.charAt(2) === squareId.charAt(2) && squarePieceId === ""){
            nextCheckingSquare.setAttribute("legalMove", "")
        }
        else{
            if(squarePieceId.charAt(0) !== movingPiece.charAt(0) && squarePieceId !== "" && oldSquareId.charAt(2) !== squareId.charAt(2)){
                nextCheckingSquare.setAttribute("take", "")
            }
        }
        
    }
}

function removeAttribute(){
    let legalMoves = document.querySelectorAll("[legalMove]")
    let takes = document.querySelectorAll("[take]")

    legalMoves.forEach(move =>{
        move.removeAttribute("legalMove")
    })

    takes.forEach(take =>{
        take.removeAttribute("take")
    })
}