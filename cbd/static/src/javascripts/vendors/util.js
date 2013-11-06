define(function(require, exports, module){
	var $ = require('jquery');
	var _ = require('underscore');
	var taoBaoImgSize = [40,60,80,100,120,160,180,200,240,250,300,310,320,360,400,460,600];//淘宝图片尺寸
	var englishM = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec");
	var waterFallColWidth = 304;
	function isType(object,type){
		type = type || 'string';
		if(typeof(type) !== 'string'){
			throw new Error('type must be string');
		}
		return Object.prototype.toString.call(object).slice(8,-1).toLowerCase() === type.toLowerCase();
	}
	var UTIL = {};
    UTIL.VEVENT = {};
    UTIL.OS = {
        detect:function(ua){
            var os = this.os = {}, browser = this.browser = {},
            webkit = ua.match(/WebKit\/([\d.]+)/),
            android = ua.match(/(Android)\s+([\d.]+)/),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            touchpad = webos && ua.match(/TouchPad/),
            kindle = ua.match(/Kindle\/([\d.]+)/),
            silk = ua.match(/Silk\/([\d._]+)/),
            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
            bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
            rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
            playbook = ua.match(/PlayBook/),
            chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            firefox = ua.match(/Firefox\/([\d.]+)/)
            // Todo: clean this up with a better OS/browser seperation:
            // - discern (more) between multiple browsers on android
            // - decide if kindle fire in silk mode is android or not
            // - Firefox on Android doesn't specify the Android version
            // - possibly devide in os, device and browser hashes

            if (browser.webkit = !!webkit) browser.version = webkit[1]
            if (android) os.android = true, os.version = android[2]
            if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
            if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
            if (webos) os.webos = true, os.version = webos[2]
            if (touchpad) os.touchpad = true
            if (blackberry) os.blackberry = true, os.version = blackberry[2]
            if (bb10) os.bb10 = true, os.version = bb10[2]
            if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
            if (playbook) browser.playbook = true
            if (kindle) os.kindle = true, os.version = kindle[1]
            if (silk) browser.silk = true, browser.version = silk[1]
            if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
            if (chrome) browser.chrome = true, browser.version = chrome[1]
            if (firefox) browser.firefox = true, browser.version = firefox[1]
            os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)))
            os.phone  = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 ||
            (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/))))
        }
    }
    UTIL.OS.detect.call(UTIL.OS,navigator.userAgent);
    if(UTIL.OS.os.phone){
        UTIL.VEVENT = {mouseup: 'touchend',mousedown: 'touchstart',mousemove: 'touchmove',mouseout: 'touchcancel'}
    }else{
        UTIL.VEVENT = {mouseup: 'mouseup',mousedown: 'mousedown',mousemove: 'mousemove',mouseout: 'mouseout'}
    }
	UTIL.TPL = {
		templates:{},
		loadTemplates:function(names,cbf){
			if(isType(names,'string')){
				names = [names];
			}
			if(!isType(names,'array')){
				throw new Error('templateName must be array or string');
			}
			var self = this;
			var tplLength = names.length;
			var loadTemplate = function(index){
				var name = names[index];
				if(self.templates[name] === undefined){
					$.get('./static/src/javascripts/tpls/'+name+'.html',function(data){
						self.templates[name] = data;
						if(++index < tplLength){
							loadTemplate(index);
						}else{
							cbf();
						}
					})
				}else{
					if(++index < tplLength){
						loadTemplate(index);
					}else{
						cbf();
					}			
				}
			}
			loadTemplate(0);
		},
		get:function(name){
			return this.templates[name];
		}
	}
	UTIL.WaterFall = function(col){
		this.col = col;
		this.water = [];
		this.init();
	}
	UTIL.WaterFall.prototype.init = function(){
		var col = this.col;
		for(var i = 0 ; i < col ; i ++){
			this.water[i] = 0;
		}
	}
	UTIL.WaterFall.prototype.getMinIndex = function(){
		return _.indexOf(this.water,_.min(this.water));
	}
	UTIL.WaterFall.prototype.getMaxIndex = function(){
		return _.indexOf(this.water,_.max(this.water));
	}
	UTIL.WaterFall.prototype.pushItem = function(val){
		var self = this;
		self.water[self.getMinIndex()] += val;
		return self.water;
	}
	UTIL.WaterFall.prototype.getParam = function(){
		return {col:this.col,water:this.water};
	}
	UTIL.WaterFall.prototype.makeColHtml = function(){
		var html = '';
        for(var i = 0 ; i < this.col ; i++){
            var colClass = 'waterCol';
            if(i === 0){
                colClass += ' firstCol';
            }else if(i === this.col-1){
                colClass += ' lastedCol'
            }
            html += '<div class="'+colClass+'"></div>';
        }
        return html;
	}
	UTIL.Date = {
		getEnglishMonth:function(month){
			return englishM[month]
		},
		getDate:function(split,daySpace){
			split = split || '/';
			daySpace = daySpace || 0;
			var timestamp = new Date().getTime();
			timestamp = new Date(timestamp + daySpace*24*60*60*1000);
			return timestamp.getFullYear()+split+(1+timestamp.getMonth())+split+timestamp.getDate()
		},
        translateIOSDate:function(date){
            return date.substr(0,date.indexOf('T')).split('-').join('/')
        }
	}
	UTIL.TRANSFORM = {
        translate3d:function(jqObj,dist,speed){
            jqObj = $(jqObj);
	        speed = speed || 0;
	        dist = $.extend({x:0,y:0,z:0},dist);
	        var style = jqObj[0].style;
	        if (!style) return;
	        style.MozTransitionDuration = 
	        style.msTransitionDuration = 
	        style.OTransitionDuration = 
	        style.transitionDuration = speed + 'ms';
	        style.webkitTransform = 'translate(' + dist.x + 'px,'+dist.y+'px)' + 'translateZ('+dist.z+'px)';
	        style.msTransform = 
	        style.MozTransform = 
	        style.OTransform = 'translate(' + dist.x + 'px,'+dist.y+'px)' + 'translateZ('+dist.z+'px)';
        },
        slideCore:function(obj,options){
            /** 
             * obj param : wrapper,container,target ,all is id or class selector
            */
            if(!obj.wrapper){
                alert('obj must has wrapper');
                return false;
            }else if(!obj.container){
                alert('obj must has container');
                return false;
            }else if(!obj.target){
                alert('obj must has target');
                return false;
            }
            var defaultOptions = {
                direct:'h',//
                space:5,
                slideP:0.5,
                rangeP:0.4,
                marginR:0
            }
            $.extend(defaultOptions,options);
            this.defaultOptions = defaultOptions;
            this.obj = obj;
            this.wrapperObj = $(obj.wrapper);
            this.containerObj = this.wrapperObj.find(obj.container);
            this.targetObj = this.containerObj.find(obj.target);
            this.startPage = {x:0,y:0};//touchstart page postion
            this.deltaPage = {x:0,y:0};//touchmove duration
            this.endPage = {x:0,y:0};// touchend page position
            this.isMouseDown = false;// is touch flag
            this.rangeStartX = 0;//first target move right range
            this.rangeEndX = 0;// last target move left range
            this.oneSlide = 0;// one target move value
            this.init();
        }
    }
    UTIL.TRANSFORM.slideCore.prototype = {
        init:function(){
            var marginR = this.defaultOptions.marginR;
            this.wrapperObjW = this.oneSlide = this.wrapperObj.width();
            // this.wrapperObjH = this.wrapperObj.height();
            if(marginR === 0){
                this.containerObj.width(this.wrapperObjW*this.targetObj.length);
            }else{
                // if target has marginRight , this.oneSlide = this.wrapperObjW+marginR
                this.containerObj.width((this.wrapperObjW+marginR)*this.targetObj.length - marginR);
                this.oneSlide += marginR;
            }     
            this.targetObj.width(this.wrapperObjW).css('float','left').last().css('marginRight',0);// set target width and some css
            this.rangeStartX = this.oneSlide*this.defaultOptions.rangeP; //mesture rangeStartX
            this.rangeEndX = this.oneSlide*(this.targetObj.length - 1);//mesture rangeEndX
            this.initEvent();// init event touchstart touchmove touchend touchcancel
        },
        initEvent:function(){
            var self = this;
            var wrapperObj = self.wrapperObj;
            var EV = UTIL.VEVENT;
            var eventsTxt = EV.mousedown+' '+ EV.mousemove+' '+EV.mouseup;// event text join ' '
            wrapperObj.on(eventsTxt,function(e){
                var eTarget = e;
                if(UTIL.OS.os.phone){
                    // if device is mobile , dosometing ,is jquery bug? beacause e.pageX or e.pageY is undefine,no,see:http://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo
                    eTarget = eTarget.originalEvent;
                };
                switch(e.type){
                    case EV.mousedown:
                        self.startMove(eTarget);
                        // return false;
                        break;
                    case EV.mousemove:
                        self.move(eTarget);
                        // return false;
                        break;
                    case EV.mouseup:
                    case EV.mouseout:
                        self.endMove(eTarget);
                        // return false;
                        break;
                }
                return false;
            })
        },        
        startMove:function(e){
            /**
             * do someting if device is mobile,beacause e.pageX or e.pageY is undefine ,jqeury bug? no, see:http://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo
             * refer to swipe.js https://github.com/bradbirdsall/Swipe
             */
            if(UTIL.OS.os.phone){
                var touches = e.touches[0];
                this.startPage = {
                    x:touches.pageX,
                    y:touches.pageY
                };
            }else{
                this.startPage = {
                    x:e.pageX,
                    y:e.pageY
                };
            }
            this.deltaPage = {x:0,y:0};//reset deltaPage
            this.isMouseDown = true;
        },
        move:function(e){
            if(!this.isMouseDown){
                return false;
            } 
            if(UTIL.OS.os.phone){
                if (e.touches.length > 1 || e.scale && e.scale !== 1) return false;
                var touches = e.touches[0];
                this.deltaPage = {
                    x:touches.pageX - this.startPage.x,
                    y:touches.pageY - this.startPage.y
                };
            }else{
                this.deltaPage = {
                    x:e.pageX - this.startPage.x,
                    y:e.pageY - this.startPage.y
                };
            }       
            if(Math.abs(this.deltaPage.x) > 10){
                var movePageX = this.endPage.x+this.deltaPage.x;
                if(this.endPage.x === 0 && this.deltaPage.x > this.rangeStartX){
                    // if currentTarget is the first, moveRight maxValue is this.rangeStartX
                    this.deltaPage.x = movePageX = this.rangeStartX;
                }else if(this.endPage.x === -this.rangeEndX && this.deltaPage.x < -this.rangeStartX){
                    // if currentTarget is the last ,moveLeft maxValue is negative this.rangeStartX
                    movePageX = this.endPage.x - this.rangeStartX;
                    this.deltaPage.x = -this.rangeStartX;
                }
                // move by css3 translate ,is so cool
                this.translate(movePageX); 
            }
                   
        },
        endMove:function(e){
            var moveSpace = 0;
            // alert(moveSpace);
            if(UTIL.OS.os.phone){
                if (e.touches.length > 1 || e.scale && e.scale !== 1) return false;
                var touches = e.touches[0];
                if(touches){
                    moveSpace = touches.pageX - this.startPage.x;
                }else{
                    moveSpace = e.pageX - this.startPage.x;
                }
                // moveSpace = touches.pageX - this.startPage.x;
                
            }else{
                moveSpace = e.pageX - this.startPage.x;
            } 
            if(Math.abs(moveSpace) > 10){
                var endDeltaX = this.deltaPage.x,endDeltay = this.deltaPage.y;
                var slideP = this.defaultOptions.slideP;
                if(endDeltaX > 0){
                    // move left
                    // if(endDeltaX < this.oneSlide*slideP){
                    //     // if move Value is less than this.oneSlide*slideP ,reset to prev statue
                    //     endDeltaX = this.endPage.x;               
                    // }else{
                    //     // else move to next target
                    //     endDeltaX = this.endPage.x = this.endPage.x + this.oneSlide;
                    // }
                    if(this.endPage.x === 0){
                        endDeltaX = this.endPage.x;
                    }else{
                        endDeltaX = this.endPage.x = this.endPage.x + this.oneSlide;
                    }
                }else{
                    // move right
                    // if(endDeltaX > -(this.oneSlide*slideP)){
                    //     endDeltaX = this.endPage.x; 
                    // }else{
                    //     endDeltaX = this.endPage.x = this.endPage.x - this.oneSlide;                   
                    // }
                    if(this.endPage.x === -this.rangeEndX){
                        endDeltaX = this.endPage.x;
                    }else{
                        endDeltaX = this.endPage.x = this.endPage.x - this.oneSlide;
                    }
                }
                this.translate(endDeltaX,500);
            }          
            this.startPage = {x:0,y:0};
            this.isMouseDown = false;
        },
        moveLeft:function(e){
            // alert(e);
        },
        moveRight:function(e){
            // alert(e);
        },
        /**
         * [ css3 translate , is so cool]
         * @param  {[type]} dist  [move value]
         * @param  {[type]} speed [description]
         * @return {[type]}       [description]
         */
        translate:function(dist, speed){
            speed = speed || 0;
            var style = this.containerObj[0].style;
            if (!style) return;
            style.webkitTransitionDuration = 
            style.MozTransitionDuration = 
            style.msTransitionDuration = 
            style.OTransitionDuration = 
            style.transitionDuration = speed + 'ms';
            style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
            style.msTransform = 
            style.MozTransform = 
            style.OTransform = 'translateX(' + dist + 'px)';
        }
    }
    UTIL.LOAD = {
    	show:function(){
    		$('#gloabLoading').stop(true,true).fadeIn();
    	},
    	hide:function(){
    		$('#gloabLoading').stop(true,true).fadeOut();
    	}
    }
    UTIL.getWaterFalColWidth = function(){
    	return waterFallColWidth;
    }
    UTIL.setWaterFalColWidth = function(val){
    	waterFallColWidth = val;
    }
    UTIL.OS = {
    	detect:function(ua){
			var os = this.os = {}, browser = this.browser = {},
			webkit = ua.match(/WebKit\/([\d.]+)/),
			android = ua.match(/(Android)\s+([\d.]+)/),
			ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
			iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
			webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
			touchpad = webos && ua.match(/TouchPad/),
			kindle = ua.match(/Kindle\/([\d.]+)/),
			silk = ua.match(/Silk\/([\d._]+)/),
			blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
			bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
			rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
			playbook = ua.match(/PlayBook/),
			chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
			firefox = ua.match(/Firefox\/([\d.]+)/)

			// Todo: clean this up with a better OS/browser seperation:
			// - discern (more) between multiple browsers on android
			// - decide if kindle fire in silk mode is android or not
			// - Firefox on Android doesn't specify the Android version
			// - possibly devide in os, device and browser hashes

			if (browser.webkit = !!webkit) browser.version = webkit[1]

			if (android) os.android = true, os.version = android[2]
			if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
			if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
			if (webos) os.webos = true, os.version = webos[2]
			if (touchpad) os.touchpad = true
			if (blackberry) os.blackberry = true, os.version = blackberry[2]
			if (bb10) os.bb10 = true, os.version = bb10[2]
			if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
			if (playbook) browser.playbook = true
			if (kindle) os.kindle = true, os.version = kindle[1]
			if (silk) browser.silk = true, browser.version = silk[1]
			if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
			if (chrome) browser.chrome = true, browser.version = chrome[1]
			if (firefox) browser.firefox = true, browser.version = firefox[1]

			os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)))
			os.phone  = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 ||
			(chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/))));
			return {os:os,browser:browser};
		}
    }
    UTIL.URL = {
    	getHash:function(){
    		var hashVal = window.location.hash;
    		var val = '';
    		if(hashVal){
    			val = hashVal.slice(1);
    			val = val.split('/');
    		}
    		return val;
    	}
    }
    UTIL.TOOL = {
    	getPicSize:function(){
    		var colSize = UTIL.getWaterFalColWidth();
    		var ajustSize = taoBaoImgSize[0];
    		for(var i = 1, len = taoBaoImgSize.length ; i < len ; i++){
                if(colSize <= taoBaoImgSize[i]){
                    ajustSize = taoBaoImgSize[i];
                    break;
                }
            }
            return ajustSize;
    	}
    }
	module.exports = UTIL;
})