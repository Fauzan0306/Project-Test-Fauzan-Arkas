// script.js

let lastScrollTop = 0;
const header = document.getElementById('header');
const apiBaseUrl = 'http://suitmedia-backend.suitdev.com/api/ideas';

let postsData = [];
let currentPage = 1;
let postsPerPage = 10;

// Event listener untuk scroll pada header
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    header.style.transform = scrollTop > lastScrollTop ? 'translateY(-100%)' : 'translateY(0)';
    lastScrollTop = scrollTop;
});

// Set active state pada menu
const currentLocation = location.href;
const menuItem = document.querySelectorAll('nav ul li a');
menuItem.forEach(item => {
    if (item.href === currentLocation) {
        item.className = "active";
    }
});

// Parallax effect untuk teks banner
window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const bannerContent = document.querySelector('.banner-content');
    bannerContent.style.transform = 'translate(-50%, ' + (50 + scrollPosition * 0.3) + '%)';
});

// Mengupdate tampilan posts
// Mengupdate tampilan posts
// Mengupdate tampilan posts
function updatePosts() {
   const postsGrid = document.querySelector('.posts-grid');
   postsGrid.innerHTML = '';

   if (postsData.length === 0) {
       postsGrid.innerHTML = '<p>No posts available.</p>'; // Menampilkan pesan jika tidak ada data
       return;
   }

   // Menghitung dan menampilkan posts yang sesuai dengan page dan showPerPage
   const start = (currentPage - 1) * postsPerPage;
   const end = start + postsPerPage;
   const paginatedPosts = postsData.slice(start, end);

   paginatedPosts.forEach(post => {
       const postCard = document.createElement('div');
       postCard.className = 'post-card';
       postCard.innerHTML = `
           <img src="${post.small_image[0].url}" alt="${post.title}">
           <div class="post-content">
               <div class="post-date">${new Date(post.published_at).toLocaleDateString()}</div>
               <div class="post-title">${post.title}</div>
           </div>
       `;
       postsGrid.appendChild(postCard);
   });

   updatePagination(); // Update pagination controls
}

function updatePagination(meta) {
   const pagination = document.querySelector('.pagination');
   pagination.innerHTML = '';

   // Menghitung total halaman berdasarkan meta
   const totalPages = meta.last_page;
   console.log('Total Pages:', totalPages); // Log totalPages

   for (let i = 1; i <= totalPages; i++) {
       const pageLink = document.createElement('span');
       pageLink.textContent = i;
       pageLink.className = i === currentPage ? 'active' : '';
       pageLink.addEventListener('click', () => {
           currentPage = i;
           fetchData(`${apiBaseUrl}?page[number]=${currentPage}&page[size]=${postsPerPage}&append[]=small_image&append[]=medium_image&sort=-published_at`);
       });
       pagination.appendChild(pageLink);
   }
}



// Fungsi untuk memuat data dari API
function fetchData(url) {
   console.log('Fetching data with postsPerPage:', postsPerPage);
   fetch(url, {
       method: 'GET',
       headers: {
           'Accept': 'application/json'
       }
   })
   .then(response => {
       if (!response.ok) {
           throw new Error('Network response was not ok');
       }
       return response.json();
   })
   .then(data => {
       console.log('Data received from API:', data);
       postsData = data.data;  // Pastikan ini sesuai
       console.log('postsData length:', postsData.length); // Log panjang postsData
       updatePosts();
       updatePagination(data.meta); // Pastikan data.meta dikirim
   })
   .catch(error => {
       console.error('There was a problem with the fetch operation:', error);
   });
}



// Mengelola perubahan sort dan showPerPage
document.getElementById('sortBy').addEventListener('change', (e) => {
    const sortBy = e.target.value;
    fetchData(`${apiBaseUrl}?page[number]=${currentPage}&page[size]=${postsPerPage}&append[]=small_image&append[]=medium_image&sort=${sortBy}`);
});

document.getElementById('showPerPage').addEventListener('change', (e) => {
   postsPerPage = parseInt(e.target.value);
   console.log('postsPerPage:', postsPerPage); // Log nilai baru
   fetchData(`${apiBaseUrl}?page[number]=${currentPage}&page[size]=${postsPerPage}&append[]=small_image&append[]=medium_image&sort=-published_at`);
});

// Menyimpan state menggunakan localStorage
window.addEventListener('beforeunload', () => {
    localStorage.setItem('postsPerPage', postsPerPage);
    localStorage.setItem('currentPage', currentPage);
});

window.addEventListener('load', () => {
    if (localStorage.getItem('postsPerPage')) {
        postsPerPage = parseInt(localStorage.getItem('postsPerPage'));
    }
    if (localStorage.getItem('currentPage')) {
        currentPage = parseInt(localStorage.getItem('currentPage'));
    }
    fetchData(`${apiBaseUrl}?page[number]=${currentPage}&page[size]=${postsPerPage}&append[]=small_image&append[]=medium_image&sort=-published_at`);
});
