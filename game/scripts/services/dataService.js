define(function () {

    //This object will allow for storing two objects associated with each other
    //and either can be used to return the other (as the index)
    var objectHash = function () {
        var _hashSeed = 0,
            _objectPairCollection = {},
            _objectPair = function (ui, js) {
                return {
                    uiObject: ui,
                    jsObject: js
                };
            },
            _setHashSeed = function (x, y) {
                x.hashPair_id = _hashSeed;
                y.hashPair_id = _hashSeed;
                return _hashSeed++; //note: _hashSeed updated AFTER val returned              
            },
            setPair = function (uiObj, jsObj) {
                var index = _setHashSeed(uiObj, jsObj);
                _objectPairCollection[index] = new _objectPair(uiObj, jsObj);
            },
            getUI = function (objKey) {
                return _objectPairCollection[objKey.hashPair_id].uiObject;
            },
            getJS = function (objKey) {
                return _objectPairCollection[objKey.hashPair_id].jsObject;
            },
            clearAll = function() {
                _hashSeed = 0;
                _objectPairCollection = {};
            };
        return {
            setPair: setPair,
            getUI: getUI,
            getJS: getJS,
            clearAll: clearAll
        };
    };

    var setLocalStorageItem = function (objKey, value) {
        //localStorage = property on the window object (when available)
        localStorage.setItem(objKey, value);
    };
    
    var getLocalStorageItem = function (objKey) {
        //localStorage = property on the window object (when available)
        return localStorage.getItem(objKey);
    };

    return {
        objectHash: objectHash,
        setLocalStorageItem: setLocalStorageItem,
        getLocalStorageItem: getLocalStorageItem
    };

});