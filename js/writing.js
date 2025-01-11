// Lấy id từ URL
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Trả về giá trị của tham số 'id'
}

// Hàm hiển thị bài viết
function displayPost(post) {
    const container = document.getElementById('post-container');
    container.innerHTML = `
        <h1>${post.title}</h1>
        ${post.content.map(paragraph => `<p>${paragraph}</p>`).join('')}
    `;
}

// Hàm load bài viết từ file JSON
function loadPost() {
    const postId = getPostIdFromUrl();
    if (!postId) {
        document.getElementById('post-container').innerHTML = '<p>ID không hợp lệ.</p>';
        return;
    }

    fetch('../data/writing.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi tải dữ liệu');
            }
            return response.json();
        })
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
