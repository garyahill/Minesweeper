define(function () {

    var _internalTimeCount = 0,
        _timerId,
        _maxDisplayValue,
        _callback;

    //Private
    var _updateCounter = function () {
        _internalTimeCount += 1;
        if (_internalTimeCount <= _maxDisplayValue) {
            _callback(_internalTimeCount);
        }
    };

    //Public
    var startTimer = function () {
        _timerId = setInterval(_updateCounter, 1000);
    },
    stopTimer = function () {
        clearInterval(_timerId);
        return _internalTimeCount;
    },
    resetTimer = function (maxDisplayValue, callback) {
        _maxDisplayValue = maxDisplayValue;
        _callback = callback;
        if (_timerId) {
            _internalTimeCount = 0;
            clearInterval(_timerId);
        }
        _callback(_internalTimeCount);
    };

    return {
        startTimer: startTimer,
        stopTimer: stopTimer,
        resetTimer: resetTimer
    };

});