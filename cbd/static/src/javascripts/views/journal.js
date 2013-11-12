define(function(require,exports,module){
	var _ = require('underscore'),BB = require('backbone'),UTIL = require('../vendors/util'),$ = require('jquery');
    var waterFallCol = 2,WaterFall = UTIL.WaterFall,DATE = UTIL.Date,LOAD = UTIL.LOAD,setWaterFalColWidth = false,winObj = $(window),winHeight = winObj.height(),headerHeight = $('.header').height();
	var journalView = BB.View.extend({
		className:'journalView',
		initialize:function(){
            var self = this;
            // self.queryObj = _.extend({ty:'rz',jd:DATE.getDate('-',-1)  },(arguments[0]['query'] || {}));
            self.queryObj = _.extend({type:'index'},(arguments[0]['query'] || {}));
            self.mouseMoveObj = {flag:false,
		        moveSpace:5,
		        start:{
		            x:0,
		            y:0
	        }};          
	        self.itemCollection = new (require('../collections/item'));
		    self.itemView = require('./item');
		    self.titleView = require('./title');
		    self.titleModel = new (require('../models/title'));
		    self.journalModel = new (require('../models/journal'));
            self.waterObj = new WaterFall(waterFallCol);
            self.$el = $(self.el);
            self.contentObj = $('<div class="journalContainer"></div>').appendTo(self.$el);
            self.journalTitleObj = $('<div class="journalTitle"></div>').appendTo(self.contentObj);
            self.journalContentObj = $('<div class="journalContent"></div>').appendTo(self.contentObj).append(self.waterObj.makeColHtml());
            self.waterFallObj = self.journalContentObj.find('.waterCol'); 
            if(!setWaterFalColWidth){
            	setWaterFalColWidth = true;
            	UTIL.setWaterFalColWidth($(self.waterFallObj[0]).width());         	
            }    
            self.contentObj.on('vmousemove vmousedown vmouseup vmouseout',function(){self.setBarStatue.apply(self,arguments)});
            self.fixedBarObjs = $('body').find('.fixedBar');
            self.itemCollection.bind('add',self.addOne,self);
            self.itemCollection.bind('reset',self.addAll,self); 
         	self.firstLoad();
            self.scrollHandler();
            self.journalModel.bind('change',self.render,this);    
        },
        firstLoad:function(){
        	var self = this;
        	self.fetchData(function(err,params){
                if(!err){
                    var response = params[1];
                    if(response.journal){
                        self.renderTitle(response);   
                        self.renderItems(response); 
                    }
                }
            });
        },
        events:{          
            'vclick .journalContainer':'preventDefault'
        },
        fetchData:function(cbf){
            var self = this;
            LOAD.show();
            self.journalModel.fetch({
                data:self.queryObj,
                success:function(model, response, options){
                    cbf(null,arguments);
                    LOAD.hide();     
                },
                error:function(){
                    alert('获取数据失败,请检查网络');
                    console.log('+++++++++++++++++++');
                    console.log(window.appConfig.appHost);
                    console.log(JSON.stringify(self.queryObj));
                    console.log(self.journalModel.url);
                    console.log('------------------');
                    cbf({err:'获取数据失败'},arguments);
                    LOAD.hide();     
                }
            }); 
        },
        refreshView:function(){
            var self = this;
            self.fetchData(function(err,params){
                if(!err){
                    var response = params[1];
                    if(response.journal){
                        self.journalTitleObj.html('');
                        self.waterFallObj.html('');
                        self.renderTitle(response);   
                        self.renderItems(response); 
                    }
                }
            })
        },
        render:function(){
            return this;
        },
        renderTitle:function(response){
        	var self = this;
            // show journal title view start			
            var title = response.journal.tle;
            var id = response.journal._id;
            var dateTime = new Date(response.journal.pubTime || response.journal.updatedAt);
            //dateTime这里的时间转化有问题，自行处理
            var englishM = DATE.getEnglishMonth(dateTime.getMonth());
            // console.log('-----------------------------');
            // console.log('response.journal.updatedAt:'+response.journal.updatedAt);
            // console.log('response.journal.pubTime:'+response.journal.pubTime);
            // console.log('dateTime:'+dateTime);
            // console.log('englishM:'+englishM);
            // console.log('getDate:'+dateTime.getDate());
            // console.log('-----------------------------');
            var tempIndex = title.indexOf('】');
            var tempTitle1 = title.slice(0,tempIndex+1);
            var tempTitle2 = title.slice(tempIndex+1);
            self.titleModel.set({_id:id,bTitle:tempTitle1,title:tempTitle2,month:englishM,date:dateTime.getDate()});
            var titleViewInit = new self.titleView({model:self.titleModel});
            self.journalTitleObj.append(titleViewInit.render().el);
            // show journal title view end			
            return self;
        },
        renderItems:function(response){    	
        	//set items to itemCollection start
            var items = response.journal.items;
            var self = this;
            var filterItems = _.filter(items,function(item){
            	return item['pic_size'];
            });
            self.itemCollection.reset();
            self.itemCollection.add(filterItems);
            //set items to itemCollection end
        },
        preventDefault:function(e){
            this.showBar();
            return false;
        },
        setBarStatue:function(e){
            var self = this;
            switch(e.type){
                case 'vmousedown':
                    self.mouseMoveObj.flag = true;
                    self.mouseMoveObj.start.x = e.pageX;
                    self.mouseMoveObj.start.y = e.pageY;
                    return false;
                    break;
                case 'vmousemove':
                    if(winObj.scrollTop() <= headerHeight){
                        self.showBar();
                    }else{
                        if(self.mouseMoveObj.flag){
                            if(e.pageY - self.mouseMoveObj.start.y > self.mouseMoveObj.moveSpace){
                                self.showBar();
                            }else{
                                self.hideBar();
                            }
                        }
                    }
                    
                    return false;
                    break;
                case 'vmouseup':
                case 'vmouseout':
                    self.mouseMoveObj.flag = false;
                    return false;
                    break;
            }
            return false;
        },
        scrollHandler:function(){
            var self = this;
            winObj.on('scroll',function(){
                if(winObj.scrollTop() <= headerHeight){
                    self.showBar();
                }          
            });
            // winObj.on('scrollstop',function(){
            //     self.showBar();         
            // });
        },
        showBar:function(){
            this.fixedBarObjs.stop().show();
        },
        hideBar:function(){
            this.fixedBarObjs.stop().hide();
        },
        addOne:function(model){
        	var self = this;
            var initItemView = new self.itemView({model:model});
            $(self.waterFallObj[self.waterObj.getMinIndex()]).append(initItemView.render().el);
            self.waterObj.pushItem(model.toJSON()['pic_size']['h']);
        },
        addAll:function(){
            var self = this;
            self.itemCollection.each(function(){
                self.addOne.apply(self,arguments);
            });
        }
	});
	module.exports = journalView
})