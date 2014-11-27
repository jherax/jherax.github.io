(function ($, undefined) {

  $(document).on("click.demo", "#load", function () {
    //adds the stylesheet just before the jherax.css <link>
    jsu.fnAddCSS("demo.css", "jherax.css");

    //appends the stylesheet to the end of <head> element
    //jsu.fnAddCSS("demo.css");
  });

})(jQuery);