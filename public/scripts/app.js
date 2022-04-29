// Client facing scripts here
$(document).ready(function () {

  // Create poll form --> click button to add additional option fields
  $( '#addOption' ).click(function ( e ) {
    // stops redirect
    e.preventDefault();

    // Count all divs with .option class, use to increment input name with adding new options
    const numberOfOptions = document.querySelectorAll('.option').length;

    const newOption =
      $(`
        <div class="option">
          <span>Option:</span>
          <input type="text" name="titleOption${numberOfOptions + 1}" placeholder="" required><br>
          <span>Description:</span>
          <input type="text" name="descriptionOption${numberOfOptions + 1}" placeholder=""><br>
        </div>
        <br>;
      `);
    $('#optionsContainer').append(newOption);
  });

  $( "#pollForm" ).submit(function ( e ) {
    e.preventDefault();
    const cookie = document.cookie.split('=')[1];

    if (!cookie) {
      $( "body" ).fadeTo(0, 0.2, () => {
        $( "input" ).prop("readonly",true);
        
      });
      return;
    }

    const pollData = $( this ).serialize();
    
    $.post( "/api/polls", pollData, function( newPoll ) {  
      const preview = $(`
        <div>
          <h3>${newPoll.question}</h3>
            <ul>
            </ul>  
        </div>
      `);

      for (const choice of newPoll.choices) {
        $( preview ).find( 'ul' ).append(`<li>${choice.title}</li>`);
      } 
      
      $( '#pollPreview' ).append(preview);
    });
  });
});

