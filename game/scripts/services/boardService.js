define(['utilitiesService'], function (utilitiesService) {

    var _getRandomMineLocations = function (squares, mines, revealedId) {

        var i = 0,
            attempts = 0,
            maxAttempts = mines * 5,
            results = [],
            usedLocations = {};

        //Run function until we've have n unique locations
        try {
            while (i < mines) {

                var temp = utilitiesService.randomNumberBetween(0, squares - 1);
                if (!usedLocations[temp] && temp !== Number(revealedId)) {
                    results[i] = temp;
                    usedLocations[temp] = true;
                    i += 1;
                }

                if (attempts > maxAttempts) {
                    throw "An error occurred while randomizing mines";
                }
                attempts += 1;
            }
        }
        catch (e) {
            alert(e);
            console.log(e);
            return;
        }
            
        return results.sort(function (a, b) { return a - b; });        
    };

    var _calculateNeighbors = function (cols, rows, squareNumber) {
            
        var index = 0,
            result = [],
            hasUp = (function () { return squareNumber > cols - 1; }()),
            hasLeft = (function () { return squareNumber % cols !== 0; }()),
            hasRight = (function () { return (squareNumber + 1) % cols !== 0; }()),
            hasDown = (function () { return squareNumber <= (cols * rows) - cols - 1; }()),
            addValue = function (val) { result[index] = val; index = index + 1; };

        if (hasUp && hasLeft) { addValue(squareNumber - cols - 1); } 
        if (hasUp) { addValue(squareNumber - cols); }                  
        if (hasUp && hasRight) { addValue(squareNumber - cols + 1); } 
        if (hasRight) { addValue(squareNumber + 1); }        
        if (hasDown && hasRight) { addValue(squareNumber + cols + 1); }
        if (hasDown) { addValue(squareNumber + cols); }    
        if (hasDown && hasLeft) { addValue(squareNumber + cols - 1); } 
        if (hasLeft) { addValue(squareNumber - 1); }

        return result;
    };

    var placeMines = function (game, revealedId) {

        var currentPosition,
          mineSquare,
          mineLocations = _getRandomMineLocations(game.squareCount, game.mineCount, revealedId);

        //for each mine location, get the corresponding square and set its mine property
        for (var i = 0, len = mineLocations.length; i < len; i++) {
            currentPosition = mineLocations[i];
            mineSquare = game.board.getSquareByIndex(currentPosition);
            mineSquare.isMine = true;

            //Add mine square the the game's board.mineSquare collection
            game.board.mineSquares[i] = mineSquare;
        }       
    };

    var setSquareAttributes = function(game) {

        var currentSquare,
            getNeighbors = function (sqVal) {
                var result = [],
                    neighborArray = _calculateNeighbors(game.columns, game.rows, sqVal);
                    
                for (var i = 0, len = neighborArray.length; i < len; i++) {
                    result.push(game.board.getSquareByIndex(neighborArray[i]));
                }
                return result;
            },
            setNeighboringMineCount = function (square) {
                for (var i = 0, len = square.neighbors.length; i < len; i++) {
                    if (square.neighbors[i].isMine === true) square.adjacentMines += 1;
                }
            };

            //Get each square; getNeighbors for each; set neighboring mine property
            for (var i = 0; i < game.squareCount; i++) {
                currentSquare = game.board.getSquareByIndex(i);
                currentSquare.neighbors = getNeighbors(i);            
                setNeighboringMineCount(currentSquare);            
            }
    };

    return {        
        placeMines: placeMines,
        setSquareAttributes: setSquareAttributes        
    };

});