const musicImage = document.querySelector(".foot img"),
musicName = document.querySelector(".foot .name"),
musicArtist = document.querySelector(".foot .artist"),
mainAudio = document.getElementById('main-audio'),
playMusicBtn = document.querySelector(".control .play"),
prevBtn = document.getElementById('prev'),
nextBtn = document.getElementById('next'),
progressArea = document.querySelector('.progress-area'),
progressBar = document.querySelector('.progress-bar'),
repeatBtn = document.getElementById('repeat'),
shuffleBtn = document.getElementById('shuffle'),
totalSongs = document.querySelector('.topBar p'),
songsContainer = document.querySelector('.container .songs');

let musicIndex = 1;
//'Song looped' , 'Playback shuffle' and 'Playlist looped'
let afterEndState = 'Playlist looped';

window.addEventListener('load', () => {
  loadMusic(musicIndex);
})

//total songs
totalSongs.innerText = `${allMusic.length} Songs`

function loadMusicList(){
  //show list of music
  songsContainer.innerHTML = '';
  for(let i=0 ; i<allMusic.length ; i++){
    let songBar = `<div class="song${musicIndex == i+1 ? ` playing` : ``}" id="${i+1}">
    <audio id="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
    <span class="mark">${musicIndex == i+1 ? `<span class="material-symbols-outlined">
    graphic_eq
  </span>` : i+1}</span>
    <span class="name">${allMusic[i].name}</span>
    <span class="time" id="time${i+1}"></span>
  </div>`
    songsContainer.innerHTML = songsContainer.innerHTML + songBar;

    let divAudioDuration = songsContainer.querySelector(`#${allMusic[i].src}`)
    divAudioDuration.addEventListener('loadeddata', () => {
      let maxDurationTime = songsContainer.querySelector(`#time${i+1}`)
      // show total duration
      let audioDuration = divAudioDuration.duration;
      let totalMin = Math.floor(audioDuration / 60)
      let totalSec = Math.floor(audioDuration % 60)
      if(totalSec < 10){
        totalSec = `0${totalSec}`
      }
      maxDurationTime.innerText = `${totalMin}:${totalSec}`;
    })
  }
}

// load music
function loadMusic(index){
  musicName.innerText = allMusic[index - 1].name
  musicArtist.innerText = allMusic[index - 1].artist
  musicImage.src = `images/${allMusic[index - 1].src}.jpg`;
  mainAudio.src = `songs/${allMusic[index - 1].src}.mp3`;
  loadMusicList();
}

// play music 
playMusicBtn.addEventListener('click', () => {
  if(playMusicBtn.innerText == "play_circle"){
    mainAudio.play();
    playMusicBtn.innerText = "pause_circle"
  }else{
    mainAudio.pause();
    playMusicBtn.innerText = "play_circle"
  }
})

//show sound bar
function showShound(){
  var volumeControl = document.getElementById("volumeControl");
  if (volumeControl.style.visibility === "hidden") {
    volumeControl.style.visibility = "visible";
  } else {
    volumeControl.style.visibility = "hidden";
  }
}

function nextMusic(){
  musicIndex++;
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex
  loadMusic(musicIndex)
  playMusicBtn.innerText = "pause_circle"
  mainAudio.play();
}

// next music btn action
nextBtn.addEventListener('click', () => {
  nextMusic();
})

// next music btn action
prevBtn.addEventListener('click', () => {
  musicIndex--;
  musicIndex < 0  ? musicIndex = allMusic.length : musicIndex = musicIndex
  loadMusic(musicIndex)
  playMusicBtn.innerText = "pause_circle"
  mainAudio.play();
})

// progress bar changes
mainAudio.addEventListener('timeupdate', (e) => {
  const currentTime = e.target.currentTime;
  const allTime = e.target.duration;
  let progressWedth = (currentTime/allTime) * 100;
  progressBar.style.width = `${progressWedth}%`;

  mainAudio.addEventListener('loadeddata', () => {
    let maxDurationTime = document.querySelector('.song-timer .max-duration')
    
    // show total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60)
    let totalSec = Math.floor(audioDuration % 60)
    if(totalSec < 10){
      totalSec = `0${totalSec}`
    }
    maxDurationTime.innerText = `${totalMin}:${totalSec}`;
  })
  
  // show current time
  let musicCurrentTime = document.querySelector('.song-timer .current-time')
  let currentMin = Math.floor(currentTime / 60)
  let currentSec = Math.floor(currentTime % 60)
  if(currentSec < 10){
    currentSec = `0${currentSec}`
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
})

// update playing song currentTime on press on progress bar
progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; //getting width of progress bar
  let clickedOffsetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; //getting song total duration
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  if(playMusicBtn.innerText == "pause_circle"){
    mainAudio.play()
  }
});

//afterEndState
//'Song looped' , 'Playback shuffle' and 'Playlist looped'

//repeat, shuffle and repeat one
//repeat
repeatBtn.addEventListener('click', () => {
  let innerTxt = repeatBtn.innerText;
  if(shuffleBtn.classList[2] == 'active'){
    shuffleBtn.classList.remove('active');
    afterEndState = 'Playlist looped'
  }
  if(repeatBtn.classList[2] == 'active'){
    if(innerTxt == 'repeat'){
      repeatBtn.innerText = 'repeat_one'
      afterEndState = 'Song looped'
    } else {
      repeatBtn.innerText = 'repeat'
      afterEndState = 'Playlist looped'
    }
  }
  repeatBtn.classList.add('active');
})

//shuffle
shuffleBtn.addEventListener('click', () => {
  if(shuffleBtn.classList[2] != 'active'){
    if(repeatBtn.innerText == 'repeat_one')
      repeatBtn.innerText = 'repeat'
    afterEndState = 'Playback shuffle';
    shuffleBtn.classList.add('active');
    repeatBtn.classList.remove('active');
  }
})

//after audio end
mainAudio.addEventListener('ended', () => {
  switch(afterEndState){
    case "Playlist looped":
      nextMusic(); //calling nextMusic function
      break;
    case "Song looped":
      mainAudio.currentTime = 0; //setting audio current time to 0
      loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
      mainAudio.play()
      break;
    case "Playback shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
      musicIndex = randIndex; //passing randomIndex to musicIndex
      loadMusic(musicIndex);
      mainAudio.play();
      break;
  }
})

//change volume

function changeVolume(volume) {
  mainAudio.volume = volume;
}