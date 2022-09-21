const wrapper = document.querySelector(".wrapper");
const musicImg = wrapper.querySelector(".img-area img");
const musicName = wrapper.querySelector(".song-details .name");
const musicArtist = wrapper.querySelector(".song-details .artist");
const audio = wrapper.querySelector("#main-audio");
const playPauseBtn = wrapper.querySelector(".play-pause");
const nextBtn = wrapper.querySelector("#next");
const prevBtn = wrapper.querySelector("#prev");
const progress_bar = wrapper.querySelector(".progress-bar");
const progress_area = wrapper.querySelector(".progress-area")
const durationtext = wrapper.querySelector(".duration");
const currenttimetext = wrapper.querySelector(".current");
const showmorebutton = wrapper.querySelector("#more-music");
const hidemusicbutton = wrapper.querySelector("#close");
const musiclist = wrapper.querySelector(".music-list");



let musicIndex = 2;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
})

showmorebutton.addEventListener("click", () => {
    console.log("show more button");
    musiclist.classList.toggle("show");
});
hidemusicbutton.addEventListener("click", () => {
    console.log("close button event");
    musiclist.classList.remove("show");
});

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    audio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    audio.play();
    playingNow();
}
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    audio.pause();
}
function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

playPauseBtn.addEventListener("click", (event) => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
});

nextBtn.addEventListener("click", (event) => {
    nextMusic();
});

prevBtn.addEventListener("click", (event) => {
    prevMusic();
});

audio.addEventListener("timeupdate", (event) => {
    var currentTime = event.target.currentTime;
    var duration = event.target.duration;
    var percentagePlayed = (currentTime / duration) * 100;
    console.log(percentagePlayed + "%");
    progress_bar.style.width = percentagePlayed + "%";

    audio.addEventListener("loadeddata", () => {
        var audioDuration = audio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        durationtext.innerText = `${totalMin}:${totalSec}`
    });
    console.log(currentTime);
    var currenttotalMin = Math.floor(currentTime / 60);

    var currenttotalSec = Math.floor(currentTime % 60);

    if (currenttotalSec < 10) {
        currenttotalSec = `0${currenttotalSec}`;
    }
    console.log("currenttotalMin :" + currenttotalMin)
    console.log("currenttotalMin :" + currenttotalSec);
    currenttimetext.innerText = currenttotalMin + ":" + currenttotalSec;
});

progress_area.addEventListener("click", (event) => {
    var progressbarwidth = progress_area.clientWidth;
    var progressbarclickedoffsetX = event.offsetX;
    console.log("audio length" + audio.duration);
    console.log("progress bar width" + progressbarwidth);
    audio.currentTime = (progressbarclickedoffsetX / progressbarwidth) * audio.duration;
    playMusic();
});

const repeatBtn = wrapper.querySelector('#repeat-plist');
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song Looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

audio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            console.log("repeat");
            // if this is set play the next song;
            nextMusic();
            break;
        case "repeat_one":
            console.log("repeat one");
            // if this is set play the song from the begining
            audio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            console.log("shuffle");
            //if this is set play the music randomly
            var randomIndex = Math.floor((Math.random() * musicIndex) + 1);
            console.log("random value" + randomIndex);
            musicIndex = randomIndex;
            loadMusic(musicIndex);
            playMusic();
            break;
    }
});

const ultag = wrapper.querySelector("#song-list");

for (var i = 0; i < allMusic.length; i++) {
    let litag = `<li li-index="${i + 1}">
            <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
            </div>
            <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
            <span id="${allMusic[i].src}" class="audio-duration"></span>
        </li>`;
    ultag.insertAdjacentHTML("beforeend", litag);

    let liAudioDuration = ultag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ultag.querySelector(`.${allMusic[i].src}`);


    liAudioTag.addEventListener("loadeddata", () => {
        console.log("test");
        console.log(liAudioTag.duration);
        var audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        console.log(totalMin + ":" + totalSec);
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        console.log(liAudioDuration.innerText);
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}
console.log(document.getElementsByTagName("li")[2].innerText + "innertext");

function playingNow() {
    
    const allLitags = ultag.querySelectorAll("li");
    
    for (let j = 0; j < allLitags.length; j++) {
        
        let audiotag = allLitags[j].querySelector(".audio-duration");
        if(allLitags[j].classList.contains("playing")){
            allLitags[j].classList.remove("playing");
            let addduration = audiotag.getAttribute("t-duration");
            console.log("hello");
            console.log("duration"+addduration);
            audiotag.innerText = addduration;
        }

        if (allLitags[j].getAttribute("li-index") == musicIndex) {
            console.log("inside li tag");
            allLitags[j].classList.add("playing");
            audiotag.innerText = "playing";
        }
        allLitags[j].setAttribute("onclick", "clicked(this)");
    }
}


//lets play the song on onclick
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}





