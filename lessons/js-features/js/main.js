(function ($) {

    //Creates the options for the slides
    var steps = {
        "#title": {
            x: -200, y: -2000, z: 1000, scale: 2, rotate: { x: 270, y: 450 }
        },
        "#definition": {
            x: -200, y: -2000, z: 1000, scale: 2, rotate: { x: 270, y: 180 }
        },
        "#duck-typing-1": {
            x: 1400, y: -2000
        },
        "#duck-typing-2": {
            x: 2400, y: -2000
        },
        "#duck-typing-eg1": {
            x: 2400, y: -1720, z: -300, rotate: { x: -90 }
        },
        "#duck-typing-eg2": {
            x: 2400, y: -1940, z: -600, rotate: { x: -180 }
        },
        "#data-types-1": {
            x: 2860, y: -1940, z: -100, rotate: { x: -180, y: 90 }
        },
        "#data-types-2": {
            x: 2860, y: -1100, z: -100, rotate: { x: -180, y: 90 }
        },
        "#data-types-3": {
            x: 3000, y: -1100, z: 1000, rotate: { x: -180, y: 90 }
        },
        "#data-types-4": {
            x: 2700, y: -1100, z: 800, rotate: { x: -180, y: -90 }
        },
        "#object-literal-1": {
            x: 2000, y: -1100, rotate: { x: -90 }
        },
        "#object-literal-2": {
            x: 2000, y: -1100, rotate: { x: 180 }
        },
        "#object-literal-3": {
            x: 1100, y: -1100, rotate: { x: 180, z: 90 }
        },
        "#object-literal-4": {
            x: 1100, y: -1100, z: 260, rotate: { x: 180, z: 90, y: 180 }
        },
        "#object-literal-5": {
            x: 500, y: -1100, z: -360, rotate: { x: 180, z: 90, y: 90 }
        },
        "#json-1": {
            x: -1000, y: -900, z: 400, rotate: { x: 180, z: 450 }
        },
        "#json-2": {
            x: -2000, y: -900, rotate: { x: 180, z: 450 }
        },
        "#json-3": {
            x: -2000, y: -1260, z: 440, rotate: { x: 90, z: 450 }
        },
        "#json-4": {
            x: -2840, y: -1260, scale: 1.2, rotate: { x: 90, z: 450 }
        },
        //"#proto-1": {},
        //"#proto-2": {},
        "#the-end": {
            x: 1700, y: 1700, z: -400, scale: 2
        },
        "#thank-you": {
            x: -400, y: 1500, z: 400, scale: 3
        }
    };

    utils
    .addHintMessage()
    .initDataAttributes(steps, ".skip-counter")
    .initPrettify()
    .initImpress("#impress", function ($impress) {
        $impress.on("impress:stepenter", function(e) {
            $("#open-closed").toggle(e.target.id !== "definition");
        });
    });

    //Adds the event listener for the buttons buttons "duck typing"
    $(document).on("click.duck", "#duck-typing-eg1 button", function (e) {
        e.preventDefault();
        var n = +$(this).text() - 1;
        $("#duck-typing-eg1 pre").hide().eq(n).show();
    });

})(jQuery);
