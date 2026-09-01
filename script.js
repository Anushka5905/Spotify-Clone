const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const songsContainer =
    document.getElementById("songsContainer");

const sectionTitle =
    document.getElementById("sectionTitle");


const playerImage =
    document.getElementById("playerImage");

const playerSong =
    document.getElementById("playerSong");

const playerArtist =
    document.getElementById("playerArtist");

const playBtn =
    document.getElementById("playBtn");

const progressBar =
    document.getElementById("progressBar");

const currentTime =
    document.getElementById("currentTime");

const totalTime =
    document.getElementById("totalTime");

const volumeBar =
    document.getElementById("volumeBar");



const audio = new Audio();

audio.volume = 0.7;



searchBtn.addEventListener("click", function () {

    searchSongs();

});



searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        searchSongs();

    }

});



function searchSongs() {


    const query =
        searchInput.value.trim();


    if (query === "") {

        alert("Please enter a song or artist name.");

        return;

    }


    sectionTitle.innerText =
        "Search Results";


    songsContainer.innerHTML =
        `<p class="loading">Loading songs...</p>`;



    const apiURL =
        "https://itunes.apple.com/search?term=" +
        encodeURIComponent(query) +
        "&entity=song&limit=20";


    console.log("API URL:", apiURL);


    fetch(apiURL)


        .then(function (response) {


            if (!response.ok) {

                throw new Error(
                    "Network response was not OK"
                );

            }


            return response.json();

        })


        .then(function (data) {


            console.log("API Response:", data);


            songsContainer.innerHTML = "";



            if (
                !data.results ||
                data.results.length === 0
            ) {


                songsContainer.innerHTML =
                    `<p>
                        No songs found.
                    </p>`;


                return;

            }


           

            data.results.forEach(function (song) {

                createSongCard(song);

            });


        })


        .catch(function (error) {


            console.error(
                "API ERROR:",
                error
            );


            songsContainer.innerHTML =
                `<p class="error">
                    Unable to load songs.
                    Please check your internet connection.
                </p>`;

        });

}



function createSongCard(song) {


    const card =
        document.createElement("div");


    card.classList.add("card");



    let image =
        "./Assets/card1img.jpeg";


    if (song.artworkUrl100) {

        image =
            song.artworkUrl100.replace(
                "100x100",
                "300x300"
            );

    }



    card.innerHTML = `

        <img
            src="${image}"
            class="card-img"
            alt="Album">

        <p class="card-title">
            ${song.trackName}
        </p>

        <p class="card-info">
            ${song.artistName}
        </p>

    `;



    card.addEventListener(
        "click",
        function () {

            playSong(song);

        }
    );


    songsContainer.appendChild(card);

}



function playSong(song) {


    console.log(
        "Selected:",
        song.trackName
    );



    if (!song.previewUrl) {


        alert(
            "Sorry, preview is not available for this song."
        );


        return;

    }



    if (song.artworkUrl100) {


        playerImage.src =
            song.artworkUrl100.replace(
                "100x100",
                "300x300"
            );

    }



    playerSong.innerHTML = `

        ${song.trackName}

        <br>

        <span id="playerArtist">
            ${song.artistName}
        </span>

    `;




    audio.src =
        song.previewUrl;



    audio.play()

        .then(function () {

            console.log(
                "Song is playing"
            );

        })

        .catch(function (error) {

            console.error(
                "Audio error:",
                error
            );

        });


   

    playBtn.innerHTML =
        '<i class="fa-solid fa-pause"></i>';



    progressBar.value = 0;

}




playBtn.addEventListener(
    "click",
    function () {


        // No song

        if (!audio.src) {


            alert(
                "Please search and select a song first."
            );


            return;

        }



        if (!audio.paused) {


            audio.pause();


            playBtn.innerHTML =
                '<i class="fa-solid fa-play"></i>';


        }


        else {


            audio.play();


            playBtn.innerHTML =
                '<i class="fa-solid fa-pause"></i>';

        }

    }
);



audio.addEventListener(
    "timeupdate",
    function () {


        if (!audio.duration) {

            return;

        }


        const progress =
            (audio.currentTime /
            audio.duration) * 100;


        progressBar.value =
            progress;


        currentTime.innerText =
            formatTime(
                audio.currentTime
            );


        totalTime.innerText =
            formatTime(
                audio.duration
            );

    }
);




progressBar.addEventListener(
    "input",
    function () {


        if (!audio.duration) {

            return;

        }


        audio.currentTime =
            (progressBar.value / 100)
            * audio.duration;

    }
);




volumeBar.addEventListener(
    "input",
    function () {


        audio.volume =
            volumeBar.value / 100;

    }
);



audio.addEventListener(
    "ended",
    function () {


        playBtn.innerHTML =
            '<i class="fa-solid fa-play"></i>';


        progressBar.value = 0;


        currentTime.innerText =
            "00:00";

    }
);



function formatTime(seconds) {


    if (isNaN(seconds)) {

        return "00:00";

    }


    const minutes =
        Math.floor(seconds / 60);


    const secs =
        Math.floor(seconds % 60);


    return (

        String(minutes).padStart(2, "0")

        +

        ":"

        +

        String(secs).padStart(2, "0")

    );

}
