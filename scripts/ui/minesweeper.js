define(function (require) {
    //Requirements alternative syntax (looks better on modules with many requirements)
    //Note: bootstrap required, but not needed in a variable for the module.  
    //This is the same as listing it in the define-require array, but not passing it in to the function
    require('bootstrap');

    var $ = require('jquery'),
        options = require('options'),
        controller = require('controller'),
        MineField = require('minefield'),
        validationService = require('validationService'),
        config = require('configurationService'),
        utils = require('utilitiesService');
    //End Requirements    

    //Debug board
    if (utils.getQueryStringParams(document.URL).debug) options.debug = true;

    $(document).ready(function () {

        //kill right context menu
        document.oncontextmenu = function () { return false; };

        //Get jq references to controls
        var gameBoard = new MineField($("#divBoard"));
        var optionsModal = $("#optionsModal");
        var aboutModal = $("#aboutModal");
        var gameContainer = $("#gameContainer");
        var gameLevels = $("#gameLevels");

        //Service call to work with BootstrapValidator
        var optionsValidator = validationService.getBootstrapValidator("optionsForm"),
            mineValidationMsg = config.VALIDATION.MESSAGES.MINES_VALIDATION,
            defaultMax = config.VALIDATION.DEFAULTS.MAX_MINES,
            data = validationService.createValidationDataObject(defaultMax, mineValidationMsg, true);

        //Add custom options to mines validation ("customMines" = name of input to add validator)
        validationService.addValidator(optionsValidator, "customMines", data);

        $("#optionsModal :input").on("change", function () {
            var rowsInput = $("#customRows"),
            columnsInput = $("#customColumns");

            //calculate and update validator for mines if rows and colums have data
            if (this.id !== "customMines" && rowsInput.val() && columnsInput.val()) {

                var minesInput = $("#customMines"),
                    maxMines = Math.floor((rowsInput.val() * columnsInput.val()) / 2),
                    dataObject = validationService.createValidationDataObject(maxMines, mineValidationMsg, true);

                minesInput.attr({ max: maxMines });
                validationService.updateValidator(optionsValidator, "customMines", dataObject);

                if (minesInput.val() !== "") optionsValidator.revalidateField('customMines');                
            }
        });

        //Game Level Buttons Event (easy, medium, expert, custom)
        $("input[name='gameLevel']").on("click", function () {
            if (this.value !== config.GAME_LEVEL.CUSTOM) {
                options.customize(this.value);
                startGame();
            }
            else {
                optionsModal.attr({ "data-backdrop": "static" }); //modal window
                optionsModal.modal();
                //Need to wait for plugin to load before calling validate 
                setTimeout(function () { optionsValidator.validate(); }, 500);
            }
        });

        //Modal Options Save
        $("#SaveOptions").on("click", function () {

            optionsValidator.validate();
            if (optionsValidator.isValid()) {
                var customArgs = {
                    rows: $("#customRows").val(),
                    columns: $("#customColumns").val(),
                    mines: $("#customMines").val()
                };
                options.customize("Custom", customArgs);
                optionsModal.modal('hide');
                startGame();
            }
        });

        //Modal About Open
        $("#About").on("click", function () {
            aboutModal.modal('show');
        });

        //Start Game
        var startGame = function () {
            gameLevels.hide();
            gameContainer.fadeIn(750);
            controller.startGame(options, gameBoard);
        };

        //Start new game (pass board object to controller for build)
        $("#NewGame").on("click", startGame);
        $("#Home").on("click", function () {
            controller.quitGame();
            gameContainer.hide();
            gameLevels.fadeIn(750);
        });

    });
});


