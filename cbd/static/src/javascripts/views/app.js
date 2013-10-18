define(function(require,exports,module){
    var BB = require('backbone');
    var itemCollection = new (require('../collections/item'));
    var itemView = require('./item');
    var appView = BB.View.extend({
        initialize:function(){
            itemCollection.bind('add',this.addOne,this);
            itemCollection.bind('reset',this.addAll,this);
            this.$el = $(this.el);
            itemCollection.fetch({
                success:function(){
                    //console.log('success');
                },
                error:function(){
                    //console.log('error');
                }
            });
        },
        addOne:function(model){
            var initItemView = new itemView({model:model});
            this.$el.append(initItemView.render().el);
        },
        addAll:function(){
            var self = this;
            itemCollection.each(function(){
                self.addOne.apply(self,arguments);
            });
        }
    });
    module.exports = appView;
})