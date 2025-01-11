// Hàm lấy bài viết theo ID
function loadPostById(postId) {
    fetch('../data/writing.json') // Đường dẫn đến file JSON
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            return response.json();
        })
        .then(posts => {
            // Tìm bài viết có ID khớp
            const post = posts.find(p => p.id === postId);
            if (post) {
                displayPost(post); // Gọi hàm hiển thị bài viết
            } else {
                console.error('Post not found');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Hàm hiển thị bài viết trên trang
function displayPost(post) {
    const container = document.getElementById('post-container'); // Container hiển thị bài viết
    container.innerHTML = `
        <h4>${post.title}</h4>
        ${post.content.map(para => `<p>${para}</p>`).join('')}
    `;
}
