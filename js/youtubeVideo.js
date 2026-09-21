document.addEventListener('DOMContentLoaded', () => {
    loadVideo();
    loadRandomComments();
});

function loadVideo() {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedTitle = urlParams.get('title');

    fetch('js/youtube_videos.json')
        .then(response => {
            if (!response.ok) throw new Error('Unable to load video list.');
            return response.json();
        })
        .then(videos => {
            if (!Array.isArray(videos) || videos.length === 0) return;

            const selectedVideo = videos.find(video => video.title === requestedTitle) || videos[0];

            const iframe = document.getElementById('video-iframe');
            const title = document.getElementById('video-title');

            if (iframe) iframe.src = selectedVideo.embed_link;
            if (title) title.textContent = selectedVideo.title;

            setVideoInfo();

            const recommendedList = document.getElementById('recommended-list');
            if (!recommendedList) return;
            recommendedList.replaceChildren();

            videos
                .filter(video => video.title !== selectedVideo.title)
                .forEach(video => recommendedList.appendChild(createRecommendedVideo(video)));
        })
        .catch(error => console.error('Error loading videos:', error));
}

function createRecommendedVideo(video) {
    const item = document.createElement('div');
    item.className = 'recommended-video-item';

    const link = document.createElement('a');
    link.className = 'recommended-link';
    link.href = `youtoobvideo.html?title=${encodeURIComponent(video.title)}`;

    const thumbnail = document.createElement('div');
    thumbnail.className = 'recommended-thumbnail';

    const image = document.createElement('img');
    image.src = video.thumbnail_url;
    image.alt = video.title;

    const duration = document.createElement('span');
    duration.className = 'video-duration';
    duration.textContent = '1:51';

    thumbnail.append(image, duration);

    const info = document.createElement('div');
    info.className = 'recommended-info';

    const title = document.createElement('p');
    title.className = 'recommended-title';
    title.textContent = video.title;

    const metadata = document.createElement('div');
    metadata.className = 'recommended-metadata';

    const date = document.createElement('div');
    date.className = 'recommended-date';
    date.textContent = `Posted on ${getRandomDate()}`;

    const views = document.createElement('div');
    views.className = 'recommended-views';
    views.textContent = `${getRandomViews()} views`;

    metadata.append(date, views);
    info.append(title, metadata);
    link.append(thumbnail, info);
    item.appendChild(link);

    return item;
}

function loadRandomComments() {
    fetch('js/comments.json')
        .then(response => {
            if (!response.ok) throw new Error('Unable to load comments.');
            return response.json();
        })
        .then(data => {
            const comments = Array.isArray(data) ? data : data.comments;
            if (!Array.isArray(comments)) return;

            const commentSection = document.getElementById('comments');
            if (!commentSection) return;

            const shuffledComments = [...comments].sort(() => 0.5 - Math.random()).slice(0, 5);
            commentSection.replaceChildren();

            shuffledComments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';

                const paragraph = document.createElement('p');
                const username = document.createElement('strong');
                username.textContent = comment.username || 'Anonymous';

                paragraph.append(username, document.createTextNode(`: ${comment.comment || ''}`));
                commentDiv.appendChild(paragraph);
                commentSection.appendChild(commentDiv);
            });
        })
        .catch(error => console.error('Error fetching comments:', error));
}

function setVideoInfo() {
    const videoInfo = document.getElementById('video-info');
    if (videoInfo) {
        videoInfo.textContent = `Uploaded by Frostymart | Views: ${getRandomViews()} | Added on: ${getRandomDate()}`;
    }
}

function getRandomDate() {
    const start = new Date(2006, 0, 1);
    const end = new Date(2013, 11, 31);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

    const day = String(randomDate.getDate()).padStart(2, '0');
    const month = String(randomDate.getMonth() + 1).padStart(2, '0');
    const year = randomDate.getFullYear();

    return `${day}/${month}/${year}`;
}

function getRandomViews() {
    const views = Math.floor(Math.random() * 10001) + 5000;
    return views.toLocaleString();
}
