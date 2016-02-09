;(function (window, $, jsu) {
    "use strict";

    //===================================
    /* JQUERY.UI.DIALOG FACADE */
    //===================================

    // Extends the messages for specific culture
    $.extend(jsu.regional.spanish, {
        dialogTitle: "Información",
        dialogCancel: "Cancelar",
        dialogOK: "Aceptar"
    });

    $.extend(jsu.regional.english, {
        dialogTitle: "Information",
        dialogCancel: "Cancel",
        dialogOK: "Agree"
    });

    if (jsu.regional.current.culture === "es")
        jsu.regional.set(jsu.regional.spanish);

    if (jsu.regional.current.culture === "en")
        jsu.regional.set(jsu.regional.english);

    // @@Private
    var _language = jsu.regional.current;

    // Sets the @value of specific @property in the @obj,
    // keeping the writable attribute to false
    // @@Private
    function setValueNotWritable (obj, property, value) {
        Object.defineProperty(obj, property, {
            "configurable": true,
            "enumerable": false,
            "writable": false,
            "value": value
        });
    }

    // Public implementation for displaying a modal window.
    // It also provides a mechanism for overriding:
    // jsu.showDialog.set("source", callback);
    function showDialog (options) {
        return showDialog.source.call(options, options);
    }

    // Sets the method that defines the functionality
    setValueNotWritable(showDialog, "source", _showDialog);

    // Sets the method that allows override the functionality
    Object.defineProperty(showDialog, "set", {
        writable: false,
        enumerable: false,
        configurable: false,
        value: function (property, callback) {
            if (!jsu.isFunction(callback)) return;
            setValueNotWritable(this, property, callback);
        }
    });

    // Private implementation to display a modal window.
    // This is a facade for jQuery.ui.dialog window.
    // @@Private
    function _showDialog (o) {
        if (!jQuery.ui || !jQuery.ui.dialog)
            throw new Error("jQuery.ui.dialog is required");
        var d = $.extend(true, {
                id: 'jsu-dialog',
                appendTo: jsu.wrapper,
                title: _language.dialogTitle,
                content: null,
                icon: null,
                buttons: {},
                modal: true,
                closeOnPageUnload: false
            }, o),
            cnt = $(),
            body = $('body'),
            icon, onClose;
        onClose = $("#" + d.id).dialog('option')['close'];
        //'this' for showDialog is the options provided by the user
        //'this' for showConfirm is the element that opens the confirm window
        if (jsu.isFunction(d.content)) cnt = d.content.call(this);
        if (jsu.isFunction(onClose)) onClose();
        if (!d.content || !cnt) return;
        if (!$.isPlainObject(d.buttons) && !$.isArray(d.buttons)) d.buttons = {};
        if (d.content instanceof jQuery || 'jquery' in Object(d.content)) cnt = d.content;
        else if (jsu.isDOM(d.content)) cnt = $(d.content);
        if (typeof d.content === "string" || typeof cnt === "string") {
            cnt = typeof cnt === "string" ? cnt : d.content;
            // Displays an icon to the left of text
            icon = d.icon ? '<div class="wnd-icon ' + d.icon + '"></div>' : "";
            cnt = $(icon + '<div class="wnd-text">' + cnt + '</div>').appendTo(body).data("del", true);
            cnt.css({ display: "table-cell", "vertical-align": "middle", cursor: "default" });
        }
        // Stores the boundaries of the Element to display
        cnt.saveBoundaries(d.id);
        cnt.wrapAll('<div id="' + d.id + '">')
           .wrapAll('<div class="ui-dialog-custom" style="display:table; margin:0 auto; border-collapse:collapse; border:0;">');
        // Check the version of jQuery.ui to use the new "appendTo" feature
        var wnd = $("#" + d.id).appendTo(body),
            v110 = (/^1\.1[0-9]/).test(jQuery.ui.version);
        if (!+o.width) d.width = wnd.find('.ui-dialog-custom')[0].clientWidth;
        // Determines whether the dialog should be closed when the page is unloaded
        if (d.closeOnPageUnload === true) wnd.attr("data-dialog-unload", true);
        if (!jsu.handlerExist(window, "beforeunload", "jsu-showDialog")) {
            $(window).on(jsu.nsEvents("beforeunload", "jsu-showDialog"), function () {
                $("[data-dialog-unload]").each(function () {
                    $(this).dialog("close");
                });
            });
        }
        // Closes the window for those elements with the "close-dialog" class
        wnd.one("click.dialog", ".close-dialog", function (e) {
            e.preventDefault();
            $(e.delegateTarget).dialog("close");
        });
        body.css("overflow", "hidden");
        wnd.dialog({
            title: d.title,
            draggable: true,
            resizable: false,
            modal: !!d.modal,
            hide: 'drop',
            show: 'fade',
            maxHeight: +d.maxHeight || Math.floor($(window).height() * 0.86),
            minHeight: +d.minHeight || 50,
            height: d.height || 'auto',
            maxWidth: +d.maxWidth || 1024,
            minWidth: +d.minWidth || 150,
            width: +d.width,
            buttons: d.buttons,
            appendTo: d.appendTo,
            create: function (event, ui) {
                var wnd = $(this);
                if (!+o.width) {
                    // Fixes the width of the window
                    var width = wnd.dialog("option", "width"),
                        maxwidth = wnd.dialog("option", "maxWidth"),
                        padding = Math.round(parseFloat(wnd.css("padding-left"))) * 2;
                    wnd.dialog("option", "width", Math.min(width, maxwidth) + padding);
                }
                if (!v110) {
                    // Adds "appendTo" feature if it is not supported
                    wnd.css("max-height", wnd.dialog("option", "maxHeight"))
                        .closest(".ui-dialog")
                        .add(".ui-widget-overlay")
                        .appendTo(d.appendTo);
                }
            },
            open: function (event, ui) {
                var wnd = $(event.target), width, zindex;
                // Fixes the width of the window with scrollbar
                if (!+o.width && wnd.hasVScroll()) {
                    width = wnd.dialog("option", "width");
                    wnd.dialog("option", "width", width + jsu.getScrollbarWidth());
                }
                // Honor z-index for $.showConfirm
                if (this.id === 'jsu-dialog-confirm') {
                    zindex = +$(".ui-dialog").css("z-index") + 1;
                    wnd.closest(".ui-dialog").css("z-index", zindex);
                }
            },
            close: function (event, ui) {
                var wnd = $(event.target);
                body.css("overflow", "");
                if (wnd.hasClass("ui-dialog-content")) {
                    wnd.dialog("destroy");
                    if (cnt.data("del")) wnd.remove();
                    else {
                        cnt.unwrap().unwrap();
                        cnt.restoreBoundaries();
                    }
                }
            }
        });
        return wnd;
    }

    //===================================
    /* JQUERY SHOWCONFIRM PLUGIN */
    //===================================

    // @@Private
    var type = "click",
        pattern = (/(?:^\w+:\/\/[^\s\n]+)[^#]$/);

    // Validates an URL address
    // @@Private
    function hasValidUrl (href) {
        return !!(href && href.length && pattern.test(href));
    }

    // Click handler for 'OK' Button
    // @@Private
    function onClickAgree (event) {
        var button = this.context;
        console.log("event", event);
        console.log("button", button);
        if (hasValidUrl(button.href)) document.location = button.href;
        $(this.dialogId).on("dialogclose", function (ev, ui) {
            setValueNotWritable($.fn.showConfirm, "canSubmit", true);
            // Unbinds  the event handler and triggers the previous actions
            $(button).off(".jsu-showConfirm").trigger(type);
            // Triggers the awful asp.net postback
            if ((/[_]{2}doPostBack/).test(button.href))
                setTimeout(button.href.replace(/javascript:/i, ""), 1);
        }).dialog("close");
    }

    // Click handler for 'Cancel' Button
    // @@Private
    function onClickCancel (event) {
        console.log("event", event);
        console.log("button", this.context);
        setValueNotWritable($.fn.showConfirm, "canSubmit", false);
        $(this.dialogId).dialog("close");
    }

    // Displays a confirm window on click event
    $.fn.showConfirm = function (o) {
        setValueNotWritable($.fn.showConfirm, "canSubmit", false);
        // Sets arbitrarily the ID to prevent multiple confirms
        o.id = 'jsu-dialog-confirm';
        o.buttons = [
            { click: null, text: _language.dialogOK },
            { click: null, text: _language.dialogCancel }
        ];
        // Sets the event's context for buttons
        var evtcontext = {
            context: null,
            dialogId: "#" + o.id
        };
        // Event handler to show the confirm window
        function onShowConfirm (e) {
            var btn = this;
            evtcontext.context = btn;
            // Allows to the easyValidate function pass through
            if (jsu.handlerExist(btn, type, "jsu-easyValidate"))
                setValueNotWritable($.fn.showConfirm, "canSubmit", !$.fn.easyValidate.canSubmit);
            if (!$.fn.showConfirm.canSubmit) {
                e.stopImmediatePropagation();
                e.preventDefault();
                // Executes the callback before the window is displayed
                if (jsu.isFunction(o.beforeShow))
                    o.beforeShow.call(btn);
                // Sets the event's context for buttons
                o.buttons[0].click = onClickAgree.bind(evtcontext);
                o.buttons[1].click = onClickCancel.bind(evtcontext);
                // Shows the confirm window
                _showDialog.call(btn, o);
            }
        }
        // Returns the collection of matching elements
        return this.each(function (i, button) {
            $(button).off(".jsu-showConfirm").on(jsu.nsEvents(type, "jsu-showConfirm"), onShowConfirm);
            var handlers = ($._data(button, 'events') || {})[type];
            console.log("handlers", handlers);
            var ievh = 0, lastHandler = handlers.pop();
            console.log("lastHandler", lastHandler);
            // Gets the index of easyValidate handler
            $.each(handlers, function (index, handler) {
                if (handler.namespace === "jsu-easyValidate") {
                    ievh = index + 1;
                    return false;
                }
            });
            // Moves the onShowConfirm handler after ievh
            handlers.splice(ievh, 0, lastHandler);
        }); //end $.each
    };

    // Augments the jsu library
    jsu.showDialog = showDialog;
}(window, jQuery, jsu));
