const audioPlayer = document.getElementById('audioPlayer');
const playPauseButton = document.getElementById('playPauseButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const seekSlider = document.getElementById('seekSlider');
const currentTimeLabel = document.getElementById('currentTime');
const totalTimeLabel = document.getElementById('totalTime');
const songList = document.getElementById('songList');
const addSongInput = document.getElementById('addSong');

let songs = [];
let currentSongIndex = 0;
let isPlaying = false;

// Format time in minutes:seconds
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Load selected song
function loadSong(song) {
    audioPlayer.src = song.url;

    // Ensure song is loaded and metadata is available
    audioPlayer.load();  // Ensure the audio file is loaded
    
    audioPlayer.onloadedmetadata = () => {
        totalTimeLabel.textContent = formatTime(audioPlayer.duration);
        seekSlider.max = audioPlayer.duration;
        currentTimeLabel.textContent = formatTime(0);
        seekSlider.value = 0;
        console.log(`Loaded song: ${song.name}`);
    };

    // Handle any errors while loading the song
    audioPlayer.onerror = (e) => {
        console.error(`Error loading audio file: ${e}`);
        alert('Error loading the selected audio file. Please make sure the file format is supported.');
    };
}

// Play or Pause song
playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseButton.textContent = 'Play';
    } else {
        if (audioPlayer.src) {
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        }
    }
    isPlaying = !isPlaying;
});

// Play next song
nextButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
    audioPlayer.play();
    isPlaying = true;
    playPauseButton.textContent = 'Pause';
});

// Play previous song
prevButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    audioPlayer.play();
    isPlaying = true;
    playPauseButton.textContent = 'Pause';
});

// Update seek slider and current time
audioPlayer.addEventListener('timeupdate', () => {
    if (!isNaN(audioPlayer.duration)) {
        seekSlider.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        currentTimeLabel.textContent = formatTime(audioPlayer.currentTime);
    }
});

// Seek in song
seekSlider.addEventListener('input', () => {
    if (!isNaN(audioPlayer.duration)) {
        audioPlayer.currentTime = (seekSlider.value / 100) * audioPlayer.duration;
    }
});

// Add song to the playlist
addSongInput.addEventListener('change', (event) => {
    const files = event.target.files;
    for (let file of files) {
        const song = {
            name: file.name,
            url: URL.createObjectURL(file)
        };
        songs.push(song);
        const li = document.createElement('li');
        li.textContent = song.name;
        li.addEventListener('click', () => {
            currentSongIndex = songs.indexOf(song);
            loadSong(songs[currentSongIndex]);
            audioPlayer.play();
            isPlaying = true;
            playPauseButton.textContent = 'Pause';
        });
        songList.appendChild(li);
    }
});

// Initial load (empty)
loadSong({ name: '', url: '' });
