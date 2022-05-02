// Scripts for the polls.ejs template

$(document).ready(function() {

  // Create sortable list using jqueryUI sortable widget
  $("#sortable").sortable();
  $("#sortable li").sortable();

  $("#voteSubmit").submit( function( e ) {
    e.preventDefault();
    
    const test1 = $("#sortable").sortable("serialize");
    
    const path = window.location.pathname;
    
    $.post(path, test1, function( data ) {
      console.log(data);
    });
  });
});
