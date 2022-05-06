$(document).ready(function() {

  $("#closebutton").on("click", function (e) {

    e.preventDefault();

    // const endDate = Date.now();
    const path =`localhost:8080/${pollData.uuid}/delete`;

    $.post(path, )





  });
});
