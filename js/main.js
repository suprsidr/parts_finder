(function($){

  if($('[data-parts-finder]').length) {
    $("<link/>", {
      rel : "stylesheet",
      type : "text/css",
      href : "css/parts-finder.min.css"
    }).appendTo("head");
    $.ajax({
      url : 'js/parts-finder.1.0.1.min.js',
      cache: true,
      dataType : "script"
    }); 
  }

})(window.jQuery);