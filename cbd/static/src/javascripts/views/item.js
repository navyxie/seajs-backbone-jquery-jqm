define(function(require,exports,module){
    var _ = require('underscore');
    var BB = require('backbone');
    var UTIL = require('../vendors/util');   
    var getTpl = UTIL.TPL.get;
    var itemView = BB.View.extend({
        template:_.template(getTpl.call(UTIL.TPL,'item')),
        className:'navyTest',
        tagName:'div',
        initialize:function(){
            this.$el = $(this.el);
            this.model.bind('change',this.render,this);           
        },
        render:function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    module.exports = itemView; 
})