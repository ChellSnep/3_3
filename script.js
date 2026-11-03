const API_KEY = 'gmXECTBVfLRBqZ28B6HkLBSYeElEvSiz';
const API_URL = `https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&rating=g`;

const fetchBtn = document.getElementById('fetch-btn');
const gifImage = document.getElementById('gif-image');
const statusMsg = document.getElementById('status-msg');

async function getRandomGif() {
  statusMsg.textContent = 'Ładowanie...';
  gifImage.hidden = true;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }

    const result = await response.json();
    const imageUrl = result.data.images.original.url;

    gifImage.src = imageUrl;
    gifImage.alt = result.data.title || 'Losowy GIF';
    gifImage.onload = () => {
      statusMsg.textContent = '';
      gifImage.hidden = false;
    };
  } catch (error) {
    statusMsg.textContent = 'Nie udało się pobrać pliku GIF. Sprawdź klucz API.';
    console.error('Szczegóły błędu:', error);
  }
}

fetchBtn.addEventListener('click', getRandomGif);

getRandomGif();