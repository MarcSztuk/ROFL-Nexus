$(document).ready(() => {

    SDK.User.loadNav();

    $("#login-button").click(() => {

        const email = $("#inputEmail").val();
        const password = $("#inputPassword").val();

        // Kører et AJAX call for at forsøge at logge ind.
        SDK.User.login(email, password, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err){
                window.log("An error occurred while trying to log in")
            } else {
                window.location.href = "index.html";
            }
        });

    });

});