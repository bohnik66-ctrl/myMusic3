const tg = window.Telegram.WebApp;
tg.expand();

let player;
// Инициализация плеера YouTube
function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-player', {
        height: '0', width: '0',
        events: { 'onStateChange': onPlayerStateChange }
    });
}

async function searchMusic() {
    const q = document.getElementById('searchInput').value;
    const res = document.getElementById('results');
    if (!q) return;

    res.innerHTML = "<p style='text-align:center; color:#00ff88;'>🔎 Ищем трек в базе...</p>";

    try {
        // Используем более стабильное зеркало для поиска
        const response = await fetch(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(q)}&filter=music_videos`);
        const data = await response.json();

        res.innerHTML = "";
        data.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <img src="${item.thumbnail}">
                <div style="overflow:hidden"><b>${item.title}</b><br><span>${item.uploaderName}</span></div>
            `;
            div.onclick = () => {
                player.loadVideoById(item.url.split('=')[1]);
                document.getElementById('track-title').innerText = item.title;
                document.getElementById('track-artist').innerText = item.uploaderName;
                document.getElementById('track-img').src = item.thumbnail;
                document.getElementById('playBtn').innerText = '⏸';
                tg.HapticFeedback.impactOccurred('light');
            };
            res.appendChild(div);
        });
    } catch (e) {
        res.innerHTML = "<p style='text-align:center; color:red;'>База временно недоступна. Попробуйте еще раз.</p>";
    }
}

function playPause() {
    const state = player.getPlayerState();
    if (state === 1) { 
        player.pauseVideo();
        document.getElementById('playBtn').innerText = '▶';
    } else { 
        player.playVideo();
        document.getElementById('playBtn').innerText = '⏸';
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        setInterval(() => {
            const duration = player.getDuration();
            const currentTime = player.getCurrentTime();
            document.getElementById('progress-bar').style.width = (currentTime / duration * 100) + "%";
        }, 1000);
    }
}
