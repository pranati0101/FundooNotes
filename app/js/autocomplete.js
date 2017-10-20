$(document).ready(function(){
  $("#stext" ).autocomplete({
  source: "/autocomplete",
  minLength: 2
  });
});
