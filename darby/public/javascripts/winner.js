$(document).on("ready", function(){
  $("#btn-set-winner").on("click", function(){
    var $this = $(this);
    var $submit = $("#area-submit");
    var $loading = $("#area-loading");
    var $winner = $("#area-winner");
    var $phone = $("#area-phone");
    var $error = $("#area-error");
    var $prize = $("#area-prize");
    
    $submit.remove();
    $loading.show();
    
    // $this.data("wait", 'true');
    $.post('/prizes/set_winner', {
      'prizeId': $prize.data("id")
    }, function(resp){
      var response = JSON.parse(resp);
      if ( response["status"] ) {
        
        $loading.remove();
        $winner.text("El Ganador es: " + response["object"]["winner"]);
        $phone.text(response["object"]["phone"]);
        $phone.show();
        $winner.show(); 
      } else {
        $loading.remove();
        $error.show();  
      }
      // process response
      // $this.data("wait", 'false');
    }, function(err){
      $loading.remove();
      $error.show();
    });
  });
});