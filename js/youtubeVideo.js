document.addEventListener('DOMContentLoaded', getRandomRecommendations);

function getRandomRecommendations(){
    const urlParams = new URLSearchParams(window.location.search);
    const videoTitle = urlParams.get('title');

    fetch('js/youtube_videos.json')
        .then(response => response.json())
        .then(videos => {
            const selectedVideo = videos.find(video => video.title === videoTitle);
            
            if (selectedVideo) {
                document.getElementById('video-iframe').src = selectedVideo.embed_link;
                document.getElementById('video-title').textContent = selectedVideo.title;
                setVideoInfo();
            }

            const recommendedList = document.getElementById('recommended-list');
            videos.filter(video => video.title !== selectedVideo.title)
                .forEach(video => {
                    const recommendedItem = document.createElement('div');
                    recommendedItem.classList.add('recommended-video-item');
                    recommendedItem.innerHTML = `
                    <a href="youtoobvideo.html?title=${encodeURIComponent(video.title)}" class="recommended-link">
                        <div class="recommended-thumbnail">
                            <img src="${video.thumbnail_url}" alt="${video.title}">
                            <span class="video-duration">1:51</span> <!-- Fake duration for design -->
                        </div>
                        <div class="recommended-info">
                            <p class="recommended-title">${video.title}</p>
                            <div class="recommended-metadata">
                                <div class="recommended-date">Posted on ${getRandomDate()}</div>
                                <div class="recommended-views">${getRandomViews()} views</div>
                            </div>
                        </div>
                    </a>
                `;
                    recommendedList.appendChild(recommendedItem);
                });
        });
}

document.addEventListener('DOMContentLoaded', getRandomComments);
document.addEventListener('DOMContentLoaded', setVideoInfo);

function getRandomComments() {
    fetch('js/comments.json')
        .then(response => response.json())
        .then(data=> {
            let comments = Array.isArray(data) ? data : data.comments; // If data is wrapped in an object with a 'comments' key
            // If comments is an array, shuffle and display
            if (Array.isArray(comments)) {
            const shuffledComments = comments.sort(() => 0.5 - Math.random()).slice(0, 5);
            const commentSection = document.getElementById('comments');
            shuffledComments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment');
                commentDiv.innerHTML = `
                    <p><strong>${comment.username}</strong>: ${comment.comment}</p>
                `;
                commentSection.appendChild(commentDiv);
            });
        } else {
            console.error('Comments data is not an array.');
        }
        })
        .catch(error => console.error('Error fetching comments:', error));
}

function setVideoInfo() {
    const videoInfo = document.getElementById('video-info');
    videoInfo.innerHTML = `Uploaded by Frostymart | Views: ${getRandomViews()} | Added on: ${getRandomDate()}`;
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
