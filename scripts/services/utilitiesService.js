//no need to pass modernizr to the function from define
define(['modernizr'], function () {

    var _randomNumberBetween = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    var _getQueryStringParams = function() {

        var hash = {}, temp;
        var q = document.URL.split('?')[1];
        if(q != undefined){
            q = q.split('&');
            for (var i = 0, len = q.length; i < len; i++) {
                temp = q[i].split('=');
                hash[temp[0]] = temp[1];
            }
        }
        return hash;
    };

    return {
        randomNumberBetween: _randomNumberBetween,
        hasLocalStorage: Modernizr.localstorage,
        getQueryStringParams: _getQueryStringParams
    };
   
});



      