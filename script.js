const API_KEY = 'gmXECTBVfLRBqZ28B6HkLBSYeElEvSiz'.trim();
const BASE_URL = 'https://api.giphy.com/v1/gifs';
const LIMIT = 20;

let currentQuery = '';
let currentPage = 1;
let totalPages = 1;

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const randomBtn = document.getElementById('random-btn');
const gifContainer = document.getElementById('gif-container');
const statusMsg = document.getElementById('status-msg');

const paginationContainer = document.getElementById('pagination');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}

function renderGifs(gifs, isSingle = false) {
  gifContainer.innerHTML = '';

  gifs.forEach((gif) => {
    const imgUrl = gif?.images?.fixed_height?.url || gif?.images?.original?.url;
    if (!imgUrl) return;

    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = gif.title || 'Obrazek GIF';
    if (isSingle) {
      img.classList.add('single-gif');
    }
    gifContainer.appendChild(img);
  });
}

function updatePaginationUI(totalCount) {
  const maxAccessibleItems = Math.min(totalCount, 4999);
  totalPages = Math.max(1, Math.ceil(maxAccessibleItems / LIMIT));

  pageInfo.textContent = `Strona ${currentPage} z ${totalPages}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
  paginationContainer.hidden = totalCount <= LIMIT;
}

async function searchGifs(query, page = 1) {
  try {
    statusMsg.textContent = 'Wyszukiwanie...';
    gifContainer.innerHTML = '';

    const offset = (page - 1) * LIMIT;
    const url = `${BASE_URL}/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=${LIMIT}&offset=${offset}&rating=g`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Serwer zwrócił kod ${response.status}`);
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      statusMsg.textContent = `Brak wyników dla frazy "${query}".`;
      paginationContainer.hidden = true;
      return;
    }

    statusMsg.textContent = '';
    renderGifs(result.data, false);
    updatePaginationUI(result.pagination.total_count);
  } catch (error) {
    paginationContainer.hidden = true;
    if (error.name === 'AbortError') {
      statusMsg.textContent = 'Przekroczono czas oczekiwania na odpowiedź serwera.';
    } else {
      statusMsg.textContent = `Błąd: ${error.message}`;
    }
    console.error('Szczegóły błędu:', error);
  }
}

async function getRandomGif() {
  try {
    statusMsg.textContent = 'Losowanie...';
    gifContainer.innerHTML = '';
    paginationContainer.hidden = true;

    const url = `${BASE_URL}/random?api_key=${API_KEY}&rating=g`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Serwer zwrócił kod ${response.status}`);
    }

    const result = await response.json();
    statusMsg.textContent = '';
    renderGifs([result.data], true);
  } catch (error) {
    if (error.name === 'AbortError') {
      statusMsg.textContent = 'Przekroczono czas oczekiwania na odpowiedź serwera.';
    } else {
      statusMsg.textContent = `Błąd: ${error.message}`;
    }
    console.error('Szczegóły błędu:', error);
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    currentQuery = query;
    currentPage = 1;
    searchGifs(currentQuery, currentPage);
  }
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    searchGifs(currentQuery, currentPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    searchGifs(currentQuery, currentPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

randomBtn.addEventListener('click', getRandomGif);