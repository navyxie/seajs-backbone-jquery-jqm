define(function(require,exports,module){
    var BB = require('backbone');
    var itemModel = BB.Model.extend({
        idAttribute:'_id',
        urlRoot:'staic/src/datasstatic/src/javascripts/datas/item.json',
        url:'static/src/javascripts/datas/item.json',
        parse:function(response){
            return response;
        }
    });
    module.exports = itemModel;
})