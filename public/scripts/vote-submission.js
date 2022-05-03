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
      
      const result = $(`
        <div>
          <h2>Current Results</h2>
          <ol> 
          </ol>
        </div
      `);

      for (const choice of data){
        console.log(choice.title);
        result.find("ol").append(`<li>${choice.title}</li>`);
        
      }
      console.log(result);

      $('body').empty().append(result);
    });
  });
});
