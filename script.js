const tg = window.Telegram.WebApp;
tg.expand();

async function searchMusic() {
    const q = document.getElementById('searchInput').value.trim();
    const resContainer = document.getElementById('results');
    
    if (!q) return;
    resContainer.innerHTML = "<p style='text-align:center; color:#1db954'>🔍 Ищем файлы без рекламы...</p>";

    // Используем API на базе SoundCloud/YouTube/ВК, которое дает полные файлы
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api-music.solmi.shop/search?q=${q}`)}`;

    try {
        const response = await fetch(url);
        const rawData = await response.json();
        const data = JSON.parse(rawData.contents);

        resContainer.innerHTML = "";
        
        if (!data || data.length === 0) {
            resContainer.innerHTML = "<p style='text-align:center'>Ничего не найдено</p>";
            return;
        }

        data.forEach(track => {
            const div = document.createElement('div');
            div.className = 'track-item';
            div.innerHTML = `
                <img src="${track.image || 'https://via.placeholder.com/50'}">
                <div>
                    <b>${track.title}</b>
                    <span>${track.artist}</span>
                </div>
            `;
            
            div.onclick = () => {
                const player = document.getElementById('audioPlayer');
                // Заменяем на https, чтобы Telegram не блокировал
                player.src = track.url.replace('http://', 'https://');
                player.play();
                
                document.getElementById('track-title').innerText = track.title;
                document.getElementById('track-artist').innerText = track.artist;
                document.getElementById('current-img').src = track.image || 'https://via.placeholder.com/50';
                
                tg.HapticFeedback.impactOccurred('medium');
            };
            resContainer.appendChild(div);
        });
    } catch (e) {
        resContainer.innerHTML = "<p style='text-align:center; color:red'>Ошибка связи с базой. Попробуйте еще раз.</p>";
    }
}
