// console.log("Hello Pankaj");

let currentSong = new Audio();
let songs;
let currFolder;


function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            let songName = decodeURIComponent(element.href).split("\\").pop();
            songs.push(songName);
        }
    }

    // show all the songs in the songlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="imgs/music.svg" alt="Music Icon">
                            <div class="info">
                                <div>${song.replace(".mp3", "")}</div>
                                
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="playb" src="imgs/play.svg" alt="Play Icon">
                            </div>
                    </li>`;
    }

    // Attach an event listener to each song in the list
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            const songName = e.querySelector(".info").firstElementChild.innerText.trim();
            console.log(songName);
            playMusic(songName + ".mp3");
        })
    });

    return songs;

}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play();
        play.src = 'imgs/pause.svg'
    }

    document.querySelector('.songinfo').innerHTML = ("track").replace("track", track.replace(".mp3", ""))
    document.querySelector('.songtime').innerHTML = '00:00 / 00:00'
}

// Dsiplay Albums Function 
async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("songs") && !e.href.includes(".htaccess")) {
            let folder = decodeURIComponent(e.href).replace(/\/$/, "").split("\\").pop();

            // Get the meta data of each folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card rounded">
                        <div class="play">
                            <img src="imgs/play.svg" alt="Play Icon">
                        </div>

                        <img class="rounded" src="/songs/${folder}/cover.jpg" alt="">

                        <h3>${response.title}</h3>

                        <p>${response.description}</p>
                    </div>`
        }
    }


    // Load the playlist while clicking
    Array.from(document.getElementsByClassName('card')).forEach(e => {
        e.addEventListener('click', async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0]);

        })
    })




}


async function main() {

    // get the list of all songs
    songs = await getSongs(`songs/cs`);
    playMusic(songs[0], true)

    // Display all the albums on page
    displayAlbums()



    // Attach an event listener to play, next & prevous buttons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = 'imgs/pause.svg'
        }
        else {
            currentSong.pause()
            play.src = 'imgs/play.svg'
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector('.songtime').innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + '%';
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener('click', () => {
        document.querySelector(".left").style.left = '0'
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener('click', () => {
        document.querySelector(".left").style.left = '-110%'
    })

    // Add an event listener for previous & next button
    previous.addEventListener("click", () => {
        console.log("Previous button clicked");

        let index = songs.indexOf(decodeURIComponent(currentSong.src.split('/').slice(-1)[0]));
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        console.log("Next button clicked");

        let index = songs.indexOf(decodeURIComponent(currentSong.src.split('/').slice(-1)[0]));
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    // Add an event listener for volume control
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100;
        if(currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    }); 

    // Add event listener to mute
    document.querySelector(".volume>img").addEventListener("click", e=>{
        if(e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })






}



main();