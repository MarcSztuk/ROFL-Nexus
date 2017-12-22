$(document).ready(() => {

    SDK.User.loadNav();

    // Hentet eventID'et fra searchbaren, da det bliver sendt med videre fra events.js. Jeg graver eventet ud via en split.
    function processEvent() {
        const linkParameters = location.search.split("eventId=");
        const chosenEvent = linkParameters[1];

        return chosenEvent;
    }

    var $pageHead = $("#pageHead");

    // Kører mit AJAX kald getEventById, for at hente alt information om det valgte event.
    SDK.Event.getEventById(processEvent(), (error, data) => {
        var chosenEvent = data;

        // Kører getUserById for at kunne finde ejeren af eventet
        SDK.User.getUserById(chosenEvent.owner.id, (error, data) => {
            let eventOwner = data;
            let eventOwnerName = eventOwner.firstName + " " + eventOwner.lastName;

            // appender titlen til siden.
            $pageHead.append(
                "<h1 style='text-align:center'>" + chosenEvent.title + " </h1>"
            );

            // Appender alle event-oplysninger til venstre side
            $(".event-left").append(
                "<p><b>Title: </b><i>" + chosenEvent.title + "</i></p>" +
                "<p><b>Description: </b><i>" + chosenEvent.description + "</i></p>" +
                "<br>" +
                "<p><b>Start date: </b><i>" + chosenEvent.startDate + "</i></p>" +
                "<p><b>End date: </b><i>" + chosenEvent.endDate + "</i></p>" +
                "<br><b>Host information </b>" +
                "<br>Name: " + eventOwnerName +
                "<br>Email: " + eventOwner.email +
                "<div><button class='subscribeButton'>Subscribe to Event!</button></div>"
            );

            var allParticipantsList = chosenEvent.participants;

            allParticipantsList.forEach((participant) => {
                participantName = participant.firstName + " " + participant.lastName;

                $("#listParticipants").append(
                    "<p style='margin-left:5px'>" + participantName + "</p>"
                );
            });

            var allPostsList = chosenEvent.posts;

            // Henter alle brugere fra databasen til at navngive posts og comments
            SDK.User.getAllMembers((error, data) => {
                var allMembers = data;
                let postI = 1;
                allPostsList.forEach((post) => {

                    let postOwner = "";

                    // Kører et forEach loop, der looper igennem alle members, og appender hvis member er tilmeldt
                    // begivenheden
                    allMembers.forEach((member) => {
                        if (member.id === post.owner.id) {
                            postOwner = member.firstName + " " + member.lastName;
                        }
                    });

                    let commentI = 1;

                    // Appender posts til højre side af event samt tilføjer comment knap og et div til at tilføje
                    // comments
                    $("#listPosts").append(
                        "<div style='border:solid thin steelblue'><button id='" + post.id + "' class='addComment'>Comment</button>" +
                        "<b>" + postI++ + ": " + postOwner + "<br>" +
                        "<i>" + post.content + "</i><br><br>" +
                        "<div id=" + post.id + "comment style='height:auto;'></div>"
                    );

                    // henter den specifikke post udfra ID for at få tilknyttede kommentarer, da posts ikke indeholder
                    // kommentarer, når man henter post igennem events.
                    SDK.Post.getPostById(post.id, (error, data) => {
                        var allComments = data.comments;

                            allComments.forEach((comment) => {

                                let commentOwner = "";

                                // Kører alle members igennem for at finde kommentar-ejeren.
                                allMembers.forEach((member) => {
                                    if (member.id === post.owner.id) {
                                        commentOwner = member.firstName + " " + member.lastName;
                                    }
                                });

                                // Appender alle kommentarer
                                $("#" + post.id + "comment").append(
                                    "<div style='font-size: 10px;border:solid silver thin; text-align:center'><i>" + commentI++ + ": " +
                                    commentOwner + "<br>" +
                                    comment.content + "</i><br></div>"
                                );
                            });
                    });
                });
                // Min metode til lade brugerne tilføje en kommentar til en post
                $(".addComment").on("click", function(chosenPostObj) {
                    let chosenPostToComment = chosenPostObj.target.id;
                    let commentText = window.prompt("Please write your comment:");
                    SDK.Post.addPostToPost(SDK.Storage.load("userID"), commentText, chosenPostToComment, (error, data) => {
                       window.alert("Your comment has been added.");
                       window.location.href = "event.html?eventId=" + chosenEvent.id;
                    });
                });

                // Metode til at lade brugere tilmelde sig events
                $(".subscribeButton").on("click", function() {
                    SDK.Event.subscribeToEvent(SDK.Storage.load("userID"), chosenEvent.id, (error, data) => {
                        window.alert("You have subscribed to the event.");
                        window.location.href = "event.html?eventId=" + chosenEvent.id;
                    });
                });

                // Metode til at lave brugere lave et post.
                $(".postButton").on("click", function() {
                    const postText = document.getElementById("postText").value;
                    SDK.Post.addPostToEvent(SDK.Storage.load("userID"), postText, chosenEvent.id, (error, data) => {
                        window.alert(SDK.Storage.load("userID") + postText + chosenEvent.id);
                        window.alert("Your post has been added.");
                        window.location.href = "event.html?eventId=" + chosenEvent.id;
                    });
                });

            });
        });
    });
});