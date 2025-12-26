const tg = window.Telegram.WebApp;
tg.expand();

async function searchMusic() {
    const q = document.getElementById('searchInput').value.trim();
    const resContainer = document.getElementById('results');
    
    if (!q) return;
    resContainer.innerHTML = "<p style='text-align:center; color:#1db954'>🔎 Поиск в облачной базе...</p>";

    // Используем официальный API Jamendo (выдает полные файлы без рекламы)
    const client_id = "56d30cce"; // Публичный ID для тестов
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${client_id}&format=jsonpost&limit=20&search=${encodeURIComponent(q)}&include=musicinfo&audioformat=mp32`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        resContainer.innerHTML = "";
        
        if (!data.results || data.results.length === 0) {
            resContainer.innerHTML = "<p style='text-align:center'>Треки не найдены. Попробуйте другое название.</p>";
            return;
        }

        data.results.forEach(track => {
            const div = document.createElement('div');
            div.className = 'track-item';
            div.innerHTML = `
                <img src="${track.image || 'https://via.placeholder.com/50'}">
                <div>
                    <b>${track.name}</b>
                    <span>${track.artist_name}</span>
                </div>
            `;
            
            div.onclick = () => {
                const player = document.getElementById('audioPlayer');
                player.src = track.audio; // Прямая ссылка на MP3
                player.play();
                
                document.getElementById('track-title').innerText = track.name;
                document.getElementById('track-artist').innerText = track.artist_name;
                document.getElementById('current-img').src = track.image || 'https://via.placeholder.com/50';
                
                tg.HapticFeedback.impactOccurred('medium');
            };
            resContainer.appendChild(div);
        });
    } catch (e) {
        resContainer.innerHTML = "<p style='text-align:center; color:red'>Ошибка подключения к серверу.</p>";
    }
}
