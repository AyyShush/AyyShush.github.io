document.addEventListener('DOMContentLoaded', loadVideos);

function loadVideos() {
    fetch('js/youtube_videos.json')
        .then(response => response.json())
        .then(videos => {
            const grid = document.getElementById('videos-grid');
            videos.forEach(video => {
                const videoItem = document.createElement('div');
                videoItem.classList.add('video-thumbnail');
                videoItem.innerHTML = `
                    <a href="youtoobvideo.html?title=${encodeURIComponent(video.title)}">
                        <img src="${video.thumbnail_url}" alt="${video.title}">
                        <p>${video.title}</p>
                    </a>
                    <p class="views">${getRandomViews()} views | Added: ${getRandomDate()}</p>
                `;
                grid.appendChild(videoItem);
            });
        });
}

function getRandomDate() {
    const start = new Date(2006, 0, 1); // January 1, 2006
    const end = new Date(2013, 11, 31); // December 31, 2013
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

    const day = String(randomDate.getDate()).padStart(2, '0'); // Two-digit day
    const month = String(randomDate.getMonth() + 1).padStart(2, '0'); // Two-digit month (months are 0-indexed)
    const year = randomDate.getFullYear();

    return `${day}/${month}/${year}`; // British format DD/MM/YYYY
}

function getRandomViews() {
    const views = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
    return views.toLocaleString(); // This will add commas to the number
}
