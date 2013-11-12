//http://blog.sina.com.cn/s/blog_c2918c770101bf1u.html
//window.plugins.ToastPlugin.ShowToast('通讯录',3000);
//第一个参数为显示的内容，第二个参数是显示的时间，单位ms
define(function(require,exports,module){
	var cordova = require('cordova');
	var message = function(){};
	var javaClassName = "DataPlugin";
	message.prototype = {
	        share:function(content,length){
	        	length = length || 3000;
	            return cordova.exec(null, null,javaClassName,"share",[content,length]);
	        }
	};
	cordova.addConstructor(function(){
		if (cordova.addPlugin) {
            cordova.addPlugin(javaClassName, new message());
        }else{
    		if(!cordova.plugins){
    			cordova.plugins = {};        	
    		}
    		cordova.plugins[javaClassName] = new message(); 
        }    
	});
	module.exports = cordova;
})