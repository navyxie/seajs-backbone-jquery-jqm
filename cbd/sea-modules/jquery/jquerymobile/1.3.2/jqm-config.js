define('jquery/jquerymobile/1.3.2/jqm-config',['jquery'],function(require, exports, module){
	var $ = require('jquery');
	$(document).bind("mobileinit", function () {
	    $.mobile.ajaxEnabled = false;
	    $.mobile.linkBindingEnabled = false;
	    $.mobile.hashListeningEnabled = false;
	    $.mobile.pushStateEnabled = false;

    // Remove page from DOM when it's being replaced
    // $('div[data-role="page"]').live('pagehide', function (event, ui) {
    //     $(event.currentTarget).remove();
    // });
	});
})