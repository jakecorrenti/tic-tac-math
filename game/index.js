window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');
    
    /*
       Indexes within the board
       [0,0] [0,1] [0,2]
       [1,0] [1,1] [1,2]
       [2,0] [2,1] [2,2]
    */

    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];   


    let currentPlayer = 'X';
    let isGameActive = true;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    function checkWinner(board) {
        // Iterate through and check all rows and columns
        for (let i = 0; i < 3; i++) {
            // Check rows
            if ((board[i][0] === 'X' || board[i][0] === 'O') &&
                board[i][0] === board[i][1] && 
                board[i][0] === board[i][2]) {
                return board[i][0];
            }
    
            // Check columns
            if ((board[0][i] === 'X' || board[0][i] === 'O') &&
                board[0][i] === board[1][i] && 
                board[0][i] === board[2][i]) {
                return board[0][i];
            }
        }
    
        // Check diagonal from top-left to bottom-right
        if ((board[0][0] === 'X' || board[0][0] === 'O') &&
            board[0][0] === board[1][1] && 
            board[0][0] === board[2][2]) {
            return board[0][0];
        }
    
        // Check diagonal from top-right to bottom-left
        if ((board[0][2] === 'X' || board[0][2] === 'O') &&
            board[0][2] === board[1][1] && 
            board[0][2] === board[2][0]) {
            return board[0][2];
        }
    
        // No winner
        return null;
    }
     
    function handleResultValidation() {
        let roundWon = false;
        //function to get win status
        const winner = checkWinner(board);

        if (winner != null){
            roundWon = true;
        }

        if (roundWon) {
            announce(currentPlayer === "X" ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

        let isBoardFull = true;
        for (let row of board) {
            if (row.includes('')) {
                isBoardFull = false;
                break;
            }
        }

        if (isBoardFull) {
            announce(TIE);
            isGameActive = false;
            return;
        }
    }

    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case TIE:
                announcer.innerText = 'Tie'
        }
        announcer.classList.remove('hide');
    };

    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O') {
            return false;
        }

        return true;
    };

    const updateBoard = (index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        board[row][col] = currentPlayer;
    }
    

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }

    const resetBoard = () => {
        board = board.map(() => ['', '', '']);        
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach (tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);
});
