// Lấy ID từ URL
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id2');
}

// Hiển thị bài viết với highlight từ quan trọng
function displayPost(post) {
    const container = document.getElementById('post-container');

    let content = post.content.map(paragraph => {
        return `<p>${paragraph.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
            return `<span class="highlight" data-word="${p1}">${p1}</span>`;
        })}</p>`;
    }).join('');

    if (post.imageSrc) {
        content = `<img src="${post.imageSrc}">` + content;
    }

    container.innerHTML = content;

    // Gán sự kiện click cho các từ highlight
    document.querySelectorAll('.highlight').forEach(span => {
        span.addEventListener('click', function () {
            const word = this.dataset.word;
            fetchCharacterData(word);
        });
    });
}

// Lấy dữ liệu ký tự từ file JSON
function fetchCharacterData(word) {
    fetch('https://raw.githubusercontent.com/minhnguyen412/trueblood60s/refs/heads/main/data/speak-words.json')
        .then(response => response.json())
        .then(data => {
            const characterData = data.find(item => item.character === word);
            if (characterData) {
                showImageCard(characterData);
            } else {
                console.log('Không tìm thấy dữ liệu cho:', word);
            }
        })
        .catch(error => console.error('Lỗi khi tải dữ liệu ký tự:', error));
}

// Hiển thị popup ký tự
function showImageCard(imageData) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.innerHTML = `
        <span class="close" onclick="this.parentElement.remove()">&times;</span>
        <div class="image-container">
            <img src="${imageData.imageSrc}" alt="${imageData.character}">
        </div>
        <div class="content">
            <h3>${imageData.character}</h3>
            <p>${imageData.meaning}</p>
            <p>${imageData.pinyin}</p>
            <audio controls>
                <source src="${imageData.audioSrc}" type="audio/mpeg">
                Your browser does not support the audio tag.
            </audio>
            <div id="writer-container"></div>
        </div>
    `;
    document.body.appendChild(card);

    
}

// Load bài viết từ JSON
function loadPost() {
    const postId = getPostIdFromUrl();
    if (!postId) {
        document.getElementById('post-container').innerHTML = '<p>ID không hợp lệ.</p>';
        return;
    }

    fetch('https://raw.githubusercontent.com/minhnguyen412/trueblood60s/refs/heads/main/data/speaking.json')
        .then(response => response.json())
        .then(posts => {
            const post = posts.find(p => p.id === Number(postId));
            if (post) {
                displayPost(post);
            } else {
                document.getElementById('post-container').innerHTML = '<p>Bài viết không tồn tại.</p>';
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            document.getElementById('post-container').innerHTML = '<p>Lỗi khi tải bài viết.</p>';
        });
}

// Gọi hàm load bài viết
loadPost();
