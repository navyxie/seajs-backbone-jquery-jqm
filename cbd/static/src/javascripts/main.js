define(function(require){
	// var $ = require('jquery');
	// var jqmobile = require('jqmobile');
	// var UTIL = require('./vendors/util');
	// console.log(UTIL);
	// var underscore = require('underscore');
	// var backbone = require('backbone');
	// console.log($);
	// console.log(jqmobile);
	// console.log(backbone);
	// console.log(underscore);
	// $(document).on('pageinit',function(){
	// 	console.log(jqmobile.ajaxEnabled);
	// });
	
	var TPL = require('./vendors/util').TPL;
	TPL.loadTemplates(['item'],function(){
		var appView = require('./views/app');
		new appView({el:'#navy'});
	})
});