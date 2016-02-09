(function($, undefined) {

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
        //middle part
        "#lazy-evaluation": {
            x: 4000, y: 2000
        },
        "#lazy-evaluation-code": {
            x: 4000, y: 3000
        },
        "#lazy-initialization": {
            x: 3000, y: 2000
        },
        "#lazy-initialization-code": {
            x: 3000, y: 3000
        },
        "#van-damme-img": {
            x: 2000, y: 2000
        },
        "#lazy-function": {
            x: 2000, y: 3000
        },
        "#lazy-function-code1": {
            x: 1000, y: 2000
        },
        "#lazy-function-parts": {
            x: 1000, y: 3000
        },
        "#lazy-function-code2": {
            x: 0, y: 2000
        },
        "#awsome-img": {
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

  utils
    .addHintMessage()
    .initDataAttributes(steps, ".skip-counter")
    .initPrettify()
    .initImpress("#impress");

}(jQuery));
