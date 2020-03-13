/*
default custom attribute pack
	sg-init
	sg-click
	sg-one
	sg-onImg
	sg-swapImg
	sg-sound
author: taejin ( drumtj@gmail.com )
*/

(function (sg) {
    /*
     * custom attribute : sg-init
     */
    sg.addCustomAttr({
        //custom attribute name
        name: "sg-init",
        //apply to every tag?
        applyAll: true,
        init: function (element, attrValue) {
            if (attrValue) eval(attrValue);
        }
    });

    /*
     * custom attribute : sg-click
     */
    sg.addCustomAttr({
        name: "sg-click",
        applyAll: true,
        init: function (element, attrValue) {
            sg.sound(element, false);
            $(element)
                .pointer()
                .click(function () {
                    var $me = $(this);
                    if (!$me.data("options").enabled) return;
                    if (attrValue) eval(attrValue);
                    sg.sound(this);
                });
        }
    });

    /*
     * custom attribute : sg-one
     */
    sg.addCustomAttr({
        name: "sg-one",
        applyAll: true,
        init: function (element, attrValue) {
            sg.sound(element, false);
            $(element)
                .pointer()
                .click(function () {
                    var $me = $(this);
                    if (!$me.data("options").enabled) return;
                    if (attrValue) {
                        eval(attrValue);
                        $me.unbind("click").css("cursor", "auto");
                    }
                    sg.sound(this);
                });
        }
    });


    /*
     * custom attribute : sg-call
     */

    sg.extend({
        call: function (element) {
            if (!element) throw "sg.call: element is " + element;
            var fnNames = $(element).attr("data-sg-call");
            if (fnNames) eval(fnNames);
        }
    });

    sg.addCustomAttr({
        name: "sg-call",
        action: function (element) {
            sg.call(element);
        }
    });


    /*
     * custom attribute : sg-onImg
     */
    function onImg(element, isShow) {
        if (!element) throw "sg.onImg: element is " + element;

        var onimgSelector = $(element).attr("data-sg-onimg");
        if (onimgSelector != undefined) {
            if (isShow) $(onimgSelector).show();
            else $(onimgSelector).hide();
        }
    }

    sg.addCustomAttr({
        name: "sg-onImg",
        init: function (element) {
            onImg(element, $(element).data("options").visible);
        },
        action: function (element) {
            onImg(element, $(element).data("options").visible);
        }
    });


    /*
     * custom attribute : sg-swapImg
     */

    sg.extend({
        swapImg: function (elementOrSelector) {
            var $img = $(elementOrSelector);
            $img.each(function (i, e) {
                var $me = $(this);
                var tempSrc = $me.attr("src");
                $me.attr("src", $me.attr("data-sg-src"));
                $me.attr("data-sg-src", tempSrc);
            });
        }
    });

    function attr_swapImg(element, isInit) {
        if (!element) throw "attr_swapImg: element is " + element;
        var swapimgSelector = $(element).attr("data-sg-swapimg");
        if (swapimgSelector != undefined) {

            if (isInit) {
                var img = new Image();
                img.src = $(swapimgSelector).attr("data-sg-src");
            } else {
                sg.swapImg(swapimgSelector);
            }
        }
    };

    sg.addCustomAttr({
        name: "sg-swapImg",
        init: function (element) {
            attr_swapImg(element, true);
        },
        action: function (element) {
            attr_swapImg(element);
        }
    });


    /*
     * custom attribute : sg-sound
     */
    var sounds = [];
    var soundUrlList = {};

    function getSoundObj(url) {
        var i, len = sounds.length;
        for (i = 0; i < len; i++) {
            if (url == sounds[i].getAttribute("data-relativeSrc")) {
                return sounds[i];
            }
        }
        return null;
    }

    // play flag is for loading and not reproduce
    sg.extend({
        setSoundName: function (path, name) {
            if (typeof path === "string") {
                soundUrlList[name] = path;
            }

            if (typeof path === "object") {
                for (var o in path) {
                    soundUrlList[o] = path[o];
                }
            }
        },
        getSounds: function () {
            return sounds
        },

        sound: function (elementOrPath, playFlag, name) {
            if (!elementOrPath) {
                throw "sg.sound: element is " + elementOrPath;
            }

            var soundName;
            var soundUrl;
            var $element;

            if (typeof elementOrPath === "string") {
                soundName = elementOrPath; //is url
            } else {
                soundName = $(elementOrPath).attr("data-sg-sound");
            }

            if (soundName) {
                if (soundName in soundUrlList) {
                    soundUrl = soundUrlList[soundName];
                } else {
                    soundUrl = soundName;
                    if (name) {
                        sg.setSoundName(soundUrl, name);
                    }
                }

                var audio = getSoundObj(soundUrl);
                if (!audio) {
                    audio = new Audio();
                    audio.src = soundUrl;
                    audio.setAttribute("data-relativeSrc", soundUrl);
                    audio.load();
                    sounds.push(audio);
                }
                if (playFlag == true || typeof playFlag === "undefined") {
                    try {
                        audio.currentTime = 0;
                    } catch (e) {}
                    audio.play();
                }
            }
        },
        /*
         *	Autor: Jorge Lozano
         *	Description: Alows to stop all the playing sounds
         *  Date: 12/05/2015
         */
        stopSounds: function () {
            var sonidos = sg.getSounds();

            $(sonidos).each(function (i, ele) {
                ele.pause();
                ele.currentTime = 0;

            });
        }
    });


    sg.addCustomAttr({
        name: "sg-sound",
        init: function (element) {
            sg.sound(element, false);
        },
        action: function (element) {
            sg.sound(element);
        }
    });
    /*
     *	Autor: Jorge Lozano
     *	Description: metodo que permite a un elemento usar Placeholder
     *  con un mismo compartamiento en cualquier navegador; Al momento de obtener
     *	foco el elemento se borra el placeholder.
     *  Date: 18/09/2014
     *  custom attribute : sg-placeholder
     */
    sg.addCustomAttr({
        name: "sg-placeholder",
        applyAll: true,
        init: function (element, attrValue) {
            //Sets the value
            $(element).val(attrValue).css({
                'color': '#c2c3c8'
            });
            $(element).focus(function () {
                var valor = $.trim($(this).val());
                if (valor == $(this).data("sgPlaceholder")) {
                    $(this).val("");
                    $(this).css({
                        'color': ''
                    });
                }
            }).blur(function () {
                var valor = $.trim($(this).val());
                if (valor == "") {
                    $(this).val($(this).data("sgPlaceholder"));
                    $(this).css({
                        'color': '#c2c3c8'
                    });
                }
            });
        }
    });

})(sg)