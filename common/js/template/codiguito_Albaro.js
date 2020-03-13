var initList = initList || [];
initList.push(function(){
	var $ta = $(".template_textArea");
	$ta.text("").attr("placeholder", $ta.attr("placeholder"));
	
	$( "#objetivos2" ).hide();
	
	$( "#botonMouse" ).css({
			  'opacity':0.4
			  });
	
	$( "#botonMouse" ).click(function() {
	  $( "#objetivos1" ).fadeOut("slow", function () {
		  $( "#objetivos2" ).fadeIn("slow")
		  $( "#botonMouse" ).css({
			  'opacity':1
			  });
		  $( "#botonTeclado" ).css({
			  'opacity':0.4
			  });
	  });
	});
	
	$( "#botonTeclado" ).click(function() {
	  $( "#objetivos2" ).fadeOut("slow", function () {
		  $( "#objetivos1" ).fadeIn("slow")
		  $( "#botonTeclado" ).css({
			  'opacity':1
			  });
		  $( "#botonMouse" ).css({
			  'opacity':0.4
			  });
	  });
	});
});