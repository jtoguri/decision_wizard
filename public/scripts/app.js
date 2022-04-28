// Client facing scripts here
$(document).ready(function () {

  // Create poll form --> click button to add additional option fields
  $('#addOption').click(function (e) {
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

  $("#pollForm").submit(function (e) {
    e.preventDefault();
    console.log($(this).serialize());
    $.post("/api/polls", $(this).serialize(), function (data) {
      console.log(data);
    });
  });
});

