var statusCodeCB = 0;

    // Sætter herunder det URL som serveren skal forbinde til.
const SDK = {
    serverURL: "http://localhost:8080/api",

    request: (options, cb) => {
        // Forbereder token til at blive sendt til serveren.
         let token = {"AUTHORIZATION": "Bearer " + SDK.Storage.load("token")}

         // Herunder angiver jeg alle de specifikationer der skal benyttes til et AJAX call
        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: token,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),

            success: (data, status, xhr) => {
                cb(null, data, status, xhr);
                statusCodeCB = xhr.status;
            },
            error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
                statusCodeCB = xhr.status;
            }
        });

    },

    // Dette er mit AJAX call der benyttes til at logge ind.
    requestLogin: (options, cb) => {
        $.ajax({
            url: SDK.serverURL + "/auth/",
            method: options.method,
            contentType: "application/json",
            dataType: "text",
            data: JSON.stringify(options.data),

            success: (data, status, xhr) => {
                cb(data, status, xhr);
            },

            error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
            }
        })
    },


    User: {

        // Metode til at finde og sætte currentUserId. Dette gøres ved at splitte token ad, og uddrage ID'et.
        currentUserId: () => {
                let token = SDK.Storage.load("token");

                if (token) {
                    var base64Url = token.split('.')[0];
                    var base64 = base64Url.replace('-', '+').replace('_', '/');

                    // SDK.Storage.persist("User", JSON.parse((window.atob(base64))));
                    SDK.Storage.persist("userID", JSON.parse(window.atob(base64)).kid);
                    // localStorage.setItem("userId", JSON.parse(window.atob(base64)).kid);
                    //const currentUser = SDK.User.currentUser();
                }
        },

        // Henter userID via et AJAX-call
        getUserById: (id, cb) => {
          SDK.request({
              method: "GET",
              url: "/users/" + id,
          }, cb)
        },

        // Henter all medlemmer via et AJAX-call.
        getAllMembers: (cb) => {
            SDK.request({
                    method: "GET",
                    url: "/users/",
                }, cb)
        },

        // Sender oplysninger til databasen så den kan oprette en bruger.
        createUser: (firstName, lastName, email, description, gender, major, password, semester, cb) => {
            SDK.request({
               // responseType: "plain/text",
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    gender: gender,
                    major: major,
                    semester: semester,
                    password: password,
                    description: description,
                },
                url: "/users/",
                method: "POST"
            }, cb)
        },

        // Min login metode til at logge ind.
        login: (email, password, cb) => {
            SDK.requestLogin({
                data: {
                    email: email,
                    password: password,
                },

                method: "POST"

            }, (data, error) => {

                if (error === "success") {
                    let token = data;

                    // Gemmer token i local storage.
                    SDK.Storage.persist("token", data);

                    cb(null, data);
                } else {
                    window.alert("Wrong email or password!");
                 }
            });
        },

        // Metode til at logge ud. Sletter alt der er gemt i local storage.
        logOut: () => {
            SDK.Storage.remove("token");
            SDK.Storage.remove("userID");
            window.location.href = "index.html";
        },

        // Metode til at indlæse nav-baren. Har her taget inspiration fra Javascript-client.
        loadNav: (cb) => {
            $("#nav-container").load("nav.html", () => {
                const currentUserId = SDK.User.currentUserId();
                if (SDK.Storage.load("token")) {
            $(".navbar-left").html(`
            <li><a class="navBar-buttons" style="color:whitesmoke;" href="profile.html">Your Profile</a></li>
            <li><a class="navBar-buttons" style="color:whitesmoke;" href="events.html">Events</a></li>
            <li><a class="navBar-buttons" style="color:whitesmoke;" href="members.html">Members</a></li>
          `);
            $(".navbar-right").html(`
            <li><a style="color:whitesmoke;" href="#" id="logout-link">Log out</a></li>
          `);
                }
                $("#logout-link").click(() => SDK.User.logOut());
                cb && cb();
            });
        }
    },

  Event: {

        // Ajax call til at hente alle events
        getAllEvents: (cb) => {
            SDK.request({
                method: "GET",
                url: "/events/",
            }, cb)
        },

      // Ajax call til at hente et event ud fra ID.
      getEventById: (id, cb) => {
          SDK.request({
              method: "GET",
              url: "/events/" + id,
          }, cb)
      },

      // Opretter et event via AJAX ved at sende information til databasen
      createEvent: (owner_id, title, startDate, endDate, description, cb) => {
          SDK.request({
             data: {
                 owner_id: owner_id,
                 title: title,
                 startDate: startDate,
                 endDate: endDate,
                 description: description
             },
              method: "POST",
              url: "/events/"

          }, cb)
      },

      // AJAX call til at tilmelde sig et event.
      subscribeToEvent: (user_id, event_id, cb) => {
            SDK.request({
                data: {
                  user_id: user_id,
                  event_id: event_id,
                },
                method: "POST",
                url: "/events/subscribe/",
            }, cb)
      },

  },

  Post: {

        // Ajax call til at hente alle posts
      getAllPosts: (cb) => {
          SDK.request({
              method: "GET",
              url: "/posts/",
          }, cb)
      },

      // AJAX call til at hente alle en post ud fra ID
      getPostById: (id, cb) => {
          SDK.request({
              method: "GET",
              url: "/posts/" + id,
          }, cb)
      },

      // Metode til at tilføje en global post.
      addGlobalPost: (owner, content, cb) => {
          SDK.request({
              data: {
                  owner: owner,
                  content, content,
              },
              url: "/posts/",
              method: "POST"
          }, cb)
      },

      // Metode til at tilføje en post til et event
      addPostToEvent: (owner, content, event, cb) => {
          SDK.request({
              data: {
                  owner: owner,
                  content: content,
                  event: event,
              },
              url: "/posts/",
              method: "POST"
          }, cb)
      },

      // Metode til at tilføje en post til en post (kommentar)
      addPostToPost: (owner, content, parent, cb) => {
          SDK.request({
              data: {
                  owner: owner,
                  content: content,
                  parent: parent,
              },
              url: "/posts/",
              method: "POST"
          }, cb)
      },
  },

    // Min storage, som bruges til at lagre og hente oplysninger fra local storage. Har her taget inspiration fra
    // javascript-client.
    Storage: {
        // Sætter her et prefix, sådan at alt der gemmes kommer til at hedde "Storage" først. Således vil programmet en
        // gang i fremtiden kunne gemme flere ting, og skelne mellem det forskellige.
        prefix: "Storage",
        // Metode til at tilføje noget til local storage.
        persist: (key, value) => {
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
        },
        // Metode til at hente noget fra local storage
        load: (key) => {
            const val = window.localStorage.getItem(SDK.Storage.prefix + key);
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
        // Metode til at fjerne noget fra local storage
        remove: (key) => {
            window.localStorage.removeItem(SDK.Storage.prefix + key);
        }
    }
};