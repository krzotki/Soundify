
const fileInput = document.getElementById('file_input');

fileInput.addEventListener('change', (evt) => {
    const fullName = fileInput.value.split('\\')[2];
    const author = fullName.split('-')[0];
    let title = fullName.split('-')[1];

    if (!title) title = fullName;

    document.getElementById('song_author').value = author;
    document.getElementById('song_title').value = title;
});