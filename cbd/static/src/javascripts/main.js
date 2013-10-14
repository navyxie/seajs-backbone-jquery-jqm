define(function(require){
	var $ = require('jquery');
	var jqmobile = require('jqmobile');
	// var underscore = require('underscore');
	// var backbone = require('backbone');
	// console.log($);
	// console.log(jqmobile);
	// console.log(backbone);
	// console.log(underscore);
	$(document).on('pageinit',function(){
		console.log(jqmobile.ajaxEnabled);
	})

});