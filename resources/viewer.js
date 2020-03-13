var linkList = [];
var idx = 0;
var $frame;
var $sidebar;
var $content;
var $window;
var $topbar;

$(function() {

    xmlLoadComplete(xmldata);

    function xmlLoadComplete(xml) {
        var $con = $('<div/>');
        var $resources = $(xml).find("resources");
        var k = 0;
        $(xml).find("organizations").each(function(i, e) {
            $(this).children("organization").each(function(i, e) {
                $(this).children("item").each(function(i, e) {
                    
                    var $div = $('<div>' + $(this).children("title").text() + ' <span></span></div>');
                    var $cld = $('<ul class="elements"></ul>').hide();
                    
                    $div.click(function(e) {
                        var flag = $(this).data("flag");
                        
                        if (flag){
                            $cld.hide("fast");
                        }else{
                            $cld.show("fast");
                        }

                        $(this).data("flag", !flag)
                    
                    }).css("cursor", "pointer");
                    
                    $con.append($div);
                    $con.append($cld);

                    $(this).children("item").each(function(i, e) {
                        var node = new NODE({
                            link: $resources.find("[identifier=" + $(this).attr("identifierref") + "]").attr("href"),
                            title: $(this).children("title").text()
                        });

                        var $a = $('<li class="item"><a href="javascript:;" onclick="loc(' + k + ')">' + node.title + '</a></li>');
                        $cld.append($a)
                        //$cld.append('<br>');
                        node.$el = $a;
                        k++;
                        linkList.push(node);
                    });
                });
            });
        });
        //console.log(linkList);

        $topbar = $("#topbar");
        $content = $("#content");
        $sidebar = $("#sidebar").append($con);
        $frame = $('<iframe id="iframe" frameborder="0" scrolling="no"></iframe>').appendTo($content);//.css("border","solid 1px #ff0000");

        $window = $(window).bind("resize", function(e) {
            frameResize();
        });
        frameResize()

        loc(0);
    }
    
});

function frameResize() {
    var sbw = $sidebar.width();
    var cw = window.innerWidth - sbw - 1;
    var ch = window.innerHeight - $topbar.height() - 1;
    $sidebar.height(ch - 10);
    $content.css("left", sbw + "px");
    $frame.width(cw).height(ch);
}

function loc(i) {
    if (i != idx){
        linkList[idx].$el.removeClass("active").addClass("visited");
    }
    
    linkList[i].$el.addClass("active").parent().before().hide("fast");
    console.log(linkList[i].link);
    $frame[0].src = linkList[i].link;
    idx = i;
    return false;
}

function next() {
    if (idx + 1 < linkList.length) {
        loc(idx + 1);
    }
}

function prev() {
    if (idx - 1 >= 0) {
        loc(idx - 1);
    }
}

var isAnimating = false;
var leftMenuFlag = true;
var backupLeftMenuWidth;
function toggleLeftMenu(target) {
    if ($sidebar.length && !isAnimating) {
        if (leftMenuFlag) {
            backupLeftMenuWidth = $sidebar.width();
            $sidebar.animate({width: 0}, {
                step: function(o) {
                    $window.trigger("resize");
                },
                start: function() {
                    isAnimating = true;
                },
                complete: function() {
                    isAnimating = false;
                }
            });
            target.innerHTML = "Mostrar menu <span></span>";
        } else {
            $sidebar.animate({width: backupLeftMenuWidth}, {
                step: function(o) {
                    $window.trigger("resize");
                },
                start: function() {
                    isAnimating = true;
                },
                complete: function() {
                    isAnimating = false;
                }
            });
            target.innerHTML = "Ocultar el menu <span></span>";
        }
        leftMenuFlag = !leftMenuFlag;
    }
}

function NODE(prop) {

    var prop = prop || {};
    var defaultProp = {
        link: null,
        title: null,
        $el: null
    };

    //console.log(prop);
    for (var o in defaultProp)
        this[o] = prop[o] || defaultProp[o];
}


