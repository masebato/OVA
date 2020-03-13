/**
 * @fileOverview Plugin to match n elements
 * @version 1.1
 * @author Jorge Lozano (jlozano9305@gmail.com)
 *  various mathing types ['oneToOne', 'oneToMany', 'manyToOne']
 */
define(['jquery', 'flip'], function ($) {
    var titles, lstColors = [],
        sources,
        targets,
        size = 2,
        defaultColor,
        currentSource,
        currentTarget, setColor, matchingType, lstTypes = ['oneToOne', 'oneToMany', 'manyToOne'],
        sizeS, sizeT, lstMatchedManyKeys = [],
        setFlip, lstClasses, resetElement;
    var options = {};

    function reset() {
        sg.sound('success-low');
        currentSource = currentTarget = 0;
        lstMatchedManyKeys = [];
        if (setColor) {
            $(sources).css({
                'background-color': defaultColor,
                'cursor': 'pointer'
            }).unbind('click');
            $(targets).css({
                'background-color': defaultColor,
                'cursor': 'pointer'
            }).unbind('click');
            if (typeof titles !== 'undefined' || titles.length > 0) {
                $(titles).css({
                    'color': defaultColor
                });

            }

        } else if (typeof lstClasses !== 'undefined' && lstClasses.length > 0) {
            $(lstClasses).each(function (i, ele) {

                $(sources).css({
                    'cursor': 'pointer'
                }).unbind('click').removeClass(ele);
                $(targets).css({
                    'cursor': 'pointer'
                }).unbind('click').removeClass(ele);

            });
        }
        init(options);

    }


    function init(initOptions) {

        //Defaults options
        var defaultOpt = {
            defaultColor: "#313E4B",
            lstColors: ['#2B275A', '#C20B19'],
            setColor: true,
            sources: [],
            targets: [],
            titles: [],
            actionSelect: null,
            actionUnSelect: null,
            success: null,
            fail: null,
            setColor: true,
            matchingType: 0,
            setFlip: false,
        };
        //Setting the options
        options = initOptions || {};
        for (var o in defaultOpt)
            if (options[o] == undefined) options[o] = defaultOpt[o];

        titles = options.titles;
        sources = $(options.sources);
        targets = $(options.targets);
        lstColors = options.lstColors;
        defaultColor = options.defaultColor;
        setColor = options.setColor;
        setFlip = options.setFlip;
        lstClasses = options.lstClasses;
        resetElement = options.resetElement;


        //Validating the options
        if (typeof sources === 'undefined' || !sources.length) {
            throw "Set the sources";
            return;
        }
        if (typeof targets === 'undefined' || !targets.length) {
            throw "Set the targets";
            return;
        }
        if (typeof options.matchingType !== 'undefined') {
            if (options.matchingType >= 0 && options.matchingType <= 2) {
                matchingType = lstTypes[options.matchingType];
            } else {
                throw "The matching types allowed are : 1:'oneToOne', 2:'oneToMany', 3:'manyToOne'";
                return;
            }
        }
        //Matching type
        switch (matchingType) {
            //oneToOne
        case lstTypes[0]:
            if (sources.length != targets.length) {
                throw "The list of sources and targets needs the same lenght of elements";
                return;
            } else {

                size = sizeS = sizeT = sources.length;
                if (setFlip) {
                    $($(targets).toArray().concat($(sources).toArray())).flip({
                        trigger: 'manual'
                    });
                }
            }
            break;
            //oneToMany
        case lstTypes[1]:
            if (sources.length > 0 && targets.length > 0 && targets.length > sources.length) {
                sizeS = sources.length;
                sizeT = targets.length;

                $(targets).each(function (i, e) {
                    $(e).css({
                        'pointer-events': 'none'
                    }).data('manyKey', i);
                });
                if (setFlip) {
                    $(targets).flip({
                        trigger: 'manual'
                    });
                }

            } else {
                throw "Set sources/targets properly to create a oneToMany matching";
                return;
            }
            break;

            //manyToOne
        case lstTypes[2]:
            if (sources.length > 0 && targets.length > 0 && sources.length > targets.length) {
                sizeS = sources.length;
                sizeT = targets.length;

                $(sources).each(function (i, e) {
                    $(e).css({
                        'pointer-events': 'none'
                    }).data('manyKey', i);
                });
                if (setFlip) {
                    $(sources).flip({
                        trigger: 'manual'
                    });
                }

            } else {
                throw "Set sources/targets properly to create a manyToOne matching";
                return;
            }
            break;
        }
        //get the less than size length to generate random colors
        var numberOfColors;
        if (sizeS > sizeT) {
            numberOfColors = sizeT;
        } else {
            numberOfColors = sizeS;
        }
        //Setting random colors
        if (typeof lstColors === 'undefined' || !lstColors.length) {
            //Random colors
            for (i = 1; i <= numberOfColors; i++) {
                lstColors[i] = "#" + ((Math.random() * 0xffffff) >> 0).toString(16);
            }
        }

        function selectElement(isSource, matchKey, manyKey) {
            var elementSelected;
            var lstElements;
            var currentElement;
            var matchedKeyType;
            if (isSource) {
                lstElements = sources;
                currentElement = currentSource = matchKey;
                matchedKeyType = 'matchedSourceKey';
            } else {
                lstElements = targets;
                currentElement = currentTarget = matchKey;
                matchedKeyType = 'matchedTargetKey';
            }


            switch (matchingType) {
                //oneToOne
            case lstTypes[0]:
                elementSelected = selectOneElement(isSource, currentElement, matchedKeyType, lstElements);
                break;
                //oneToMany
            case lstTypes[1]:
                enableEvent(true, isSource);
                elementSelected = selectManyElement(isSource, currentElement, matchedKeyType, lstElements, manyKey);

                break;

                //manyToOne
            case lstTypes[2]:
                enableEvent(true, isSource)
                $(isSource ? sources : targets).css({
                    'pointer-events': 'auto'
                });
                elementSelected = selectManyElement(isSource, currentElement, matchedKeyType, lstElements, manyKey);
                break;
            }
            if (setFlip) {
                $(elementSelected).flip(true);
            }
            return elementSelected;
        }

        function selectOneElement(isSource, currentElement, matchedKeyType, lstElements) {
            var elementSelected;

            $(lstElements).each(function (index, obj) {
                if ($(obj).data(matchedKeyType) == currentElement) {
                    if (setColor) {
                        $(obj).css({
                            'background-color': '' + lstColors[currentElement - 1]
                        });
                    } else if (typeof lstClasses !== 'undefined' && lstClasses.length > 0) {

                        $(obj).addClass(lstClasses[currentElement - 1]);
                    }
                    //Any select behavior
                    if (options.actionSelect != null) {
                        options.actionSelect.apply(this, [obj, isSource]);
                    }
                    sg.sound('success-low');
                    elementSelected = obj;
                    return false;
                }

            });
            return elementSelected;
        }

        function selectManyElement(isSource, currentElement, matchedKeyType, lstElements, manyKey) {
            var elementSelected;

            $(lstElements).each(function (index, obj) {
                var objManyKey = $(obj).data('manyKey');
                if ($(obj).data(matchedKeyType) === currentElement && manyKey === objManyKey && !isManyKeySelected(objManyKey)) {
                    var manySelected = isManyKeySelected($(obj).data('manyKey'));
                    if (setColor) {
                        $(obj).css({
                            'background-color': '' + lstColors[currentElement - 1]
                        });
                    } else if (typeof lstClasses !== 'undefined' && lstClasses.length > 0) {

                        $(obj).addClass(lstClasses[currentElement - 1]);
                    }
                    //Any select behavior
                    if (options.actionSelect != null) {
                        options.actionSelect.apply(this, [obj, isSource]);
                    }
                    sg.sound('success-low');
                    elementSelected = obj;
                    return false;
                }

            });

            return elementSelected;
        }

        function isManyKeySelected(manyKey) {

            var sw = false;
            if (typeof lstMatchedManyKeys !== 'undefined' && lstMatchedManyKeys.length > 0 && typeof manyKey !== 'undefined') {
                $(lstMatchedManyKeys).each(function (i, e) {

                    if (e == manyKey) {
                        sw = true;
                        return;
                    }
                });
            }
            return sw;
        }

        function matchElement(matchKey, manyKey) {
            //Se reccorren los origenes y destinos para completar una relacion
            var matchedSource = $(selectElement(true, matchKey, manyKey));
            var matchedTarget = $(selectElement(false, matchKey, manyKey));

            switch (matchingType) {
                //oneToOne
            case lstTypes[0]:
                unBindMatchingEvent(matchedSource, 'click');
                unBindMatchingEvent(matchedTarget, 'click');
                break;
                //oneToMany
            case lstTypes[1]:
                unBindMatchingEvent(matchedTarget, 'click');
                var manyKey = $(matchedTarget).data('manyKey');
                lstMatchedManyKeys.push(manyKey);
                if (lstMatchedManyKeys.length == sizeT) {
                    unBindMatchingEvent(sources, 'click');
                }
                $(targets).css({
                    'pointer-events': 'none'
                });
                break;

                //manyToOne
            case lstTypes[2]:
                unBindMatchingEvent(matchedSource, 'click');
                var manyKey = $(matchedSource).data('manyKey');
                lstMatchedManyKeys.push(manyKey);
                if (lstMatchedManyKeys.length == sizeS) {
                    unBindMatchingEvent(targets, 'click');
                }
                $(sources).css({
                    'pointer-events': 'none'
                });
                break;
            }

            //Any select behavior
            if (options.success != null) {
                options.success.apply(this, [matchKey]);
            }
            currentSource = currentTarget = null;
            sg.sound('success');
            setTitles(matchKey);

        }

        function setTitles(matchKey) {
            //Validate if the titles exists
            if (setColor && (typeof titles !== 'undefined' || titles.length > 0)) {
                $(titles).each(function (i, ele) {

                    if ($(ele).data('matchedTitleKey') == matchKey) {
                        $(ele).css({
                            'color': '' + lstColors[matchKey - 1]
                        });
                    }
                });
            }
        }


        function unMatchElement(isSource) {
            unselectElement(true, currentSource);
            unselectElement(false, currentTarget);
            sg.sound('error');
            //Any select behavior
            if (options.fail != null) {
                options.fail.apply(this);
            }
        }

        function unselectElement(isSource, matchKey) {
            var elementUnSelected;
            var lstElements;
            var currentElement;
            var matchedKeyType;
            if (isSource) {
                lstElements = sources;
                currentElement = matchKey;
                currentSource = null;
                matchedKeyType = 'matchedSourceKey';
            } else {
                lstElements = targets;
                currentElement = matchKey;
                currentTarget = null;
                matchedKeyType = 'matchedTargetKey';
            }

            $(lstElements).each(function (index, obj) {

                if ($(obj).data(matchedKeyType) == currentElement) {
                    if (setColor) {
                        $(obj).css({
                            'background-color': '' + defaultColor
                        });
                    } else if (typeof lstClasses !== 'undefined' && lstClasses.length > 0) {

                        $(lstClasses).each(function (i, ele) {
                            $(obj).removeClass(ele);
                        });

                    }
                    //Any select behavior
                    if (options.actionUnselect != null) {
                        options.actionUnselect.apply(this, [obj, isSource]);
                    }
                    sg.sound('success-low');
                    elementUnSelected = obj;
                    return false;
                }
            });
            if (setFlip) {
                $(elementUnSelected).flip(false);
            }
            return elementUnSelected;
        }

        function unBindMatchingEvent(elementOrSelector, eventName) {
            $(elementOrSelector).unbind('' + eventName).css({
                'cursor': 'default',
                'pointer-events': 'none !important'
            });

        }

        function enableEvent(enable, isSource) {
            var pointerValue = enable ? 'auto' : 'none';
            switch (matchingType) {
                //oneToOne
            case lstTypes[0]:

                break;
                //oneToMany
            case lstTypes[1]:
                $(isSource ? targets : sources).css({
                    'pointer-events': pointerValue
                });
                break;
                //manyToOne
            case lstTypes[2]:
                $(isSource ? sources : targets).css({
                    'pointer-events': pointerValue
                });
                break;
            }
        }

        $(sources).on('click', function () {
            var element = $(this);
            var matchKey = $(element).data('matchedSourceKey');
            var manyKey = $(element).data('manyKey');
            //No hay origen
            if (!currentSource) {
                //Si no hay destino, se selecciona el origen
                if (!currentTarget) {

                    selectElement(true, matchKey, manyKey);

                    //Si Hay destino
                } else {
                    //Si el origen escogido es igual al destino actual hace matching
                    if (matchKey == currentTarget) {
                        matchElement(matchKey, manyKey);

                    } else {
                        //se deselecciona tanto el currentSource y el current
                        unMatchElement(true);
                        enableEvent(false, false);
                    }

                }

                //Hay origen
            } else {
                //Cuando la currentSource es igual al origen seleccionado, se deselecciona
                if (currentSource == matchKey) {
                    unselectElement(true, matchKey);
                    enableEvent(false, true);

                    //Cuando la origen no es igual al selecciona, se deselecciona la currentSource, y se selecciona el nuevo origen escogido 
                } else {
                    //No hay concepto
                    if (!currentTarget) {
                        //Se resetea el origen actual
                        unselectElement(true, currentSource);
                        enableEvent(false, true);
                        //seleciona como origen actual el elemento cliqueado
                        selectElement(true, matchKey, manyKey);
                    }
                }
            }
        });

        $(targets).on('click', function () {
            var element = $(this);
            var matchKey = $(element).data('matchedTargetKey');
            var manyKey = $(element).data('manyKey');
            //No hay origen
            if (!currentTarget) {
                //Si no hay destino, se selecciona el origen
                if (!currentSource) {

                    selectElement(false, matchKey, manyKey);

                    //Si Hay destino
                } else {
                    //Si el origen escogido es igual al destino actual hace matching
                    if (matchKey == currentSource) {
                        matchElement(matchKey, manyKey);

                    } else {
                        //se deselecciona tanto el currentSource y el current
                        unMatchElement(false);
                        enableEvent(false, true);
                    }

                }

                //Hay origen
            } else {
                //Cuando la currentSource es igual al origen seleccionado, se deselecciona
                if (currentTarget == matchKey) {
                    unselectElement(false, matchKey);
                    enableEvent(false, false);

                    //Cuando la origen no es igual al selecciona, se deselecciona la currentSource, y se selecciona el nuevo origen escogido 
                } else {
                    //No hay concepto
                    if (!currentSource) {
                        //Se resetea el origen actual
                        unselectElement(false, currentTarget);
                        enableEvent(false, false);
                        //seleciona como origen actual el elemento cliqueado
                        selectElement(false, matchKey, manyKey);
                    }
                }
            }
        });

        $(resetElement).on('click', function () {
            reset();
        });
    }


    return {
        init: init,
        reset: reset
    }
});