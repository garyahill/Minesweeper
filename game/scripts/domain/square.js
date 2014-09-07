define(['pubSubService', 'configurationService'], function (pubSub, config) {

    var Square = function() {

        //noinspection CommaExpressionJS
        this.isMine = false,
        this.isFlagged = false,
        this.isQuestioned = false,
        this.isRevealed = false,
        this.isExplodedMine = false,
        this.adjacentMines = 0,
        this.neighbors = [];
    };

    Square.prototype.reveal = function () {

        if (!this.isRevealed && !this.isFlagged) {

            if (this.isMine) {
                this.isExplodedMine = true;
                return true;
            }
            else {
                this.isRevealed = true;
                //publish changes
                pubSub.pub(config.PUBSUB.SQUARE_STATE_CHANGED, this);
                pubSub.pub(config.PUBSUB.REVEALED_SQUARE_COUNT_CHANGED);

                //Propagate callback to neighbors if this is a blank square
                if (!this.adjacentMines) {
                    for (var i = 0, len = this.neighbors.length; i < len; i++) {
                        this.neighbors[i].propagate(this);
                    }
                }
            }
        }
    };

    Square.prototype.propagate = function (revealedSquare) {

        //don't propagate updates to revealed, mined, flagged, or the revealed square
        //The revealed square will be updated in calling function "reveal".
        if (!this.isRevealed && !this.isMine && !this.isFlagged && this != revealedSquare) {

            this.isRevealed = true;
            pubSub.pub(config.PUBSUB.SQUARE_STATE_CHANGED, this);
            pubSub.pub(config.PUBSUB.REVEALED_SQUARE_COUNT_CHANGED);

            //recursively propagate on empty square
            if (!this.adjacentMines) {
                for (var i = 0, len = this.neighbors.length; i < len; i++) {
                    this.neighbors[i].propagate(revealedSquare);
                }
            }
        }
    };

    Square.prototype.toggleMarker = function () {

        if (!this.isRevealed) {

            pubSub.pub(config.PUBSUB.SQUARE_STATE_CHANGED, this);

            if (this.isFlagged) {
                this.isQuestioned = true;
                this.isFlagged = false;
                //signal that we should add 1 to flag to be placed count
                pubSub.pub(config.PUBSUB.FLAG_COUNT_CHANGED, 1);
                //if flag removed was on mine; signal we should decrement cleared mine count
                if (this.isMine) pubSub.pub(config.PUBSUB.CLEARED_MINE_COUNT_CHANGED, -1);
            }
            else if (this.isQuestioned) {
                this.isFlagged = false;
                this.isQuestioned = false;
            }
            else {
                this.isFlagged = true;
                //signal that we should subtract 1 from flag to be placed count
                pubSub.pub(config.PUBSUB.FLAG_COUNT_CHANGED, -1);
                //add one to cleared mine count if we are putting a flag on a mine
                if (this.isMine) pubSub.pub(config.PUBSUB.CLEARED_MINE_COUNT_CHANGED, 1);
            }
        }
    };

    return Square;

});