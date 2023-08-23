
document.getElementById('fetchColorsButton').addEventListener('click', async () => {
    clearErrorMessage();
    const url = document.getElementById('urlInput').value;
    const fetchButton = document.getElementById('fetchColorsButton');
    const loadingIndicator = document.getElementById('loadingIndicator');

    //mostra animação de loading
    fetchButton.style.display = 'none';
    loadingIndicator.style.display = 'block';

    const response = await fetch('http://3.134.78.116:4000/api/scrape', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    });

    //Esconde animação de loading
    loadingIndicator.style.display = 'none';
    fetchButton.style.display = 'block';

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
        errorMessage.textContent = 'Erro ao obter as cores. Verifique a URL e tente novamente.';
    }
});

function clearErrorMessage() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';
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
    }, 2000); // Exibe a notificação por 2 segundos
}

// Oculta a notificação ao carregar a página
window.onload = () => {
    const copyNotification = document.getElementById('copyNotification');
    copyNotification.style.display = 'none';
};
