define(['pubsubService', 'configurationService'], function (pubSub, config) {

    return function () {

        var squares = [],
            mineSquares = [],
            stateChangedSquares = [],
            revealedSquares = 0;
        
        //Private Methods
        var _addStateChangedSquare = function (sq) {
                return stateChangedSquares.push(sq);
            },
            _revealMines = function () {
                for (var i = 0, len = mineSquares.length; i < len; i++) {
                    //reveal only non-flagged mines
                    if (!mineSquares[i].isFlagged) {
                        mineSquares[i].isRevealed = true;
                        stateChangedSquares.push(mineSquares[i]);
                    }
                }
            },
            _incrementRevealedSquares = function () {
                revealedSquares += 1;
            },
            _minefieldCleared = function () {
                if (squares.length - mineSquares.length === revealedSquares) {
                    return true;
                }
            };

        //Public Methods
        var addSquare = function (sq) {
            squares[squares.length] = sq;
        },
            getStateChangedSquares = function () {
                var returnVal = stateChangedSquares;
                stateChangedSquares = [];
                return returnVal;
            },
            getSquareByIndex = function (index) {
                return squares[index];
            },
            executeSquareAction = function (square, isReveal) {

                var eventData = {},
                    mineDetonated;

                if (isReveal) {
                    mineDetonated = square.reveal();

                    if (mineDetonated) {
                        _revealMines();
                        eventData.gameOver = true;
                        eventData.isWin = false;
                    }
                    if (_minefieldCleared()) {
                        pubSub.pub(config.PUBSUB.ALL_MINES_CLEARED);
                        eventData.gameOver = true;
                        eventData.isWin = true;
                    }
                }
                else {
                    square.toggleMarker();
                }
                return eventData;
            };
                
   //PubSub Subscriptions
        pubSub.sub(config.PUBSUB.SQUARE_STATE_CHANGED, _addStateChangedSquare);
        pubSub.sub(config.PUBSUB.REVEALED_SQUARE_COUNT_CHANGED, _incrementRevealedSquares);

        return {
            squares: squares,
            mineSquares: mineSquares,
            addSquare: addSquare,
            getSquareByIndex: getSquareByIndex,
            getStateChangedSquares: getStateChangedSquares,
            executeSquareAction: executeSquareAction
        };
    }

});