(function($, undefined) {

	if ("ontouchstart" in document.documentElement) {
	    $(".hint").html("<p>Toque a la izquierda o la derecha para navegar</p>");
	}

	//Creates the options for the slides
	var steps = {
        "#title": {
            x: -1000, y: -1500, scale: 5, rotate: { x: 90 }
        },
        "#principles": {
            x: -1500, y: 500, scale: 2, rotate: { y: -180, z: 90 }
        },
        "#dry": {
            x: -700, y: 500, scale: 1, z: 300, rotate: { y: -180, z: 90 }
        },
        "#dry-eg1": {
            x: -700, y: 1700, scale: 1, z: 120, rotate: { y: -180, z: 90 }
        },
        "#dry-eg2": {
            x: -700, y: 1700, scale: 1, z: 420, rotate: { y: -180, z: 90, x: 180 }
        },
        "#dry-eg3": {
            x: -700, y: 1700, scale: 1, z: 420, rotate: { y: -180, z: 90, x: 180 }
        },
        "#dry-eg4": {
            x: -1000, y: 1700, scale: 1, rotate: { y: -90, z: 90, x: 180 }
        },
        "#abstraction": {
            x: -1400, y: 700, scale: 2, rotate: { x: 90 }
        },
        "#open-closed": {
            scale: 2, rotate: { x: 90, y: 90 }
        },
        "#single-resp": {
            x: 680, y: -710, z: -400
        },
        "#coupling": {
            y: -1500
        },
        "#case-eg1": {
            x: 1800, y: -1500
        },
        "#code-eg1": {
            x: 1800, y: -900, z: 200, rotate: { x: 90 }
        },
        "#remarks": {
            x: 2900, y: -540
        },
        "#splash": {
            x: 1800, y: -540, rotate: { x: 270 }
        },
        "#solution-1": {
            x: 1400, y: -2300, z: 600, scale: 2, rotate: { x: 270, y: 180 }
        },
        "#solution-2": {
            x: 2600, y: -1000, z: 500, scale: 2, rotate: { x: 270, y: 90 }
        },
        "#strategy-1": {
            x: 1500, y: 300, z: 500, scale: 2, rotate: { x: 270 }
        },
        "#strategy-2": {
            x: 1500, y: 300, z: -900, rotate: { x: 270, y: 90 }
        },
        "#awsome": {
            x: 1500, y: 1400, scale: 1.6, rotate: { y: 90 }
        },
        "#thank-you": {
            x: 2400, y: 1300, scale: 3, z: 500
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
    total = $("div.step").length - 3;

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

})(jQuery);
