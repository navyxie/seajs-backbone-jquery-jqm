define(function(require,exports,module){
    var _ = require('underscore');
    var BB = require('backbone');
    var UTIL = require('../vendors/util');   
    var getTpl = UTIL.TPL.get;
    var itemView = BB.View.extend({
        template:_.template(getTpl.call(UTIL.TPL,'item')),
        className:'waterFallItem',
        tagName:'div',
        initialize:function(){
            this.$el = $(this.el);
            // this.waterColWidth = ($('.journalContent').width())*0.49;
            this.model.bind('change',this.render,this);           
        },
        events:{
            'vclick .clickUrl':'openUrl'
        },
        openUrl:function(e){
            if(window.appConfig.debug){
                window.open(this.model.get('cUrl'));
            }else{
                var childbrowser = require('childbrowser');
                childbrowser.plugins.childBrowser.showWebPage(this.model.get('cUrl'),{ showLocationBar: true });
            }
        },
        render:function(){
            var jsonData = this.model.toJSON();
            var ajustSize = UTIL.TOOL.getPicSize();
            if(jsonData.uPic){
                jsonData.uPic += '_'+ajustSize+'x'+ajustSize+'.jpg';
            }else{
                jsonData.pUrl += '_'+ajustSize+'x'+ajustSize;
            }
            var pic_size = jsonData['pic_size'];
            var imgHeight = UTIL.getWaterFalColWidth()*pic_size['h']/pic_size['w'];
            jsonData.imgShowH = imgHeight;
            this.$el.html(this.template(jsonData));
            return this;
        }
    });
    module.exports = itemView; 
})