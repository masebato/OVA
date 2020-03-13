//by serjio.  tab(input, text)
var initList = initList || [];
initList.push(function (){
	var $ta = $(".ggc_textArea");
	$ta.text("").attr("placeholder", $ta.attr("placeholder"));//.trigger("blur");
	/*
	$("#ggc_textArea").bind("focus", function(e){
		var $this = $(this);
		if($this.text() == $this.attr("placeholder")){
			
		}
	});
	*/
	//AQUI VA EL CODIGO PARA EJECUTAR MI APP
	$("#ggc_btn_objetivos").on("click", transicion);
	$("#ggc_btn_teclado").on("click", transicionb);
	
	function transicion()
	{
		var cambiosCSS = { opacity:0.5};
		var cambiosCSSa ={ opacity:1}
		var cambiosObjetivos={display:"inline-block"};
		var cambiosTextArea={display:"none"};
		var cambioSubtitulo={display:"none"}
		$(".ggc_btn_teclado_estado").css(cambiosCSS);
		$(".ggc_btn_objetivos_estado").css(cambiosCSSa);
		$("#ggc_objetivos").css(cambiosObjetivos);
		$(".ggc_textArea").css(cambiosTextArea);
		$("#ggc_titulo").css(cambioSubtitulo);
	
	}
	function transicionb()
	{
		var cambiosCSSe = { opacity:1};
		var cambiosCSSf ={ opacity:0.5}
		var cambiosObjetivosb={display:"none"};
		var cambiosTextAreab={display:"block"};
		var cambioSubtitulob={display:"inline-block"}
		$(".ggc_btn_teclado_estado").css(cambiosCSSe);
		$(".ggc_btn_objetivos_estado").css(cambiosCSSf);
		$("#ggc_objetivos").css(cambiosObjetivosb);
		$(".ggc_textArea").css(cambiosTextAreab);
		$("#ggc_titulo").css(cambioSubtitulob);
	
	
	}
});