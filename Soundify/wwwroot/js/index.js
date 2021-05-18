
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

    setActiveSong(id);
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

const setActiveSong = (id) => {
    const allSongs = document.getElementsByClassName('song_item');
    for (var i = 0; i < allSongs.length; i++) {
        allSongs[i].classList.remove('active');
        if (allSongs[i].classList.contains(id)) allSongs[i].classList.add('active');
    }

};

const setActivePlaylist = (id) => {
    const allPlaylists = document.getElementsByClassName('playlist_item');
    for (var i = 0; i < allPlaylists.length; i++) {
        allPlaylists[i].classList.remove('active');
        if (allPlaylists[i].classList.contains(id)) allPlaylists[i].classList.add('active');
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

const makeFormModal = (title, inputs, onSubmit, submitText) => {
    const container = makeDiv(['form_container']);
    {
        const updateForm = (result) => {
            message.classList.remove('hidden', 'success', 'fail');

            if (result.status) {
                message.classList.add('success');
                message.textContent = result.message;

                inputs.forEach(input => input.classList.add('hidden'));
                submit.classList.add('hidden');

            } else {
                message.classList.add('fail');
                message.textContent = result.message;
            }
        };

        const clickBlocker = makeClickBlocker();
        container.append(clickBlocker);

        const form = document.createElement('form');
        {
            form.method = 'post';
            form.enctype = "multipart/form-data";

            const header = makeHeader(3, title);
            form.append(header);
        }

        inputs.forEach(input => form.appendChild(input));

        const submit = makeInput('submit');
        submit.addEventListener('click', (evt) => {
            evt.preventDefault();

            const formData = new FormData(form);
            onSubmit(formData, (result) => {
                updateForm(result);
            });
        });
        submit.value = submitText;
        form.append(submit);


        const message = makeDiv(['message', 'hidden']);
        form.append(message);

        container.append(form);
    }

    return container;
};

const makeSongOptions = (id) => {
    const container = makeDiv(['song_options', 'hidden']);
    {
        const addToPlaylist = makeDiv(['option_item', 'add_to_playlist']);
        {
            addToPlaylist.textContent = 'Add to playlist';
            container.append(addToPlaylist);
            addToPlaylist.addEventListener('click', () => {
                showAddToPlaylistForm(id);
            });
        }

        const removeFromPlaylist = makeDiv(['option_item', 'remove_from_playlist']);
        {
            removeFromPlaylist.textContent = 'Remove from this playlist';
            if (CURRENT_PLAYLIST) {
                container.append(removeFromPlaylist);
            }
        }
    }

    container.addEventListener('pointerleave', () => container.classList.add('hidden'));

    return container;
};

const newPlaylist = () => {
    if (loggedUserId === 0) {
        showLoginForm();
        return;
    }

    const input1 = makeInput('text', 'Name', 'name');

    const container = makeFormModal('New playlist', [input1], (form, formUpdate) => { sendCreatePlaylistRequet(form, formUpdate)},  'Create');
    document.body.append(container);
};

const showLoginForm = () => {
    const loginInput = makeInput('text', 'Username', 'username');

    const passwordInput = makeInput('password', 'Password', 'password');

    const container = makeFormModal('Login', [loginInput, passwordInput], (form, formUpdate) => { sendLoginRequest(form, formUpdate) }, 'Login');
    document.body.append(container);
};

const showAddToPlaylistForm = (songId) => {

    const select = document.createElement('select');
    select.name = 'playlist_id';
    select.classList.add('form-control');

    loadedPlaylists.forEach(playlist => {
        const option = document.createElement('option');
        option.value = playlist.id;
        option.textContent = playlist.name;
        select.append(option);
    });

    const hiddenInput = makeInput('number', 'Music', 'music_id');
    hiddenInput.value = songId;
    hiddenInput.classList.add('hidden');

    const container = makeFormModal('Add to playlist', [select, hiddenInput], (form, formUpdate) => { sendAddToPlaylistRequest(form, formUpdate) }, 'Add');
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
                const buttonOptions = makeDiv(['button_options'], () => {
                    optionsContainer.classList.remove('hidden');

                    const position = buttonOptions.getBoundingClientRect();
                    optionsContainer.style.top = `${position.y}px`;
                    optionsContainer.style.right = `${window.innerWidth - position.x - position.width}px`;

                    console.log(position, optionsContainer.style);
                });
               
                const optionsIcon = makeIcon(["fas", "fa-ellipsis-h"]);
                buttonOptions.append(optionsIcon);
                optionsColumn.append(buttonOptions);

                const optionsContainer = makeSongOptions(song.id);
                buttonOptions.append(optionsContainer);
                
                row.append(optionsColumn);
            }
        }

        container.append(row);
    });

};

const setCurrentPlaylist = (id) => {
    setActivePlaylist(id);
    globalSongFilter.playlist_id = id;
    CURRENT_PLAYLIST = id;
};

const refreshPlaylists = () => {
    const container = document.querySelector('div#playlist_list');
    container.innerHTML = '';

    const allSongsButton = makeDiv(['playlist_item', 'all_songs', 0], () => {
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

    if (!CURRENT_PLAYLIST) {
        setCurrentPlaylist(0);
    }
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

const onPlaylistCreate = (result) => {
    fetchPlaylists();
};

const sendCreatePlaylistRequet = (playlistData, formUpdate) => {
    const onResult = (result) => {
        formUpdate(result);
        if (result.status) {
            onPlaylistCreate(result);
        }
    };

    fetch('CreatePlaylist', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "RequestVerificationToken": $('input:hidden[name="__RequestVerificationToken"]').val()
        },
        body: playlistData,
        credentials: 'include'
    }).then(response => response.json()).then(result => onResult(result));
};

const sendLoginRequest = (credentials, formUpdate) => {

    const onResult = (result) => {
        formUpdate(result);
        if (result.status) {
            onLoginSuccesful(result);
        }
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

const sendAddToPlaylistRequest = (data, formUpdate) => {
    const onResult = (result) => {
        formUpdate(result);
        if (result.status) {
            onSongAddedToPlaylist(result);
        }
    };

    fetch('AddToPlaylist', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "RequestVerificationToken": $('input:hidden[name="__RequestVerificationToken"]').val()
        },
        body: data,
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

