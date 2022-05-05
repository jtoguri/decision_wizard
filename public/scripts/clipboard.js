
$(document).ready(function() {
  
  $("#copyButton").on("click", function() {
    navigator.clipboard.writeText(`http://${$("a.shareLink").text()}`); 
  });
});
