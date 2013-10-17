define(function(require,exports,module){
    var BB = require('backbone');
    var itemCollection = new (require('../collections/item'));
    var itemView = require('./item');
    var appView = BB.View.extend({
        initialize:function(){
            console.log('init appView');
            itemCollection.bind('add',this.addOne,this);
            itemCollection.bind('reset',this.addAll,this);
            this.$el = $(this.el);
            itemCollection.fetch({
                success:function(){
                    console.log('success');
                },
                error:function(){
                    console.log('error');
                    console.log(arguments);
                }
            });
            //console.log(new itemView());
        },
        addOne:function(model){
            console.log('addOne');
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