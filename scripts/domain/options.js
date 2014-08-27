define(['configurationService'], function (config) {

    var mines = 10,
        columns = 9,
        rows = 9,
        squareSize = 35,
        squareMargin = 3,
        maxTimeCount = 999,
        squareCount = columns * rows,
        boardWidth = columns * squareSize,
        difficultyLevel = config.GAME_LEVEL.EASY,
        debug = false;

    var customize = function (difficulty, args) {

        switch (difficulty) {
            case config.GAME_LEVEL.EASY:
                this.rows = 9;
                this.columns = 9;
                this.mines = 10;
                this.difficultyLevel = config.GAME_LEVEL.EASY;
                break;
            case config.GAME_LEVEL.MEDIUM:
                this.rows = 16;
                this.columns = 16;
                this.mines = 40;
                this.difficultyLevel = config.GAME_LEVEL.MEDIUM;
                break;
            case config.GAME_LEVEL.EXPERT:
                this.rows = 16;
                this.columns = 30;
                this.mines = 99;
                this.difficultyLevel = config.GAME_LEVEL.EXPERT;
                break;
            case config.GAME_LEVEL.CUSTOM:
                this.rows = Number(args.rows);
                this.columns = Number(args.columns);
                this.mines = Number(args.mines);
                this.difficultyLevel = config.GAME_LEVEL.CUSTOM;
                break;
        }

        this.squareCount = this.columns * this.rows;
        this.boardWidth = this.columns * (this.squareSize + this.squareMargin);
    };

    return {
        mines: mines,
        columns: columns,
        squareSize: squareSize,
        squareMargin: squareMargin,
        squareCount: squareCount,
        boardWidth: boardWidth,
        maxTimeCount: maxTimeCount,
        rows: rows,
        debug: debug,
        difficultyLevel: difficultyLevel,
        customize: customize
    };

});