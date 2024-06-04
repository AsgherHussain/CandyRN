$(document).ready(function () {
  document.getElementById("id_user").addEventListener("change", function() {
    var user_id = dropDown.value
    var url = `${window.location.origin}/api/v1/get-user/${user_id}/`
    console.log(url)
       $.ajax({
      url: url,
      type: "GET",
      success: function (result) {
        var firstName= result.first_name
        var lastName= result.last_name
        var email= result.email
        var phone= result.phone

        $('#id_first_name').val(firstName)
        $('#id_last_name').val(lastName)
        $('#id_email').val(email)
        $('#id_phone').val(phone)
      }

    })(django.jQuery);
});


  var plus_button = document.getElementById("add_id_user")
  var change_button = document.getElementById("change_id_user")
  var dropDown = document.getElementById("id_user")
  plus_button.style.display = 'none';
  change_button.style.display = 'none';

});