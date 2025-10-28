// ==========================================
// POSTS MANAGEMENT SYSTEM
// Static Blog System for News & Mall Categories
// ==========================================

(function() {
    'use strict';
    
    // ==========================================
    // POSTS STORAGE MANAGEMENT
    // ==========================================
    
    function getPostsData() {
        const data = localStorage.getItem('blogPosts');
        return data ? JSON.parse(data) : {
            news: [],
            mall: []
        };
    }
    
    function savePostsData(data) {
        localStorage.setItem('blogPosts', JSON.stringify(data));
    }
    
    // Generate URL-friendly slug
    function generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 100);
    }
    
    // Generate unique post ID
    function generatePostId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    // ==========================================
    // ADD NEW POST
    // ==========================================
    
    window.addNewPost = function(category, postData) {
        const posts = getPostsData();
        
        const slug = postData.slug || generateSlug(postData.title);
        const postId = generatePostId();
        
        const newPost = {
            id: postId,
            title: postData.title,
            slug: slug,
            permalink: `/${category}/${slug}.html`,
            content: postData.content,
            excerpt: postData.excerpt || postData.content.substring(0, 200) + '...',
            image: postData.image || '',
            category: category,
            date: new Date().toISOString(),
            dateFormatted: formatDate(new Date()),
            author: postData.author || 'Admin',
            metaDescription: postData.metaDescription || postData.excerpt,
            keywords: postData.keywords || '',
            published: true
        };
        
        posts[category].unshift(newPost);
        savePostsData(posts);
        
        return newPost;
    };
    
    // ==========================================
    // GET POSTS
    // ==========================================
    
    window.getAllPosts = function(category = null, limit = null) {
        const posts = getPostsData();
        
        if (category) {
            const categoryPosts = posts[category] || [];
            return limit ? categoryPosts.slice(0, limit) : categoryPosts;
        }
        
        // Get all posts from all categories
        const allPosts = [...posts.news, ...posts.mall]
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return limit ? allPosts.slice(0, limit) : allPosts;
    };
    
    window.getPostBySlug = function(category, slug) {
        const posts = getPostsData();
        return posts[category].find(post => post.slug === slug);
    };
    
    window.getPostById = function(postId) {
        const posts = getPostsData();
        for (let category in posts) {
            const post = posts[category].find(p => p.id === postId);
            if (post) return post;
        }
        return null;
    };
    
    // ==========================================
    // UPDATE & DELETE
    // ==========================================
    
    window.updatePost = function(postId, updatedData) {
        const posts = getPostsData();
        
        for (let category in posts) {
            const index = posts[category].findIndex(p => p.id === postId);
            if (index !== -1) {
                posts[category][index] = {
                    ...posts[category][index],
                    ...updatedData,
                    updatedAt: new Date().toISOString()
                };
                savePostsData(posts);
                return posts[category][index];
            }
        }
        return null;
    };
    
    window.deletePost = function(postId) {
        const posts = getPostsData();
        
        for (let category in posts) {
            const index = posts[category].findIndex(p => p.id === postId);
            if (index !== -1) {
                posts[category].splice(index, 1);
                savePostsData(posts);
                return true;
            }
        }
        return false;
    };
    
    // ==========================================
    // EXPORT STATIC HTML
    // ==========================================
    
    window.exportPostAsHTML = function(post) {
        const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(post.title)} - Mall Kolkata</title>
    <meta name="description" content="${escapeHtml(post.metaDescription || post.excerpt)}">
    <meta name="keywords" content="${escapeHtml(post.keywords || post.category)}">
    <meta name="author" content="${escapeHtml(post.author)}">
    <link rel="stylesheet" href="../style.css">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(post.title)}">
    <meta property="og:description" content="${escapeHtml(post.excerpt)}">
    <meta property="og:type" content="article">
    ${post.image ? `<meta property="og:image" content="${escapeHtml(post.image)}">` : ''}
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    </script>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <div class="logo">
                <h1>mallkolkata.in</h1>
                <p class="tagline">❤️ Result Sabse Pahle ❤️</p>
            </div>
            <nav id="mainNav">
                <ul>
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../news.html" ${post.category === 'news' ? 'class="active"' : ''}>📰 News</a></li>
                    <li><a href="../mall.html" ${post.category === 'mall' ? 'class="active"' : ''}>🛍️ Mall Info</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container">
        <!-- Post Header -->
        <div class="welcome-banner">
            <h2>${post.category === 'news' ? '📰' : '🛍️'} ${escapeHtml(post.title)}</h2>
            <p class="original-tag">Published on ${post.dateFormatted} by ${escapeHtml(post.author)}</p>
        </div>

        <!-- Post Content -->
        <article class="content-section">
            ${post.image ? `<div style="text-align: center; margin-bottom: 20px;">
                <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" style="max-width: 100%; height: auto; border-radius: 8px; border: 2px solid #ffd700;">
            </div>` : ''}
            
            <div class="info-box">
                ${post.content}
            </div>
        </article>

        <!-- AdSense Placeholder -->
        <div class="adsense-container">
            <div id="adsenseSlot1" class="adsense-slot"></div>
        </div>

        <!-- Back to Category -->
        <div style="text-align: center; margin: 30px 0;">
            <a href="../${post.category}.html" class="btn btn-primary">← Back to ${post.category === 'news' ? 'News' : 'Mall Info'}</a>
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <div class="container">
            <nav class="footer-nav">
                <a href="../about.html">About Us</a>
                <a href="../contact.html">Contact Us</a>
                <a href="../privacy.html">Privacy Policy</a>
            </nav>
            <p>&copy; 2018 - 2025 Mall Kolkata • Powered by mallkolkata.in</p>
        </div>
    </footer>

    <script>
        // Load AdSense
        document.addEventListener('DOMContentLoaded', function() {
            const adsenseCode = localStorage.getItem('adsenseCode');
            if (adsenseCode) {
                document.getElementById('adsenseSlot1').innerHTML = adsenseCode;
            }
        });
    </script>
</body>
</html>`;
        
        return template;
    };
    
    window.downloadPostHTML = function(postId) {
        const post = getPostById(postId);
        if (!post) {
            alert('Post not found!');
            return;
        }
        
        const html = exportPostAsHTML(post);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${post.slug}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    // Download all posts as ZIP (instructions)
    window.exportAllPosts = function() {
        const posts = getAllPosts();
        const files = [];
        
        posts.forEach(post => {
            files.push({
                filename: `${post.category}/${post.slug}.html`,
                content: exportPostAsHTML(post)
            });
        });
        
        // Show instructions for manual upload
        let instructions = 'UPLOAD THESE FILES TO YOUR SERVER:\n\n';
        files.forEach(file => {
            instructions += `📄 ${file.filename}\n`;
        });
        instructions += '\nCreate folders: /news/ and /mall/\n';
        instructions += 'Upload each HTML file to its respective folder.\n\n';
        instructions += 'For AWS S3:\n';
        instructions += '1. Create folders: news/ and mall/\n';
        instructions += '2. Upload HTML files\n';
        instructions += '3. Set permissions to public-read\n';
        
        alert(instructions);
        
        // Download first file as example
        if (posts.length > 0) {
            downloadPostHTML(posts[0].id);
        }
    };
    
    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    function formatDate(date) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        const d = new Date(date);
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ==========================================
    // DISPLAY POSTS ON PAGES
    // ==========================================
    
    window.displayPostsList = function(category, containerId, limit = null) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const posts = getAllPosts(category, limit);
        
        if (posts.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 40px; color: #ffd700;">No posts yet. Add your first post from admin panel!</p>';
            return;
        }
        
        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0;">';
        
        posts.forEach(post => {
            html += `
                <div class="post-card" style="background: #000; border: 2px solid #ffd700; border-radius: 8px; padding: 20px; transition: transform 0.3s ease;">
                    ${post.image ? `<img src="${post.image}" alt="${escapeHtml(post.title)}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px; margin-bottom: 15px; border: 1px solid #ffd700;">` : ''}
                    <h3 style="color: #ffd700; margin-bottom: 10px; font-size: 18px;">${escapeHtml(post.title)}</h3>
                    <p style="color: #ffd700; font-size: 12px; margin-bottom: 10px; opacity: 0.8;">📅 ${post.dateFormatted}</p>
                    <p style="color: #ffd700; margin-bottom: 15px; line-height: 1.6;">${escapeHtml(post.excerpt)}</p>
                    <a href="${post.permalink}" class="btn btn-primary" style="text-decoration: none; display: inline-block; padding: 8px 20px;">Read More →</a>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    };
    
    console.log('✅ Posts Management System Loaded');
    
})();

