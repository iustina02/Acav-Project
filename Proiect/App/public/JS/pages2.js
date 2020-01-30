    let login_page = document.getElementById("Login");
    let home_page = document.getElementById("Home");
    let menu_page = document.getElementById("Menu");
        (function() {

                function getHashParams() {
                var hashParams = {};
                var e, r = /([^&;=]+)=?([^&;]*)/g,
                    q = window.location.hash.substring(1);
                while ( e = r.exec(q)) {
                    hashParams[e[1]] = decodeURIComponent(e[2]);
                }
                return hashParams;
                }

                var params = getHashParams();

                var page = params.page,
                    error = params.error;
                console.log(params);
                
                if (error) {
                    alert('There was an error during the authentication');
                }else {
                    if (page) {
                        login_page.classList.add("inactive");
                        login_page.classList.remove("active");
                        home_page.classList.add("active");
                        menu_page.classList.add("inactive");
                    } else {
                        login_page.classList.add("active");
                        home_page.classList.add("inactive");
                        menu_page.classList.add("inactive");
                    }
                }
         })();

         function top_menu(){
            menu_page.classList.add("active");
            menu_page.classList.remove("inactive");
            home_page.classList.remove("active");
            home_page.classList.add("inactive");
        }

        function home(){
            menu_page.classList.add("inactive");
            menu_page.classList.remove("active");
            home_page.classList.add("active");
            home_page.classList.remove("inactive");
        }

        function Log_out(){
            menu_page.classList.remove("active");
            menu_page.classList.add("inactive");
            home_page.classList.remove("active");
            home_page.classList.add("inactive");

            login_page.classList.remove("inactive");
            login_page.classList.add("active");
        }

        function myFunction(){
            location.reload();
        }