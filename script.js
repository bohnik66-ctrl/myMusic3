const tg = window.Telegram.WebApp;
tg.expand();

// API Ключ не нужен, используем публичный инстанс поиска
async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const container = document.getElementById('results');
    
    if (!query) return;
    container.innerHTML = "<p style='text-align:center; color:#00ff88;'>🔍 Синхронизация с базой...</p>";

    // Используем Invidious API (зеркало YouTube) - оно работает без ключей и CORS
    const searchUrl = `https://inv.vern.cc/api/v1/search?q=${encodeURIComponent(query)}&type=video`;

    try {
        const response = await fetch(searchUrl);
        const results = await response.json();

        container.innerHTML = "";
        
        results.forEach(video => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${video.videoThumbnails[0].url}">
                <div class="card-info">
                    <b>${video.title}</b>
                    <span>${video.author}</span>
                </div>
            `;
            
            card.onclick = () => {
                // Генерируем прямую аудио-ссылку
                const audioUrl = `https://inv.vern.cc/latest_version?id=${video.videoId}&itag=140`;
                playMusic(audioUrl, video.title, video.author, video.videoThumbnails[0].url);
            };
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = "<p style='text-align:center; color:red;'>Ошибка сети. Попробуйте еще раз.</p>";
    }
}

function playMusic(url, title, artist, img) {
    const player = document.getElementById('audioPlayer');
    player.src = url;
    player.play();

    document.getElementById('track-title').innerText = title;
    document.getElementById('track-artist').innerText = artist;
    document.getElementById('current-art').src = img;

    // Вибрация телефона при включении трека
    tg.HapticFeedback.impactOccurred('medium');
}
