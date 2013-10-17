define(function(require,exports,module){
    var BB = require('backbone');
    var itemModel = require('../models/item');
    var itemCollection = BB.Collection.extend({
        model:itemModel,
        url:'static/src/javascripts/datas/item.json',
        parse:function(response){
            return response;
        }
    });
    module.exports = itemCollection;
})