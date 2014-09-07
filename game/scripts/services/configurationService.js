define(function () {

    //FONT AWESOME ICON TEXT
    var fa_mine = "<i class=\"fa fa-bomb\"></i>",
        fa_flag = "<i class=\"fa fa-flag\"></i>",
        fa_question = "<i class=\"fa fa-question\"></i>";

    //FEEDBACK MESSAGES
    var max_time_exceeded = "Maximum Time Exceeded",
        no_level_winner = "No winner at this level yet!",
        no_browser_support = "[upgrade your browser to use this feature]";

    //GAME LEVELS
    var easy = "Easy",
        medium = "Medium",
        expert = "Expert",
        custom = "Custom";

    //GAME OUTCOME
    var loss = "Loss",
        win = "Win";

    //GAME OUTCOME MESSAGES
    var winners = [];
    winners[0] = "Congratulations!";
    winners[1] = "Nice work!";
    winners[2] = "Well played!";
    winners[3] = "Way to go!";

    var losers = [];
    losers[0] = "Better luck next time!!";
    losers[1] = "Keep practicing!";
    losers[2] = "Maybe Minesweeper is not your game?";
    losers[3] = "That's going to hurt in the morning!";
    losers[4] = "Haste makes waste!";

    //HTML ELEMENT IDS 
    var debug_board_container_id = "debugContainer",
        timer_id = "lblTimer",
        flags_id = "lblFlags",
        resultsModal_id = "resultsModal",
        resultsTitle_id = "resultsTitle",
        resultsLevel_id = "resultsLevel",
        resultsOutcome_id = "resultsOutcome",
        resultsTime_id = "resultsTime",
        resultsMinesCleared_id = "resultsMinesCleared",
        resultsRecordRow_id = "resultsRecordRow",
        resultsRecordTime_id = "resultsRecordTime";

    //HTML ELEMENT TYPES
    ui_square_element_type = "button";

    //HTML TEXT
    var ui_square_element_html = "<" + ui_square_element_type + ">",
        clear_float = "<div style=\"clear: both\"></div>",
        debug_board_spacing = "<br /><br /><br />",
        debug_board_container_html = "<div id='" + debug_board_container_id + "'></div>";

    //NAMES AND VALUES FOR DATA_DASH SQ_HELPER
    var name = "data-squarehelper",
        mine = "mine",
        exploded = "exploded",
        flag = "flag",
        question = "question";

    //PUBSUB EVENTS
    var cleared_mine_count_changed = "cleared_mine_count_changed",
        flag_count_changed = "flag_count_changed",
        all_mines_cleared = "all_mines_cleared",
        square_state_changed = "square_state_changed",
        revealed_square_count_changed = "revealed_square_count_changed";

    //SQUARE CLASS NAMES
    var revealed = "revealed",
        board = "gameboard";
 
    //UI EVENTS
    var mouse_down = 'mousedown',
        tap_hold = 'taphold';

    //VALIDATION
    var validation_messages_mines = "Mines must be less than or equal to",
    validation_defaults_max_mines = 40;
          
    return {
        CLEAR_FLOAT: clear_float,
        CSS_CLASSES: {
            BOARD: board,
            REVEALED: revealed
        },        
        DATA_DASH: {
            SQ_HELPER: {
                NAME: name,
                VALUES: {
                    EXPLODED_MINE: exploded,
                    FLAG: flag,
                    MINE: mine,
                    QUESTION: question
                }
            }
        },
        DEBUG: {
            BOARD_CONTAINER_HTML: debug_board_container_html,
            BOARD_CONTAINER_ID: debug_board_container_id,
            BOARD_SPACING: debug_board_spacing
        },        
        FA_ICONS: {
            FLAG: fa_flag,
            MINE: fa_mine,
            QUESTION: fa_question
        },
        GAME_LEVEL: {
            CUSTOM: custom,
            EASY: easy, 
            EXPERT: expert,
            MEDIUM: medium
        },
        GAME_OUTCOME: {
            WIN: win,
            LOSS: loss
        },
        MESSAGES: {
            OUTCOME: {
                LOSERS: losers,
                WINNERS: winners                
            },
            FEEDBACK: {
                MAX_TIME_EXCEEDED: max_time_exceeded,
                NO_BROWSER_SUPPORT: no_browser_support,
                NO_LEVEL_WINNER: no_level_winner                                
            }
        },
        PUBSUB: {
            CLEARED_MINE_COUNT_CHANGED: "cleared_mine_count_changed",
            FLAG_COUNT_CHANGED: "flag_count_changed",
            ALL_MINES_CLEARED: "all_mines_cleared",
            SQUARE_STATE_CHANGED: "square_state_changed",
            REVEALED_SQUARE_COUNT_CHANGED: "revealed_square_count_changed"
        },
        UI: {
            EVENTS: {
                MOUSE_DOWN: mouse_down,
                TAP_HOLD: tap_hold
            },
            SQUARE: {
                ELEMENT: {
                    HTML: ui_square_element_html,
                    TYPE: ui_square_element_type                    
                }
            },
            ID: {
                FLAGS: flags_id,               
                RESULTS_LEVEL: resultsLevel_id,
                RESULTS_MINES_CLEARED: resultsMinesCleared_id,
                RESULTS_MODAL: resultsModal_id,
                RESULTS_OUTCOME: resultsOutcome_id,
                RESULTS_RECORD_ROW: resultsRecordRow_id,
                RESULTS_RECORD_TIME: resultsRecordTime_id,
                RESULTS_TIME: resultsTime_id,
                RESULTS_TITLE: resultsTitle_id,
                TIMER: timer_id
            }
        },       
        VALIDATION: {            
            DEFAULTS: {
                MAX_MINES: validation_defaults_max_mines
            },
            MESSAGES: {
                MINES_VALIDATION: validation_messages_mines
            }
        }
    }
});

