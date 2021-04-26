
const loadedSongs = [];

let CURRENT_SONG;

const setSong = (id, play = false) => {
    CURRENT_SONG = id;
    const player = document.getElementById('player');

    const song = loadedSongs.find(song => song.id === id);
    player.src = song.src;

    player.load();

    if (play) player.play();

    const title = document.getElementById('song_title');
    title.textContent = song.author + ' - ' + song.name;

    setActive(id);
};

const nextSong = () => {
    let index = loadedSongs.findIndex(song => song.id === CURRENT_SONG) + 1;

    if (index === loadedSongs.length) index = 0;

    setSong(loadedSongs[index].id, true);
};

const previousSong = () => {
    let index = loadedSongs.findIndex(song => song.id === CURRENT_SONG) - 1;

    if (index === -1) index = loadedSongs.length - 1;

    setSong(loadedSongs[index].id, true);
};

const setActive = (id) => {
    const allSongs = document.getElementsByClassName('song_item');
    for (var i = 0; i < allSongs.length; i++) {
        allSongs[i].classList.remove('active');
        if (allSongs[i].classList.contains(id)) allSongs[i].classList.add('active');
    }

};