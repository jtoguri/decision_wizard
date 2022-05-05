// Scripts for the polls.ejs template

$(document).ready(function() {

  // Create sortable list using jqueryUI sortable widget
  $("#sortable").sortable();
  $("#sortable li").sortable();

  $("#voteSubmit").submit(function(e) {
    e.preventDefault();

    const test1 = $("#sortable").sortable("serialize");
    const path = window.location.pathname;

    $.post(path, test1, function(data) {
      console.log(data);

      const result = $(`<div id="pollResults">
        <h1 id="pollh1">Current Results:</h1>
        <table id="resultsTable">
          <thead>
            <tr>
              <th class="tableHeading" scope="col">Choices</th>
              <th class="tableHeading" scope="col">SCORE</th>
            </tr>
          </thead>
        </table>
        </div>`
      );

      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          result.find("table").append(`<tr class="optionInTheLead"><td>${data[i].title}</td><td>${data[i].score}</td></tr>`);
        } else {
          result.find("table").append(`<tr><td>${data[i].title}</td><td>${data[i].score}</td></tr>`);
        }
      }

      $('.container').empty().append(result);
    });
  });
});
