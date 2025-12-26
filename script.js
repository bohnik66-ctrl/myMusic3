const tg = window.Telegram.WebApp;
tg.expand();

async function searchMusic() {
    const q = document.getElementById('searchInput').value;
    const res = document.getElementById('results');
    if (!q) return;

    res.innerHTML = "<p style='text-align:center'>🔎 Ищем...</p>";

    // API для поиска ПОЛНЫХ версий (Full MP3)
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api-music.solmi.shop/search?q=${q}`)}`;

    try {
        const response = await fetch(url);
        const data = JSON.parse((await response.json()).contents);

        res.innerHTML = "";
        data.forEach(t => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <img src="${t.image || 'https://via.placeholder.com/50'}">
                <div><b>${t.title}</b><br><span>${t.artist}</span></div>
            `;
            div.onclick = () => {
                const p = document.getElementById('mainPlayer');
                p.src = t.url;
                document.getElementById('track-title').innerText = t.title;
                document.getElementById('track-artist').innerText = t.artist;
                document.getElementById('track-img').src = t.image;
                tg.HapticFeedback.impactOccurred('medium');
            };
            res.appendChild(div);
        });
    } catch (e) {
        res.innerHTML = "<p>Ошибка. Попробуйте другой запрос.</p>";
    }
}
