const tg = window.Telegram.WebApp;
tg.expand();

async function searchMusic() {
    const q = document.getElementById('searchInput').value.trim();
    const resBox = document.getElementById('results');
    
    if (!q) return;
    resBox.innerHTML = "<p style='text-align:center; color:#00ff88;'>🔍 Поиск в базе бота...</p>";

    // Официальный API Jamendo для получения полных треков
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=56d30cce&format=jsonpost&limit=20&search=${encodeURIComponent(q)}&audioformat=mp32`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        resBox.innerHTML = "";
        
        if (!data.results || data.results.length === 0) {
            resBox.innerHTML = "<p style='text-align:center'>Ничего не найдено.</p>";
            return;
        }

        data.results.forEach(track => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <img src="${track.image}">
                <div style="overflow:hidden">
                    <b>${track.name}</b>
                    <span>${track.artist_name}</span>
                </div>
            `;
            
            div.onclick = () => {
                const audio = document.getElementById('audioElement');
                audio.src = track.audio; // Прямая ссылка на полный файл
                audio.play();
                
                document.getElementById('track-name').innerText = track.name;
                document.getElementById('track-artist').innerText = track.artist_name;
                document.getElementById('track-art').src = track.image;
                
                tg.HapticFeedback.impactOccurred('medium');
            };
            resBox.appendChild(div);
        });
    } catch (e) {
        resBox.innerHTML = "<p style='text-align:center; color:red;'>Ошибка сети. Попробуйте еще раз.</p>";
    }
}
