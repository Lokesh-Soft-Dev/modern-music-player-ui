// DOM Elements
const elements = {
    playPauseBtn: document.getElementById('playPauseBtn'),
    playIcon: document.getElementById('playIcon'),
    audio: document.getElementById('audio'),
    progress: document.getElementById('progress'),
    progressBar: document.getElementById('progressBar'),
    progressHandle: document.getElementById('progressHandle'),
    volume: document.getElementById('volume'),
    muteBtn: document.getElementById('muteBtn'),
    volumeIcon: document.getElementById('volumeIcon'),
    favBtn: document.getElementById('favBtn'),
    favIcon: document.getElementById('favIcon'),
    speedSelect: document.getElementById('speedSelect'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    shuffleBtn: document.getElementById('shuffleBtn'),
    repeatBtn: document.getElementById('repeatBtn'),
    songTitle: document.getElementById('songTitle'),
    artistName: document.getElementById('artistName'),
    albumCover: document.getElementById('albumCover'),
    currentTimeDisplay: document.getElementById('currentTime'),
    durationDisplay: document.getElementById('duration')
};

// Player state
const state = {
    isPlaying: false,
    isMuted: false,
    isShuffled: false,
    isRepeated: false,
    isFavorite: false,
    isDragging: false,
    currentTrackIndex: 0,
    trackList: [
        {
            title: "Jai Bajarangi",
            artist: "Shankar Mahadevan",
            src: "./Audio/Jai-Bajarangi.mp3",
            cover: "./Images/Bajarangi.jpg"
        },
        {
            title: "DDLJ Love BGM",
            artist: "LOKESH",
            src: "./Audio/DDLJ.mp3",
            cover: "./Images/DDLJ.jpg"
        },
        {
            title: "Tujh Mein Rab Dikhta Hai",
            artist: "Roopkumar Rathod",
            src: "./Audio/Tujh Mein Rab Dikhta Hai - Rab Ne Bana Di Jodi 128 Kbps.mp3",
            cover: "./Images/RBDJ.jpg"
        },
        {
            title: "They Don't Care About Us",
            artist: "MJ - Michael Jackson",
            src: "./Audio/Michael Jackson - B02 They Don't Care About Us - History (Hi-Res 96000Hz 24Bits).mp3",
            cover: "./Images/MJ.jpg"
        },
        {
            title: "Maari - Tile Song",
            artist: "Anirudh Ravichandher",
            src: "./Audio/Maari Thara Local (Here Comes Maari).mp3",
            cover: "./Images/Maari.jpg"
        },
        {
            title: "Thuli-Thuli-Mazhaiyaai",
            artist: "Tanvi, Haricharan",
            src: "./Audio/Thuli-Thuli-Mazhaiyaai.mp3",
            cover: "./Images/Paiya.jpg"
        },
        {
            title: "Oy Oy",
            artist: "Prashanthini and Siddharth",
            src: "./Audio/01 - Oy! Oy! - SenSongsMp3.co.mp3",
            cover: "./Images/Oy Oy.jpg"
        }
    ]
};

// Utility functions
const utils = {
    formatTime: (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    },
    
    updateTimeDisplay: () => {
        elements.currentTimeDisplay.textContent = utils.formatTime(elements.audio.currentTime);
        elements.durationDisplay.textContent = utils.formatTime(elements.audio.duration || 0);
    },
    
    // Smooth transition for album cover changes
    fadeAlbumCover: (newSrc) => {
        elements.albumCover.style.opacity = 0;
        setTimeout(() => {
            elements.albumCover.src = newSrc;
            elements.albumCover.style.opacity = 1;
        }, 300);
    }
};

// Core player functions
const player = {
    updateTrackInfo: () => {
        const track = state.trackList[state.currentTrackIndex];
        elements.songTitle.textContent = track.title;
        elements.artistName.textContent = track.artist;
        
        // Update album cover with fade effect
        utils.fadeAlbumCover(track.cover);
        
        elements.audio.src = track.src;
        
        // Reset progress bar
        elements.progress.style.width = '0%';
        
        // Load the audio file
        elements.audio.load();
        
        // If player was playing, continue playing the new track
        if (state.isPlaying) {
            elements.audio.play().catch(e => console.log("Auto-play prevented:", e));
        }
        
        // Update favorite status
        player.resetFavoriteStatus();
        
        // Update time display immediately
        utils.updateTimeDisplay();
    },
    
    resetFavoriteStatus: () => {
        state.isFavorite = false;
        elements.favIcon.classList.remove('fas');
        elements.favIcon.classList.add('far');
        elements.favBtn.classList.remove('active');
    },
    
    togglePlayPause: () => {
        if (elements.audio.paused) {
            player.play();
        } else {
            player.pause();
        }
    },
    
    play: () => {
        elements.audio.play();
        elements.playIcon.classList.replace('fa-play', 'fa-pause');
        state.isPlaying = true;
    },
    
    pause: () => {
        elements.audio.pause();
        elements.playIcon.classList.replace('fa-pause', 'fa-play');
        state.isPlaying = false;
    },
    
    updateProgress: () => {
        if (state.isDragging) return;
        const { currentTime, duration } = elements.audio;
        const progressPercent = (currentTime / duration) * 100;
        elements.progress.style.width = `${progressPercent}%`;
        utils.updateTimeDisplay();
    },
    
    seek: (e) => {
        const width = elements.progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = elements.audio.duration;
        elements.audio.currentTime = (clickX / width) * duration;
    },
    
    setVolume: function() {
        const volumeValue = this.value;
        elements.audio.volume = volumeValue / 100;
        
        // Update volume icon
        if (volumeValue == 0) {
            elements.volumeIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
            state.isMuted = true;
        } else {
            elements.volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
            state.isMuted = false;
        }
    },
    
    toggleMute: () => {
        state.isMuted = !state.isMuted;
        elements.audio.muted = state.isMuted;
        
        if (state.isMuted) {
            elements.volumeIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
            elements.volume.value = 0;
        } else {
            elements.volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
            elements.volume.value = elements.audio.volume * 100;
        }
    },
    
    toggleFavorite: () => {
        state.isFavorite = !state.isFavorite;
        elements.favBtn.classList.toggle('active', state.isFavorite);
        elements.favIcon.classList.toggle('fas', state.isFavorite);
        elements.favIcon.classList.toggle('far', !state.isFavorite);
    },
    
    changeSpeed: function() {
        elements.audio.playbackRate = parseFloat(this.value);
    },
    
    nextTrack: () => {
        if (state.isShuffled) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * state.trackList.length);
            } while (newIndex === state.currentTrackIndex && state.trackList.length > 1);
            state.currentTrackIndex = newIndex;
        } else {
            state.currentTrackIndex = (state.currentTrackIndex + 1) % state.trackList.length;
        }
        player.updateTrackInfo();
    },
    
    prevTrack: () => {
        if (elements.audio.currentTime > 3) {
            // If more than 3 seconds into song, restart it
            elements.audio.currentTime = 0;
        } else {
            // Otherwise go to previous track
            state.currentTrackIndex = (state.currentTrackIndex - 1 + state.trackList.length) % state.trackList.length;
            player.updateTrackInfo();
        }
    },
    
    toggleShuffle: () => {
        state.isShuffled = !state.isShuffled;
        elements.shuffleBtn.classList.toggle('active', state.isShuffled);
    },
    
    toggleRepeat: () => {
        state.isRepeated = !state.isRepeated;
        elements.repeatBtn.classList.toggle('active', state.isRepeated);
        elements.audio.loop = state.isRepeated;
    },
    
    handleTrackEnd: () => {
        if (state.isRepeated) {
            elements.audio.currentTime = 0;
            elements.audio.play();
        } else {
            player.nextTrack();
        }
    },
    
    startDrag: () => {
        state.isDragging = true;
        elements.progressHandle.style.opacity = '1';
    },
    
    endDrag: () => {
        state.isDragging = false;
        elements.progressHandle.style.opacity = '0';
    },
    
    handleKeyDown: (e) => {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                player.togglePlayPause();
                break;
            case 'ArrowRight':
                elements.audio.currentTime = Math.min(elements.audio.currentTime + 5, elements.audio.duration);
                break;
            case 'ArrowLeft':
                elements.audio.currentTime = Math.max(elements.audio.currentTime - 5, 0);
                break;
            case 'ArrowUp':
                elements.volume.value = Math.min(parseInt(elements.volume.value) + 10, 100);
                player.setVolume.call(elements.volume);
                break;
            case 'ArrowDown':
                elements.volume.value = Math.max(parseInt(elements.volume.value) - 10, 0);
                player.setVolume.call(elements.volume);
                break;
            case 'KeyM':
                player.toggleMute();
                break;
            case 'KeyF':
                player.toggleFavorite();
                break;
            case 'KeyS':
                player.toggleShuffle();
                break;
            case 'KeyR':
                player.toggleRepeat();
                break;
            case 'KeyN':
                player.nextTrack();
                break;
            case 'KeyP':
                player.prevTrack();
                break;
        }
    }
};

// Event Listeners
const setupEventListeners = () => {
    // Player controls
    elements.playPauseBtn.addEventListener('click', player.togglePlayPause);
    elements.prevBtn.addEventListener('click', player.prevTrack);
    elements.nextBtn.addEventListener('click', player.nextTrack);
    elements.shuffleBtn.addEventListener('click', player.toggleShuffle);
    elements.repeatBtn.addEventListener('click', player.toggleRepeat);
    elements.favBtn.addEventListener('click', player.toggleFavorite);
    
    // Audio element events
    elements.audio.addEventListener('timeupdate', player.updateProgress);
    elements.audio.addEventListener('ended', player.handleTrackEnd);
    elements.audio.addEventListener('loadedmetadata', utils.updateTimeDisplay);
    elements.audio.addEventListener('canplay', utils.updateTimeDisplay);
    
    // Progress bar
    elements.progressBar.addEventListener('click', player.seek);
    elements.progressBar.addEventListener('mousemove', (e) => state.isDragging && player.seek(e));
    elements.progressBar.addEventListener('mousedown', player.startDrag);
    document.addEventListener('mouseup', player.endDrag);
    document.addEventListener('mousemove', (e) => {
        if (state.isDragging) {
            player.seek(e);
        }
    });
    
    // Volume control
    elements.volume.addEventListener('input', player.setVolume);
    elements.muteBtn.addEventListener('click', player.toggleMute);
    
    // Playback speed
    elements.speedSelect.addEventListener('change', player.changeSpeed);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', player.handleKeyDown);
    
    // Album cover load event
    elements.albumCover.addEventListener('load', () => {
        elements.albumCover.style.opacity = 1;
    });
};

// Initialize player
const initPlayer = () => {
    setupEventListeners();
    player.updateTrackInfo();
    elements.audio.volume = elements.volume.value / 100;
    
    // Initial album cover setup
    elements.albumCover.style.transition = 'opacity 0.3s ease';
    elements.albumCover.style.opacity = 1;
};

// Start the player
initPlayer();