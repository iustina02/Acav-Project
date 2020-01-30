

        var name = top_artists_name_cookies();
        var popularity = top_artists_popularity_cookies();

        var playlist_track_name = [];
        var playlist_track_popularity = [];

        var top_tracks_tracks = [];
        var top_tracks_popularity = [];

        var list_top_genres_genre = [];
        var list_top_genres_popularity = [];

        var list_top_artists_artist = [];
        var list_top_artists_popularity = [];

        var user_groups = [];
        var all_groups = [];

        var albums = [];
        var fans = [];


        var info_div = document.getElementById("info_div");
        var gen_select = document.getElementById("gen_select");
        var location_select = document.getElementById("location_select");
        let list_of_groups=  document.getElementById('list_of_groups');


        var cookies_name = name.split(",");


        for(i = 0; i < cookies_name.length ; i ++){
            if(cookies_name[i] == " users_gen" || cookies_name[i] == "users_gen"){
                document.getElementById("info_title").innerHTML = "User(s) with selected genre";
                let list_user = []
                let list_id = []
                
                let result = popularity[i];

                result = result.replace("[","");
                result = result.replace("]","");
                list_user = result.split(",");

                for(j = 0; j < cookies_name.length ; j ++){
                    if(cookies_name[j] == " users_id" || cookies_name[j] == "users_id" ){
                        let result = popularity[j];

                        result = result.replace("[","");
                        result = result.replace("\"", "");
                        result = result.replace("\"", "");
                        result = result.replace("]","");
                        list_id = result.split(",");
                        console.log(list_id);
                    }
                }

                for(let i = 0; i < list_user.length; i++){
                    let p1 = document.createElement('p');
                    p1_text = "User: "+list_user[i]+" with id: " + list_id[i];
                    p1.innerHTML = p1_text
                    info_div.appendChild(p1);
                }
            } else if(cookies_name[i] == " users_location" || cookies_name[i] == "users_location"){
                document.getElementById("info_title").innerHTML = "User(s) with selected location";
                let list_user = []
                let list_id = []
                
                let result = popularity[i];
                result = result.replace("[","");
                result = result.replace("]","");
                list_user = result.split(",");

                for(j = 0; j < cookies_name.length ; j ++){
                    if(cookies_name[j] == " users_id" || cookies_name[j] == "users_id" ){
                        let result = popularity[j];
                        result = result.replace("[","");
                        result = result.replace("\"", "");
                        result = result.replace("\"", "");
                        result = result.replace("]","");
                        list_id = result.split(",");
                        console.log(list_id);
                    }
                }

                for(let i = 0; i < list_id.length; i++){
                    let p1 = document.createElement('p');
                    p1_text = "User: "+list_user[i]+" with id: " + list_id[i];
                    p1.innerHTML = p1_text
                    info_div.appendChild(p1);
                }

            } else if(cookies_name[i] == " user_name_playlist" || cookies_name[i] == "user_name_playlist"){
                document.getElementById("info_title").innerHTML = "Spotify User Playlist";
                let result = popularity[i];

                let list_playlist = result.split(",")
                for( let i = 0; i < list_playlist.length; i++){
                    let Playlist = document.createElement('p');
                    result = list_playlist[i].replace("[","");
                    result = result.replace("\"", "");
                    result = result.replace("\"", "");
                    result = result.replace("]","");
                    Playlist_text = result;

                    Playlist.innerHTML = "Playlist: " + Playlist_text;
                    info_div.appendChild(Playlist);
                }

            }else if(cookies_name[i] == " playlist_track_pop" || cookies_name[i] == "playlist_track_pop"){
                playlist_track_popularity= popularity[i];
                
            }
            else if(cookies_name[i] == " list_top_tracks_track" || cookies_name[i] == "list_top_tracks_track"){
                top_tracks_tracks = popularity[i];
            }
            else if(cookies_name[i] == " list_top_tracks_popularity" || cookies_name[i] == "list_top_tracks_popularity"){
                top_tracks_popularity = popularity[i];
            }
            else if(cookies_name[i] == " list_top_genres_genre" || cookies_name[i] == "list_top_genres_genre"){
                list_top_genres_genre = popularity[i];
            }
            else if(cookies_name[i] == " list_top_genres_popularity" || cookies_name[i] == "list_top_genres_popularity"){
                list_top_genres_popularity = popularity[i];
            }
            else if(cookies_name[i] == " list_top_artists_artist" || cookies_name[i] == "list_top_artists_artist"){
                list_top_artists_artist = popularity[i];
            }
            else if(cookies_name[i] == " list_top_artists_popularity" || cookies_name[i] == "list_top_artists_popularity"){
                list_top_artists_popularity = popularity[i];
            }
            else if(cookies_name[i] == " user_groups" || cookies_name[i] == "user_groups"){
                user_groups = popularity[i];
                if (!("user_groups" in sessionStorage)) {
                    sessionStorage.setItem('user_groups',user_groups);
                }
            }
            else if(cookies_name[i] == " all_groups" || cookies_name[i] == "all_groups"){
                all_groups = popularity[i];
                if (sessionStorage.getItem("all_groups") == null) {
                    sessionStorage.setItem('all_groups',all_groups);
                }
            }
            else if(cookies_name[i] == " playlist_track_name" || cookies_name[i] == "playlist_track_name"){
                playlist_track_name= popularity[i];
                
            } else if(cookies_name[i] == " error" || cookies_name[i] == "error"){
                console.log(popularity[i]);
            } else if(cookies_name[i] == "search_result" || cookies_name[i] == " search_result"){
                let result = popularity[i];
                result = result.replace("[","");
                result = result.replace("\"", "");
                result = result.replace("\"", "");
                result = result.replace("]","");

                albums = result.split(",");

                for(j = 0; j < cookies_name.length ; j ++){
                    if(cookies_name[j] == " fans" || cookies_name[j] == "fans" ){
                        let result = popularity[j];
                        fans = result.split(':')[1].replace("[]","").split(',');

                    }
                }
            }
            else if(cookies_name[i] == "user_name_display" || cookies_name[i] == " user_name_display"){
                document.getElementById('user_welcome').innerHTML= "Hello, "+popularity[i];
            }

        }


        user_groups = sessionStorage.getItem('user_groups').split(',');
        all_groups = sessionStorage.getItem("all_groups").split(',');
        if(user_groups.length > 0){
            for(let i = 0; i < user_groups.length; i++){
                let p1 =  document.createElement('p');
                result = user_groups[i].replace("[","").replace("]","").replace("\"","").replace("\"","");
                p1.innerHTML = result;
                list_of_groups.appendChild(p1);
            }
        }

        for( i = 0; i < all_groups.length; i++){
            var pCreate = document.createElement('option');
            let result = all_groups[i];
            result = result.replace("[","");
            result = result.replace("\"", "");
            result = result.replace("\"", "");
            result = result.replace("]","");
            pCreate.innerHTML = result;
            pCreate.value = result;
            gen_select.appendChild(pCreate);

        }

        if(playlist_track_name.length >0 && playlist_track_popularity.length >0) {
            var playlist_track_name = playlist_track_name.split(':')[1].replace("[\"]","").split(",");
            var playlist_track_popularity = playlist_track_popularity.split(":")[1].replace("[\"]","").split(",");
            makegraph(playlist_track_name,playlist_track_popularity);
        }

        if(albums.length >0 && fans.length >0) {
            makegraph(albums,fans);
        }



    document.getElementById("search_eve").addEventListener("click", function(){
        // console.log("ceva");
        var result_gen = gen_select.options[gen_select.selectedIndex].value;
        var result_location = location_select.options[location_select.selectedIndex].value;

        if(result_gen != "0" && result_location != "0")
        {
            let result = result_gen+"/"+result_location;
            document.cookie = "data="+result;
            console.log(result);
        }
        else if(result_location != "0")
        {
            document.cookie = "data=gen/"+result_location;
        }          
        else if(result_gen != "0")
        {
            document.cookie = "data="+result_gen+"/location";
        }
        else if(input_user != null){
            console.log(input);
        }  
    })

    document.getElementById("search_user").addEventListener('keypress', function(e){
        if (e.key === 'Enter') {
            let input_user = document.getElementById("search_user").value;
            if(input_user != null){
                document.cookie = "user="+input_user;

                location.href = "/search_user";
            }
            else {
                console.log("enter");
            } 
        }

    })

    document.getElementById("search_artist_track").addEventListener('keypress', function(e){
        if (e.key === 'Enter') {
            let input_user = document.getElementById("search_artist_track").value;
            if(input_user != null){
                document.cookie = "search="+input_user;

                location.href = "/search_artist_track";
            }
            else {
                console.log("enter");
            } 
        }

    })

    document.getElementById("btn_top_tracks").addEventListener("click", function () {

        if (!("tracks_name" in sessionStorage)) {
            sessionStorage.setItem('tracks_name',top_tracks_tracks);
        }
        if (sessionStorage.getItem("tracks_popularity") == null) {
            sessionStorage.setItem('tracks_popularity',top_tracks_popularity);
        }

        let track_name = sessionStorage.getItem('tracks_name').split(',');
        let track_pop = sessionStorage.getItem("tracks_popularity").split(',');

        dataPoints = []

        for(let i =0; i < track_name.length; i++){
            y = track_pop[i].replace("j","").replace(":","").replace("[","");
            y = parseInt(y,10);
            x = track_name[i].replace("j","").replace(":","").replace("[","").replace("]","");
            point = {label: x, y: y}
            dataPoints.push(point);
        }

        var chart =  new CanvasJS.Chart("chartContainer", {
        theme: "dark1", // "light2", "dark1", "dark2"
        animationEnabled: true, // change to true		
        title:{
            text: "Tracks - Popularity"
            },
            data: [
            {
                // Change type to "bar", "area", "spline", "pie",etc.
                type: "area",
                dataPoints: dataPoints
            }
            ]
        });
        chart.render();

        let fdds =  document.querySelector("div.canvasjs-chart-container a");
        fdds.setAttribute("style", "display:none;");
        
        document.getElementById("btn-download").addEventListener("click",function() {
        chart.exportChart({format: "png"});
        });

        document.getElementById("btn-download-svg").addEventListener("click",function() {
            chart.exportChart({format: "svg"});
        });

        name = [];
        popularity = [];

        });

    document.getElementById("btn_top_artists").addEventListener("click", function () {

        if (!("artists_name" in sessionStorage)) {
            sessionStorage.setItem('artists_name',list_top_artists_artist);
        }
        if (sessionStorage.getItem("artists_popularity") == null) {
            sessionStorage.setItem('artists_popularity',list_top_artists_popularity);
        }

        let art_name = sessionStorage.getItem('artists_name').split(',');
        let art_pop = sessionStorage.getItem("artists_popularity").split(',');

        dataPoints = []

        for(let i =0; i < art_name.length; i++){
            y = art_pop[i].replace("j","").replace(":","").replace("[","");
            y = parseInt(y,10);
            x = art_name[i].replace("j","").replace(":","").replace("[","").replace("]","");
            point = {label: x, y: y}
            dataPoints.push(point);
        }

        var chart =  new CanvasJS.Chart("chartContainer", {
        theme: "dark1", // "light2", "dark1", "dark2"
        animationEnabled: true, // change to true		
        title:{
            text: "Artists- Popularity"
            },
            data: [
            {
                // Change type to "bar", "area", "spline", "pie",etc.
                type: "pie",
                dataPoints: dataPoints
            }
            ]
        });

        chart.render();

        let fdds =  document.querySelector("div.canvasjs-chart-container a");
        fdds.setAttribute("style", "display:none;");
        
        document.getElementById("btn-download").addEventListener("click",function() {
        chart.exportChart({format: "png"});
        });

        document.getElementById("btn-download-svg").addEventListener("click",function() {
            chart.exportChart({format: "svg"});
        });

        name = [];
        popularity = [];

        });

    document.getElementById("btn_top_genres").addEventListener("click", function () {

        if (!("genres_name" in sessionStorage)) {
            sessionStorage.setItem('genres_name',list_top_genres_genre);
        }
        if (sessionStorage.getItem("genres_popularity") == null) {
            sessionStorage.setItem('genres_popularity',list_top_genres_popularity);
        }

        let gen_name = sessionStorage.getItem('genres_name').split(',');
        let gen_pop = sessionStorage.getItem("genres_popularity").split(',');

        var chart =  new CanvasJS.Chart("chartContainer", {
        theme: "dark1", // "light2", "dark1", "dark2"
        animationEnabled: true, // change to true		
        title:{
            text: "Genres - Popularity"
            },
            data: [
            {
                // Change type to "bar", "area", "spline", "pie",etc.
                type: "bar",
                dataPoints: [
                    { label: gen_name[0],  y: parseInt(gen_pop[0].replace("j","").replace(":","").replace("[",""),10)},
                    { label: gen_name[1], y: parseInt(gen_pop[1],10)  },
                    { label: gen_name[2], y: parseInt(gen_pop[2],10)  },
                    { label: gen_name[3],  y: parseInt(gen_pop[3],10)  },
                    { label: gen_name[4],  y: parseInt(gen_pop[4],10)  },
                    { label: gen_name[5],  y: parseInt(gen_pop[5],10) },
                    { label: gen_name[6], y: parseInt(gen_pop[6],10)  },
                    { label: gen_name[7], y: parseInt(gen_pop[7],10)  },
                    { label: gen_name[8],  y: parseInt(gen_pop[8],10)  },
                    { label: gen_name[9],  y: parseInt(gen_pop[9],10)  }
                ]
            }
            ]
        });
        chart.render();

        let fdds =  document.querySelector("div.canvasjs-chart-container a");
        fdds.setAttribute("style", "display:none;");
        
        document.getElementById("btn-download").addEventListener("click",function() {
        chart.exportChart({format: "png"});
        });

        document.getElementById("btn-download-svg").addEventListener("click",function() {
            chart.exportChart({format: "svg"});
        });

        name = [];
        popularity = [];

        });


    function makegraph(a,b){

        let track_name = a;
        let track_pop = b;

        dataPoints = [];

        for(i = 0 ; i <track_name.length; i++){
            point = {};
            y = track_pop[i];
            y = parseInt(y,10);
            x = track_name[i].replace("j","").replace(":","").replace("[","").replace("]","");
            point = { label: x, y:y}
            dataPoints.push(point);
        }

        console.log(dataPoints);
        

        var chart =  new CanvasJS.Chart("chartContainer", {
        theme: "dark1", // "light2", "dark1", "dark2"
        animationEnabled: true, // change to true		
        title:{
            text: "search top"
            },
            data: [
            {
                // Change type to "bar", "area", "spline", "pie",etc.
                type: "spline",
                dataPoints: dataPoints
            }
            ]
        });
        chart.render();

        let fdds =  document.querySelector("div.canvasjs-chart-container a");
        fdds.setAttribute("style", "display:none;");
        
        document.getElementById("btn-download").addEventListener("click",function() {
        chart.exportChart({format: "png"});
        });

        document.getElementById("btn-download-svg").addEventListener("click",function() {
            chart.exportChart({format: "svg"});
        });
    }

    function top_artists_name_cookies(){
        var name = [];
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');

        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            var split_c = c.split('=');
            name.push(split_c[0]);
        }
        return name;
    }

    function top_artists_popularity_cookies(){
        var popularity = [];
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');

        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            var split_c = c.split('=');
            popularity.push(split_c[1]);
        }
        return popularity;
    }

    function deleteAllCookies() {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    function check(){
        user_groups = sessionStorage.getItem('user_groups').split(',');
        all_groups = sessionStorage.getItem("all_groups").split(',');
        if(user_groups.length > 0){
            for(let i = 0; i < user_groups.length; i++){
                let p1 =  document.createElement('p');
                result = user_groups[i].replace("[","").replace("]","").replace("\"","").replace("\"","");
                p1.innerHTML = result;
                list_of_groups.appendChild(p1);
            }
        }

        for( i = 0; i < all_groups.length; i++){
            var pCreate = document.createElement('option');
            let result = all_groups[i];
            result = result.replace("[","");
            result = result.replace("\"", "");
            result = result.replace("\"", "");
            result = result.replace("]","");
            pCreate.innerHTML = result;
            pCreate.value = result;
            gen_select.appendChild(pCreate);

        }
    }
