// ================== CART DATA HANDLING ==================
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = [];
    }
    updateCartSummary();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartSummary();
}

// ================== ADD TO CART (TRANG SẢN PHẨM) ==================
window.addToCart = function (id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    saveCart();
    showCartNotification(name);
};

// ================== ADD TO CART (TRANG SẢN PHẨM VÀ GIỎ HÀNG) ==================
window.addToCartFromCartPage = function (id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    saveCart();
    showCartNotification(name);
};

// Hiển thị thông báo thêm sản phẩm
function showCartNotification(productName) {
    // Xóa thông báo cũ nếu có
    const old = document.querySelector('.cart-notification');
    if (old) old.remove();

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 80px;
        right: 30px;
        background: #4CAF50;
        color: white;
        padding: 16px 28px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        z-index: 2000;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
      ">
        <i class="fas fa-check-circle" style="font-size:20px"></i>
        Đã thêm <b>${productName}</b> vào giỏ hàng!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
}

// ================== UPDATE CART SUMMARY (TRANG GIỎ HÀNG + HEADER) ==================
function updateCartSummary() {
    // Tổng số lượng sản phẩm
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Update header count
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }

    // Update "xx items"
    const itemCountElement = document.querySelector('.item-count');
    if (itemCountElement) {
        itemCountElement.textContent = `${totalItems} items`;
    }

    // Update subtotal
    const subtotalElement = document.querySelector('.price-breakdown .price-row:first-child span:last-child');
    if (subtotalElement) {
        subtotalElement.textContent = `${subtotal.toLocaleString('vi-VN')}đ`;
    }

    // Giảm giá 20%
    const discount = subtotal * 0.2;
    const discountElement = document.querySelector('.price-breakdown .price-row:nth-child(2) .discount');
    if (discountElement) {
        discountElement.textContent = `-${discount.toLocaleString('vi-VN')}đ`;
    }

    // Tổng tiền sau giảm
    const total = subtotal - discount;
    const totalElement = document.querySelector('.price-breakdown .total span:last-child');
    if (totalElement) {
        totalElement.textContent = `${total.toLocaleString('vi-VN')}đ`;
    }

    // Nút thanh toán
    const checkoutTotalElement = document.querySelector('.checkout-total');
    if (checkoutTotalElement) {
        checkoutTotalElement.textContent = `${total.toLocaleString('vi-VN')}đ`;
    }

    // Hiển thị danh sách sản phẩm trong giỏ hàng
    renderCartItems();
}

// ================== RENDER CART ITEMS ==================
function renderCartItems() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return; // Không phải trang giỏ hàng

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Giỏ hàng trống</p>';
        return;
    }

    cart.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <div class="product-info">
                <img src="${item.image}" alt="${item.name}" />
                <span>${item.name}</span>
            </div>
            <div class="current-price">${item.price.toLocaleString('vi-VN')}đ</div>
            <div class="quantity">
                <button class="qty-btn minus">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10">
                <button class="qty-btn plus">+</button>
            </div>
            <button class="remove-btn">Xóa</button>
        `;

        // Event tăng
        div.querySelector('.plus').addEventListener('click', () => {
            if (item.quantity < 10) {
                item.quantity++;
                saveCart();
            }
        });

        // Event giảm
        div.querySelector('.minus').addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                saveCart();
            }
        });

        // Event nhập số lượng
        div.querySelector('.quantity-input').addEventListener('change', (e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value) || value < 1) value = 1;
            if (value > 10) value = 10;
            item.quantity = value;
            saveCart();
        });

        // Event xóa
        div.querySelector('.remove-btn').addEventListener('click', () => {
            cart = cart.filter(p => p.id !== item.id);
            saveCart();
        });

        cartContainer.appendChild(div);
    });
}

// ================== REMOVE ALL ITEMS ==================
function removeAllItems() {
    cart = [];
    saveCart();
}

// ================== CONTINUE SHOPPING ==================
function continueShopping() {
    window.location.href = 'Trangchu.html';
}

// ================== PROCEED TO CHECKOUT ==================
function proceedToCheckout() {
    alert('Chức năng thanh toán sẽ được thực hiện sau!');
}

// ================== INIT ==================
document.addEventListener('DOMContentLoaded', () => {
    loadCart();

    // Nút xóa tất cả
    const removeAllButton = document.querySelector('.cart-actions .btn-outline:last-child');
    if (removeAllButton) {
        removeAllButton.addEventListener('click', removeAllItems);
    }

    // Nút tiếp tục mua sắm
    const continueButton = document.querySelector('.cart-actions .btn-outline:first-child');
    if (continueButton) {
        continueButton.addEventListener('click', continueShopping);
    }

    // Nút thanh toán
    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', proceedToCheckout);
    }

    // Gán sự kiện cho nút Add to Cart ở mục Recommended
    document.querySelectorAll('.recommended-section .product-card').forEach(card => {
        const name = card.querySelector('.product-info h3').innerText.trim();
        const priceText = card.querySelector('.current-price').innerText.replace(/[^\d]/g, '');
        const price = parseInt(priceText, 10);
        const image = card.querySelector('img').getAttribute('src');
        // Tìm id theo tên sản phẩm trong productDatabase
        const product = Object.values(productDatabase).find(p => p.name === name);
        const id = product ? product.id : null;

        const btn = card.querySelector('.add-to-cart-btn');
        if (btn && id) {
            btn.addEventListener('click', () => {
                window.addToCartFromCartPage(id, name, price, image);
            });
        }
    });
});

// ================== DỮ LIỆU SẢN PHẨM ==================
const productDatabase = {
    1: { id: 1, name: "iPhone 15 Pro Max", price: 29990000, image: "Img/iphone-15.jpg" },
    2: { id: 2, name: "Samsung Galaxy S23 Ultra", price: 24990000, image: "Img/samsung-s23.jpg" },
    3: { id: 3, name: "Xiaomi 13 Pro", price: 18990000, image: "Img/xiaomi-13pro.jpg" },
    4: { id: 4, name: "Oppo Reno 10", price: 12990000, image: "Img/oppo.jpg" },
    5: { id: 5, name: "Vivo V29", price: 9990000, image: "Img/vivo.jpg" },
    6: { id: 6, name: "Realme 11 Pro+", price: 8990000, image: "Img/realme.jpg" },
    7: { id: 7, name: "Nokia G22", price: 4990000, image: "Img/nokia.jpg" },
    8: { id: 8, name: "Asus ROG Phone 7", price: 19990000, image: "Img/asus.jpg" },
    9: { id: 9, name: "Samsung Smart TV 55\"", price: 12990000, image: "Img/samsung-tv.jpg" },
    10: { id: 10, name: "iPad Pro 12.9\" M2", price: 18990000, image: "Img/ipad-pro.jpg" },
    11: { id: 11, name: "Apple Watch Series 9", price: 8990000, image: "Img/apple-watch.jpg" },
    12: { id: 12, name: "Sony WH-1000XM5", price: 6990000, image: "Img/sony-headphones.jpg" }
};

