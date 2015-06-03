(function($, undefined) {

	if ("ontouchstart" in document.documentElement) {
	    $(".hint").html("<p>Toque a la izquierda o la derecha para navegar</p>");
	}

	//Creates the options for the slides
	var steps = {
        "#title": {
            x: 0, y: 0
        },
        "#definition": {
            x: 0, y: 1000
        },
        "#advantages": {
            x: 1000, y: 0
        },
        "#drawbacks": {
            x: 1000, y: 1000
        },
        "#all-right-img": {
            x: 2000, y: 0
        },
        "#concepts": {
            x: 2000, y: 1000
        },
        "#closure": {
            x: 3000, y: 0
        },
        "#closure-attr": {
            x: 3000, y: 1000
        },
        "#closure-code": {
            x: 4000, y: 0
        },
        "#closure-scoping": {
            x: 4000, y: 1000
        },
        //the middle
        "#van-damme-img": {
            x: 4000, y: 2000
        },
        "#lazy-evaluation": {
            x: 4000, y: 3000
        },
        "#lazy-evaluation-code": {
            x: 3000, y: 2000
        },
        "#lazy-initialization": {
            x: 3000, y: 3000
        },
        "#lazy-initialization-code": {
            x: 2000, y: 2000
        },
        "#awsome-img": {
            x: 2000, y: 3000
        },
        "#lazy-function": {
            x: 1000, y: 2000
        },
        "#lazy-function-code1": {
            x: 1000, y: 3000
        },
        "#lazy-function-parts": {
            x: 0, y: 2000
        },
        "#lazy-function-code2": {
            x: 0, y: 3000
        },
        //last segment
        "#lazy-function-code3": {
            x: 0, y: 4000
        },
        "#self-punish-img": {
            x: 1000, y: 4000
        },
        "#thank-you": {
            x: 3000, y: 4000, z: 400, scale: 3
        }
	};

    //Local reference declaration
    var toString = Object.prototype.toString;
    var i, total;

    //Determines whether the @obj parameter is an object
    function isObject(obj) {
        return toString.call(obj) == "[object Object]";
    }

    //Builds the data-* attribute for each property in the object
    //@obj: the object that contains the key/values
    //@name: the prefix and key builds the data-* attribute
    function buildAttr(obj, name) {
        var key, value, prefix, attr = {};
        if (isObject(obj)) {
            for (key in obj) {
                value = obj[key];
                prefix = name + "-" + key;
                if (isObject(value))
                    $.extend(attr, buildAttr(value, prefix));
                else {
                    attr[prefix] = value;
                }
            }//end for
        }//end if
        return attr;
    }

    i = 0;
    total = $("div.step").length - 2;

    //Adds the data-* attributes to the slides
    $.each(steps, function(key, value) {
        var div = $(key)
                .append("<div class='counter'>" + (i+=1) + " / " + total +"</div>")
                .wrapInner("<div class='wrap'>"),
            attr = buildAttr(value, "data");
        //console.log(key, attr);
        div.attr(attr);
    });

    //Makes the code pretty
    window.prettyPrint && prettyPrint();

    //Adds the event handler
    $("#impress")
        .on("impress:init", function() {
            $("body").on("mousewheel", function() { return false; });
        });

	//Starts the impress
    impress().init("impress");

}(jQuery));
