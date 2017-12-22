$(document).ready(() => {

    SDK.User.loadNav();


    var $pageHead = $("#pageHead");
    var $email = $("#email");
    var $education = $("#education");
    var $description = $("#description");
    var $postAmount = $("#postAmount");

    // Kører et AJAX call der finder det nuværende brugerobjekt
    SDK.User.getUserById(SDK.Storage.load("userID"), (error, data) => {

            let currentMember = data;

            const name = currentMember.firstName + " " + currentMember.lastName;
            const education = currentMember.major + " on " + currentMember.semester + ". semester";

            // Appender alle de forskellige brugeroplysninger
            $pageHead.append(
            "<h1> Profile of " +  name + " </h1>"
            );

            $email.append(
            "<td>"+ currentMember.email + "</td>"
            );

            $education.append(
              "<td>"+ education + "</td>"
            );

            $description.append(
              "<td>"+ currentMember.description + "</td>"
            );

            let postCount = 0;
            currentMember.posts.forEach((post) => {
            postCount++;
            });

            $postAmount.append(
              "<td>" + postCount + " posts and comments in total." + "</td>"
            );
        });
    });

