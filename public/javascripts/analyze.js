(function($) {

  $("#analyze").click(function() {
    var data = {text: JSON.stringify($("#input").val())};
    $.post('/analyze', data, function(result, status) {
      $("#output").text(JSON.stringify(result));
    });
  });

})(jQuery);
