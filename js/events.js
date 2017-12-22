$(document).ready(() => {

        SDK.User.loadNav();
        SDK.Event.getAllEvents((error, data) => {
        var allEventsList = data;

        var $allEvents = $("#allEvents");

        allEventsList.forEach((event) => {

            const eventId = event.id;

            // Sikrer at eventTitle ikke er for lang til at blive vist på knappen.
            let eventTitle;
            if (event.title.length > 50) {
                eventTitle = event.title.substr(0,50) + "..";
            } else {
                eventTitle = event.title;
            }

            // Sikrer at beskrivelsen på eventet ikke er for langt  til at blive vist på knappen.
            let eventDescription;
            if (event.description.length > 50) {
                eventDescription = event.description.substr(0,50) + "...";
            } else {
                eventDescription = event.description;
            }

            // Lister alle events som en button.
            $allEvents.append(
            "<p><button data-toggle=modal " + "id=" + eventId +
                " data-target=#showEvent onClick=chosenEvent(this.id) class=viewEvents >" +
                "<b>Title: </b>" + eventTitle + "<br>" +
                "<b>Description: </b> <i>" + eventDescription + "</i><br>" +
                "<b>Date: </b>" + event.startDate + "<br>" +
                "<b><u>Click for more info</u></b>" +
                "</button></p>"
            );

        });

            // Tilføjer al information eventet i højre side
            $(function() {
                $("#createEvent-button").on("click", function() {

                    const title = $("#title").val();
                    const description = $("#description").val();

                    const startDateTemp = $("#startDate").val();
                    const startDateSplit = startDateTemp.split("T");

                    const startDate = startDateSplit[0] + " " + startDateSplit[1] + ":00"

                    const endDateTemp = $("#endDate").val();

                    const endDateSplit = endDateTemp.split("T");
                    const endDate = endDateSplit[0] + " " + endDateSplit[1] + ":00"

                    SDK.Event.createEvent(SDK.Storage.load("userID"), title, startDate, endDate, description, (error, data) => {

                        window.location.href = "events.html"

                    });

                });
            });

                // Funktion til at sende den valgte knap som et objekt, så jeg kan trække ID'et ud.
                $(function () {
                    $(".viewEvents").on("click", function (chosenEventObj) {

                        const chosenEventId = chosenEventObj.target.id;

                        window.location.href = "event.html?eventId=" + chosenEventId;
                    });
                });
        });
});
