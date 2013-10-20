define(function(require, exports, module){
	var $ = require('jquery');
	function isType(object,type){
		type = type || 'string';
		if(typeof(type) !== 'string'){
			throw new Error('type must be string');
		}
		return Object.prototype.toString.call(object).slice(8,-1).toLowerCase() === type.toLowerCase();
	}
	var UTIL = {};
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
	};
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
		}
	}
	module.exports = UTIL;
})