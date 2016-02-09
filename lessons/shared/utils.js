/**
 * Common utilities
 * @return {Object}
 */
var utils = (function utilsModule($) {

	//Module to export
	var module = {};

	/* @private
	 * Local reference declaration
	 */
	var toString = Object.prototype.toString;

	/* @private
	 *
	 * Determines whether the @obj parameter is an object
	 * @param  {Object}  obj: the Object to validate
	 * @return {Boolean}
	 */
	function isObject(obj) {
		return toString.call(obj) === "[object Object]";
	}

	/* @public
	 *
	 * Adds the hint message
	 * @param  {String} message: message to show in the '.hint' slide
	 * @return {Object} returns the module to allow chaining
	 */
	function addHintMessage(message) {
		message = message || "Toque a la izquierda o derecha para navegar";
		if ("ontouchstart" in document.documentElement) {
			$(".hint").html("<p>" + message + "</p>");
		}
		return module;
	}

	/* @public
	 *
	 * Builds the data-* attribute for each property in the object
	 * @param  {Object} obj:  the object that contains the key/values
	 * @param  {String} name: the prefix and key builds the data-* attribute
	 * @return {Object}
	 */
	function buildDataAttributes(obj, name) {
		var key, value, prefix, attr = {};
		if (isObject(obj)) {
			for (key in obj) {
				value = obj[key];
				prefix = name + "-" + key;
				if (isObject(value)) {
					$.extend(attr, buildDataAttributes(value, prefix));
				}
				else {
					attr[prefix] = value;
				}
			}//end for
		}//end if
		return attr;
	}

	/* @public
	 *
	 * Adds the wrapper element and counter element to slides
	 * @param  {Object} slides:    the object containing the slides to build data-attributes
	 * @param  {String} noCount: class selector to prevent adding the 'counter' div
	 * @return {Object} returns the module to allow chaining
	 */
	function initDataAttributes(slides, noCount) {
		var i = 0,
    		total = 0,
				$steps = $("div.step");
		if (typeof noCount === "string") {
			$steps = $steps.not(noCount);
			noCount = noCount.replace(".", " ").trim();
		}
		total = $steps.length;
		//Adds the data-* attributes to the slides
		$.each(slides, function(key, value) {
			var slide = $(key),
					counter = $("<div class='counter'>");
			if (noCount && slide.hasClass(noCount)) {
				counter.hide();
			} else {
				i += 1;
			}
			slide
				.append(counter.text(i + " / " + total))
				.wrapInner("<div class='wrap'>")
				.attr(buildDataAttributes(value, "data"));
		});
		return module;
	}

	/* @public
	 *
	 * Makes the code pretty
	 * @return {Object} returns the module to allow chaining
	 */
	function initPrettify() {
		if (window.prettyPrint) {
			prettyPrint();
		}
		return module;
	}

	/**
	 * @public
	 *
	 * Starts the impress plugin
	 * @param  {String}   selector: selector of the element to impress!
	 * @param  {Function} callback: function to execute before impress is initialized
	 * @return {Object}   returns the module to allow chaining
	 */
	function initImpress(selector, callback) {
		selector = selector || "#impress";
		$(selector).on("impress:init", function() {
			$("body").on("mousewheel", function() { return false; });
		});
		if (typeof callback === "function") {
			callback($(selector));
		}
		//Starts the impress
		impress().init(selector.substr(1));
		return module;
	}

	//public API
	module.addHintMessage = addHintMessage;
	module.buildDataAttributes = buildDataAttributes;
	module.initDataAttributes = initDataAttributes;
	module.initPrettify = initPrettify;
	module.initImpress = initImpress;

	return module;

}(window.jQuery));
