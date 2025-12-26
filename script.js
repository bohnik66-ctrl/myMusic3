const tg = window.Telegram.WebApp;
tg.expand();

async function searchMusic() {
    const query = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('results');
    
    if (!query) return;
    resultsContainer.innerHTML = "<p style='text-align:center; color:#00ff88;'>🔎 Подключение к защищенной базе...</p>";

    // Используем HearThis API — оно отдает полные треки и разрешено в Telegram
    const apiUrl = `https://hearthis.at/api/search?q=${encodeURIComponent(query)}&count=20`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        resultsContainer.innerHTML = "";
        
        if (!data || data.length === 0) {
            resultsContainer.innerHTML = "<p style='text-align:center'>Треков не найдено. Попробуйте другой запрос.</p>";
            return;
        }

        data.forEach(track => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${track.thumb || 'https://via.placeholder.com/50'}">
                <div style="overflow:hidden">
                    <b>${track.title}</b>
                    <span>${track.user.username}</span>
                </div>
            `;
            
            card.onclick = () => {
                const audio = document.getElementById('audioPlayer');
                // stream_url — это прямая ссылка на ПОЛНЫЙ файл без рекламы
                audio.src = track.stream_url;
                audio.play();
                
                document.getElementById('track-title').innerText = track.title;
                document.getElementById('track-artist').innerText = track.user.username;
                document.getElementById('track-img').src = track.thumb || 'https://via.placeholder.com/50';
                
                tg.HapticFeedback.impactOccurred('medium');
            };
            resultsContainer.appendChild(card);
        });
    } catch (e) {
        resultsContainer.innerHTML = "<p style='text-align:center; color:red;'>Ошибка доступа. Попробуйте обновить страницу.</p>";
    }
}
