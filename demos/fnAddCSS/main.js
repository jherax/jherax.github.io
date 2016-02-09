(function ($, undefined) {

  $(document).on("click.demo", "#load", function () {
    //adds the stylesheet just before the jherax.css <link>
    jsu.addCSS("demo.css", "jherax.min.css");

    //appends the stylesheet to the end of <head> element
    //jsu.addCSS("demo.css");
  });

})(jQuery);