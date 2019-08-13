var addBtn = document.querySelector('.add-button');
var URLinput = document.querySelector('.URL-input');

addBtn.addEventListener('click', () => {
    sendURL(URLinput.value);
    URLinput.value = '';
});

function sendURL(URL) {
    window.location.href = `http://localhost:4000/download?URL=${URL}`;
}
