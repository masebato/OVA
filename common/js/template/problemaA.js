function fail(target) {
	sg.sound("error");
	$(target).addClass("fail");
}

function success(target) {
	sg.sound("success");
	$(target).addClass("success");
}