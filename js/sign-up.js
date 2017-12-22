$(document).ready(() => {

    $("#register-button").click(() => {

        const firstName = $("#firstName").val();
        const lastName = $("#lastName").val();
        const email = $("#email").val();

        let chosenGender = $('input[name=gender]:checked', '#gender').val();
        const gender = chosenGender;

        const description = $("#description").val();
        const major = $("#major").val();
        const semester = $("#semester").val();
        const password1 = $("#password1").val();
        const password2 = $("#password2").val();

        if (password1 !== password2){

            window.alert("Password does not match one another!");
            return ("Fejl i password");
            }

            // Kører mit createUser AJAX med de indtastede oplysninger.
        SDK.User.createUser(firstName, lastName, email, description, gender, major, password1, semester, (error, data) => {

            window.alert("Profile created!");
            window.location = "login.html";

        });
    }
    )
});