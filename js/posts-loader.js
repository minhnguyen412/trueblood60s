// Hàm kiểm tra phần tử có nằm trong viewport không
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
}

function showImageCard(imageData) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.innerHTML = `
        <span class="close" onclick="this.parentElement.style.display='none'">&times;</span>
        
        <h3>${imageData.character}</h3>
        <p>${imageData.meaning}</p>
        <p>${imageData.pinyin}</p>
        
    `;
    document.body.appendChild(card);

    
}

// Hàm chính để load posts với các tham số có thể thay đổi
function loadPosts(startpId, endpId, listId) {
    const itemList = document.getElementById(listId);

    // Tải dữ liệu hình ảnh
    fetch('../data/imagesData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(imagesData => {
            fetch('../data/posts.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Lọc bài viết theo ID từ startId đến endId
                    const filteredPosts = data.filter(post => post.id >= startpId && post.id <= endpId);

                    filteredPosts.forEach((item, index) => {
                        const li = document.createElement('li');
                        li.className = 'animate box'; // Thêm class box cho hiệu ứng

                        const row = document.createElement('div');
                        row.className = 'row';
                    
                        const avatar = document.createElement('span');
                        avatar.className = 'avatar-1';
                        avatar.style.backgroundImage = `url(${item.avatar})`;

                        const user = document.createElement('span');
                        user.className = 'user';
                        user.textContent = item.user; // Thêm tên người dùng

                        const audio = document.createElement('span');
                        audio.className = 'audio';
                        audio.textContent = '☊'; // Biểu tượng âm thanh
                        audio.style.cursor = 'pointer'; // Thay đổi con trỏ khi hover

                        // Thêm sự kiện click để phát âm thanh
                        audio.addEventListener('click', () => {
                            const audioElement = new Audio(item.audioSrc); // Tạo đối tượng Audio với đường dẫn
                            audioElement.play(); // Phát âm thanh
                        });

                        const toggleButton = document.createElement('button');
                        toggleButton.className = 'toggle-description';
                        toggleButton.textContent = '⬇️';
                        
                        const p = document.createElement('p');
                        p.className = 'description';
                        p.itemProp = 'description';
                        p.innerHTML = item.description.replace(/\\n/g, '<br>'); // Sử dụng innerHTML để hiển thị mô tả
                        p.style.display = 'none';

                        // Xử lý sự kiện click vào nút toggle
                        toggleButton.addEventListener('click', () => {
                            if (p.style.display === 'block') {
                                p.style.display = 'none';
                                toggleButton.textContent = '⬇️';
                            } else {
                                p.style.display = 'block';
                                toggleButton.textContent = '⬅️';
                            }
                        });

                        // Thêm avatar và user vào thẻ row
                        row.appendChild(avatar);
                        row.appendChild(user);
                        li.appendChild(audio);
                        li.appendChild(toggleButton);

                        const h2 = document.createElement('h2');
                        h2.itemProp = 'name';
                        
                        // Tạo các phần tử từ segments
                        item.segments.forEach(segment => {
                            const span = document.createElement('span');
                            span.textContent = segment;
                            span.style.cursor = 'pointer';
                            span.innerHTML = item.segments;


                            // Thêm sự kiện click vào từng cụm từ
                            span.addEventListener('click', () => {
                                const imageData = imagesData.find(image => image.character === segment);
                                if (imageData) {
                                    showImageCard(imageData);
                                }
                            });

                            h2.appendChild(span); // Thêm ký tự vào h2
                        });

                        li.appendChild(row);
                        li.appendChild(h2);
                        li.appendChild(p);
                        itemList.appendChild(li);

                        // Kiểm tra ngay khi tải trang với khoảng delay
                        if (isInViewport(li)) {
                            setTimeout(() => {
                                li.classList.add('visible');
                            }, 100 * index); // Thêm khoảng delay dựa trên chỉ số của item
                        }
                        // Thêm sự kiện cuộn
                        window.addEventListener('scroll', () => {
                            if (isInViewport(li)) {
                                li.classList.add('visible');
                            }
                        });
                    });
                })
                .catch(error => console.error('Error fetching JSON:', error));
        })
        .catch(error => console.error('Error fetching imagesdata JSON:', error));
}
