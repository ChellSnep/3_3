const API_KEY = 'gmXECTBVfLRBqZ28B6HkLBSYeElEvSiz'.trim();
const BASE_URL = 'https://api.giphy.com/v1/gifs';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const randomBtn = document.getElementById('random-btn');
const gifContainer = document.getElementById('gif-container');
const statusMsg = document.getElementById('status-msg');

function renderGifs(gifs, isSingle = false) {
  gifContainer.innerHTML = '';

  gifs.forEach((gif) => {
    const img = document.createElement('img');
    img.src = gif.images.fixed_height.url || gif.images.original.url;
    img.alt = gif.title || 'Obrazek GIF';
    if (isSingle) {
      img.classList.add('single-gif');
    }
    gifContainer.appendChild(img);
  });
}

async function searchGifs(query) {
  statusMsg.textContent = 'Wyszukiwanie...';
  gifContainer.innerHTML = '';

  const url = `${BASE_URL}/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=20`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }

    const result = await response.json();

    if (result.data.length === 0) {
      statusMsg.textContent = `Brak wyników dla frazy "${query}".`;
      return;
    }

    statusMsg.textContent = '';
    renderGifs(result.data, false);
  } catch (error) {
    statusMsg.textContent = 'Wystąpił błąd podczas wyszukiwania GIF-ów.';
    console.error('Szczegóły błędu:', error);
  }
}

async function getRandomGif() {
  statusMsg.textContent = 'Losowanie...';
  gifContainer.innerHTML = '';

  const url = `${BASE_URL}/random?api_key=${API_KEY}&rating=g`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }

    const result = await response.json();
    statusMsg.textContent = '';
    renderGifs([result.data], true);
  } catch (error) {
    statusMsg.textContent = 'Nie udało się wylosować pliku GIF.';
    console.error('Szczegóły błędu:', error);
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    searchGifs(query);
  }
});

randomBtn.addEventListener('click', getRandomGif);