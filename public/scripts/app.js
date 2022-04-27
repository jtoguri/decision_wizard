// Client facing scripts here
$(document).ready(function () {
  // Create poll form --> click button to add additional option fields
  $('#addOption').click(function (e) {
    // stops redirect
    e.preventDefault();
    const newOption =
      $(`
        <div class="option">
          <span>Option:</span>
          <input type="text" name="" placeholder="" required><br>
          <span>Description:</span>
          <input type="text" name="" placeholder=""><br>
        </div>
        <br>;
      `);
    $('#optionsContainer').append(newOption);
  });
});



