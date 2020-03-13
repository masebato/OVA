var initList = initList || [];
initList.push(function(){
	$("[data-sg-id=sequence]").each(function(i,e){
		//secuencia_bindClick($(this).children().hide().eq(0).show());
		secuencia_bindClick($(this).children().hide().filter(".secuencia_secuencia_flecha").eq(0).show());
	});
});

function secuencia_bindClick($el){
	$($el).click(function(e){
		sg.sound("success-low");
		$(this).unbind("click").next().fadeIn("slow", function(){
			var bt = $(this).next(".secuencia_secuencia_flecha");
			if(bt.length){
				secuencia_bindClick(bt.fadeIn("slow"));
			}else{
				$(this).next().fadeIn("slow");
			}
		});
	})
}