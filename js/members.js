$(document).ready(() => {

        SDK.User.loadNav();
        SDK.User.getAllMembers((error, data) => {
        let allMembersList = data;

        let $allMembers = $("#allMembers");

        // Kører et loop for hver member
            allMembersList.forEach((member) => {

                const name = member.firstName + " " + member.lastName;
                const eduInfo = "Studying (" + member.major + ") on semester (" + member.semester + ").";

                // Tilføjer en ny tablerow med en member for hver member
                $allMembers.append(
                    "<tr id=" + member.id + ">" +
                    "<td>" + name + "</td>" +
                    "<td>" + member.email + "</td>" +
                    "<td>" + eduInfo + "</td>" +
                    "<td> <button data-toggle=modal data-target=#showMember class=viewProfileButton>View Profile</button> </td>" +
                    "</tr>");
        });

            // Laver en delegate der kan registrere klik på show info knappen
    $("#allMembers").delegate("tr", "click", function(clickedMember) {

        let chosenMemberId = $(clickedMember.currentTarget).attr('id');

        // Kører et for loop der finder en member med samme id som den valgte bruger på listen
        for(let i = 0; i < allMembersList.length; i++){
            if (allMembersList[i].id == chosenMemberId) {
                var chosenMember = allMembersList[i];
                break;
            }
        }

        const chosenMemberName = chosenMember.firstName + " " + chosenMember.lastName;
        const chosenMemberEducation = chosenMember.major + " on " + chosenMember.semester + ". semester";

        let gender = "";
        if (chosenMember.gender.toLowerCase() === "m") {
            gender = "Male";
        } else {
            gender = "Female";
        }

        // Sletter indholdet i Modals - Så den er klar til at blive "dannet" på ny.
        $("#showMember-body").html("");
        $("#showMember-title").html("");

        $("#showMember-title").append(
          "<b>Profile of " + chosenMemberName + "</b>"
        );

        // Kører et AJAX call der finder member via ID
        SDK.User.getUserById(chosenMember.id, (error, data) => {
        var advChosenMember = data;

        let memberPostAmount = 0;
        advChosenMember.posts.forEach((post) => {
            memberPostAmount++;
        });

        // Appender information om den valgte bruger til modal'en
        $("#showMember-body").append(
            "<div class=container" +
            "<p><b>Name: </b><i>" + chosenMemberName + "</i></p>" +
            "<p><b>Email:: </b><i>" + chosenMember.email + "</i></p>" +
            "<p><b>Education: </b><i>" + chosenMemberEducation + "</i></p>" +
            "<p><b>Gender: </b><i>" + gender + "</i></p>" +
            "<b>Description:</b>" +
            "<p><i>" + chosenMember.description + "</i></p>" +
            "<br> </br>" +
            "<p><b>Posts: </b>" +
             chosenMember.firstName + " has " + memberPostAmount + " total posts and comments." + "</p><br>" +
            "</div>"
    );
    });
    })
   });
});

