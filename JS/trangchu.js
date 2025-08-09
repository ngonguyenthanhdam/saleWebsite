// Homepage JavaScript

// ================== DỮ LIỆU SẢN PHẨM MẪU ==================
// Mô phỏng cơ sở dữ liệu sản phẩm (dùng cho giao diện demo)
const productDatabase = {
    1: { id: 1, name: "iPhone 15 Pro Max", price: 29990000, image: "Img/iphone-15.jpg" },
    2: { id: 2, name: "Samsung Galaxy S23 Ultra", price: 24990000, image: "Img/samsung-s23.jpg" },
    3: { id: 3, name: "Xiaomi 13 Pro", price: 18990000, image: "Img/xiaomi-13pro.jpg" },
    4: { id: 4, name: "Oppo Reno 10", price: 12990000, image: "Img/oppo.jpg" },
    5: { id: 5, name: "Vivo V29", price: 9990000, image: "Img/vivo.jpg" },
    6: { id: 6, name: "Realme 11 Pro+", price: 8990000, image: "Img/realme.jpg" },
    7: { id: 7, name: "Nokia G22", price: 4990000, image: "Img/nokia.jpg" },
    8: { id: 8, name: "Asus ROG Phone 7", price: 19990000, image: "Img/asus.jpg" }
};

// ================== DỮ LIỆU GIỎ HÀNG & YÊU THÍCH ==================
// Lưu trữ giỏ hàng và danh sách yêu thích trên localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// ================== KHỞI TẠO TRANG ==================
// Khi trang được load xong, cập nhật số lượng giỏ hàng, trạng thái đăng nhập, v.v.
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateWishlistIcons();
    checkUserLogin();
});

// ================== XỬ LÝ ĐĂNG NHẬP/ĐĂNG XUẤT ==================
// Kiểm tra trạng thái đăng nhập của người dùng
function checkUserLogin() {
    const currentUser = sessionStorage.getItem('currentUser');
    const userBtn = document.getElementById('userBtn');
    const dropdownMenu = userBtn.nextElementSibling; // The <ul> dropdown menu
    const logoutMenuItem = document.getElementById('logoutMenuItem');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        userBtn.title = user.name;
        userBtn.innerHTML = `<i class="fas fa-user"></i>`;
        userBtn.removeAttribute('href');
        
        // Hide all menu items first
        Array.from(dropdownMenu.children).forEach(li => {
            li.style.display = 'none';
        });
        
        // Show only "Tài khoản của tôi" and "Đăng xuất"
        const accountLink = Array.from(dropdownMenu.children).find(li => {
            const link = li.querySelector('a');
            return link && (link.getAttribute('href') === 'user.html' || link.getAttribute('href') === 'admin.html');
        });
        if (accountLink) {
            accountLink.style.display = 'block';
            const link = accountLink.querySelector('a');
            if (user.role === 'admin') {
                link.href = 'admin.html';
                link.innerHTML = '<i class="fas fa-user-shield"></i> Quản trị viên';
            } else {
                link.href = 'user.html';
                link.innerHTML = '<i class="fas fa-user-circle"></i> Tài khoản của tôi';
            }
        }
        if (logoutMenuItem) {
            logoutMenuItem.style.display = 'block';
        }
    } else {
        userBtn.title = 'Đăng nhập';
        userBtn.innerHTML = `<i class="fas fa-user"></i>`;
        userBtn.href = 'login.html';
        
        // Show only "Đăng nhập" and "Đăng ký"
        Array.from(dropdownMenu.children).forEach(li => {
            const link = li.querySelector('a');
            if (!link) return;
            const href = link.getAttribute('href');
            if (href === 'login.html' || href === 'register.html') {
                li.style.display = 'block';
            } else {
                li.style.display = 'none';
            }
        });
        
        if (logoutMenuItem) {
            logoutMenuItem.style.display = 'none';
        }
    }
}

// Hiển thị menu đăng nhập khi chưa đăng nhập
function showLoginMenu() {
    checkUserLogin();
}

// Đăng xuất tài khoản
function logout() {
    // Xóa session
    sessionStorage.removeItem('currentUser');
    
    // Lưu lại giỏ hàng và wishlist cho user nếu cần
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const cart = localStorage.getItem('cart');
        const wishlist = localStorage.getItem('wishlist');
        
        if (cart) {
            localStorage.setItem(`cart_${user.id}`, cart);
        }
        if (wishlist) {
            localStorage.setItem(`wishlist_${user.id}`, wishlist);
        }
    }
    
    // Xóa giỏ hàng và wishlist hiện tại
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    
    // Hiện lại menu đăng nhập
    showLoginMenu();
    
    // Cập nhật số lượng
    updateCartCount();
    updateWishlistIcons();
    
    // Thông báo đăng xuất thành công
    showNotification('Đã đăng xuất thành công!', 'success');
    
    // Reload lại trang để cập nhật giao diện
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// ================== XỬ LÝ SẢN PHẨM & GIỎ HÀNG ==================
// Xem chi tiết sản phẩm
function viewProductDetail(productId) {
    // Chuyển sang trang chi tiết sản phẩm với id tương ứng
    window.location.href = `sanphamchitiet.html?id=${productId}`;
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
    const product = productDatabase[productId];
    if (!product) {
        alert('Sản phẩm không tồn tại!');
        return;
    }

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    // Lưu lại vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật số lượng giỏ hàng
    updateCartCount();
    
    // Thông báo thành công
    showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
}

// Ghi đè addToCart để luôn lấy đủ thông tin sản phẩm
window.addToCart = function(id) {
    const product = productDatabase[id];
    if (!product) {
        alert("Sản phẩm không tồn tại!");
        return;
    }
    // Gọi đúng hàm addToCart của giohang.js nếu có
    if (typeof window.addToCartFromCartPage === 'function') {
        window.addToCartFromCartPage(product.id, product.name, product.price, product.image);
    } else if (typeof window.addToCart === 'function' && window.addToCart.length === 4) {
        window.addToCart(product.id, product.name, product.price, product.image);
    } else {
        // Nếu không có, tự lưu vào localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id == product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    }
};

// ================== XỬ LÝ YÊU THÍCH ==================
// Thêm/xóa sản phẩm khỏi danh sách yêu thích
function toggleWishlist(button) {
    const productCard = button.closest('.product-card');
    const productId = parseInt(productCard.getAttribute('data-product-id'));
    const product = productDatabase[productId];
    
    if (!product) {
        alert('Sản phẩm không tồn tại!');
        return;
    }

    const icon = button.querySelector('i');
    const isInWishlist = wishlist.some(item => item.id === productId);

    if (isInWishlist) {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.id !== productId);
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('Đã xóa khỏi danh sách yêu thích!', 'info');
    } else {
        // Add to wishlist
        wishlist.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image
        });
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('Đã thêm vào danh sách yêu thích!', 'success');
    }

    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Update cart count display
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Update wishlist icons and count
function updateWishlistIcons() {
    // Update wishlist count
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
    
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = parseInt(card.getAttribute('data-product-id'));
        const wishlistBtn = card.querySelector('.action-btn:first-child');
        if (wishlistBtn) {
            const icon = wishlistBtn.querySelector('i');
            
            if (wishlist.some(item => item.id === productId)) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Backend integration functions (for future use)

// Load products from API
async function loadProductsFromAPI() {
    try {
        // const response = await fetch('/api/products/featured');
        // const data = await response.json();
        // return data;
        console.log('Loading featured products from API');
        return Object.values(productDatabase);
    } catch (error) {
        console.error('Error loading featured products:', error);
        return [];
    }
}

// Save cart to backend
async function saveCartToBackend() {
    try {
        // const response = await fetch('/api/cart', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(cart)
        // });
        // return await response.json();
        console.log('Saving cart to backend:', cart);
        return { success: true };
    } catch (error) {
        console.error('Error saving cart:', error);
        return { success: false, error: error.message };
    }
}

// Save wishlist to backend
async function saveWishlistToBackend() {
    try {
        // const response = await fetch('/api/wishlist', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(wishlist)
        // });
        // return await response.json();
        console.log('Saving wishlist to backend:', wishlist);
        return { success: true };
    } catch (error) {
        console.error('Error saving wishlist:', error);
        return { success: false, error: error.message };
    }
}