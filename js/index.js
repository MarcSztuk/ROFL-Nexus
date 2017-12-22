$(document).ready(() => {

    // Loader nav-baren.
    SDK.User.loadNav();

    // Tjekker om brugeren har en token, hvis ikke, bliver posts ikke vist.
    if (SDK.Storage.load("token")) {
    SDK.Post.getAllPosts((error, data) => {
        var allPosts = data;

        let postI = 1;

        // Kører et loop for alle posts
        allPosts.forEach((post) => {

            // Hvis post ikke har et owner id eller event id, ved jeg at det er en global post
            if (!post.owner.id || !post.event.id) {

                SDK.User.getAllMembers((error, data) => {
                    var allMembers = data;

                    let postOwner = "";

                    // Kører et loop for at finde postens ejer
                    allMembers.forEach((member) => {
                        if (member.id === post.owner.id) {
                            postOwner = member.firstName + " " + member.lastName;
                        }
                    });

                    setTimeout(function () {

                        // Lister alle posts
                        $("#listPosts").append(
                            "<div style='border-bottom:solid thin steelblue'><button id='" + post.id + "' class='addComment'>Comment</button>" +
                            "<b>" + postI++ + ": " + postOwner + "<br>" +
                            "<i>" + post.content + "</i><br><br>" +
                            "<div id=" + post.id + "comment style='height:auto;'></div>"
                        );

                        let commentI = 1;

                        // Kører et AJAX call for at få et post via post ID
                        SDK.Post.getPostById(post.id, (error, data) => {
                            var allComments = data.comments;

                            // Kører et loops for alle comments
                            allComments.forEach((comment) => {

                                let commentOwner = "";

                                // Kører et loop for alle members
                                allMembers.forEach((member) => {
                                    if (member.id === post.owner.id) {
                                        commentOwner = member.firstName + " " + member.lastName;
                                    }
                                });

                                // Tilføjer alle kommentarer til et global post
                                $("#" + post.id + "comment").append(
                                    "<div style='font-size: 10px;border-bottom:solid thin steelblue;margin-left:-25%;text-align:center'><i>" + commentI++ + ": " +
                                    commentOwner + "<br>" +
                                    comment.content + "</i><br></div>"
                                );
                            });
                        });
                    }, 50);
                });

            }
        });

        // Funktion til at tilføje comment - VIRKER IKKE
        $(".addComment").on("click", function(chosenPostObj) {
            let chosenPostToComment = chosenPostObj.target.id;
            let commentText = window.prompt("Please write your comment:");
            SDK.Post.addPostToPost(SDK.Storage.load("userID"), commentText, chosenPostToComment, (error, data) => {
                window.alert("Your comment has been added.");
                window.location.href = "index.html";
            });
        });
    });

    } else {
        $("#listPosts").append(
        "<p> You need to login to see posts. </p>"
        );
    };

    // Knap til at lave en global post
    $(".postButton").on("click", function() {
        const postText = document.getElementById("postText").value;
        SDK.Post.addGlobalPost(SDK.Storage.load("userID"), postText, (error, data) => {
            window.alert("Your post has been added.");
            window.location.href = "index.html";
        });
    });



});