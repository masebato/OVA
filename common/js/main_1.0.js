requirejs.config({
    //html파일 기준으로
    baseUrl: "../../common/",
    paths: {
        'text': 'lib/require/text', //HTML 데이터를 가져올때 text! 프리픽스를 붙여준다.
        'jquery': 'lib/jquery/jquery-1.11.1.min',
        'jquery-ui': 'lib/jquery/jquery-ui-1.11.2', //'lib/jquery/jquery-ui-1.10.4.custom.min',//jquery-ui-1.10.2.min',
        'jquery-easytabs': 'lib/jquery/jquery.easytabs.custom', //jquery.easytabs.min',
        'jquery-fancybox': 'lib/jquery/fancybox/jquery.fancybox',
        'sg': 'lib/sg/sg-1.2',
        'sg-attr-defaultPack': 'lib/sg/sg.attr.defaultPack-1.0',
        'sg-attr-draggable': 'lib/sg/sg.attr.draggable-1.2',
        'sg-tag-defaultPack': 'lib/sg/sg.tag.defaultPack-1.1',
        'util': 'lib/tj/tj.utils',
        'matched': 'js/matched/matched_v1.0',
        'flip': 'js/flip/jquery.flip',
        'jquery-alphanum': 'lib/jquery/jquery.alphanum.min',
        'inputKitComp': 'js/kit/inputKitComp'
    },

    /*
    	shim:
    	AMD 형식을 지원하지 않는 라이브러리의 경우 아래와 같이 SHIM을 사용해서 모듈로 불러올 수 있다.
    	참고 : http://gregfranko.com/blog/require-dot-js-2-dot-0-shim-configuration/
    */
    shim: {
        'jquery-ui': {
            deps: ['jquery']
        },
        'jquery-fancybox': {
            deps: ['jquery']
        },
        'jquery-easytabs': {
            deps: ['jquery']
        },
        'sg': {
            deps: ['jquery'],
            exports: "sg"
        },
        'sg-attr-defaultPack': {
            deps: ['sg']
        },
        'sg-attr-draggable': {
            deps: ['jquery-ui', 'sg']
        },
        'sg-tag-defaultPack': {
            deps: ['sg']
        },
        'jquery-easytabs': {
            deps: ['jquery']
        },
         'flip': {
            deps: ['jquery']
        },
        'matched': {
            deps: ['jquery','flip']
        },       
        'jquery-alphanum': {
            deps: ['jquery']
        }
    }
});

require(
    //library load and execute
 ['jquery', 'jquery-ui', 'sg', 'sg-attr-defaultPack', 'sg-attr-draggable', 'sg-tag-defaultPack', 'jquery-easytabs', 'jquery-fancybox', 'util'],

    function () {
        sg.setStage("#stage");
        sg.setScaleMode("showall");
        sg.setLoadingImage("../../common/img/progress_circle.gif");
        sg.setSoundName({
            "success": "../../common/sounds/success.mp3",
            "success-low": "../../common/sounds/success-low.mp3",
            "error": "../../common/sounds/error.mp3"
        });

        sg.init(function () {
            /*
				Modify the page size to the stage height
			*/
            function getOutHeight(target) {
                var h = 0;
                var $this = $(target);
                h = $this.height();
                h += $this.cssVal("padding-top") + $this.cssVal("padding-bottom");
                h += $this.cssVal("margin-top") + $this.cssVal("margin-bottom");
                h += $this.cssVal("border-top-width") + $this.cssVal("border-bottom-width");
                return h;
            }

            function setInHeight(target, h) {
                var $this = $(target);
                $this.css("min-height", h - (getOutHeight(target) - $this.height()));
            }

            setInHeight(".gga_contenido, .ggb_contenido, .ggc_contenido, .ggd_contenido, .gge_contenido", sg.stageHeight - getOutHeight("#content>header"));

            $("html").css("user-select", "none");

        });
    }
);