define(function () {

    var cache = {};

    return {
        //initialize: initialize,
        pub: function (id) {
            //get any additional arguments (except the first 'id') 
            var args = [].slice.call(arguments, 1);

            //if id of pub item not in cache, add to cache (array to hold callback handlers)
            if (!cache[id]) cache[id] = [];
           

            //for each callback in cached item (array) with this message id, call the function with the args
            //provided.  Using apply so we can send the arguments as an array as opposed to call where we must
            //list individually
            for (var i = 0, x = cache[id].length; i < x; i++) cache[id][i].apply(null, args);

        },
        sub: function (id, fn) {

            //if message id doesn't exist, create message id array and add the function to it; 
            //if it exists just add the function to it
            if (!cache[id]) {
                cache[id] = [fn];
            }
            else {
                cache[id].push(fn);
            }
        },
        //Might use this later
            //        unsub: function (id, fn) {
            //            var index;
            //
            //            //if message id doesn't exist exit
            //            if (!id) return;
            //
            //            //if message id exists check for function; if no function provided then reset entire array
            //            if (!fn) {
            //                cache[id] = [];
            //            }
            //            else {
            //                //if function is provided, find it and create a new array without it
            //                index = cache[id].indexOf(fn);
            //                if (index > -1) {
            //                    cache[id] = cache[id].slice(0, index).concat(cache[id].slice(index + 1));
            //                }
            //            }
            //        },
        reset: function () {
            cache = {};
        }
    };

});
