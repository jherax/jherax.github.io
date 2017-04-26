"use strict";

/*
 *  JSU Library
 *  Author: David Rivera
 *  Created: 2013/06/26
 *  Version: 4.0.0
 -------------------------------------
 *  Source:
 *  http://github.com/jherax/js-utils
 -------------------------------------
 *  Documentation:
 *  http://jherax.github.io
 *  http://jherax.github.io/?lang=spanish
 -------------------------------------
 *  Has dependency on jQuery
 *  http://jquery.com/
 -------------------------------------
 *  Abstract:
 *  This is a library of utilities for JavaScript and jQuery.
 *  Included tools for data validation, text formatting, tooltips, positioning elements, cloning objects, sorting arrays, etc.
 -------------------------------------
 *  Released under the MIT license
 *  https://raw.githubusercontent.com/jherax/js-utils/master/LICENSE
 *  Copyright (C) 2013-2016 jherax
 */

// Avoid console errors in browsers that lack a console.
(function(window, $) {
  var method,
    methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeStamp', 'trace', 'warn'
    ],
    length = methods.length,
    console = (window.console = window.console || {});

  while (length -= 1) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = $.noop;
    }
  }
}(window, jQuery));

// Creates the global namespace
if (window.jsu && jsu.author !== 'jherax') {
  throw new Error('A variable with namespace [jsu] is already in use');
}

// Creates the initial properties
var jsu = window.jsu || {
  setDescriptor: function(value) {
    return {
      writable: false,
      enumerable: false,
      configurable: false,
      value: value
    };
  }
};

Object.defineProperties(jsu, {
  author: jsu.setDescriptor('jherax'),
  version: jsu.setDescriptor('4.0.0'),
  dependencies: jsu.setDescriptor(['jQuery']),
  //selector where dynamic HTML is placed
  wrapper: {
    writable: true,
    enumerable: true,
    configurable: false,
    value: 'body'
  },
  //polyfill to get the host of the site
  siteOrigin: {
    writable: false,
    enumerable: true,
    configurable: false,
    value:
      (function(loc) {
        var port = loc.port ? ':' + loc.port : '';
        return (loc.origin || (loc.protocol + '//' + loc.hostname + port));
      }(window.location))
  },
  //utility to create safe namespaces
  createNS: {
    writable: false,
    enumerable: true,
    configurable: false,
    value: function(namespace) {
      // @see https://gist.github.com/jherax/97cce1801527b84782a2
      var nsparts = namespace.toString().split("."),
        reName = (/^[A-Za-z_]\w+/),
        cparent = window,
        i, subns, nspartsLength;
      // we want to be able to include or exclude the root namespace so we strip it if it's in the namespace
      if (nsparts[0] === "window") { nsparts = nsparts.slice(1); }
      // loop through the parts and create a nested namespace if necessary
      for (i = 0, nspartsLength = nsparts.length; i < nspartsLength; i += 1) {
        subns = nsparts[i];
        // check if the namespace is a valid variable name
        if (!reName.test(subns)) { throw new Error('Incorrect namespace'); }
        // check if the current parent already has the namespace declared,
        // if it isn't, then create it
        if (typeof cparent[subns] === 'undefined') {
          cparent[subns] = {};
        }
        cparent = cparent[subns];
      }
      i = subns = nsparts = nspartsLength = reName = undefined;
      // the parent is now constructed with empty namespaces and can be used.
      // we return the outermost namespace
      return cparent;
    }
  }
});

//-----------------------------------
// Immediately-invoked Function Expressions (IIFE)
// We pass the namespace as an argument to a self-invoking function.
// "regional" is the context of the local namespace, and "$" is the jQuery object.
(function(regional, $) {
  // Creates the messages for specific culture
  regional.spanish = {
    culture: 'es',
    deprecated: ' "{0}" está en desuso, use "{1}" en su lugar ',
    wordPattern: /\s(?:Y|O|Del?|Por|Al?|L[ao]s?|[SC]on|En|Se|Que|Una?)\b/g,
    decimalMark: ',',
    thousandsMark: '.',
    timeFormat: 'HH:mm',
    dateFormat: 'dd/MM/yyyy',
    dateFormatError: 'El formato de fecha es incorrecto',
    dateIsGreater: 'La fecha no puede ser mayor a hoy',
    dateIsLesser: 'La fecha no puede ser menor a hoy',
    validateForm: 'El botón debe estar dentro de un &lt;form&gt;',
    validateRequired: 'Este campo es requerido',
    validateFormat: 'El formato es incorrecto'
  };
  regional.english = {
    culture: 'en',
    deprecated: ' "{0}" is deprecated, use "{1}" instead ',
    wordPattern: null,
    decimalMark: '.',
    thousandsMark: ',',
    timeFormat: 'HH:mm',
    dateFormat: 'MM/dd/yyyy',
    dateFormatError: 'The date format is incorrect',
    dateIsGreater: 'The date can't be greater than today',
    dateIsLesser: 'The date can't be lesser than today',
    validateForm: 'The button must be inside a &lt;form&gt;',
    validateRequired: 'This field is required',
    validateFormat: 'The format is incorrect'
  };

  //-----------------------------------
  // You can add more languages using $.extend
  regional.current = $.extend({}, regional.spanish);

  //-----------------------------------
  // Sets the default language configuration
  Object.defineProperty(regional, 'set', {
    configurable: false,
    enumerable: true,
    writable: false,
    value: function(obj, callback) {
      if (typeof obj === 'string')
        obj = regional[obj];
      $.extend(regional.current, obj);
      //this segment must be called before the plugin initialization
      if ($.isFunction(callback)) callback.apply(regional);
    }
  });

}(jsu.createNS('jsu.regional'), jQuery));

//-----------------------------------
// We provide an object to override default settings.
// "config" is the context of the local namespace, and "$" is the jQuery object.
(function(config, $) {
  config.position = null; //{ at:null, my:null };
})(jsu.createNS('jsu.config'), jQuery);

//-----------------------------------
// Immediately-invoked Function Expressions (IIFE)
// "jherax" is the context of the local namespace, and "$" is jQuery.
(function(window, $, jherax) {

  //===================================
  /* PRIVATE MEMBERS */
  //===================================

  // Sets the default language configuration
  jherax.regional.set('spanish');
  var _toString = Object.prototype.toString,
    _language = jherax.regional.current;

  /**
   * @private
   * Create a custom exception notifier.
   * https://gist.github.com/jherax/c2f151165ecb19b9f8e3
   *
   * @param  {String} message: the message and the format to show the error
   * @return {Error}
   */
  var CustomError = (function() {
    function CustomError() {
      //enforces 'new' instance
      if (!(this instanceof CustomError)) {
        return new CustomError(arguments);
      }
      var error,
        //handles the arguments object when is passed by enforcing a 'new' instance
        args = Array.apply(null, typeof arguments[0] === 'object' ? arguments[0] : arguments),
        message = args.shift() || 'An exception has occurred';
      //builds the message with multiple arguments
      if (~message.indexOf('}')) {
        args.forEach(function(arg, i) {
          message = message.replace(RegExp('\\{' + i + '}', 'g'), arg);
        });
      }
      //gets the exception stack
      error = new Error(message);
      error.name = this.name;
      Object.defineProperties(this, {
        stack: {
          enumerable: false,
          get: function() { return error.stack; }
        },
        message: {
          enumerable: false,
          value: message
        }
      });
    }
    //prevents direct reference to Error.prototype
    CustomError.prototype = Object.create(Error.prototype, {
      constructor: jherax.setDescriptor(CustomError),
      name: jherax.setDescriptor('JSU Error')
    });
    return CustomError;
  }());
  //-----------------------------------
  // Prints a console message notifying the compatibility mode
  // @private
  function deprecated(oldname, newname) {
    var style = 'color: red; display: block;',
      text = _language.deprecated.replace('{0}', oldname).replace('{1}', newname);
    console.warn('%c' + text, style); // eslint-disable-line
  }
  //-----------------------------------
  // Seals the writable attribute in all object's properties
  // @private
  function _setPropertiesNotWritable(obj) {
    for (var p in obj) {
      Object.defineProperty(obj, p, {
        __proto__: null,
        configurable: true,
        enumerable: true,
        writable: false
      });
    }
  }
  //-----------------------------------
  // Sets the @value of specific @property in the @obj,
  // keeping the writable attribute to false
  // @private
  function _setValueNotWritable(obj, property, value, enumerable) {
    Object.defineProperty(obj, property, {
      configurable: true,
      enumerable: !!enumerable,
      writable: false,
      value: value
    });
  }
  //-----------------------------------
  // @private
  var SELECTABLE_TYPES = (/text|password|search|tel|url/);

  // Fix: failed to read the 'selectionStart' property from 'HTMLInputElement'
  // The @fn parameter provides a callback to execute additional code
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
  // @private
  function _fixSelection(dom, fn) {
    var validType = SELECTABLE_TYPES.test(dom.type),
      selection = {
        start: validType ? dom.selectionStart : 0,
        end: validType ? dom.selectionEnd : 0
      };
    if (validType && isFunction(fn)) fn(dom);
    return selection;
  }
  //-----------------------------------
  // Detects the browser via userAgent, since
  // jQuery 1.9+ deprecated the browser property.
  var browser = (function() {
    var ua = navigator.userAgent.toLowerCase(),
      match =
      (/(msie) ([\w.]+)/).exec(ua) ||
      (/(chrome)[ \/]([\w.]+)/).exec(ua) ||
      (/(webkit)[ \/]([\w.]+)/).exec(ua) ||
      (/(opera)(?:.*version|)[ \/]([\w.]+)/).exec(ua) ||
      ua.indexOf('compatible') < 0 && (/(mozilla)(?:.*? rv:([\w.]+)|)/).exec(ua) || [];
    var b = {},
      o = {
        browser: match[1] || 'unknown',
        version: match[2] || '0'
      };
    b[o.browser] = true;
    b.version = o.version;
    return Object.freeze(b);
  }());
  //-----------------------------------
  /**
   * Determines if the entry parameter is a DOM Element
   *
   * @param  {Any} obj: the object to test
   * @return {Boolean}
   */
  function isDOM(obj) {
    if ('HTMLElement' in window) return !!(obj && obj instanceof HTMLElement);
    return !!(obj && typeof obj === 'object' && obj.nodeType === 1 && obj.nodeName);
  }
  //-----------------------------------
  // Determines if the @obj parameter is a function
  function isFunction(obj) {
    return typeof obj === 'function';
  }

  /**
   * Filters an array of objects with multiple criteria.
   *
   * @see https://gist.github.com/jherax/f11d669ba286f21b7a2dcff69621eb72
   *
   * @export
   * @param  {Array}  array: the array to filter
   * @param  {Object} filters: an object with the filter criteria as the property names
   * @return {Array}
   */
  function multiFilter(array, filters) {
    const filterKeys = Object.keys(filters);
    // filters all elements passing the criteria
    return array.filter(item =>
      // dynamically validate all filter criteria
      // eslint-disable-next-line
      filterKeys.every(key => !!~filters[key].indexOf(item[key]))
    );
  }

  //-----------------------------------
  // @private
  function _reducer(flat, cv) {
    return flat.concat(Array.isArray(cv) ? flatten(cv) : cv);
  }

  /**
   * Merges all inner arrays into one-level depth array.
   *
   * @see https://gist.github.com/jherax/7dce66c97ea06150e00c5a6febec26e7
   *
   * @export
   * @param  {Array} array: the array to be flattened
   * @return {Array}
   */
  function flatten(array) {
    return array.reduce(_reducer, []);
  }

  /**
   * Sums all the values in an array by reducing it.
   *
   * @see https://gist.github.com/jherax/a9846d44b62b64d7a182d6d6ec9de526
   *
   * @export
   * @param  {Array} array: the collection to iterate.
   * @param  {String | Number} prop: (optional) property name or array index.
   * @return {Number}
   */
  function sumValues(array, prop) {
    if (!array || !array.length) return 0;
    if ((/string|number/).test(typeof prop)) {
      return array.reduce((total, cv) => total + (+cv[prop]), 0);
    }
    return array.reduce((total, cv) => total + (+cv), 0);
  }

  //-----------------------------------
  // Determines whether the @dom parameter is a text or checkable <input>
  // http://www.quackit.com/html_5/tags/html_input_tag.cfm
  // http://github.com/jherax/js-utils#inputtypeistext
  var inputType = (function() {
    var TEXTAREA = /textarea/i,
      TEXT = /text|password|file|number|search|tel|url|email|datetime|datetime-local|date|time|month|week/i,
      RADIO = /checkbox|radio/i,
      INPUT = /input/i;
    return {
      isText: function(dom) {
        if (!isDOM(dom)) return false;
        if (TEXTAREA.test(dom.nodeName)) return true;
        return TEXT.test(dom.type) && INPUT.test(dom.nodeName);
      },
      isCheck: function(dom) {
        if (!isDOM(dom)) return false;
        return RADIO.test(dom.type) && INPUT.test(dom.nodeName);
      }
    };
  }());

  /**
   * Determines whether an event listener (defined by @eventName + @namespace) was bound to a DOM element.
   *
   * @see  https://gist.github.com/jherax/22f3f1b696943af63fbd
   *
   * @param  {DOMElement} dom: element to which search for a namespaced-event listener.
   * @param  {String} eventName: the name of the event to search for.
   * @param  {String} namespace: the namespace in which the event was registered.
   * @return {Boolean}
   */
  function handlerExist(dom, eventName, namespace) {
    let listener;
    let listeners = $._data(dom, 'events');
    if (listeners) listeners = listeners[eventName];
    for (let i in listeners) {
      listener = listeners[i];
      if (namespace === (listener.namespace || (listener.data && listener.data.handler))) {
        return true;
      }
    }
    return false;
  }
  //-----------------------------------
  // @private
  var SPACES_TABS = /\s+|\t+/g;

  // Builds the event name, by appending "." + @namespace at the end of @eventName
  function nsEvents(eventName, namespace) {
    namespace = '.' + namespace;
    eventName = eventName.trim().replace('.', '') + namespace;
    return eventName.replace(SPACES_TABS, namespace + ' ');
  }
  //-----------------------------------
  // @private
  const ESCAPE_CHARS = /[.*+?=!:${}()\|\-\^\[\]\/\\]/g;

  /**
   * Escapes the special characters in the entry parameter, so that
   * it can be used as a pattern in a regular expression constructor.
   *
   * @param  {String} text: pattern to escape special characters
   * @return {String | Null}
   */
  function escapeRegExp(text) {
    if (typeof text !== 'string') return null;
    return text.replace(ESCAPE_CHARS, '\\$&');
  }
  //-----------------------------------
  // Dynamically adds a script.
  // This method is useful to insert JavaScript code from an external file.
  function addScript(path) {
    var o = $.extend({
      src: null,
      async: true,
      createTag: false,
      charset: null,
      onload: null,
      before: null
    }, $.isPlainObject(path) ? path : { src: path });
    if (!o.src) throw new CustomError('The url of file is required');
    //creates the <script> element
    if (o.createTag === true) {
      var tags, tagsLength, i,
        file = document.createElement('script'),
        before = escapeRegExp(o.before);
      file.type = 'text/javascript';
      file.src = o.src;
      if (o.charset) file.charset = o.charset;
      if (isFunction(o.onload)) file.onload = o.onload;
      tags = document.getElementsByTagName('script');
      if (!before) return !!$(tags).last().before(file);
      before = new RegExp(before);
      for (i = 0, tagsLength = tags.length; i < tagsLength; i += 1) {
        if (before.test(tags[i].src)) {
          tags[i].parentNode.insertBefore(file, tags[i]);
          break;
        }
      }
      return file;
    }
    //returns jqXHR object
    return $.ajax({
      url: o.src,
      async: o.async,
      dataType: 'script'
    }).done(function(script) {
      if (isFunction(o.onload)) o.onload();
    }).fail(function(jqXHR, result) {
      console.log('addScript:', jqXHR);
      throw new CustomError(result);
    });
  }
  //-----------------------------------
  // Dynamically adds an external stylesheet file (CSS).
  // This method is useful to inject a css file to the document.
  function addCSS(path, before) {
    if (!path) throw new CustomError('The url of file is required');
    before = escapeRegExp(before);
    var tags, tagsLength, i,
      file = document.createElement('link');
    file.rel = 'stylesheet';
    file.type = 'text/css';
    file.href = path;
    if (!before) {
      tags = document.getElementsByTagName('head');
      tags && tags[0].appendChild(file);
      return file;
    }
    before = new RegExp(before);
    tags = document.getElementsByTagName('link');
    for (i = 0, tagsLength = tags.length; i < tagsLength; i += 1) {
      if (before.test(tags[i].href)) {
        tags[i].parentNode.insertBefore(file, tags[i]);
        break;
      }
    }
    return file;
  }
  //-----------------------------------
  /**
   * @private
   */
  const TYPES = {
    _true: /true/i,
    _false: /false/i,
    _null: /null/i,
    _undefined: /undefined/i,
    _object: /^[{[].*[}\]]$/,
    _number: /^[0-9]+$/,
  };

  /**
   * @private
   */
  const URL_PARAM = /(.+)=([^&]+)/;

  /**
   * Parses the input value to the correct data type
   *
   * @private
   * @param  {Any} value: value to test its type
   * @return {Any}
   */
  function parseType(value) {
    if (TYPES._true.test(value)) return true;
    if (TYPES._false.test(value)) return false;
    if (TYPES._null.test(value)) return null;
    if (TYPES._undefined.test(value)) return undefined;
    if (TYPES._number.test(value)) return +value;
    if (TYPES._object.test(value)) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  }

  /**
   * Try to parse the text to a primitive value
   *
   * @private
   * @param  {String} text: string to parse
   * @return {String}
   */
  function getValue(text) {
    let value = parseType(decodeURIComponent(text));
    // prevents a string such as "00" be converted to number 0
    if (typeof value === 'number' && String(value).length !== text.length) {
      value = text;
    }
    return value;
  }

  /**
   * Gets values from the url search and store them as an object.
   *
   * @see https://gist.github.com/jherax/e6ecb05aa35eb0219525
   *
   * @export
   * @param  {String} url: (optional) url from where extract the search parameters
   * @param  {String} key: (optional) specific parameter in the url-search to extract
   * @return {Object}
   */
  function urlParamsToObject(url = window.location.search, key) {
    let m;
    const paramsObj = {};
    url.split(/[?&#]/g).forEach((param) => { // eslint-disable-line
      m = param.match(URL_PARAM);
      if (!param || !m) return true; // continue
      if (!key || key === m[1]) {
        paramsObj[m[1].trim()] = getValue(m[2]);
      }
    });
    return paramsObj;
  }

  /**
   * Gets the value of a specific key from the url search.
   *
   * @see https://gist.github.com/jherax/e6ecb05aa35eb0219525
   *
   * @export
   * @param  {String} url: (optional) url from where extract the search parameters
   * @param  {String} key: specific parameter in the url-search to extract
   * @return {Primitive}
   */
  function urlParameter(...args) {
    let url = window.location.search,
      key = args[0],
      value = '';
    if (args.length > 1) {
      [url, key] = args;
    }
    if (!key) return '';
    const m = url.match(new RegExp(`[?&](${key})=([^&#]+)`));
    if (m) value = getValue(m[2]);
    return value;
  }

  /**
   * Creates a deep copy of an object.
   * https://gist.github.com/jherax/05204bdf9eb47eeffdc8
   *
   * @param  {Any} from: Source object to clone
   * @param  {Object} dest: (Optional) destination object to merge with
   * @return {Any} The cloned object
   */
  var clone = (() => {
    const constructors = [Date, RegExp, Function, String, Number, Boolean];
    ['Map', 'Set'].forEach((c) => {
      if (c in window) constructors.push(window[c]);
    });

    function compare(obj) {
      return obj === this;
    }

    function cloner(source, dest, cache) {
      let prop;
      // determines whether @source is a primitive value or a function
      if (source == null || typeof source !== 'object') return source;
      // checks if @source refers to an object created previously
      if (_toString.call(source) === '[object Object]') {
        if (cache.find(compare, source)) return source;
        // keeps reference to created objects
        cache.push(source);
      }

      // determines whether @source is an instance of any of the constructors
      if (~constructors.indexOf(source.constructor)) return new source.constructor(source);
      if (source.constructor !== Object && source.constructor !== Array) return source;
      // creates a new object and recursively iterates over its properties
      dest = dest || new source.constructor();
      for (prop in source) {
        // merges @source into @dest
        dest[prop] = cloner(source[prop], dest[prop], cache);
      }
      return dest;
    }

    return (source, dest) => {
      const cache = [];
      return cloner(source, dest, cache);
    };
  })();
  //-----------------------------------
  // Gets the selected text in the document and inside the text boxes.
  function getSelectedText() {
    var selection,
      dom = document.activeElement,
      sel = { text: '', slice: '', start: -1, end: -1 },
      _getSelection = window.getSelection || document.getSelection;
    if (_getSelection) {
      // Get selected text from an input field
      if (inputType.isText(dom)) {
        selection = _fixSelection(dom);
        sel.start = selection.start;
        sel.end = selection.end;
        if (sel.end > sel.start) {
          sel.text = dom.value.substring(sel.start, sel.end);
          sel.slice = dom.value.slice(0, sel.start) + dom.value.slice(sel.end);
        }
      }
      // Gets the selected text in the document
      else sel.text = _getSelection().toString();
    } else {
      selection = document.selection;
      if (selection && selection.type !== 'Control')
        sel.text = selection.createRange().text;
    }
    if (sel.text !== '') sel.text = sel.text.trim();
    return sel;
  }
  //-----------------------------------
  // Gets the current position of the cursor in the @dom element
  function getCaretPosition(dom) {
    var selection, sel;
    if ('selectionStart' in dom) {
      return _fixSelection(dom).start;
    } else { // IE below version 9
      selection = document.selection;
      if (selection) {
        sel = selection.createRange();
        sel.moveStart('character', -dom.value.length);
        return sel.text.length;
      }
    }
    return -1;
  }
  //-----------------------------------
  // Sets the @position of the cursor in the @dom element
  function setCaretPosition(dom, pos) {
    var _createTextRange, range;
    pos = +pos || 0;
    if ('selectionStart' in dom) {
      _fixSelection(dom, function(dom) {
        dom.setSelectionRange(pos, pos);
      });
    } else { // IE below version 9
      _createTextRange = dom.createTextRange;
      if (_createTextRange) {
        range = _createTextRange();
        if (!range) return;
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    }
  }
  //-----------------------------------
  // Applies a transformation to the text,
  // also it removes all consecutive spaces
  var capitalize = (function() {
    const TEXTAREA = /textarea/i,
      LINEBREAK = /\r|\n/g,
      PARAGRAPH = /^[¶\s]+|[¶\s]+$/g,
      SECTION = /\s*¶+\s*/g,
      SPACES = /\s{2,}/g,
      WORD = /(?:^|-|:|;|\s|\.|\(|\/)[a-záéíóúüñ]/g,
      FIRST = /^\w/;

    const matchToUpper = (m) => m.toUpperCase();
    const matchToLower = (m) => m.toLowerCase();

    return function(obj, type) {
      var isInput = inputType.isText(obj),
        text = isInput ? obj.value : obj && obj.toString();
      if (!text || !text.length) return '';
      if (TEXTAREA.test(obj.nodeName)) {
        text = text.replace(LINEBREAK, '¶').replace(SPACES, ' ');
        while (PARAGRAPH.test(text)) text = text.replace(PARAGRAPH, '');
        text = text.replace(SECTION, '\n');
      } else {
        text = text.replace(SPACES, ' ').trim();
      }
      switch (type) {
        case 'word':
          text = text.toLowerCase().replace(WORD, matchToUpper);
          text = (_language.wordPattern instanceof RegExp ?
            text.replace(_language.wordPattern, matchToLower) : text);
          break;
        case 'title':
          text = text.replace(WORD, matchToUpper);
          break;
        case 'first':
          text = text.replace(FIRST, matchToUpper);
          break;
        case 'upper':
          text = text.toUpperCase();
          break;
        case 'lower':
          text = text.toLowerCase();
          break;
      }
      if (isInput) obj.value = text;
      return text;
    };
  }());
  //-----------------------------------
  // @private
  var _DIGIT_THOUSANDS = (/\B(?=(\d{3})+(?!\d))/g);

  // Sets the numeric format according to current culture.
  // Places the decimal and thousand separators specified in _language
  function numericFormat(obj, o) {
    o = $.extend({
      inDecimalMark: _language.decimalMark,
      inThousandsMark: _language.thousandsMark,
      outDecimalMark: _language.decimalMark,
      outThousandsMark: _language.thousandsMark
    }, o);
    var isInput = inputType.isText(obj),
      text = isInput ? obj.value : obj && obj.toString();
    if (!text || !text.length) return '';
    var thousands = new RegExp(escapeRegExp(o.inThousandsMark), 'g'),
      number = text.replace(thousands, '').split(o.inDecimalMark) || [''],
      integer = number[0].replace(_DIGIT_THOUSANDS, o.outThousandsMark),
      decimal = number.length > 1 ? o.outDecimalMark + number[1] : '';
    text = integer + decimal;
    if (isInput) obj.value = text;
    return text;
  }
  //-----------------------------------
  // Validates the text format, depending on the type supplied.
  // Date validations are run according to regional setting.
  var isValidFormat = (function() {
    var _DATETIME = /[dMyHhms]+/g;

    function _dtFormatter(format) {
      return ('^' +
        escapeRegExp(format).replace(_DATETIME, function(match) {
          switch (match) {
            case 'yyyy':
              return '([1-2][0,9][0-9][0-9])';
            case 'MM':
              return '((0[1-9])|(1[0-2]))';
            case 'dd':
              return '((0[1-9])|([1-2][0-9])|(3[0-1]))';
            case 'HH':
              return '([0-1][0-9]|[2][0-3])';
            case 'hh':
              return '([0][0-9]|[1][0-2])';
            case 'mm':
              return '([0-5][0-9])';
            case 'ss':
              return '([0-5][0-9])';
          }
        }) + '$');
    }

    function _validate(obj, pattern) {
      obj = inputType.isText(obj) ? obj.value : obj.toString();
      return pattern.test(obj);
    }
    //built-in validators
    var _PATTERNS = {
      //Validates the date format according to regional setting
      date: new RegExp(_dtFormatter(_language.dateFormat)),
      //Validates the time format: HH:mm:ss
      time: (/^([0-1][0-9]|[2][0-3]):([0-5][0-9])(?::([0-5][0-9])){0,1}$/),
      //Validates the date-time format according to regional setting
      datetime: new RegExp(_dtFormatter(_language.dateFormat + ' ' + _language.timeFormat)),
      email: (/^([0-9a-zñÑ](?:[\-.\w]*[0-9a-zñÑ])*@(?:[0-9a-zñÑ][\-\wñÑ]*[0-9a-zñÑ]\.)+[a-z]{2,9})$/i),
      url: (/((?:http|ftp|https):\/\/[\w\-_]+(?:\.[\w\-_]+)+(?:[\w\-\.,@?\^=%&:\/~\+#]*[\w\-\@?\^=%&\/~\+#])?)/gi),
      ipv4: (/^(?:(?:25[0-5]|2[0-4]\d|[01]\d\d|\d{1,2})\.){3}(?:25[0-5]|2[0-4]\d|[01]\d\d|\d{1,2})$/),
      //Validates the password strength (must have 8+ characters, 1+ number, 1+ uppercase)
      password: (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
      //Validates latitudes range from -90 to 90
      latitude: (/^-?([1-8]?[1-9]|[1-9]0|0),{1}\d{1,6}$/),
      //Validates longitudes range from -180 to 180
      longitude: (/^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9]),{1}\d{1,6}$/)
    };
    var validator = {};
    Object.keys(_PATTERNS).forEach(function(key) {
      validator[key] = function(text, pattern) {
        return _validate(text, pattern || _PATTERNS[key]);
      }
    });
    //Set properties as not writable
    _setPropertiesNotWritable(validator);
    Object.defineProperty(validator, 'set', jherax.setDescriptor(
      function(property, value) {
        if (!isFunction(value)) return;
        _setValueNotWritable(this, property, value, true);
      }
    ));
    return validator;
  }());
  //-----------------------------------
  // @private
  const _YMD = (/[yMd]+/gi);
  var _Y = (/y+/);
  var _M = (/M+/);
  var _D = (/d+/);

  // Evaluates whether the @dom element contains a value with a date.
  // The result of the validation is written to @o.response
  var isValidDate = (function() {
    function _parser(date, e) {
      var type, i;
      if (date instanceof Date) return date;
      if (typeof date !== 'string') {
        if (+date) { return new Date(+date); }
        return new Date();
      }
      type = date.length > 10 ? 'datetime' : 'date';
      e.error = (e.error || !isValidFormat[type](date));
      if (e.error) { return new Date(); }
      var date = 'y/M/d',
        dateParts = date.split(/\D/),
        formatParts = _language.dateFormat.split(/[^yMd]/);
      for (i in formatParts) {
        if (_Y.test(formatParts[i])) { date = date.replace('y', dateParts[i]); continue }
        if (_M.test(formatParts[i])) { date = date.replace('M', dateParts[i]); continue }
        if (_D.test(formatParts[i])) { date = date.replace('d', dateParts[i]); continue }
      }
      dateParts.splice(0, 3);
      return new Date(date + ' ' + dateParts.join(':'));
    }
    return function(obj, o) {
      var isInput = inputType.isText(obj),
        text = isInput ? obj.value : obj && obj.toString();
      o = $.extend({
        isFuture: false,
        compareTo: new Date(),
        response: null
      }, o);
      var e = { error: false };
      var dif = (_parser(text, e) - _parser(o.compareTo, e)) / 1000 / 3600 / 24;
      if (e.error) { o.response = _language.dateFormatError; return false; }
      if (o.isFuture && dif < 0) { o.response = _language.dateIsLesser; return false; }
      if (!o.isFuture && dif > 0) { o.response = _language.dateIsGreater; return false; }
      return true;
    };
  }());

  /**
   * @private
   */
  const defaults = {
    formatDate: {
      date: null,
      inputFormat: 'yyyy/MM/dd',
      outputFormat: 'MM/dd/yyyy',
    },
  };

  /**
   * Changes the format of a string-date.
   *
   * @see https://gist.github.com/jherax/e58ee9f560764a72a90ded5fc53e4105
   *
   * @export
   * @param  {Object | String} options: it can be a String with the date, or an Object with the following properties:
   *         - {String} date: the entry date to change the format
   *         - {String} inputFormat: the format of the entry date
   *         - {String} outputFormat: the format of the output date
   * @return {String}
   */
  function formatDate(options) {
    let d, m, y; // eslint-disable-line
    if (typeof options === 'string') {
      options = {date: options};
    }
    const opt = Object.assign({}, defaults.formatDate, options);
    const dateParts = opt.date.split(/\D/);
    const formatParts = opt.inputFormat.split(/\W/);
    for (let i = 0; i < formatParts.length; i += 1) {
      if (_Y.test(formatParts[i])) { y = dateParts[i]; continue; }
      if (_M.test(formatParts[i])) { m = dateParts[i]; continue; }
      if (_D.test(formatParts[i])) { d = dateParts[i]; continue; }
    }
    return opt.outputFormat.replace(_YMD, (match) => { // eslint-disable-line
      if (_Y.test(match)) return y;
      if (_M.test(match)) return m;
      if (_D.test(match)) return d;
    });
  }

  //-----------------------------------
  // Displays the date according to the format specified by .dateFormat and .timeFormat in jsu.regional
  // The supported formats for ISO 8601 are: [YYYY-MM-DD] and [YYYY-MM-DDThh:mm]
  var dateToString = (function() {
    var _TYPE = (/\[object\s(?:String|Number|Date)\]/),
      _MSDATE = (/Date/),
      _DATE = (/[dMy]+/g),
      _HOUR = (/[Hhms]+/g);

    function _fillZero(n) { return ('0' + n).slice(-2); }

    function fnDate(o) {
      return (o.ISO8601 ? 'yyyy-MM-dd' : _language.dateFormat).replace(_DATE, function(match) {
        switch (match) {
          case 'dd':
            return _fillZero(o.date.getDate());
          case 'MM':
            return _fillZero(o.date.getMonth() + 1);
          case 'yyyy':
            return o.date.getFullYear();
        }
      });
    }

    function fnTime(o) {
      return (o.ISO8601 ? 'HH:mm' : _language.timeFormat).replace(_HOUR, function(match) {
        var h = o.date.getHours();
        switch (match) {
          case 'HH':
            return _fillZero(o.date.getHours());
          case 'hh':
            return _fillZero(h === 12 ? 12 : h % 12);
          case 'mm':
            return _fillZero(o.date.getMinutes());
          case 'ss':
            return _fillZero(o.date.getSeconds());
        }
      });
    }

    function fnDateTime(o) {
      return fnDate(o) + (o.ISO8601 ? 'T' : ' ') + fnTime(o);
    }
    // Return Module
    return function(o) {
      if (_TYPE.test(_toString.call(o))) o = { date: o };
      o = $.extend({ date: new Date(), ISO8601: false }, o);
      if (typeof o.date === 'string' && _MSDATE.test(o.date)) {
        o.date = +o.date.replace(/\D+/g, '');
      }
      if (o.date instanceof Date === false) {
        o.date = new Date(o.date);
      }
      if (!o.date.valueOf()) {
        //invalid date
        return null;
      }
      // Public API
      return {
        date: fnDate(o),
        time: fnTime(o),
        dateTime: fnDateTime(o)
      };
    };
  }());
  //-----------------------------------
  // @private
  var _ISO_8601 = /(?:(\d{4})-(\d{2})-(\d{2}))(?:T(?:(\d{2})(?:\:(\d{2}))?(?:\:(\d{2}))?)?(?:([+\-]\d{2})(?:\:?(\d{2}))?)?)?/;

  // Gets the Date object from a string that meets the ISO 8601 format
  function dateFromISO8601(date) {
    if (typeof date !== 'string') { throw new CustomError('Date format must be ISO 8601 » {0}', date); }
    var r = date.match(_ISO_8601);
    if (!r) { throw new CustomError('Date format must be ISO 8601 » {0}', date); }
    var gmt = new Date(),
      th = +r[7] || (gmt.getTimezoneOffset() / -60), //normalize the hours offset
      tm = +r[8] || (gmt.getTimezoneOffset() % -60), //normalize the minutes offset
      M = r[2] - 1,
      h = r[4] || 0,
      m = r[5] || 0,
      s = r[6] || 0,
      ms;
    if (th < 0 && tm > 0) { tm = -tm; } //fixes minutes offset
    ms = -60000 * (th * 60 + tm); //corrects the time offset
    gmt = new Date(Date.UTC(r[1], M, r[3], h, m, s) + ms);
    return new Date(gmt);
  }
  //-----------------------------------
  // Delegates the blur event to removing the tooltips
  $(document).off('blur.jsu-tooltip').on(nsEvents('blur', 'jsu-tooltip'), '[data-role=tooltip]', function() {
    $('.vld-tooltip').remove();
  });
  //-----------------------------------
  // Displays a tooltip next to the @dom element
  function showTooltip(dom, msg, pos) {
    dom = $(dom);
    pos = $.extend({
      at: 'right center',
      my: 'left+6 center',
      collision: 'flipfit'
    }, jherax.config.position, pos);
    dom.attr('data-role', 'tooltip').trigger(nsEvents('blur', 'tooltip'));
    if (dom.focus) dom.focus(); //sets focus before showing the tooltip
    var vld = $('<span class="vld-tooltip">').html(msg);
    vld.appendTo(jherax.wrapper).position({
      of: dom,
      at: pos.at,
      my: pos.my,
      collision: pos.collision
    }).hide().fadeIn(400);
    return false;
  }
  //-----------------------------------
  // Shows the overlay screen with the loading animation
  function showLoading(o) {
    if (o === false)
      o = { hide: true };
    var d = $.extend({
      hide: false,
      delay: 1800,
      async: true,
      of: null
    }, o);
    $('#floatingBarsG,#backBarsG').stop().remove();
    if (d.hide === true) return true;
    var target = $(d.of || 'body'),
      blockG = [],
      i, loading, overlay;
    for (i = 1; i < 9; i += 1) blockG.push('<div class="blockG"></div>');
    loading = $('<div id="floatingBarsG">').append(blockG.join(''));
    overlay = $('<div id="backBarsG" class="bg-fixed bg-opacity">');
    if (d.of) {
      overlay.css({
        'border-radius': $(d.of).css('border-radius'),
        'position': 'absolute',
        'top': target.position().top,
        'left': target.position().left,
        'height': target.outerHeight(),
        'width': target.outerWidth()
      });
    }
    overlay.add(loading).appendTo(target);
    if (d.async === true) overlay.hide().fadeIn(d.delay);
    else overlay.show();
    loading.center({ of: d.of });
    return true;
  }
  //-----------------------------------
  // @private
  var _$DIV = $('<div>');

  // Encodes a string, by converting special characters like <, >, &... to its corresponding HTML entity.
  // This method also can be used as a delegate for the jQuery methods: $.val() and $.text()
  function getHtmlText(i, value) {
    if (!value && typeof i === 'string') value = i;
    var html = _$DIV.text(value).html();
    return $.trim(html);
  }
  //-----------------------------------
  // Detects the width of the scrollbar
  function getScrollbarWidth() {
    var outer = $('<div>').css({ visibility: 'hidden', width: 100, overflow: 'scroll' }).appendTo('body'),
      barWidth = $('<div>').css('width', '100%').appendTo(outer).outerWidth();
    outer.remove();
    return 100 - barWidth;
  }
  //-----------------------------------
  // Updates the HTML5 browser cache
  function updateCache() {
    if (handlerExist(window, 'load', 'jsu-updateCache')) return;
    $(window).on(nsEvents('load', 'jsu-updateCache'), function(event) {
      var appCache = window.applicationCache;
      $(appCache).on(nsEvents('updateready', 'jsu-updateCache'), function(e) {
        if (appCache.status == appCache.UPDATEREADY) {
          //the browser downloads a new version of the cache manifest,
          //and must reload the page in order to access to the new resources
          appCache.swapCache();
          window.location.reload(true);
        }
      });
    });
  }

  //===================================
  /* JQUERY EXTENSIONS */
  //===================================

  // Reverses the array of matched elements
  $.fn.reverse = Array.prototype.reverse;
  //-----------------------------------
  // Detects if an element is before or after another element
  $.fn.isAfter = function(sel) {
    return this.prevAll().filter(sel).length !== 0;
  };
  $.fn.isBefore = function(sel) {
    return this.nextAll().filter(sel).length !== 0;
  };
  //-----------------------------------
  // Detects if the element has vertical scrollbar
  $.fn.hasVScroll = function() {
    if (!this.length) return false;
    return this.get(0).scrollHeight > this.get(0).clientHeight;
  };
  //-----------------------------------
  // Detects if the element has horizontal scrollbar
  $.fn.hasHScroll = function() {
    if (!this.length) return false;
    return this.get(0).scrollWidth > this.get(0).clientWidth;
  };
  //-----------------------------------
  // Position an element relative to another element
  (function() {
    // http://api.jqueryui.com/position/
    if (jQuery.ui && jQuery.ui.position) return;
    var _position,
      _HORIZONTAL = /left|center|right/,
      _VERTICAL = /top|center|bottom/,
      _OFFSET = /([a-z]+)([+\-]\d+)?\s?([a-z]+)?([+\-]\d+)?/; //brings 4 groups: (horizontal)(offset) (vertical)(offset)
    //normalizes "horizontal vertical" alignment
    function _setAlignment(pos) {
      pos = $.trim(pos);
      var horizontal = _HORIZONTAL.test(pos),
        vertical = _VERTICAL.test(pos);
      if (!horizontal && !vertical)
        return 'center center';
      if (!(/\s/).test(pos)) {
        if (!horizontal) return 'center ' + pos;
        if (!vertical) return pos + ' center';
      }
      return (pos === 'center' ? 'center center' : pos);
    }
    //sets the coordinates relative to target element
    function _getAtPosition(target, atOffset) {
      var left = 0,
        top = 0,
        targetOffset = target.offset(),
        targetWidth = target.outerWidth(),
        targetHeight = target.outerHeight();
      switch (atOffset[1]) {
        case 'left':
          left = targetOffset.left + (+atOffset[2] || 0);
          break;
        case 'center':
          left = targetOffset.left + (+atOffset[2] || 0) + (targetWidth / 2);
          break;
        case 'right':
          left = targetOffset.left + (+atOffset[2] || 0) + (targetWidth);
          break;
      }
      switch (atOffset[3]) {
        case 'top':
          top = targetOffset.top + (+atOffset[4] || 0);
          break;
        case 'center':
          top = targetOffset.top + (+atOffset[4] || 0) + (targetHeight / 2);
          break;
        case 'bottom':
          top = targetOffset.top + (+atOffset[4] || 0) + (targetHeight);
          break;
      }
      return { 'left': left, 'top': top };
    }
    //sets the coordinates according to current @element
    function _getMyPosition(element, myOffset) {
      var left = 0,
        top = 0,
        elementWidth = element.outerWidth(),
        elementHeight = element.outerHeight();
      switch (myOffset[1]) {
        case 'left':
          left = (+myOffset[2] || 0);
          break;
        case 'center':
          left = -(-(+myOffset[2] || 0) + (elementWidth / 2));
          break;
        case 'right':
          left = -(-(+myOffset[2] || 0) + (elementWidth));
          break;
      }
      switch (myOffset[3]) {
        case 'top':
          top = (+myOffset[4] || 0);
          break;
        case 'center':
          top = -(-(+myOffset[4] || 0) + (elementHeight / 2));
          break;
        case 'bottom':
          top = -(-(+myOffset[4] || 0) + (elementHeight));
          break;
      }
      return { 'left': left, 'top': top };
    }
    //monkey-patching
    _position = $.fn.position;
    $.fn.position = function(o) {
      if (!o || !o.of) return _position.apply(this, arguments);
      o = $.extend({
        of: null,
        at: 'center center',
        my: 'center center'
      }, o);
      o.at = _setAlignment(o.at);
      o.my = _setAlignment(o.my);
      //gets the target dimensions
      var target = $(o.of).first();
      if (target.length === 0) return this;
      var atOffset = (o.at).match(_OFFSET),
        myOffset = (o.my).match(_OFFSET);
      //sets the coordinates relative to target element
      var atPosition = _getAtPosition(target, atOffset);
      //positioning each element
      return this.each(function(i, dom) {
        var element = $(dom).css({ 'position': 'absolute', 'margin': 0 }),
          //sets the coordinates according to current @element
          myPosition = _getMyPosition(element, myOffset);
        element.offset({
          top: atPosition.top + myPosition.top,
          left: atPosition.left + myPosition.left
        });
      });
    };
  })();
  //-----------------------------------
  // Centers an element relative to another.
  // https://gist.github.com/jherax/ad41f92597e6d95bdee1
  // https://jsfiddle.net/apaul34208/e4y6F (css:calc)
  $.fn.center = function(o) {
    o = $.extend({}, o);
    if (o.of) {
      return this.position({
        my: 'center',
        at: 'center',
        of: o.of
      });
    } else {
      return this.each(function(i, dom) {
        var elem = $(dom);
        elem.css({
          'position': 'fixed',
          'left': '50%',
          'top': '50%',
          'margin-left': -elem.outerWidth() / 2 + 'px',
          'margin-top': -elem.outerHeight() / 2 + 'px'
        });
      });
    }
  };
  //-----------------------------------
  // TODO: Refactor all jQuery plugins and split to another file
  // Limits the max length in the input:text
  $.fn.maxLength = function(length, o) {
    if (!length) throw new CustomError('The length must be greater than 0');
    o = $.extend({
      at: 'right bottom',
      my: 'right top+6',
      collision: 'flipfit'
    }, jherax.config.position, o);
    return this.each(function(i, dom) {
      var count = 'Max: ' + length;
      if (!inputType.isText(dom)) return true; //continue
      dom.maxLength = length;
      $(dom).attr('data-role', 'tooltip')
        .off('.jsu-maxLength')
        .on(nsEvents('keypress input paste', 'jsu-maxLength'), function(e) {
          var len = dom.value.length,
            max = len >= length ? 1 : 0;
          if (browser.mozilla) max = (!e.keyCode && max);
          if (max) {
            len = length;
            dom.value = dom.value.substr(0, len);
            e.preventDefault();
          }
          var id = 'maxLength' + dom.id;
          count = 'Max: ' + len + '/' + length;
          if (!$('#' + id).text(count).length) {
            $('<span class="vld-tooltip" id="' + id + '">')
              .text(count).appendTo(jherax.wrapper).position({
                of: dom,
                at: o.at,
                my: o.my,
                collision: o.collision
              }).hide().fadeIn(400);
          }
        });
    });
  };
  //-----------------------------------
  // Apply the capitalized format to text when the blur event is raised
  $.fn.capitalize = function(type) {
    return this.each(function(i, dom) {
      $(dom).off('.jsu-capitalize').on(nsEvents('blur', 'jsu-capitalize'), function() {
        capitalize(this, type);
      });
    });
  };
  //-----------------------------------
  // Displays a tooltip next to the current element
  $.fn.showTooltip = function(msg, pos) {
    return this.each(function(i, dom) {
      showTooltip(dom, msg, pos);
    });
  };
  //-----------------------------------
  // Validates the format of the first element, depending on the type supplied.
  // Date validations are run according to regional setting
  $.fn.isValidFormat = function(type) {
    if (!this.length) return false;
    if (!isValidFormat[type]) {
      throw new CustomError('Property isValidFormat.{0} does not exist', type);
    }
    return isValidFormat[type](this.get(0));
  };
  //-----------------------------------
  // Evaluates whether the current element contains a value with a date.
  // The result of the validation will be shown in a tooltip
  $.fn.isValidDate = function(o) {
    if (!this.length) return false;
    return isValidDate(this.get(0), o);
  };
  //-----------------------------------
  // Sets the numeric format according to current culture.
  // Places the decimal and thousand separators specified in _language
  $.fn.numericFormat = function(o) {
    return this.each(function(i, dom) {
      $(dom).off('.jsu-numericFormat').on(nsEvents('keyup blur', 'jsu-numericFormat'), function() {
        numericFormat(this, o);
      });
    });
  };
  //-----------------------------------
  // The matched elements accept only numeric characters
  $.fn.numericInput = function() {
    return this.each(function(i, dom) {
      var len = dom.maxLength;
      dom.maxLength = 524000; //firefox fix
      if (len < 1) { len = 524000; } //chrome fix
      $(dom).off('.jsu-numericInput')
        .on(nsEvents('focus blur input paste', 'jsu-numericInput'), { max: len }, function(e) {
          var pos = e.type !== 'blur' ? getCaretPosition(e.target) : 0,
            text = e.target.value,
            selected, digits;
          if (e.type === 'paste') {
            selected = getSelectedText();
            if (selected.text !== '') {
              text = selected.slice;
            }
          }
          digits = text.match(/\d/g);
          text = !digits ? '' : digits.join('').substr(0, e.data.max);
          if (e.type === 'blur' && parseFloat(text) === 0) { text = '0'; }
          pos = Math.max(pos - (e.target.value.length - text.length), 0);
          e.target.value = text;
          e.target.maxLength = e.data.max;
          if (e.type !== 'blur') {
            setCaretPosition(e.target, pos);
          }
        })
        .on(nsEvents('keydown', 'jsu-numericInput'), function(e) {
          var key = (e.which || e.keyCode),
            ctrl = !!(e.ctrlKey || e.metaKey);
          // Allow: (numbers), (keypad numbers),
          // Allow: (backspace, tab, delete), (home, end, arrows)
          // Allow: (Ctrl+A), (Ctrl+C), (Ctrl+V), (Ctrl+X)
          return ((key >= 48 && key <= 57) || (key >= 96 && key <= 105) ||
            (key == 8 || key == 9 || key == 46) || (key >= 35 && key <= 40) ||
            (ctrl && key == 65) || (ctrl && key == 67) ||
            (ctrl && key == 86) || (ctrl && key == 88));
        });
    });
  };
  //-----------------------------------
  // Sets a mask of allowed characters for the matched elements
  $.fn.customInput = function(mask) {
    mask = mask instanceof RegExp ? mask : escapeRegExp(mask);
    if (!mask) { throw new CustomError('Mask must be RegExp or string'); }
    if (typeof mask === 'string') { mask = '[' + mask + ']'; }
    return this.each(function(i, dom) {
      var len = dom.maxLength;
      dom.maxLength = 524000; //firefox fix
      if (len < 1) { len = 524000; } //chrome fix
      $(dom).off('.jsu-customInput')
        .on(nsEvents('focus blur input paste', 'jsu-customInput'), { max: len }, function(e) {
          var pos = e.type !== 'blur' ? getCaretPosition(e.target) : 0,
            text = e.target.value,
            selected, pattern, matched;
          if (e.type === 'paste') {
            selected = getSelectedText();
            if (selected.text !== '') {
              text = selected.slice;
            }
          }
          pattern = new RegExp(mask.source || mask, 'gi');
          matched = text.match(pattern);
          text = !matched ? '' : matched.join('').substr(0, e.data.max);
          pos = Math.max(pos - (e.target.value.length - text.length), 0);
          e.target.value = text;
          e.target.maxLength = e.data.max;
          if (e.type !== 'blur') {
            setCaretPosition(e.target, pos);
          }
        })
        .on(nsEvents('keypress', 'jsu-customInput'), function(e) {
          var pattern = new RegExp(mask.source || mask, 'i'),
            key = (e.which || e.keyCode),
            vk = (key == 8 || key == 9 || key == 46 || (key >= 35 && key <= 40));
          return pattern.test(String.fromCharCode(key)) || vk;
        });
    });
  };
  //-----------------------------------
  // @private
  function _filterLength(n) { return (n && n.length) }

  // Prevents press specific keys for the matched elements
  $.fn.disableKey = function(keys) {
    if (!keys) { return this; }
    keys = keys.toString().split('');
    keys = keys.filter(_filterLength);
    return this.each(function() {
      $(this).off('.jsu-disableKey').on(nsEvents('keypress', 'jsu-disableKey'), function(e) {
        var key = (e.which || e.keyCode);
        key = String.fromCharCode(key);
        return keys.indexOf(key) === -1;
      });
    });
  };
  //-----------------------------------
  // Validates the elements marked or performs a custom validation
  (function() {
    // Creates the filters based on those properties defined in isValidFormat
    var _ALLFILTERS = $.map(isValidFormat, function(value, key) {
      return '.vld-' + key;
    }).join(',');
    // Shows a tooltip for the validation message
    function _fnTooltip(dom, event, messageType, pos) {
      var beforeTooltip,
        button = $(event.currentTarget),
        args = { 'target': dom, 'position': pos };

      //executes a function before displaying the tooltip,
      //useful to change the element to which the tooltip is attached
      beforeTooltip = button.data('nsEvent');
      if (beforeTooltip) button.trigger(beforeTooltip, [args]);

      //removes the validation message when the [blur] event is raised
      $(dom).attr('data-role', 'tooltip').trigger('blur.tooltip');
      if (args.target.focus) { args.target.focus(); }

      $('<span class="vld-tooltip">')
        .appendTo(jherax.wrapper)
        .html(messageType)
        .position({
          of: args.target,
          at: args.position.at,
          my: args.position.my,
          collision: args.position.collision
        }).hide().fadeIn(400);
    }
    // Sets the focus on the input elements inside the @container
    function _fnSetFocus(container, group) {
      var elements = $(container)
        .find('input:not([type=button]):not([type=submit]), textarea')
        .filter(':not(:disabled):not(.no-auto-focus)').get().reverse();
      $(elements).each(function() {
        if (inputType.isText(this) && this.getAttribute('data-group') === group) {
          $(this).focus();
        }
      });
    }
    // Determines whether first option in a select should be validated
    function _fnValidateFirstItem(dom, o) {
      if (dom.length === 0) { return true; }
      //treat the first item of the <select> element as an invalid option
      return (o.firstItemInvalid && dom.selectedIndex === 0);
    }
    // Attach a callback executed before displaying the tooltip,
    // useful to change the element to which show the tooltip against
    function _setOnBeforeTooltip($button, index, onBeforeTooltip) {
      if (isFunction(onBeforeTooltip)) {
        var event = nsEvents('beforeTooltip', 'jsu-easyValidate-' + index);
        $button.data('nsEvent', event);
        //TODO: Check if it works, previously delegated to document
        $button.off(event).on(event, { callback: onBeforeTooltip }, _onBeforeTooltip);
      }
    }
    // Execute a callback before displaying the tooltip
    function _onBeforeTooltip(e, args) {
      //args.target is the DOM element to which the "tooltip" is attached
      //args.position is the position of "tooltip" { at, my, collision }
      e.data.callback(args);
    }
    $.fn.easyValidate = function(o) {
      var position = $.extend({
          at: 'right center',
          my: 'left+6 center',
          collision: 'flipfit'
        }, jherax.config.position),
        d = $.extend({
          fnValidator: null,
          firstItemInvalid: false,
          container: jherax.wrapper,
          requiredForm: false,
          position: position,
          onBeforeTooltip: null
        }, o);
      // Returns the collection of matching elements
      return this.each(function(index, btn) {
        var handlers, $btn = $(btn);
        if (d.requiredForm && !$btn.closest('form').length) {
          showTooltip(btn, _language.validateForm);
          return true; //continue with next element
        }
        // Execute a callback before displaying the tooltip,
        _setOnBeforeTooltip($btn, index, d.onBeforeTooltip);
        // Each button validates the marked elements according to the specified rules
        $btn.off('.jsu-easyValidate').on(nsEvents('click', 'jsu-easyValidate'), { handler: 'easyValidate' }, function(event) {
          _fnSetFocus(d.container, btn.getAttribute('data-group'));
          $btn.focus().blur();
          $('.vld-tooltip').remove();
          var submit = true;

          // Validates each element according to specific rules
          $('.vld-required,' + _ALLFILTERS).each(function(i, input) {
            var type, checkbox,
              $input = $(input),
              tag = input.nodeName.toLowerCase();
            // Gets the html5 data- attribute; modern browsers admit: dom.dataset[attribute]
            if (btn.getAttribute('data-group') !== input.getAttribute('data-group')) return true; //continue
            if (inputType.isText(input)) { input.value = $.trim(input.value); }

            // Validates the elements marked with the css class "vld-required"
            // Looks for empty [input, select] elements, and those having the [value] attribute equal to "0"
            if ($input.hasClass('vld-required') && ((tag === 'select' && (_fnValidateFirstItem(input, d) || input.value === '0')) ||
                (inputType.isText(input) && !input.value.length) || (inputType.isCheck(input) && !input.checked) || tag === 'span')) {
              checkbox = input;
              // Awful asp.net radiobutton / checkbox
              if (tag === 'span' || inputType.isCheck(input)) {
                if (tag === 'input') { checkbox = $input; } else { checkbox = $input.find('input:first-child'); }
                if (checkbox.is(':checked') || $('[name="' + checkbox.attr('name') + '"]').filter(':checked').length) {
                  return true; //continue
                }
                if (tag === 'span') { checkbox.addClass('vld-required'); }
                checkbox = checkbox.get(0);
              }
              _fnTooltip(checkbox, event, _language.validateRequired, d.position);
              return (submit = false); //break
            } //end of "vld-required" elements

            if (!inputType.isText(input) || !input.value.length) return true; //continue
            // Validates the elements marked with specific formats like "vld-email"
            for (type in isValidFormat) {
              if ($input.hasClass('vld-' + type) && !isValidFormat[type](input)) {
                _fnTooltip(input, event, _language.validateFormat, d.position);
                return (submit = false); //break
              }
            } //end of specific format validation
          }); //end $.each field

          // Executes the callback function for the custom validation
          if (submit && isFunction(d.fnValidator) && !d.fnValidator(btn)) {
            submit = false;
          }
          _setValueNotWritable($.fn.easyValidate, 'canSubmit', submit);
          if (!submit) { event.stopImmediatePropagation(); }
          return submit;

        }); //end btn.click

        handlers = ($._data(btn, 'events') || {})['click'];
        // Move at the beginning the click.easyValidate handler
        handlers.unshift(handlers.pop());

      }); //end $.each
    }; //end easyValidate
  })();

  /**
   * Stores the current location of the set of matched elements taking into account its boundary/adjacent elements.
   * https://gist.github.com/jherax/ad41f92597e6d95bdee1
   *
   * @signature: $(selector).saveBoundaries(prefix)
   * @param  {String} prefix: the prefix to build the class name for the boundary elements.
   * @return {jQuery}
   */
  $.fn.saveBoundaries = function(prefix) {
    prefix = prefix ? prefix + '-' : '';
    return this.each(function(i, dom) {
      var $elem = $(dom),
        id = prefix + 'jqboundary' + i;
      $elem.data('jqboundary', id);
      $elem.parent().addClass(id + '-parent');
      $elem.prev().addClass(id + '-prev');
      $elem.next().addClass(id + '-next');
    });
  };

  /**
   * Restores the set of matched elements to its original location stored by $.saveBoundaries()
   * https://gist.github.com/jherax/ad41f92597e6d95bdee1
   *
   * @signature: $(selector).restoreBoundaries()
   * @return {jQuery}
   */
  $.fn.restoreBoundaries = function() {
    return this.each(function(i, dom) {
      var $elem = $(dom),
        id = $elem.data('jqboundary'),
        parent = id + '-parent',
        prev = id + '-prev',
        next = id + '-next',
        originalCSS = $elem.data('originalCSS');
      if (originalCSS) $elem.css($.parseJSON(originalCSS));
      if (!id) return true; //continue
      $elem.removeData('jqboundary');
      $('[class*=' + id + ']').reverse().each(function() {
        var boundary = $(this);
        if (boundary.hasClass(next)) return !boundary.before($elem);
        if (boundary.hasClass(prev)) return !boundary.after($elem);
        if (boundary.hasClass(parent)) return !boundary.append($elem);
      }).removeClass([parent, prev, next].join(' '));
    });
  };

  //===================================
  /* PUBLIC API */
  //===================================

  jherax.browser = browser;
  jherax.isDOM = isDOM;
  jherax.isFunction = isFunction;
  jherax.multiFilter = multiFilter; //undocumented
  jherax.flatten = flatten; //undocumented
  jherax.sumValues = sumValues; //undocumented
  jherax.inputType = inputType;
  jherax.handlerExist = handlerExist;
  jherax.nsEvents = nsEvents;
  jherax.addScript = addScript;
  jherax.addCSS = addCSS;
  jherax.escapeRegExp = escapeRegExp;
  jherax.urlParamsToObject = urlParamsToObject;
  jherax.urlParameter = urlParameter;
  jherax.clone = clone; //undocumented
  jherax.getSelectedText = getSelectedText;
  jherax.getCaretPosition = getCaretPosition;
  jherax.setCaretPosition = setCaretPosition;
  jherax.capitalize = capitalize;
  jherax.numericFormat = numericFormat;
  jherax.isValidFormat = isValidFormat;
  jherax.isValidDate = isValidDate;
  jherax.formatDate = formatDate; //undocumented
  jherax.dateToString = dateToString;
  jherax.dateFromISO8601 = dateFromISO8601;
  jherax.showTooltip = showTooltip;
  jherax.showLoading = showLoading;
  jherax.getHtmlText = getHtmlText;
  jherax.getScrollbarWidth = getScrollbarWidth;
  jherax.updateCache = updateCache; //undocumented

  //Provide compatibility with older versions
  jherax.getQueryToString = function () {
    deprecated('getQueryToString', 'urlParameter');
    return urlParameter.apply(this, arguments);
  };
  jherax.getQueryToObject = function () {
    deprecated('getQueryToObject', 'urlParamsToObject');
    return urlParamsToObject.apply(this, arguments);
  };

}(window, jQuery, jsu));
