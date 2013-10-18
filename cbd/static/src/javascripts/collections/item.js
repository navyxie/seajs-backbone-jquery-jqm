define(function(require,exports,module){
    var BB = require('backbone');
    var itemModel = require('../models/item');
    var baseUrl = '/1/items'
    var itemCollection = BB.Collection.extend({
        model:itemModel,
        url:baseUrl,
        parse:function(response){
            return response.results;
        }
    });
    module.exports = itemCollection;
})