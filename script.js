
document.getElementById('fetchColorsButton').addEventListener('click', fetchColors);
document.getElementById('urlInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    fetchColors();
  }
});

document.getElementById('testButton').addEventListener('click', testColors);
document.getElementById('testInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    testColors();
  }
});

  async function fetchColors () {

  clearErrorMessage();
  clearColorsContainer();
  const url = document.getElementById('urlInput').value;
  const fetchButton = document.getElementById('fetchColorsButton');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const colorsContent = document.getElementById('colorsContent')

  colorsContent.style.display = 'none'  
  fetchButton.style.display = 'none';
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
}

  function testColors () {
  const testInput = document.getElementById('testInput').value;
  const testBody = document.getElementById('colorBody')
  testBody.style.backgroundColor = testInput;
}
  
function clearErrorMessage() {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = '';
}

function clearColorsContainer(){
  const colors = document.getElementById('colorsContainer')
  colors.textContent = ''
}

function colorToHex(color) {
  const rgbaMatch = color.match(/rgba?\(([^)]+)\)/);

  if (rgbaMatch) {
    const rgbaValues = rgbaMatch[1].split(",").map(value => parseFloat(value.trim()));
    if (rgbaValues.length === 3 || rgbaValues.length === 4) {
      const [r, g, b] = rgbaValues.slice(0, 3).map(value => Math.round(value));
      const hexR = r.toString(16).padStart(2, '0');
      const hexG = g.toString(16).padStart(2, '0');
      const hexB = b.toString(16).padStart(2, '0');

      if (rgbaValues.length === 4) {
        const a = Math.round(rgbaValues[3] * 255);
        const hexA = a.toString(16).padStart(2, '0');
        return `#${hexR}${hexG}${hexB}${hexA}`;
      }

      return `#${hexR}${hexG}${hexB}`;
    } else {
      throw new Error("Invalid color format");
    }
  } else {
    throw new Error("Invalid color format");
  }
}

function copyColorToClipboard(color) {
  const copyNotification = document.getElementById('copyNotification');
  const hexColor = colorToHex(color);
  
  navigator.clipboard.writeText(hexColor)
    .then(() => {
      copyNotification.style.display = 'block';
      testInput.value =  hexColor;
      setTimeout(() => {
        copyNotification.style.display = 'none';
      }, 1000);
    })
    .catch(err => {
      console.error('Erro ao copiar: ', err);
    });
}

