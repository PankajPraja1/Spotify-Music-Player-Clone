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

    console.log("Loading folder:", currFolder);

    let a = await fetch(`/${folder}/`);
    if (!a.ok) {
        console.error("Could not load folder:", folder);
        return [];
    }

    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        const href = element.getAttribute("href");
        if (!href) {
            continue;
        }

        if (href.toLowerCase().endsWith(".mp3")) {
            let songName = decodeURIComponent(href).split(/[\\/]/).pop();
            songs.push(songName);
        }
    }

    console.log("Current folder:", currFolder);
    console.log("Songs:", songs);

    // show all the songs in the songlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";

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
        e.addEventListener("click", () => {
            const songName = e.querySelector(".info").firstElementChild.innerText.trim();
            console.log("Selected song:", songName);
            playMusic(songName + ".mp3");
        });
    });

    return songs;
}

// Play Music Function
const playMusic = (track, pause = false) => {
    if (!track) {
        console.error("No track provided!");
        return;
    }
    console.log("Playing:", track);
    console.log("Folder:", currFolder);

    currentSong.src = `/${currFolder}/${encodeURIComponent(track)}`;
    console.log("Audio URL:", currentSong.src);

    if (!pause) {
        currentSong.play()
            .then(() => {
                play.src = "imgs/pause.svg";
            })
            .catch(error => {
                console.error(
                    "Could not play music:",
                    error
                );
            });
    }

    document.querySelector('.songinfo').innerHTML = track.replace(".mp3", "")
    document.querySelector('.songtime').innerHTML = '00:00 / 00:00'
}

// Dsiplay Albums Function 
async function displayAlbums() {
    try {
        let a = await fetch(`/songs/`);
        let response = await a.text();

        let div = document.createElement("div");
        div.innerHTML = response;

        let anchors = div.getElementsByTagName("a");
        let cardContainer = document.querySelector(".cardContainer");

        for (let i = 0; i < anchors.length; i++) {
            const element = anchors[i];
            const href = element.getAttribute("href");

            console.log("raw Album href:", href);

            if (!href || href === "../" || href.includes(".htaccess")) {
                continue;
            }

            let folder = decodeURIComponent(href).replace(/\\/g, "/").replace(/\/+$/, "").split("/").pop();

            console.log("Album folder:", folder);

            if (!folder || folder === "songs") {
                continue;
            }

            try {
                // Get the meta data of each folder
                let meta = await fetch(`/songs/${folder}/info.json`);

                console.log(
                    "Fetching:",
                    `/songs/${folder}/info.json`
                );

                if (!meta.ok) {
                    console.log(
                        `Could not find info.json for ${folder}`
                    );
                    continue;
                }

                let info = await meta.json();

                cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card rounded">
                        <div class="play">
                            <img src="imgs/play.svg" alt="Play Icon">
                        </div>

                        <img class="rounded" src="/songs/${folder}/cover.jpg" alt="">

                        <h3>${info.title}</h3>

                        <p>${info.description}</p>
                    </div>`;

            } catch (error) {

                console.error(
                    `Error loading album ${folder}:`,
                    error
                );
            }
        }

        // Load the playlist while clicking
        Array.from(document.getElementsByClassName('card')).forEach(e => {
            e.addEventListener('click', async item => {
                const folder = item.currentTarget.dataset.folder;

                console.log("Clicked album:", folder);

                songs = await getSongs(`songs/${folder}`);
                if (songs.length > 0) {
                    playMusic(songs[0]);
                }
            });
        });

    } catch (error) {
        console.error(
            "Error displaying albums:",
            error
        );
    }
}

async function main() {
    // get the list of all songs
    songs = await getSongs(`songs/cs`);
    if (songs.length > 0) {
        playMusic(songs[0], true);
    }

    // Display all the albums on page
    await displayAlbums()

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
    });

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector('.songtime').innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;

        if (currentSong.duration) {
            document.querySelector(".circle").style.left =
                (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

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
        document.querySelector(".left").style.left = '-120%'
    })

    // Add an event listener for previous & next button
    previous.addEventListener("click", () => {
        console.log("Previous button clicked");

        let index = songs.indexOf(decodeURIComponent(currentSong.src.split('/').pop()));
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        console.log("Next button clicked");

        let index = songs.indexOf(decodeURIComponent(currentSong.src.split('/').pop()));
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    // Add an event listener for volume control
    const volumeInput = document.querySelector(".range").getElementsByTagName("input")[0];

    volumeInput.addEventListener("change", e => {
        console.log("Setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    });

    // Add event listener to mute
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (currentSong.volume > 0) {
            currentSong.volume = 0;
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            volumeInput.value = 0;
        }
        else {
            currentSong.volume = .1;
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            volumeInput.value = 10;
        }
    });
}

main();