const tg = window.Telegram.WebApp;
tg.expand();

async function searchMusic() {
    const q = document.getElementById('searchInput').value;
    const res = document.getElementById('results');
    if (!q) return;

    res.innerHTML = "<p style='text-align:center; color:#00ff88;'>🔎 Ищем полную версию...</p>";

    // Используем более стабильный CORS-прокси
    const corsProxy = "https://cors-anywhere.herokuapp.com/"; // Можно также попробовать https://api.codetabs.com/v1/proxy?quest=
    const targetApi = `https://api-music.solmi.shop/search?q=${encodeURIComponent(q)}`;

    try {
        // Попробуем сначала через прямой запрос (некоторые API это позволяют)
        let response = await fetch(targetApi);
        
        // Если заблокировано, можно использовать резервный метод через другой прокси
        if (!response.ok) throw new Error('CORS');

        const data = await response.json();

        res.innerHTML = "";
        if (data.length === 0) {
            res.innerHTML = "<p style='text-align:center'>Ничего не найдено</p>";
            return;
        }

        data.forEach(t => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <img src="${t.image || 'https://via.placeholder.com/50'}">
                <div>
                    <b>${t.title}</b><br>
                    <span>${t.artist}</span>
                </div>
            `;
            div.onclick = () => {
                const p = document.getElementById('mainPlayer');
                // Важно: проверяем, чтобы ссылка на музыку была HTTPS
                p.src = t.url.replace('http://', 'https://'); 
                document.getElementById('track-title').innerText = t.title;
                document.getElementById('track-artist').innerText = t.artist;
                document.getElementById('track-img').src = t.image || 'https://via.placeholder.com/50';
                
                tg.HapticFeedback.impactOccurred('medium');
            };
            res.appendChild(div);
        });
    } catch (e) {
        console.error(e);
        res.innerHTML = "<p style='text-align:center; color:red;'>Ошибка доступа к базе. Попробуйте еще раз через минуту.</p>";
    }
}
