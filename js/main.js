(function($){

  if($('[data-parts-finder]').length) {
    $("<link/>", {
      rel : "stylesheet",
      type : "text/css",
      href : "css/parts-finder.min.css"
    }).appendTo("head");
    $.ajax({
      url : 'js/parts-finder.min.js',
      cache: true,
      dataType : "script"
    }); 
  }

})(window.jQuery);