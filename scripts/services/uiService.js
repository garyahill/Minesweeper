define(['utilitiesService', 'dataService', 'configurationService'], function (utilitiesService, dataService, config) {
        
    //PRIVATE METHODS

    var _addDataDashAttribute = function (uiSquare, content) {

        var helper = config.DATA_DASH.SQ_HELPER;

        switch (content) {
            case helper.VALUES.QUESTION:
                uiSquare.attr(helper.NAME, helper.VALUES.QUESTION);
                break;
            case helper.VALUES.FLAG:
                uiSquare.attr(helper.NAME, helper.VALUES.FLAG);
                break;
            case helper.VALUES.MINE:
                uiSquare.attr(helper.NAME, helper.VALUES.MINE);
                break;
            case helper.VALUES.EXPLODED_MINE:
                uiSquare.attr(helper.NAME, helper.VALUES.EXPLODED_MINE);
                break;
            default:
                uiSquare.attr(helper.NAME, content);
                break;
        }
    };

    var _getGameEndMessage = function (isWin) {
        var msg = config.MESSAGES.OUTCOME;
        if (isWin) return msg.WINNERS[utilitiesService.randomNumberBetween(0, msg.WINNERS.length - 1)];
        else return msg.LOSERS[utilitiesService.randomNumberBetween(0, msg.LOSERS.length - 1)];
    };

    var _getSquareDimensions = function (val) {
        return "width: ".concat(val).concat("px; ").concat("height: ").concat(val).concat("px");
    };
     
    var _parseMinesClearedResultText = function (cleared, total) {
        return cleared.toString().concat(" of ").concat(total).concat(" Mines");
    };

    var _parseOutcomeText = function (isWin) {
        if (isWin) { return config.GAME_OUTCOME.WIN; }
        else { return config.GAME_OUTCOME.LOSS; }
    };

    var _parseRecordTimeResultText = function (data) {

        var record,
           storedTime,
           level = data.Level,
           time = data.Time,
           isWin = data.IsWin,
           getStoredItem = dataService.getLocalStorageItem,
           setStoredItem = dataService.setLocalStorageItem;

        if (utilitiesService.hasLocalStorage) {
            //this game type hasn't been stored yet
            if (!getStoredItem(level)) {
                //store new time on win condition
                if (isWin) {
                    record = time;
                    setStoredItem(level, record);
                }
                else { record = config.MESSAGES.FEEDBACK.NO_LEVEL_WINNER; }
            }
            else { //in else condition we have a stored time                    
                storedTime = Number(getStoredItem(level));
                if (isWin) {
                    if (storedTime > time) {
                        record = time;  //new record
                        setStoredItem(level, record);
                    }
                    else { record = storedTime; } //not a record                                        
                }
                else { record = storedTime; } //record stands on loss                    
            }
        }
        else { return config.MESSAGES.FEEDBACK.NO_BROWSER_SUPPORT }

        //determine if "record is parse-able to time rep (if not it's a text message)
        if (!isNaN(record)) {
            record = _parseTimeResultText(record);
        }
        return record;
    };

    var _parseTimeResultText = function (seconds) {

        var output;
        if (seconds > 3599) {
            output = config.MESSAGES.FEEDBACK.MAX_TIME_EXCEEDED;
        }
        else if (seconds < 60) {
            if (seconds === 1) { output = "1 Second"; }
            else { output = seconds.toString().concat(" Seconds"); }
        }
        else {
            var minutes = Math.floor(seconds / 60);
            var seconds = (seconds % 60).toString();
            if (seconds.length < 2) seconds = "0".concat(seconds);
            output = minutes.toString().concat(":").concat(seconds.toString());
        }
        return output;
    };

    var _removeDataDashAttribute = function (uiSquare, attribute) {
        //Check for existance and remove accordingly
        if (uiSquare.attr(attribute)) {
            uiSquare.removeAttr(attribute);
        }
    };

    var _updateSquareContent = function (uiSquare, content) {
        uiSquare.empty();
        uiSquare.append(content);
    };

    var _updateSquareChangeClass = function (uiSquare, className) {
        uiSquare.removeClass();
        uiSquare.addClass(className);
    };

    //PUBLIC METHODS

    var bindMouseDownEvent = function (uiObject, eventHandler) {
        uiObject.on(config.UI.EVENTS.MOUSE_DOWN, eventHandler.bind(uiObject));
    };

    var createDebugSquare = function (squareSize, isMine, adjacentMines) {

        debugSquare = createUISquare(squareSize);

        if (isMine) {
            _updateSquareContent(debugSquare, config.FA_ICONS.MINE);
            _addDataDashAttribute(debugSquare, config.DATA_DASH.SQ_HELPER.VALUES.MINE);
        }
        else if (adjacentMines > 0) {
            _updateSquareContent(debugSquare, adjacentMines);
            _addDataDashAttribute(debugSquare, adjacentMines);
        }
        return debugSquare;
    };

    var createUISquare = function (sqSize) {

        return $(config.UI.SQUARE.ELEMENT.HTML).attr({
            style: _getSquareDimensions(sqSize)
        });
    };
    
    var finalizeBoard = function (gameboard) {
        gameboard.minefieldContainer.append(config.CLEAR_FLOAT);
    };

    var freezeBoardState = function (minefieldContainer) {
        minefieldContainer.children(config.UI.SQUARE.ELEMENT.TYPE).attr("disabled", "disabled");
    };

    var getDebugBoardObject = function () {

        var jqDebugContainer = $(config.DEBUG.BOARD_CONTAINER_ID);

        //append container to body only once
        if (!jqDebugContainer.length) {
            jqDebugContainer = $(config.DEBUG.BOARD_CONTAINER_HTML);
            jqDebugContainer.appendTo("body");
            jqDebugContainer.addClass(config.CSS_CLASSES.BOARD);
        }
        return jqDebugContainer;
    };

    var removeDomItem = function (board) {
        board.remove();
    };

    var resetGameBoard = function (gameboard, width) {
        gameboard.minefieldContainer.empty();
        gameboard.minefieldContainer.attr({ style: "width: " + width.toString().concat("px") });
    };

    var showResultsModal = function (gameData) {

        var resultsModal = $("#".concat(config.UI.ID.RESULTS_MODAL));
        $("#".concat(config.UI.ID.RESULTS_TITLE)).empty().append(_getGameEndMessage(gameData.IsWin));
        $("#".concat(config.UI.ID.RESULTS_LEVEL)).empty().append(gameData.Level);
        $("#".concat(config.UI.ID.RESULTS_OUTCOME)).empty().append(_parseOutcomeText(gameData.IsWin));
        $("#".concat(config.UI.ID.RESULTS_TIME)).empty().append(_parseTimeResultText(gameData.Time));
        $("#".concat(config.UI.ID.RESULTS_MINES_CLEARED)).empty().append(_parseMinesClearedResultText(gameData.MinesCleared, gameData.TotalMines));

        //Records don't make sense for custom games because the parameters differ
        if (gameData.Level === config.GAME_LEVEL.CUSTOM) {
            $("#".concat(config.UI.ID.RESULTS_RECORD_ROW)).hide();
        }
        else {
            $("#".concat(config.UI.ID.RESULTS_RECORD_ROW)).show();
            $("#".concat(config.UI.ID.RESULTS_RECORD_TIME)).empty().append(_parseRecordTimeResultText(gameData));
        }

        resultsModal.attr({ "data-backdrop": "static" });
        resultsModal.modal('show');
    };

    var spaceDebugBoard = function (debugBoard) {
        debugBoard.append(config.DEBUG.BOARD_SPACING);
    };

    var uiUpdateSquare = function (vSquare, uiSquare) {

        var helper = config.DATA_DASH.SQ_HELPER;

        //is Mine
        if (vSquare.isRevealed && vSquare.isMine) {
            uiSquare.removeClass();
            _updateSquareContent(uiSquare, config.FA_ICONS.MINE);
            _updateSquareChangeClass(uiSquare, config.CSS_CLASSES.REVEALED);

            if (vSquare.isExplodedMine) {
                _addDataDashAttribute(uiSquare, helper.VALUES.EXPLODED_MINE);
            }
            else {
                _addDataDashAttribute(uiSquare, helper.VALUES.MINE);
            }
        } //square without a mine
        else if (vSquare.isRevealed) {
            //purge data attribute & empty square (could be a ?-mark square)
            _removeDataDashAttribute(uiSquare, helper.NAME);
            uiSquare.empty();

            _updateSquareChangeClass(uiSquare, config.CSS_CLASSES.REVEALED);            

            //Show content in the square if appropriate
            if (vSquare.adjacentMines) {
                _updateSquareContent(uiSquare, vSquare.adjacentMines);
                _addDataDashAttribute(uiSquare, vSquare.adjacentMines);
            }
        }
        else { //toggle marker action            
            if (vSquare.isFlagged) {
                _updateSquareContent(uiSquare, config.FA_ICONS.FLAG);
                _addDataDashAttribute(uiSquare, helper.VALUES.FLAG);
            }
            else if (vSquare.isQuestioned) {
                _updateSquareContent(uiSquare, config.FA_ICONS.QUESTION);
                _addDataDashAttribute(uiSquare, helper.VALUES.QUESTION);
            }
            else {
                uiSquare.empty();
                _removeDataDashAttribute(uiSquare, helper.NAME);
            }
        }
        //Disable revealed square
        if (vSquare.isRevealed) uiSquare.attr("disabled", "disabled");
    };
    
    var updateFlagCount = function (count) {
        $("#".concat(config.UI.ID.FLAGS)).text(count);
    };

    var updateTimer = function (value) {
        $("#".concat(config.UI.ID.TIMER)).text(value);
    };

    return {
        resetGameBoard: resetGameBoard,
        createUISquare: createUISquare, 
        finalizeBoard: finalizeBoard,
        getDebugBoardObject: getDebugBoardObject,
        createDebugSquare: createDebugSquare,
        uiUpdateSquare: uiUpdateSquare,
        freezeBoardState: freezeBoardState,
        updateTimer: updateTimer,
        updateFlagCount: updateFlagCount,
        bindMouseDownEvent: bindMouseDownEvent,
        removeDomItem: removeDomItem,
        showResultsModal: showResultsModal,
        spaceDebugBoard: spaceDebugBoard
    };

});