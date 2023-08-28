
document.getElementById('fetchColorsButton').addEventListener('click', async () => {
    clearErrorMessage();
    clearColorsContainer();
    const url = document.getElementById('urlInput').value;
    const fetchButton = document.getElementById('fetchColorsButton');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const colorsContent = document.getElementById('colorsContent')

    fetchButton.style.display = 'nones';
    loadingIndicator.style.display = 'block';

    const response = await fetch('https://color-catcher-backend.matheustorresdev.com.br/api/scrape', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    });

    loadingIndicator.style.display = 'none';
    fetchButton.style.display = 'block';
    colorsContent.style.display = 'block'

    if (response.ok) {
        const data = await response.json();
        const colorsContainer = document.getElementById('colorsContainer');
        colorsContainer.innerHTML = '';
        clearErrorMessage();

        data.colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.style.backgroundColor = color;
            colorDiv.className = 'color-box';
            colorDiv.addEventListener('click', () => copyColorToClipboard(color));
            colorsContainer.appendChild(colorDiv);
        });
    } else {
        const errorMessage = document.getElementById('errorMessage');
        colorsContent.style.display = 'none'
        errorMessage.textContent = 'Verifique a URL e tente novamente.';
    }
});

function clearErrorMessage() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';
}

function clearColorsContainer(){
    const colors = document.getElementById('colorsContainer')
    colors.textContent = ''
}

function rgbToHex(rgb) {
    const values = rgb.match(/\d+/g);
    return '#' + values.map(value => Number(value).toString(16).padStart(2, '0')).join('');
}

function copyColorToClipboard(color) {
    const copyNotification = document.getElementById('copyNotification');
    const copyText = document.createElement('textarea');
    const hexColor = rgbToHex(color);
    copyText.value = hexColor;
    document.body.appendChild(copyText);
    copyText.select();
    document.execCommand('copy');
    document.body.removeChild(copyText);

    copyNotification.style.display = 'block';
    setTimeout(() => {
        copyNotification.style.display = 'none';
    }, 2000); 
}
document.getElementById('testButton').addEventListener('click', () => {
    const testInput = document.getElementById('testInput').value;
    const testBody = document.getElementById('colorBody')
    testBody.style.backgroundColor = testInput;
});

window.onload = () => {
    const copyNotification = document.getElementById('copyNotification');
    copyNotification.style.display = 'none';
};