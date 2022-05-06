// Client facing scripts here
$(document).ready(function () {

  // Create poll form --> click button to add additional option fields
  $('.addOption').on("click", function (e) {
    // stops redirect
    // e.preventDefault();

    // Count all divs with .option class, use to increment input name with adding new options
    const numberOfOptions = $('#optionsContainer').children().length;

    const newOption = `
    <div class="input-group">
    <input class="form-control noRightBorder" type="text" name="choices[choice${numberOfOptions + 1}][title]" placeholder="New Option" required />
    <input class="form-control noRightBorder" type="text" name="choices[choice${numberOfOptions + 1}][describe]" placeholder="Description" />
    <button class="btn btn-outline-secondary btn-sm removeOption" type="button"> x </button>
    </div>`;

    $('#optionsContainer').append(newOption);
  });

  $(document).on("click", "button.removeOption", function () {
    $(this).closest('div').remove();
  });

  $("#pollForm").submit(function (e) {
    console.log("button was clicked");
    e.preventDefault();

    const pollData = $(this).serialize();

    $.post("/api/polls", pollData, function (response) {
      const path = response;
      window.location.assign(path);
    });
  });
});
