
const loadedSongs = {};

const changeCurrentSong = (id) => {
    const player = document.getElementById('player');

    player.src = loadedSongs[id].src;
    player.load();
    player.play();
};