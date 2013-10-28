define(function(require){
	var $ = require('jqmobile');
	$(function(){
	    // $.mobile.ajaxEnabled = false;	    
	    // $.mobile.hashListeningEnabled = false;
	    // $.mobile.linkBindingEnabled = false;
	    // $.mobile.pushStateEnabled = false;
	    $.support.cors = true;
	    $.mobile.allowCrossDomainPages = true;
		var TPL = require('./vendors/util').TPL;
		TPL.loadTemplates(['item','title'],function(){		
			var BB = require('backbone');
			var appView = require('./views/app');			
			new appView();
			if(!window.appConfig.debug){
				document.addEventListener("deviceready", onDeviceReady, false);
			    function onDeviceReady() {
			    // 注册回退按钮事件监听器
			        document.addEventListener("backbutton", onBackKeyDown, false); //返回键
			    } 
			    function onConfirm(button) {
			        if(button==1) navigator.app.exitApp(); //选择了确定才执行退出
			    }
			    function onBackKeyDown() {
			        if($.mobile.activePage.is('#index')){
			            navigator.notification.confirm(
			                '按确定退出程序!',  // message
			                onConfirm,              // callback to invoke with index of button pressed
			                '潮百搭',            // title
			                '确定,取消'          // buttonLabels
			            );
			        }              
			    }
			}
			// var workspace = require('./routers/app');
			// var router = new workspace();
			// router.start({pushState: true});
		})
	})
});