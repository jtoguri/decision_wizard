// Client facing scripts here

$(document).ready(function() {

  if (!confirmCookie()) {
    console.log("no cookie");
  }

  // Create poll form --> click button to add additional option fields
  $('.addOption').on("click", function(e) {
    // stops redirect
    e.preventDefault();

    // Count all divs with .option class, use to increment input name with adding new options
    const numberOfOptions = document.querySelectorAll('.option').length;

    const newOption = $(`
    <div class="input-group option">
    <input class="form-control" type="text" name="choices[choice${numberOfOptions + 1}][title]" placeholder="New option" required />
    <input class="form-control" type="text" name="choices[choice${numberOfOptions + 1}][describe]" placeholder="new decription" />
    <button class="btn btn-outline-secondary btn-sm removeOption" type="button"> - </button>
    </div>`
    );
    $('#optionsContainer').append(newOption);
  });

  $('.removeOption').on("click", function(e) {
    e.preventDefault();
    $(this).closest('div').remove();
  });


  $("#pollForm").submit(function(e) {
    e.preventDefault();

    const pollData = $(this).serialize();

    $.post("/api/polls", pollData, function(newPoll) {
      const preview = $(`
        <div>
          <h3>${newPoll.question}</h3>
            <ul>
            </ul>
        </div>
      `);

      for (const choice of newPoll.choices) {
        $(preview).find('ul').append(`<li>${choice.title}</li>`);
      }

      $('#pollPreview').append(preview);
    });
  });
});

