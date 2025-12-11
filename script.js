// ============================================
// TMDB API Configuration
// ============================================
const API_KEY = 'c7c00b48014e8ea976e8939e2721d950';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// ============================================
// API FETCH FUNCTIONS
// ============================================

async function fetchForPopularMovies() {
  try {
    // Fetch movie dan TV show secara terpisah untuk menghindari person
    const [moviesResponse, tvResponse] = await Promise.all([
      fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`),
      fetch(`${BASE_URL}/trending/tv/day?api_key=${API_KEY}`)
    ]);
    
    const moviesData = await moviesResponse.json();
    const tvData = await tvResponse.json();
    
    // Gabungkan hasil dan tambahkan media_type
    const allResults = [
      ...moviesData.results.map(item => ({ ...item, media_type: 'movie' })),
      ...tvData.results.map(item => ({ ...item, media_type: 'tv' }))
    ];
    
    return { results: allResults };
  } catch (error) {
    console.log('Error fetching popular movies:', error);
    throw error;
  }
}

async function searchMovies(query) {
  try {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=id-ID`);
    const data = await response.json();
    
    // Filter hanya movie dan tv, buang person
    const filtered = data.results.filter(item => 
      item.media_type === 'movie' || item.media_type === 'tv'
    );
    
    return { results: filtered };
  } catch (error) {
    console.log('Error searching movies:', error);
    throw error;
  }
}

async function fetchForIndividualMovie(movieId, mediaType = 'movie') {
  try {
    const response = await fetch(`${BASE_URL}/${mediaType}/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
    return await response.json();
  } catch (error) {
    console.log('Error fetching individual movie:', error);
    throw error;
  }
}

async function fetchMovieTrailer(movieId, mediaType = 'movie') {
  try {
    const response = await fetch(`${BASE_URL}/${mediaType}/${movieId}/videos?api_key=${API_KEY}`);
    return await response.json();
  } catch (error) {
    console.log('Error fetching trailer:', error);
    throw error;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function separateByThree(popularMoviesResult) {
  const random = () => Math.floor(Math.random() * popularMoviesResult.length);
  let selectedOnes = new Set();

  while (selectedOnes.size < 3) {
    const selected = popularMoviesResult[random()];
    selectedOnes.add(JSON.stringify({
      id: selected.id,
      mediaType: selected.media_type
    }));
  }

  return [...selectedOnes].map(item => JSON.parse(item));
}

function getFullRuntime(movieRuntime) {
  if (!movieRuntime || movieRuntime === 0) return 'N/A';
  
  const hours = Math.floor(movieRuntime / 60);
  const minutes = movieRuntime % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function amountMovieLayout({ id, title, rating, time, date, poster, overview, mediaType }) {
  return `
    <div class="movie" data-id="${id}" data-media-type="${mediaType}">
      <div class="title">
        <span>${title}</span>
        <div class="rating">
          ⭐ ${rating.toFixed(1)}
        </div>
      </div>

      <div class="poster-wrapper" data-movie-id="${id}" data-media-type="${mediaType}">
        <div class="poster">
          <img src="${IMG_BASE_URL}${poster}" alt="${title}" onerror="this.src='https://via.placeholder.com/194x288?text=No+Image'">
          
          <div class="movie-overlay">
            <p class="overview">${overview}</p>
          </div>

          <div class="poster-click-hint">
            👆 Klik untuk detail
          </div>

          <span class="time-and-date">
            <p class="time">
              🕐 ${time}
            </p>
            <p class="date">
              📅 ${date}
            </p>
          </span>
        </div>
      </div>

      <button class="watch" data-movie-id="${id}" data-media-type="${mediaType}"> 
        ▶️ Nonton Trailer
      </button>
    </div>
  `;
}

// ============================================
// MAIN DISPLAY FUNCTIONS
// ============================================

async function recommendMovies() {
  const recomendationsDiv = document.querySelector('.recomendations');
  recomendationsDiv.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  
  const button = document.querySelector('.recomend');
  button.classList.add('loading-btn');
  button.disabled = true;

  try {
    const { results } = await fetchForPopularMovies();
    
    if (!results || results.length === 0) {
      throw new Error('No movies found');
    }

    const threeSelected = separateByThree(results).map(async (item) => {
      const { id, mediaType } = item;
      const movieInfo = await fetchForIndividualMovie(id, mediaType);

      const title = movieInfo.title || movieInfo.name || 'Unknown';
      const editedTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
      
      const overview = movieInfo.overview || 'Deskripsi tidak tersedia';
      const editedOverview = overview.length > 100 ? overview.substring(0, 100) + '...' : overview;

      return amountMovieLayout({
        id: movieInfo.id,
        title: editedTitle,
        rating: movieInfo.vote_average || 0,
        time: getFullRuntime(movieInfo.runtime || movieInfo.episode_run_time?.[0] || 0),
        date: (movieInfo.release_date || movieInfo.first_air_date || '').slice(0, 4) || 'N/A',
        poster: movieInfo.poster_path || '',
        overview: editedOverview,
        mediaType: mediaType
      });
    });

    const result = await Promise.all(threeSelected);
    
    recomendationsDiv.style.opacity = '0';
    recomendationsDiv.innerHTML = result.join("");
    
    setTimeout(() => {
      recomendationsDiv.style.opacity = '1';
      recomendationsDiv.style.transition = 'opacity 0.5s ease-in';
    }, 100);

    attachEventListeners();
    
  } catch (error) {
    console.error('Error fetching movies:', error);
    recomendationsDiv.innerHTML = '<p style="color: white; text-align: center;">Gagal memuat rekomendasi. Silakan coba lagi.</p>';
  } finally {
    button.classList.remove('loading-btn');
    button.disabled = false;
  }
}

async function displaySearchResults(query) {
  const recomendationsDiv = document.querySelector('.recomendations');
  recomendationsDiv.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  
  const searchBtn = document.querySelector('#searchBtn');
  const searchInput = document.querySelector('#searchInput');
  searchBtn.classList.add('loading-btn');
  searchBtn.disabled = true;
  searchInput.disabled = true;

  try {
    const { results } = await searchMovies(query);
    
    if (!results || results.length === 0) {
      recomendationsDiv.innerHTML = `
        <div class="result-info">
          Tidak ada hasil ditemukan untuk <strong>"${query}"</strong>
        </div>
      `;
      return;
    }

    // Ambil maksimal 12 hasil (4 baris x 3 kolom)
    const limitedResults = results.slice(0, 12);
    
    const movieCards = limitedResults.map(async (item) => {
      const movieInfo = await fetchForIndividualMovie(item.id, item.media_type);

      const title = movieInfo.title || movieInfo.name || 'Unknown';
      const editedTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
      
      const overview = movieInfo.overview || 'Deskripsi tidak tersedia';
      const editedOverview = overview.length > 100 ? overview.substring(0, 100) + '...' : overview;

      return amountMovieLayout({
        id: movieInfo.id,
        title: editedTitle,
        rating: movieInfo.vote_average || 0,
        time: getFullRuntime(movieInfo.runtime || movieInfo.episode_run_time?.[0] || 0),
        date: (movieInfo.release_date || movieInfo.first_air_date || '').slice(0, 4) || 'N/A',
        poster: movieInfo.poster_path || '',
        overview: editedOverview,
        mediaType: item.media_type
      });
    });

    const result = await Promise.all(movieCards);
    
    // Add result info
    const resultInfo = `
      <div class="result-info">
        Menampilkan ${limitedResults.length} hasil untuk <strong>"${query}"</strong>
      </div>
    `;
    
    recomendationsDiv.style.opacity = '0';
    recomendationsDiv.innerHTML = resultInfo + result.join("");
    
    setTimeout(() => {
      recomendationsDiv.style.opacity = '1';
      recomendationsDiv.style.transition = 'opacity 0.5s ease-in';
    }, 100);

    attachEventListeners();
    
  } catch (error) {
    console.error('Error searching:', error);
    recomendationsDiv.innerHTML = `
      <div class="result-info">
        Gagal mencari film. Silakan coba lagi.
      </div>
    `;
  } finally {
    searchBtn.classList.remove('loading-btn');
    searchBtn.disabled = false;
    searchInput.disabled = false;
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

function attachEventListeners() {
  // Poster click listeners
  const posters = document.querySelectorAll('.poster-wrapper');
  posters.forEach(poster => {
    poster.addEventListener('click', async () => {
      const movieId = poster.getAttribute('data-movie-id');
      const mediaType = poster.getAttribute('data-media-type');
      await openDetailModal(movieId, mediaType);
    });
  });

  // Watch button listeners
  const watchButtons = document.querySelectorAll('.watch');
  watchButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const movieId = button.getAttribute('data-movie-id');
      const mediaType = button.getAttribute('data-media-type');
      
      const originalContent = button.innerHTML;
      button.innerHTML = '<div class="button-spinner"></div> Loading...';
      button.disabled = true;
      
      try {
        const trailerData = await fetchMovieTrailer(movieId, mediaType);
        
        if (trailerData.results && trailerData.results.length > 0) {
          const trailer = trailerData.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
          ) || trailerData.results.find(video => 
            video.site === 'YouTube'
          ) || trailerData.results[0];
          
          if (trailer && trailer.site === 'YouTube') {
            openTrailerModal(trailer.key, trailer.name || 'Trailer');
          } else {
            alert('Trailer YouTube tidak tersedia');
          }
        } else {
          alert('Trailer tidak tersedia');
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
        alert('Gagal memuat trailer');
      } finally {
        button.innerHTML = originalContent;
        button.disabled = false;
      }
    });
  });
}

// ============================================
// MODAL FUNCTIONS
// ============================================

async function openDetailModal(movieId, mediaType) {
  const modal = document.createElement('div');
  modal.className = 'detail-modal';
  modal.innerHTML = '<div class="detail-content"><div class="loading"><div class="spinner"></div></div></div>';
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);

  try {
    const movieData = await fetchForIndividualMovie(movieId, mediaType);
    
    const title = movieData.title || movieData.name;
    const overview = movieData.overview || 'Deskripsi tidak tersedia';
    const backdrop = movieData.backdrop_path ? BACKDROP_URL + movieData.backdrop_path : IMG_BASE_URL + movieData.poster_path;
    const rating = movieData.vote_average?.toFixed(1) || 'N/A';
    const date = (movieData.release_date || movieData.first_air_date || '').slice(0, 4) || 'N/A';
    const runtime = getFullRuntime(movieData.runtime || movieData.episode_run_time?.[0] || 0);
    const genres = movieData.genres?.map(g => `<span class="genre-tag">${g.name}</span>`).join('') || '';
    
    const cast = movieData.credits?.cast?.slice(0, 6).map(actor => `
      <div class="cast-item">
        <img class="cast-photo" src="${actor.profile_path ? IMG_BASE_URL + actor.profile_path : 'https://via.placeholder.com/100x100?text=No+Photo'}" alt="${actor.name}">
        <div class="cast-name">${actor.name}</div>
        <div class="cast-character">${actor.character}</div>
      </div>
    `).join('') || '<p style="color: var(--light-gray);">Data cast tidak tersedia</p>';

    const streamingLinks = getStreamingLinks(title, mediaType);

    modal.querySelector('.detail-content').innerHTML = `
      <button class="close-detail">&times;</button>
      <div class="detail-header">
        <img class="detail-backdrop" src="${backdrop}" alt="${title}">
        <div class="detail-header-overlay">
          <h2 class="detail-title">${title}</h2>
          <div class="detail-meta">
            <span class="detail-rating">⭐ ${rating}</span>
            <span>📅 ${date}</span>
            <span>🕐 ${runtime}</span>
          </div>
        </div>
      </div>
      <div class="detail-body">
        <div class="detail-section">
          <h3>Sinopsis</h3>
          <p>${overview}</p>
        </div>
        
        <div class="detail-section">
          <h3>Genre</h3>
          <div class="genre-tags">
            ${genres || '<span class="genre-tag">Tidak ada data</span>'}
          </div>
        </div>

        <div class="detail-section">
          <h3>Pemeran</h3>
          <div class="cast-grid">
            ${cast}
          </div>
        </div>

        <div class="detail-section">
          <h3>Tonton di Platform Streaming</h3>
          <div class="streaming-links">
            ${streamingLinks}
          </div>
        </div>
      </div>
    `;

    const closeBtn = modal.querySelector('.close-detail');
    closeBtn.addEventListener('click', () => closeModal(modal));
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });

    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal(modal);
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);

  } catch (error) {
    console.error('Error loading details:', error);
    modal.querySelector('.detail-content').innerHTML = '<p style="color: white; padding: 40px; text-align: center;">Gagal memuat detail film</p>';
  }
}

function getStreamingLinks(title, mediaType) {
  const encodedTitle = encodeURIComponent(title);
  
  return `
    <a href="https://www.netflix.com/search?q=${encodedTitle}" target="_blank" class="streaming-btn">
      🎬 Netflix
    </a>
    <a href="https://www.disneyplus.com/search?q=${encodedTitle}" target="_blank" class="streaming-btn">
      ✨ Disney+
    </a>
    <a href="https://www.primevideo.com/search?phrase=${encodedTitle}" target="_blank" class="streaming-btn">
      📺 Prime Video
    </a>
    <a href="https://www.hulu.com/search?q=${encodedTitle}" target="_blank" class="streaming-btn">
      🟢 Hulu
    </a>
    <a href="https://www.hbomax.com/search?q=${encodedTitle}" target="_blank" class="streaming-btn">
      🔷 HBO Max
    </a>
    <a href="https://www.vidio.com/search?q=${encodedTitle}" target="_blank" class="streaming-btn">
      🇮🇩 Vidio
    </a>
  `;
}

function openTrailerModal(videoKey, videoTitle) {
  const modal = document.createElement('div');
  modal.className = 'trailer-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${videoTitle}</h3>
        <button class="close-modal">&times;</button>
      </div>
      <div class="video-container">
        <iframe 
          src="https://www.youtube.com/embed/${videoKey}?autoplay=1" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
  
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => closeModal(modal));
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
  
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(modal);
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

function closeModal(modal) {
  modal.classList.remove('show');
  setTimeout(() => modal.remove(), 300);
}

// ============================================
// INITIALIZATION
// ============================================

const recomendationButton = document.querySelector('.recomend');
recomendationButton.addEventListener('click', recommendMovies);

// Search functionality
const searchBtn = document.querySelector('#searchBtn');
const searchInput = document.querySelector('#searchInput');

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    displaySearchResults(query);
  }
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query) {
      displaySearchResults(query);
    }
  }
});

// Load initial recommendations
recommendMovies();