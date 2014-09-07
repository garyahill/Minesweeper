define(['board', 'pubSubService', 'configurationService'], function (Board, pubSub, config) {

    var instance;  // Singleton Instance

    function Singleton(options) {

        var mineCount = options.mines,
            flagCount = options.mines,
            clearedMineCount = 0,
            columns = options.columns,
            rows = options.rows,
            squareCount = options.squareCount,
            timeCounter = 0,
            difficultyLevel = options.difficultyLevel;

        var board = new Board();

        //Private Methods (all close over "instance" before being shipped to pubsub)
        var _allMinesCleared = function () {
            instance.clearedMineCount = instance.mineCount;
        };
        var _setClearedMineCount = function (val) {
            instance.clearedMineCount += val;
        };
        var _setFlagCount = function (val) {
            instance.flagCount += val;
        };
    
        //PubSub Subscriptions
        pubSub.sub(config.PUBSUB.ALL_MINES_CLEARED, _allMinesCleared);
        pubSub.sub(config.PUBSUB.CLEARED_MINE_COUNT_CHANGED, _setClearedMineCount);  
        pubSub.sub(config.PUBSUB.FLAG_COUNT_CHANGED, _setFlagCount);         
        
        //instance is set to this returned object
        return {
            board: board,
            columns: columns,
            rows: rows,
            flagCount: flagCount,
            squareCount: squareCount,
            mineCount: mineCount,
            clearedMineCount: clearedMineCount,
            timeCounter: timeCounter,
            difficultyLevel: difficultyLevel
        };
    }

    return {
        currentInstance: function (options) {
            if (!instance) {
                instance = new Singleton(options);
            }
            return instance;
        },
        killInstance: function () {
            if (instance !== undefined) {
                //kill pubSub subscriptions; recreate on new game
                pubSub.reset();
                instance = null;
            }
        }
    };

});


