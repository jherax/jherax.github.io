/*
 *  Description: Utilities
 *  Author: David Rivera
 */
//TODO: Actualizar documentación de easyValidate (onBeforeTooltip (args) args.target, args.position)
//TODO: Agregar propiedad arrow para las flechas del tooltip
//TODO: Agregar documentación de $.saveBoundaries
//TODO: Agregar documentación de $.restoreBoundaries

//===================================
/* MISCELLANEOUS */
//===================================

//-----------------------------------
// Motivation:
// Pass the result of a function as the input to the next function
let data = {};
fun3(fun2(fun1(data)));

// Proposal 1:
let funcs = [f1, f2, f3];
let data = {};
for (let func of funcs) data = func(data);

// Proposal 2:
[f1, f2, f3].reduce((o, fn) => fn(o), {});

//-----------------------------------
// Quita los acentos del texto
function ignoreAccent (text) {
    var accent = "ÂâÀàÁáÄäÃãÅåÊêÈèÉéËëÎîÌìÍíÏïÔôÒòÓóÖöÕõÛûÙùÚúÜüÑñÝýÿ",
        normal = "AaAaAaAaAaAaEeEeEeEeIiIiIiIiOoOoOoOoOoUuUuUuUuNnYyy",
        length = accent.length;
    for (var i = 0; i < length; i += 1) {
        text = text.replace(accent.charAt(i), normal.charAt(i));
    }
    return text;
}

//------------------------------------------
// Padding to left or right
function fillPadding (direction, quantity, fillchar) {
    direction = direction || "left";
    quantity = quantity || 2;
    fillchar = fillchar || "0";
    return (direction === "left"
        ? function (text) {
            var filled = new Array(quantity).join(fillchar) + (text || "");
            return filled.slice(-quantity);
        }
        : function (text) {
            var filled = (text || "") + new Array(quantity).join(fillchar);
            return filled.slice(0, quantity);
        })
}

//-----------------------------------
// Enables Cross Domain Requests
$.ajaxPrefilter(function (options) {
    if (options.crossDomain && $.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:'),
            url = options.url; //encodeURIComponent(options.url);
        options.url = http + '//cors-anywhere.herokuapp.com/' + url;
        //options.url = "http://cors.corsproxy.io/url=" + url;
        //options.crossDomain = false;
    }
});

// -----------------------------------
// Llama un servicio web mediante AJAX
// Fachada de jQuery.ajax()
// Ver documentación en:
// http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings
window.callAjax = (function() {
    var defaults = {
        settings: {}, // sobrescribe los parámetros de configuración de $.ajax()
        async: true, // determina si la solicitud AJAX es enviada asíncronamente
        cache: false, // determina si el recurso solicitado es almacenado en caché por el navegador
        type: 'POST', // tipo de petición que se hará al servidor
        dataType: 'json', // el tipo de datos que retorna el servicio web
        contentType: 'application/json; charset=utf-8', // tipo de datos enviado al servidor
        url: '', // nombre del servicio web y del método a ser consumido
        params: {}, // objeto JSON que contiene los parámetros esperados por el servicio web
        processData: false, // determina si convierte {params} a querystring y lo añade en la url (para peticiones GET)
        crossDomain: false, // forzar una solicitud crossDomain (como JSONP) en el mismo dominio
        showLoading: false, // determina si debe mostrar la animación cuando se inicie la petición AJAX
        success: null, // este callback es ejecutado luego de una respuesta exitosa del servidor
        error: null, // este callback se ejecuta si la solicitud falla
    };
    function _ajax(options) {
        var config = $.extend(defaults, options);
        if (!config.url) throw new Error('Debe especificar la url');
        if (!config.crossDomain) {
            if (!config.processData && config.type === 'GET') {
                config.url += '?' + $.map(config.params, function(value, key) {
                    return key + '=' + encodeURIComponent(value);
                }).join('&');
                config.params = undefined;
            }
        }
        if (config.showLoading === true) {/* show loading animation */}
        var jqxhr = $.ajax($.extend({
            type: (config.dataType === 'jsonp' ? 'GET' : config.type),
            url: config.url,
            data: JSON.stringify(config.params),
            processData: config.processData,
            contentType: config.contentType,
            dataType: config.dataType,
            cache: config.cache,
            async: config.async,
            crossDomain: config.crossDomain,
            success: function(data, status, jqXHR) {
                if ($.isFunction(config.success)) {
                    config.success(data, status, jqXHR);
                }
            },
            error: function(jqXHR, status, errorThrown) {
                if ($.isFunction(config.error)) config.error(jqXHR);
                else throw new Error([errorThrown, options.url, jqXHR.responseText].join('\n'));
            },
        }, config.settings));
        jqxhr.always(function() {
            if (config.showLoading === true) {/* hide loading animation */}
        });
        return jqxhr;
    }

    return _ajax;
}());


//-----------------------------------
// Observa cambios en el hash de la url
var onHashChange = (function (window, jsu) {
    "use strict";

    if (!jsu.isFunction(jsu.showDialog)) {
        throw new Error("jsu.showDialog is required");
    }
    var location = window.location,
        prevHash = location.hash;
    return function (callback) {
        if (!jsu.isFunction(callback)) return;
        if ("onhashchange" in window) {
            $(window).on(jsu.nsEvents("hashchange", "jsu-onHashChange"), callback);
            //window.onhashchange = callback;
        } else {
            jsu.showDialog({
                width: 380,
                content: [
                    'Su navegador no soporta las nuevas características de HTML5, como el evento <i>hashchange.</i>',
                    '<p>Actualice el <a href="http://browsehappy.com/">navegador</a> para mejorar su experiencia.</p>'
                ].join("")
            });
            window.setInterval(function() {
                if (location.hash != prevHash) {
                    prevHash = location.hash;
                    callback();
                }
            }, 200);
        }
    };
}(window, jsu));

//-----------------------------------
// Multiples ventanas con jsu.showDialog
jsu.showDialog({
    id: "jherax-dev",
    title: "Acerca de Jherax",
    content: "Visita mi blog en wordpress<p><a href='https://jherax.wordpress.com'>jherax.wordpress.com</a></p><button class='close-dialog'>Cerrar</button>",
    closeOnPageUnload: true,
    modal: true
});
jsu.showDialog({
    id: "david-rivera",
    title: "Acerca de David",
    content: "Visita mi blog en wordpress<p><a href='https://jherax.wordpress.com'>jherax.wordpress.com</a></p><button class='close-dialog'>Cerrar</button>",
    closeOnPageUnload: false,
    modal: false
});

//===================================
/* POLLYFILLS */
//===================================

// Polyfill for Array.prototype.some
if (typeof Array.prototype.some !== 'function') {
    Object.defineProperty(Array.prototype, "some", {
        writable: false,
        enumerable: false,
        configurable: false,
        value: function (fn /*, thisArg */) {
            'use strict';
            if (this === void 0 || this === null)
                throw new TypeError();
            if (typeof fn !== 'function')
                throw new TypeError();
            var thisArg, index,
                array = Object(this),
                //let @len be ToUint32(value)
                len = array.length >>> 0;

            thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (index = 0; index < len; index += 1) {
                if (index in array && fn.call(thisArg, array[index], index, array))
                    return true;
            }
            return false;
        }
    });
}

//-----------------------------------
// Polyfill for Array.prototype.filter
if (typeof Array.prototype.filter !== 'function') {
    Object.defineProperty(Array.prototype, "filter", {
        writable: false,
        enumerable: false,
        configurable: false,
        value: function (fn /*, thisArg */) {
            'use strict';
            if (this === void 0 || this === null) {
                throw new TypeError();
            }
            if (typeof fn !== 'function') {
                throw new TypeError();
            }
            var filtered, thisArg,
                index, element,
                array = Object(this),
                len = array.length >>> 0;

            filtered = [];
            thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (index = 0; index < len; index += 1) {
                if (index in array) {
                    element = array[index];
                    if (fn.call(thisArg, element, index, array)) {
                        filtered.push(element);
                    }
                }
            }
            return filtered;
        }
    });
}

//===================================
/* EXTEND DATEPICKER */
//===================================

// Creates culture for jquery.ui datepicker
(function ($) {
    'use strict';

    if ($.datepicker) {
        $.datepicker.regional['en'] = $.extend({}, $.datepicker.regional[""]);
        $.datepicker.regional['es'] = {
            closeText: 'Cerrar',
            prevText: '&lt; Anterior',
            nextText: 'Siguiente &gt;',
            currentText: 'Hoy',
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Mi&eacute;rcoles', 'Jueves', 'Viernes', 'S&aacute;bado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mi&eacute;', 'Juv', 'Vie', 'S&aacute;b'],
            dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'S&aacute;'],
            weekHeader: 'Sm',
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ""
        };
    }
    if ($.timepicker) {
        $.timepicker.regional['en'] = $.extend({}, $.timepicker.regional[""]);
        $.timepicker.regional['es'] = {
            timeOnlyTitle: 'Seleccione Hora',
            timeText: 'Tiempo',
            hourText: 'Hora',
            minuteText: 'Minuto',
            secondText: 'Segundo',
            currentText: 'Actual',
            closeText: 'Aceptar',
            timeFormat: 'HH:mm',
            hourGrid: 4,
            minuteGrid: 10,
            ampm: false
        };
    }
    // This code segment must be called before the plugin initialization
    // You can find more languages: [http://github.com/jquery/jquery-ui/tree/master/ui/i18n]
    if ($.datepicker) { $.datepicker.setDefaults($.datepicker.regional[jsu.regional.current.culture]); }
    if ($.timepicker) { $.timepicker.setDefaults($.timepicker.regional[jsu.regional.current.culture]); }

}(jQuery));


//===================================
/* TABLETOOLS FACADES */
//===================================
(function (window, $, jsu) {
    "use strict";

    if (!jsu.isFunction($.fn.dataTable)) {
        throw new Error("jQuery.dataTable is required");
    }
    var _wrapper = '<div class="tabletools-wrapper tabla">',
        _defaults = {
            selector: ".dataTable",
            languageUrl: "../assets/tabletools/dataTables-ES.txt",
            tableToolsSwf: "../assets/tabletools/copy_csv_xls_pdf.swf",
            width: "90%"
        };
    //-----------------------------------
    function initComplete (oSettings, json) {
        //Chrome: Fixes the width having horizontal scrollbar
        if (jsu.browser.chrome) {
            var dt = $($.fn.dataTable.fnTables(true)),
                wrap = $('.dataTables_wrapper');
            if (dt.outerWidth() < wrap.outerWidth()) {
                oSettings.oScroll.sXInner = "100%";
                dt.dataTable().fnAdjustColumnSizing();
            }
            if (dt.outerWidth() > wrap.outerWidth()) {
                wrap.find('table').data("layout", true).css("table-layout", "fixed");
            }
        }
    }
    //-----------------------------------
    function setResizeHandler () {
        if (!jsu.handlerExist(window, "resize", "showTableScroll")) {
            $(window).on(jsu.nsEvents('resize', 'showTableScroll'), function () {
                var table = $('.dataTables_wrapper table'),
                    fixed = jsu.browser.chrome && table.data("layout"),
                    oTable = $($.fn.dataTable.fnTables(true)).dataTable();
                oTable.fnSettings().oFeatures.bAutoWidth = true;
                if (fixed) table.css("table-layout", "auto");
                oTable.fnAdjustColumnSizing();
                if (fixed) table.css("table-layout", "fixed");
            });
        }
    }
    //-----------------------------------
    // Initializes dataTables & TableTools plugins
    function showTableTools (options) {
        var d = $.extend({}, _defaults, options),
            wrapper = $(_wrapper).width(d.width);
        $(d.selector).wrap(wrapper).dataTable({
            "bJQueryUI": true,
            "aaSorting": [],
            "iDisplayLength": 15,
            "aLengthMenu": [[15, 25, 50, -1], [15, 25, 50, "Todo"]],
            "oLanguage": { "sUrl": d.languageUrl },
            "sPaginationType": "full_numbers",
            "sDom": '<"H"Tfr>t<"F"lip>',
            "oTableTools": {
                "sRowSelect": "multi",
                "sSwfPath": d.tableToolsSwf,
                "aButtons": [{
                    "sExtends": "copy",
                    "bSelectedOnly": "true"
                }, "xls", "csv", "pdf"]
            }
        });
    }
    //-----------------------------------
    // Sets TableTools with scrolling support
    function showTableScroll (options) {
        var d = $.extend({}, _defaults, options),
            wrapper = $(_wrapper).width(d.width);
        $(d.selector).wrap(wrapper).dataTable({
            "bJQueryUI": true,
            "aaSorting": [],
            "sScrollX": "100%",
            "bScrollCollapse": true,
            "bAutoWidth": false,
            "iDisplayLength": 15,
            "aLengthMenu": [[15, 25, 50, -1], [15, 25, 50, "Todo"]],
            "oLanguage": { "sUrl": d.languageUrl },
            "sPaginationType": "full_numbers",
            "sDom": '<"H"Tfr>t<"F"lip>',
            "oTableTools": {
                "sRowSelect": "multi",
                "sSwfPath": d.tableToolsSwf,
                "aButtons": [{
                    "sExtends": "copy",
                    "bSelectedOnly": "true"
                }, "xls", "csv", "pdf"]
            },
            "fnInitComplete": initComplete
        });
        if ($.fn.dataTable.fnTables(true).length) {
            setResizeHandler();
        }
    }

    // Augments the jsu library
    jsu.showTableTools = showTableTools;
    jsu.showTableScroll = showTableScroll;
}(window, jQuery, jsu));


//===================================
/* TYPEAHEAD AUTOCOMPLETE PLUGIN */
//===================================
(function ($, jsu) {
    "use strict";

    if (!jsu.isFunction($.fn.typeahead)) {
        throw new Error("jQuery.typeahead is required");
    }
    $.fn.fnAutoComplete = function (o) {
        return this.each(function () {
            var txb = $(this).attr("disabled", true);
            //$.ajaxSetup({ accepts: "json", contentType: "application/json; charset=utf-8", dataType: "json" });
            $.ajax({
                type: "POST",
                url: o.url,
                data: jsu.stringify($.extend({}, o.params)),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    data = $.parseJSON(data.d);
                    var x,
                        head = [], body = [],
                        dataLength = data.length;
                    if (!dataLength) return;
                    //Creates header and body templates
                    for (x = 0; x < dataLength; x+=1) {
                        head.push('<div class="tt-head-cell">' + data[x] + '</div>');
                        if (!(/^img$/i).test(data[x])) body.push('<div class="">{{' + data[x] + '}}</div>');
                        else body.push('<div class="image"><img src="{{' + data[x] + '}}"/></div>');
                    }
                    x = dataLength = null;
                    //Fix the padding-right of the last column
                    head[head.length - 1] = head[head.length - 1].replace('">', ' last-cell">');
                    body[body.length - 1] = body[body.length - 1].replace('">', ' last-cell">');
                    txb.attr({ "disabled": false, "placeholder": "Seleccione" }).typeahead({
                        limit: 7,
                        valueKey: o.display,
                        prefetch: { url: o.prefetchUrl }, /*'prefetch/customers.json'*/
                        header: '<div class="tt-head-row">' + head.join('') + '</div>',
                        template: body.join(''),
                        engine: Hogan
                    }).on('typeahead:selected', function (e, datum) {
                        $(o.hiddenField).val(datum[o.hiddenValue]);
                        txb.blur();
                    }).off('.fnAutoComplete').on(jsu.nsEvents('keyup', 'fnAutoComplete'), function () {
                        $(o.hiddenField).val("");
                    });
                },
                error: function (e) {
                    $('#ajax-error').html(e.responseText);
                    console.log(e.responseText);
                }
            }); //end $.ajax
        }); //return jquery
    };
}(jQuery, jsu));


//===================================
/* TYPEAHEAD AUTOCOMPLETE PLUGIN */
//===================================
(function ($, jsu) {
    "use strict";

    if (!jsu.isFunction($.fn.typeahead)) {
        throw new Error("jQuery.typeahead is required");
    }
    function _fnFormatItem (item) {
        var n, tokens, tokensLength;
        if (jsu.isFunction(this.fnFormatter))
            item = this.fnFormatter(item);
        item.tokens = [];
        tokens = item[this.display].split(/\b/);
        for (n = 0, tokensLength = tokens.length; n < tokensLength; n+=1) {
            if (tokens[n].length > 2) item.tokens.push(tokens[n]);
        }
        return item;
    }
    function _fnReplace (url, query) {
        var q = url.replace('%QUERY', query),
            p, params = this.fnParameters();
        for (p in params) {
            q += "&" + p + "=" + encodeURIComponent(params[p]);
        }
        this.params = params = p = null;
        return q;
    }
    $.fn.fnAutoCompleteRemote = function (o) {
        var fnReplace = null;
        if (jsu.isFunction(o.fnParameters))
            fnReplace = _fnReplace.bind(o);
        return this.each(function () {
            var x, colsLength,
                txb = $(this),
                head = [], body = [];
            //Creates header and body templates
            for (x = 0, colsLength = o.columns.length; x < colsLength; x+=1) {
                head.push('<div class="tt-head-cell">' + o.columns[x] + '</div>');
                if (!(/^img$/i).test(o.columns[x])) body.push('<div class="">{{' + o.columns[x] + '}}</div>');
                else body.push('<div class="image"><img src="{{' + o.columns[x] + '}}"/></div>');
            }
            //Fix the padding-right of the last column
            head[head.length - 1] = head[head.length - 1].replace('">', ' last-cell">');
            body[body.length - 1] = body[body.length - 1].replace('">', ' last-cell">');
            var query = "?prefix=%QUERY";
            for (x in o.params) {
                query += "&" + x + "=" + encodeURIComponent(o.params[x]);
            }
            x = colsLength = null;
            txb.attr({ "placeholder": "Seleccione" }).typeahead({
                minLength: 2,
                limit: 10,
                remote: {
                    url: o.webservice + query,
                    dataType: "json",
                    rateLimitWait: 600,
                    replace: fnReplace,
                    filter: function (data) {
                        var i, datums = [],
                            length = data.length;
                        //data = $.parseJSON(d.documentElement.textContent);
                        for (i = 0; i < length; i+=1)
                            datums.push(_fnFormatItem.call(o, data[i]));
                        return datums;
                    }
                },
                valueKey: o.display,
                header: '<div class="tt-head-row">' + head.join('') + '</div>',
                template: body.join(''),
                engine: Hogan
            }).on('typeahead:selected', function (e, datum) {
                $(o.hiddenField).val(datum[o.hiddenValue]);
                txb.blur();
            }).off('.fnAutoCompleteRemote').on(jsu.nsEvents('keyup', 'fnAutoCompleteRemote'), function () {
                $(o.hiddenField).val("");
            });
        }); //return jquery
    };
}(jQuery, jsu));


//===================================
/* HIGHCHARTS FACADES */
//===================================
(function ($, jsu) {
    "use strict";

    if (!jsu.isFunction($.fn.highcharts)) {
        throw new Error("jQuery.highcharts is required");
    }
    if (!jsu.isFunction(jsu.showDialog)) {
        throw new Error("jsu.showDialog is required");
    }
    // Creates accessible charts and graphs
    $.fn.drawChart = function (o) {
        var h,
            table = $(this).eq(0),
            tableDOM = table.get(0);
        if (+o.barThickness)
            h = table.find('thead th').length * o.barThickness * table.find('tbody tr').length;
        o.target = (o.target || $('<section class="chart-0">').appendTo(table.parent()).get(0));
        return $(o.target).addClass('chart-viewer').highcharts({
            data: o.data || { table: tableDOM },
            chart: o.chart || { type: o.type, height: o.height || h },
            title: { text: o.title || table.find('caption').text() },
            subtitle: { text: o.subtitle || tableDOM.getAttribute('data-highchart-subtitle') },
            xAxis: o.xAxis || {},
            yAxis: o.yAxis || {
                allowDecimals: !!o.allowDecimals,
                labels: { overflow: 'justify' },
                title: { text: o.yAxisTitle || null, align: 'high' }
            },
            tooltip: o.tooltip || {},
            plotOptions: o.plotOptions || {},
            legend: o.legend || {
                backgroundColor: '#FFFFFF',
                shadow: true
            },
            credits: { enabled: false }
        });
    };
    //-----------------------------------
    // Draws a chart of type: spider
    function drawChartSpider (selector) {
        $(selector).drawChart({
            target: '.chart-0',
            chart: {
                polar: true,
                type: 'line',
                height: 470
            },
            xAxis: {
                tickmarkPlacement: 'on',
                lineWidth: 0
            },
            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                max: 100,
                min: 0
            },
            tooltip: {
                shared: true,
                formatter: function () {
                    var s = [];
                    $.each(this.points, function (i, point) {
                        var series = point.series;
                        if (i === 0) s.push('<span style="font-size:10px; font-weight:bold;">' + point.key + '</span><br/>');
                        s.push('<span style="color:' + series.color + '">' + jsu.capitalize(series.name.replace(/\_/g, " "), 'capital'));
                        s.push('</span>: <span style="font-style:italic">' + Highcharts.numberFormat(point.y, 1) + '%</span><br/>');
                    });
                    return s.join("");
                } //end formatter
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                shadow: true,
                backgroundColor: '#FFFFFF',
                labelFormatter: function () {
                    return jsu.capitalize(this.name.replace(/\_/g, " "), 'capital');
                } //end formatter
            }
        });
        jsu.showDialog({ title: $(selector).find('caption').text(), content: $('.chart-0') });
    }

    // Augments the jsu library
    jsu.drawChartSpider = drawChartSpider;
}(jQuery, jsu));
