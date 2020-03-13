var initList = initList || [];
initList.push(function(){
	//before
	//midTransition
	//after
	var $tempTab;
	$('#tab-container')
	.bind("easytabs:initialised", function($defaultTabLink, defaultPanel){
		var hash = window.location.hash.match(/^[^\?]*/)[0];
		$tempTab = $(hash.length ? hash : "#tabs2");
	})
	.bind("easytabs:before", function(e, $targetPanel, settings){
		sg.resetDraggable( $tempTab.find("[data-sg-draggable]") );
		//$tempTab = settings;
	}).easytabs();
	
});
