
const fileInput = document.getElementById('file_input');

fileInput.addEventListener('change', (evt) => {
    const fullName = fileInput.value.split('\\')[2];
    const author = fullName.split('-')[0];
    let title = fullName.split('-')[1];

    if (!title) title = fullName;

    const authorInput = document.getElementById('song_author');
    authorInput.value = (authorInput.value.length > 0) ? authorInput.value : author;

    const titleInput = document.getElementById('song_title');
    titleInput.value = (titleInput.value.length > 0) ? titleInput.value : title;

});