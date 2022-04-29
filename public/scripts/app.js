// Client facing scripts here

$(document).ready(function () {

  // Create poll form --> click button to add additional option fields
  $( '.addOption' ).on("click", function (e) {
    // stops redirect
    e.preventDefault(e);

    console.log("adding an option!");

    // Count all divs with .option class, use to increment input name with adding new options
    const previousOption = document.querySelectorAll('.option').length;

    const newOption =
      // $(`
      //   <div class="input-group option">
      //     <input type="text" name="choices[choice${previousOption + 1}][title]" placeholder="New option" required>
      //     <input class="form-control" type="text" name="choices[choice${previousOption + 1}][describe]" placeholder="new" /><br />
      //     <button class="addOption btn btn-outline-secondary btn-sm" type="button">+</button>
      //   </div>
      // `);
        $(`
      <div class="input-group option">
      <input class="form-control" type="text" name="choices[choice${previousOption + 1}][title]" placeholder="New option" required />
      <input class="form-control" type="text" name="choices[choice${previousOption + 1}][describe]" placeholder="new decription" />
      <button class="btn btn-outline-secondary btn-sm addOption" type="button">+</button>
    </div>
    `);


      $(this).removeClass('addOption').addClass('removeOption');
      //change inner html
    $('#optionsContainer').append(newOption);

  });

  $('.removeOption').on("click", function (e){
    e.preventDefault(e);
    $(this).closest('div').remove();

  })


  $( "#pollForm" ).submit(function( e ) {
    e.preventDefault();
    console.log($( this ).serialize());
    $.post( "/api/polls", $( this ).serialize(), function( data ) {
      console.log(data);
      const preview = $(`
        <div>
          <h3>${data.question}</h3>
          <div>
            <span>${data.choices[0].title}</span>
          </div>
        </div>
      `);
      $('body').append(preview);
    });
  });
});

