﻿
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}


let loadedSongs = [];
let loadedPlaylists = [];

let CURRENT_PLAYLIST;
let CURRENT_SONG;

const setSong = (id, play = false) => {
    CURRENT_SONG = id;
    const player = document.getElementById('player');

    const song = loadedSongs.find(song => song.id === id);
    player.src = `cdn/${song.trackName}`;

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

const handleSearchInputChange = (filter) => {
    const input = document.querySelector(`input.search_input.${filter}`);
    globalSongFilter[filter] = input.value;
    fetchSongs();
};
    
const makeDiv = (classes, clickHandler) => {
    const div = document.createElement('div');
    classes.forEach(className => div.classList.add(className));

    if (clickHandler) div.addEventListener('click', () => clickHandler());

    return div;
}

const makeIcon = (classes) => {
    const i = document.createElement('i');
    classes.forEach(className => i.classList.add(className));

    return i;
};

const makeInput = (type, placeholder, name) => {
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.name = name;
    return input;
};

const makeClickBlocker = () => {
    const blocker = makeDiv(['click_blocker'], () => {
        blocker.parentElement.parentElement.removeChild(blocker.parentElement);
    });
    return blocker;
};

const makeHeader = (size, text) => {
    const header = document.createElement(`h${size}`);
    header.textContent = text;
    return header;
};

const showLoginForm = () => {
    const container = makeDiv(['form_container']);
    {
        const clickBlocker = makeClickBlocker();
        container.append(clickBlocker);

        const form = document.createElement('form');
        {
            const loginResultHandler = (result) => {
                message.classList.remove('hidden', 'success', 'fail');

                if (result.status) {
                    onLoginSuccesful(result);
                    message.classList.add('success');
                    message.textContent = result.message;

                    loginInput.classList.add('hidden');
                    passwordInput.classList.add('hidden');
                    submit.classList.add('hidden');

                } else {
                    message.classList.add('fail');
                    message.textContent = result.message;
                }
            };

            form.method = 'post';
            form.enctype = "multipart/form-data";

            const header = makeHeader(3, 'Sign in');
            form.append(header);

            const loginInput = makeInput('text', 'Username', 'username');
            form.append(loginInput);

            const passwordInput = makeInput('password', 'Password', 'password');
            form.append(passwordInput);

            const submit = makeInput('submit');
            submit.addEventListener('click', (evt) => {
                evt.preventDefault();

                const formData = new FormData(form);

                sendLoginRequest(loginResultHandler, formData);
            });
            submit.value = 'Login';
            form.append(submit);

            const message = makeDiv(['message', 'hidden']);
            form.append(message);

            container.append(form);
        }
    }

    document.body.append(container);
};

const refreshSongList = () => {

    const container = document.querySelector('div.song_list');
    container.innerHTML = "";

    loadedSongs.forEach(song => {
        const row = makeDiv(['grid_row', 'song_item', song.id]);
        {
            const playColumn = makeDiv(['grid_col-1']);
            {
                const buttonPlay = makeDiv(['button_play'], () => setSong(song.id, true));
                {
                    const playIcon = makeIcon(["fas", "fa-play"]);
                    buttonPlay.append(playIcon);
                    playColumn.append(buttonPlay);
                }

                row.append(playColumn);
            }

            const nameColumn = makeDiv(['grid_col-4']);
            {
                nameColumn.innerText = song.name;
                row.append(nameColumn);
            }

            const authorColumn = makeDiv(['grid_col-4']);
            {
                authorColumn.innerText = song.author;
                row.append(authorColumn);
            }

            const durationColumn = makeDiv(['grid_col-2']);
            {
                durationColumn.innerText = song.duration.toString().toHHMMSS();
                row.append(durationColumn);
            }

            const optionsColumn = makeDiv(['grid_col-1']);
            {
                const buttonOptions = makeDiv(['button_options'], () => console.log('options'));
                {
                    const optionsIcon = makeIcon(["fas", "fa-ellipsis-h"]);
                    buttonOptions.append(optionsIcon);
                    optionsColumn.append(buttonOptions);
                }
                row.append(optionsColumn);
            }
        }

        container.append(row);
    });

};

const setCurrentPlaylist = (id) => {
    globalSongFilter.playlist_id = id;
    CURRENT_PLAYLIST = id;
};

const refreshPlaylists = () => {
    const container = document.querySelector('div#playlist_list');
    container.innerHTML = '';

    const allSongsButton = makeDiv(['playlist_item', 'all_songs'], () => {
        setCurrentPlaylist(0);
        fetchSongs();
    });
    allSongsButton.textContent = 'All songs';
    container.append(allSongsButton);


    loadedPlaylists.forEach(playlist => {
        const playlistButton = makeDiv(['playlist_item', playlist.id], () => {
            setCurrentPlaylist(playlist.id);
            fetchSongs();
        });

        playlistButton.textContent = playlist.name;

        container.append(playlistButton);
    });
};

const globalSongFilter = {
    name: null,
    author: null,
    playlist_id: 0
};

const fetchPlaylists = () => {
    const onLoad = (result) => {
        console.log(result);
        loadedPlaylists = result;
        refreshPlaylists();
    };

    fetch(`GetPlaylists?user_id=${loggedUserId}`)
        .then(response => response.json())
        .then(json => onLoad(json));
};


const fetchSongs = (setSongOnLoad = false) => {
    const onLoad = (result) => {
        loadedSongs = result;
        refreshSongList();
        if (setSongOnLoad) setSong(loadedSongs[0].id, false);
    };

    const filter = globalSongFilter;
    let query = '?';
    for (let option in filter) {
        if (filter[option]) query += `${option}=${filter[option]}&`;
    }

    fetch(`GetSongs${query}`)
        .then(response => response.json())
        .then(json => onLoad(json));
};

const onLoginSuccesful = (result) => {
    loggedUserId = result.userId;
    loggedUsername = result.username;
    setUser();
    fetchPlaylists();
    fetchSongs();
}; 

const onLogout = () => {
    loggedUserId = 0;
    loggedUsername = null;
    setUser();
    fetchPlaylists();
    fetchSongs();
};

const sendLoginRequest = (loginResultHandler, credentials) => {
    const onResult = (result) => {
        loginResultHandler(result);
    };

    fetch('Login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "RequestVerificationToken": $('input:hidden[name="__RequestVerificationToken"]').val()
        },
        body: credentials,
        credentials: 'include'
    }).then(response => response.json()).then(result => onResult(result));
};

const sendLogoutRequest = () => {
    fetch('Logout')
        .then(response => response.json())
        .then(json => {
            onLogout();
        });
};

const setUser = () => {
    const userContainer = document.querySelector('div#user_container');

    userContainer.innerHTML = "";

    if (loggedUserId !== 0) {
        const usernameContainer = makeDiv(['username_container']);
        usernameContainer.textContent = loggedUsername;
        userContainer.append(usernameContainer);

        const logoutButton = makeDiv(['button_logout'], () => {
            sendLogoutRequest();
        });

        const icon = makeIcon(['fas', 'fa-sign-out-alt']);
        logoutButton.append(icon);
        userContainer.append(logoutButton);

    } else {
        const loginButton = makeDiv(['button_login'], () => {
            showLoginForm();
        });
        const icon = makeIcon(['fas', 'fa-sign-in-alt']);
        loginButton.append(icon);

        userContainer.append(loginButton);
    }
};

window.onload = () => {
    setUser();
    fetchSongs(true);
    fetchPlaylists();
};

