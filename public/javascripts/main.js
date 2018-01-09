(function($) {

  $("#analyze").click(function() {
    var data = JSON.stringify({ text: $("#input").val() });
    $.post('/analyze', data, function(result, status) {
      $("#output").text(JSON.stringify(result));
    });
  });

})(jQuery);
