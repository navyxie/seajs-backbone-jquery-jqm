define(function(require,exports,module){
    var BB = require('backbone');
    var baseUrl = '/1/items';
    var itemModel = BB.Model.extend({
        idAttribute:'_id',
        urlRoot:baseUrl,
        url:baseUrl,
        parse:function(response){
            return response;
        }
    });
    module.exports = itemModel;
})