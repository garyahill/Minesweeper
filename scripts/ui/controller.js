define(function (require) {
    //Requirements alternative syntax (looks better on modules with many requirements)
    var game = require('game'),
        Square = require('square'),
        MineField = require('minefield'),
        boardService = require('boardService'),
        uiService = require('uiService'),
        dataService = require('dataService'),
        timerService = require('timerService'),
        utils = require('utilitiesService'),
        config = require('configurationService');
    //End Requirements   

    var currentGame,
        gameOptions,
        uiBoard,
        debugBoard,
        squareObjectHash,
        isFirstSquareRevealed;

    //public functions
    function startGame(options, board) {
        
        //Kill any current game to re-initialize (and debug board if present)    
        game.killInstance();
        
        //Initialize controller variables
        currentGame = game.currentInstance(options);
        gameOptions = options;
        uiBoard = board;
        squareObjectHash = new dataService.objectHash();
        
        //Init
        resetGameBoardUI();
        drawBoard();
        isFirstSquareRevealed = false;
        resetIndicators();
    }

    //Assign a function that will run only one time per game (Safe First Reveal)
    var firstSquareRevealEvent = function (revealIndex) {

        boardService.placeMines(currentGame, revealIndex);
        boardService.setSquareAttributes(currentGame);

        //optional debugging
        if (gameOptions.debug) {
            if (!debugBoard) { debugBoard = new MineField(uiService.getDebugBoardObject()); }
            uiService.resetGameBoard(debugBoard, gameOptions.boardWidth);
            drawDebugBoard();
        }

        //Start timer
        timerService.startTimer();

        //Safe square revealed
        return true;
    };

    function squareActionHandler(e) {

        //"this" is the ui square revealed; bound to event using bind method
        if (e.button === 0) {
            squareRevealHandler.call(this);
        }
        else {
            toggleMarkerHandler.call(this);
        }
    }

    function squareRevealHandler() {       

        //Exit when an action tries to reveal a flagged square
        var vSquare = squareObjectHash.getJS(this);
        if (vSquare.isFlagged) return;

        if(isFirstSquareRevealed === false) {
            isFirstSquareRevealed = firstSquareRevealEvent(this.hashPair_id);
        }
        commonSquareActions.call(vSquare, true);
    }

    function toggleMarkerHandler() {        
        var vSquare = squareObjectHash.getJS(this);
        commonSquareActions.call(vSquare, false);
    }

    function commonSquareActions(isReveal) {
        //"this" is now the vSquare passed from function "call"
        var eventData = currentGame.board.executeSquareAction(this, isReveal);
        updateUI(isReveal);

        if (eventData.gameOver) {
            gameEnd(eventData.isWin);
        }
    }

    function updateUI(isReveal) {

        var vSquares = currentGame.board.getStateChangedSquares();
        for (var i = 0, len = vSquares.length; i < len; i++) {
            uiService.uiUpdateSquare(vSquares[i], squareObjectHash.getUI(vSquares[i]));
        }
        //Update flag count if not a reveal action
        if (!isReveal) uiService.updateFlagCount(currentGame.flagCount);
    }

    function drawBoard() {
       
        //build the board
        for (var i = 0; i < currentGame.squareCount; i++) {

            //create virtual and ui squares; store associated pair
            var vSquare = new Square();
            var uiSquare = uiService.createUISquare(gameOptions.squareSize);
            squareObjectHash.setPair(uiSquare, vSquare);
            
            //Add square action event            
            uiService.bindMouseDownEvent(uiSquare, squareActionHandler);
            currentGame.board.addSquare(vSquare);
            uiBoard.minefieldContainer.append(uiSquare);
        }
        uiService.finalizeBoard(uiBoard);
    }

    function resetGameBoardUI() {
        if (uiBoard) uiService.resetGameBoard(uiBoard, gameOptions.boardWidth);
        if (debugBoard) uiService.resetGameBoard(debugBoard, gameOptions.boardWidth);
    }

    function resetIndicators() {
        timerService.resetTimer(gameOptions.maxTimeCount, uiService.updateTimer);
        uiService.updateFlagCount(gameOptions.mines);
    }    

    function gameEnd(isWin) {
        uiService.freezeBoardState(uiBoard.minefieldContainer);
        currentGame.timeCounter = timerService.stopTimer();
        
        var gameData = {
            Time: currentGame.timeCounter,
            MinesCleared: currentGame.clearedMineCount,
            TotalMines: currentGame.mineCount,
            Level: currentGame.difficultyLevel,
            IsWin: isWin            
        };
        uiService.showResultsModal(gameData);
    }

    function quitGame() {
        //Fired when the user clicks the "home" button
        if (debugBoard) {
            uiService.removeDomItem(debugBoard.minefieldContainer);
            debugBoard = null;
        }
        game.killInstance();
    }

    /// Debugging ///
    function drawDebugBoard() {       
        uiService.spaceDebugBoard(debugBoard.minefieldContainer);
        for (var i = 0; i < currentGame.squareCount; i++) {
            var vSquare = currentGame.board.getSquareByIndex(i),
            uiSquare = uiService.createDebugSquare(gameOptions.squareSize, vSquare.isMine, vSquare.adjacentMines);
            debugBoard.minefieldContainer.append(uiSquare);
        }
        uiService.finalizeBoard(debugBoard);
    }
    
    return {
        startGame: startGame,
        quitGame: quitGame
    };

});