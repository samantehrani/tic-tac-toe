const CELL_VALUE = {
    "O": 1,
    "X": -1,
    "B": 0
};
const GAME_STATE = {
    "oWin": 1,
    "xWin": -1,
    "draw": 0,
    "inProgress": 2
};
const WINNING_STATES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
class GameBoard {
    constructor(boardConfiguration) {
        this._state = boardConfiguration || new Int8Array(Array(9).fill(CELL_VALUE.B));
    }
    getCellState(index) {
        return this._state[index];
    }
    get state() {
        return this._state;
    }
    setCellState(index, move) {
        this._state[index] = move;
    }
    set state(boardConfiguration) {
        this._state = boardConfiguration;
    }
}
class GameSession {
    constructor(id, signs, turn) {
        this._sessionId = id;
        this.gameStates = [new GameBoard()];
        this.signs = {
            "player1": signs.player1,
            "player2": signs.player2
        };

        this._turn = turn ? (turn === "player1" ? this.signs["player1"] : this.signs["player2"]) : (function() {
            return (Math.floor(Math.random() * 2) + 1) === 3 ? 1 : -1; // either 2 or 3
        })(); // 1 => player 1 turn  -1 => player 2 turn

        this._winner = GAME_STATE.inProgress;
    }
    get turn() {
        return this._turn;
    }
    set turn(t) {
        if (t === 1 || t === -1) {
            this._turn = t;
        }
        throw `${t} is Invalid! Turns can only be assigned to either 1 or -1!`;
    }
    switchPlayer() {
        this._turn = this._turn * -1;
    }
    get winner() {
        return this._winner;
    }
    get sessionId() {
        return this._sessionId;
    }

    changePlayerSign(sign) {
        if (sign === 1 || sign === -1) {
            this.signs.player1 = sign;
            this.signs.player2 = -1 * sign;
            return;
        }
        throw `${sign} is Invalid! Signs can only be assigned to either 1 or -1!`;
    }
    makeMove(index, player) {
        if (this._winner !== GAME_STATE.inProgress) {
            throw `This Game is Over. Game went for ${this._winner}`;
        }

        if (!player) {
            throw "Provide Player!";
        }
        if (this.turn === this.signs[player]) {
            let currentBoard = this.getCurrentBoard();

            if (currentBoard.getCellState(index) === CELL_VALUE.B) {
                let newGameBoard = new GameBoard(currentBoard.state);

                newGameBoard.setCellState(index, this.signs[player]);

                this.gameStates.push(newGameBoard);
                if (!this.isTerminated()) {
                    this.switchPlayer();
                }


                return this._winner;
            }
            throw `This is already filled with ${currentBoard.getCellState(index)}`;
        }
        throw `It's not ${player}'s turn!`;
    }
    getCurrentBoard() {
        return this.gameStates[this.gameStates.length - 1];
    }
    static printGame(gameSession, history) {
        let h = history ? history : false;
        if (h) {

        } else {
            let currentBoard = gameSession.getCurrentBoard();
            console.log("===========")
            for (let i = 0; i < 9; i += 3) {
                console.log(`${currentBoard.getCellState(i)} | ${currentBoard.getCellState(i+1)} | ${currentBoard.getCellState(i+2)}`);
            }
        }
    }
    isTerminated() {
        let currentState = this.getCurrentBoard().state;

        for (let i = 0; i < WINNING_STATES.length; i++) {
            if (currentState[WINNING_STATES[i][0]] === currentState[WINNING_STATES[i][1]] && currentState[WINNING_STATES[i][0]] === currentState[WINNING_STATES[i][2]] && currentState[WINNING_STATES[i][0]] != CELL_VALUE.B) {
                this._winner = (currentState[WINNING_STATES[i][0]] === 1) ? GAME_STATE.oWin : GAME_STATE.xWin;
                return true;
            }
        }
        return false;
    }
}
let gameSession = new GameSession(1, { "player1": 1, "player2": -1 }, "player1");
GameSession.printGame(gameSession);
gameSession.makeMove(1, "player1");
GameSession.printGame(gameSession);
gameSession.makeMove(5, "player2");
GameSession.printGame(gameSession);
gameSession.makeMove(2, "player1");
GameSession.printGame(gameSession);
gameSession.makeMove(7, "player2");
GameSession.printGame(gameSession);
gameSession.makeMove(0, "player1");
GameSession.printGame(gameSession);
gameSession.makeMove(8, "player2");
GameSession.printGame(gameSession);
gameSession.makeMove(3, "player1");
GameSession.printGame(gameSession);
gameSession.makeMove(4, "player2");
GameSession.printGame(gameSession);
gameSession.makeMove(2, "player1");
GameSession.printGame(gameSession);