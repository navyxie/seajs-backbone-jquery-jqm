define(function(require,exports,module){
    var BB = require('backbone');
    var titleModel = BB.Model.extend({
        idAttribute:'_id'
    });
    module.exports = titleModel;
})