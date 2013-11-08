define(function(require,exports,module){
    var $ = require('jqmobile');
    var BB = require('backbone');
    var headerObj = $('.header');
    var barNavObjs = $('.barNav'); 
    var journalView = require('./journal');
    var UTIL = require('../vendors/util');
    var TRANSFORM = UTIL.TRANSFORM;
    var os = UTIL.OS.detect(navigator.userAgent);
    var pageTransition = 'none'; 
    var winObj = $(window);
    var winWidth = winObj.width();
    var isOldAndroid = false;
    var mouseObj = {
        flag:false,
        x:0,
        y:0,
        count:1
    };
    if(os.os['android'] && parseInt(os.os['version'].slice(0,1)) < 3){
        //oldAndroid ,version < 3
        isOldAndroid = true;       
        pageTransition = 'none';
    }
    //记录是否已记载过日志的数据及查询条件    
    var loadDataMap = {
        'index':{loaded:false,query:{type:'index'},el:'#indexContent',rzList:[]},
        'newest':{loaded:false,query:{type:'hot'},el:'#newestContent',rzList:[]},
        'lastest':{loaded:false,query:{type:'new'},el:'#lastestContent',rzList:[]}
    };
    var appView = BB.View.extend({
        el:'body',
        initialize:function(){
            var self = this;
            self.$el = $(self.el);
            var hashVal = UTIL.URL.getHash();
            if(hashVal){
                self.showPage(hashVal[0]);
            }else{
                self.showPage('index');
            }
            self.hashchange();
            self.updateBar();         
            self.animate();
        },        
        events:{
            'tap .barNav':'changeNav'
        },
        render:function(){
            return this;
        },
        animate:function(){
            new TRANSFORM.slideCore({wrapper:'#index',container:'.appContent',target:'.journalContainer'},{marginR:0});
            return this;
        },
        changeNav:function(e){
            var self = this;
            var eTarget = $(e.target);
            if(eTarget.hasClass('barNav')){
                eTarget = eTarget;               
            }else{
                eTarget = eTarget.parent();
            }  
            self.showPage(eTarget.attr('klg-page-id'));  
            return false;
        },
        showPage:function(pageId){
            var self = this;
            if(!loadDataMap[pageId]['loaded']){
                loadDataMap[pageId]['loaded'] = true;
                loadDataMap[pageId]['rzList'].push(new journalView({el:loadDataMap[pageId]['el'],query:loadDataMap[pageId]['query']}));
                loadDataMap[pageId]['rzList'].push(new journalView({el:loadDataMap[pageId]['el'],query:loadDataMap[pageId]['query']}));
                loadDataMap[pageId]['rzList'].push(new journalView({el:loadDataMap[pageId]['el'],query:loadDataMap[pageId]['query']}));
                loadDataMap[pageId]['rzList'].push(new journalView({el:loadDataMap[pageId]['el'],query:loadDataMap[pageId]['query']}));
                loadDataMap[pageId]['rzList'].push(new journalView({el:loadDataMap[pageId]['el'],query:loadDataMap[pageId]['query']}));
            }else{
                loadDataMap[pageId]['rzList'][0].refreshView();
            } 
            $.mobile.changePage('#'+pageId,{transition: pageTransition,changeHash:true});
            mouseObj.count = 1;
        },
        updateBar:function(index){          
            var defaultNav = $(barNavObjs[0]);
            var hashVal = UTIL.URL.getHash();    
            if(hashVal){
                //fix jq bug for hash in android 2.3(when hash is index,hash is /staic/cbd/index.html)
                if(hashVal[0]){
                    defaultNav = barNavObjs.filter('.'+hashVal[0]);
                }                          
            }
            // alert(barNavObjs.index(defaultNav));  
            if(!defaultNav.length){
                defaultNav = $(barNavObjs[0]);
            }            
            barNavObjs.removeClass('selected');
            defaultNav.addClass('selected');
            headerObj.text(defaultNav.attr('klg-page-title'));
        },
        hashchange:function(){
            var self = this;
            winObj.hashchange(function(){
                self.updateBar();
            });
        }
    });
    module.exports = appView;
})