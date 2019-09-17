/* eslint-disable indent */
const GameBoard = (() => {
    let gameboard = ['', '', '', '', '', '', '', '', '']
    const webBoard = document.getElementById('gameboard')
    const render = () => {
        for (let i = 0; i < gameboard.length; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.setAttribute('class', 'square')
            square.textContent = gameboard[i]
            webBoard.appendChild(square)
        }
    }
    const reset = () => {
        gameboard = ['', '', '', '', '', '', '', '', '']
        while (webBoard.hasChildNodes()) {
            webBoard.removeChild(webBoard.firstChild)
        }
    }
    const gameboardCheck = () => {
        if (!gameboard.includes('')) {
            return true
        }
    }
    return {
        gameboard,
        render,
        reset,
        gameboardCheck
    }
})()

const Player = (type) => {
    let placedPositions = []
    let score = 0
    let isAI = false
    const name = ''
    const placeMarker = () => {
        console.log(type)
        console.log('Make your turn')
    }
    const resetPlacedPositions = () => {
        placedPositions = []
    }
    const markerColor = () => {
        if (type === 'X') {
            return 'red'
        }
        else {
            return 'blue'
        }
    }
    // function for the AI
    const makeMove = () => {
        let possibleMoves = []
        for (let square in GameBoard.gameboard) {
            if (GameBoard.gameboard[square] === '') {
                possibleMoves.push(square)
            }
        }
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]     
    }
    const hasWonMatch = () => {
        score++
        return score
    }
    return { name, type, score, placedPositions, placeMarker, hasWonMatch, resetPlacedPositions, markerColor, makeMove, isAI }
}
const Game = () => {
    const playerX = Player('X')
    const playerO = Player('O')
    let currentPlayer = playerX
    let matchWinner = null
    const displayPlayerXScore = document.getElementById('playerXScore')
    const displayPlayerOScore = document.getElementById('playerOScore')
    const displayCurrentPlayer = document.getElementById('displayCurrentPlayer')
    const squares = document.getElementsByClassName('square')
    const scoreX = document.getElementById('scoreX')
    const scoreO = document.getElementById('scoreO')
    const winner = document.getElementById('winner')

    const play = () => {
        GameBoard.render()
        if (matchWinner != null) {
            matchWinner === playerX ? currentPlayer = playerO : currentPlayer = playerX
        }
        if (currentPlayer.isAI) {
            makeMoveAI()
        }
        makeMove()
    }
    const createGame = () => {
        displayPlayerXScore.textContent = playerX.score
        displayPlayerOScore.textContent = playerO.score
        const displayGame = document.getElementById('match')
        const playGameForm = document.getElementById('playGameForm')
        const playGameButton = document.getElementById('startGame')
        playGameButton.addEventListener('click', function (e) {
            // prevent the button from reloading the page
            e.preventDefault()
            let playerXName = document.getElementById('playerXName').value
            let playerOName = document.getElementById('playerOName').value
            if (playerXName === '') {
                playerXName = 'Player X'
            }
            if (playerOName === '') {
                playerOName = 'Player O'
            }
            if (document.getElementById('aiCheck').checked) {
                playerO.isAI = true
                playerOName = 'AI Overlord'
            }
            playerX.name = playerXName
            playerO.name = playerOName
            scoreX.textContent = playerX.name
            scoreO.textContent = playerO.name
            playGameForm.style.display = 'none'
            displayGame.style.display = 'block'

            play()
        })
    }
    const newGame = () => {
        const newGameButton = document.getElementById('newGame')
        newGameButton.style.display = 'block'
        newGameButton.addEventListener('click', function () {
            playerX.placedPositions = []
            playerO.placedPositions = []
            winner.textContent = ''
            GameBoard.reset()
            GameBoard.gameboard = ['', '', '', '', '', '', '', '', '']
            newGameButton.style.display = 'none'
            play()
        })
    }
    const moveEventListener = () => {
        if (currentPlayer.isAI) {
            currentPlayer = playerX
        }
        const square = event.target
        square.removeEventListener('click', moveEventListener)
        square.textContent = currentPlayer.type
        square.style.color = currentPlayer.markerColor()
        GameBoard.gameboard[square.getAttribute('id')] = currentPlayer.type
        currentPlayer.placedPositions.push(Number(square.getAttribute('id')))
        if (checkVictory(currentPlayer)) {
            matchWinner = currentPlayer
            return newGame()
        }
        if (!GameBoard.gameboard.includes('')) {
            displayCurrentPlayer.textContent = 'It\'s a tie!'
            return newGame()
        }
        else {
            currentPlayer = (currentPlayer.type === 'X') ? currentPlayer = playerO : currentPlayer = playerX
            if (playerO.isAI) {
                makeMoveAI()
                if (checkVictory(currentPlayer)) {
                    matchWinner = currentPlayer
                    return newGame()
                }
                else {
                    currentPlayer = playerX
                }
            }
            displayCurrentPlayer.textContent = currentPlayer.name + ' make a move!'
        }
    }
    const makeMoveAI = () => {
        let index = playerO.makeMove()
        squares[index].textContent = 'O'
        GameBoard.gameboard[index] = 'O'
        currentPlayer.placedPositions.push(Number(index))
    }
    const makeMove = () => {
        displayCurrentPlayer.textContent = currentPlayer.name + ' make a move!'
        for (let i = 0; i < squares.length; i++) {
            squares[i].addEventListener('click', moveEventListener)
        }
    }

    const checkVictory = (player) => {
        console.log(player)
        if (player.placedPositions.length < 3) {
            return false
        }
        else if ((player.placedPositions.includes(0) && player.placedPositions.includes(1) && player.placedPositions.includes(2)) ||
            (player.placedPositions.includes(3) && player.placedPositions.includes(4) && player.placedPositions.includes(5)) ||
            (player.placedPositions.includes(6) && player.placedPositions.includes(7) && player.placedPositions.includes(8)) ||
            (player.placedPositions.includes(0) && player.placedPositions.includes(3) && player.placedPositions.includes(6)) ||
            (player.placedPositions.includes(1) && player.placedPositions.includes(4) && player.placedPositions.includes(7)) ||
            (player.placedPositions.includes(2) && player.placedPositions.includes(5) && player.placedPositions.includes(8)) ||
            (player.placedPositions.includes(0) && player.placedPositions.includes(4) && player.placedPositions.includes(8)) ||
            (player.placedPositions.includes(2) && player.placedPositions.includes(4) && player.placedPositions.includes(6))
        ) {
            for (let i = 0; i < squares.length; i++) {
                squares[i].removeEventListener('click', moveEventListener)
            }
            currentPlayer.score += 1
            displayPlayerXScore.textContent = playerX.score
            displayPlayerOScore.textContent = playerO.score
            console.log(currentPlayer.name)
            displayCurrentPlayer.textContent = currentPlayer.name + ' is the winner!'
            
            return true
          }
    }
    return { playerX, playerO, createGame, newGame, play, makeMove, checkVictory }
}
const game = Game()
game.createGame()
