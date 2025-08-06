// giohang.js

// Hàm cập nhật tổng tiền và số lượng sản phẩm
function updateCartSummary() {
    const cartItems = document.querySelectorAll('.cart-item');
    let totalItems = 0;
    let subtotal = 0;

    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        const priceText = item.querySelector('.current-price').textContent;
        const price = parseFloat(priceText.replace(/\./g, '').replace('đ', ''));

        totalItems += quantity;
        subtotal += quantity * price;
    });

    // Cập nhật số lượng sản phẩm trong header
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }

    // Cập nhật số lượng sản phẩm trong tiêu đề giỏ hàng
    const itemCountElement = document.querySelector('.item-count');
    if (itemCountElement) {
        itemCountElement.textContent = `${totalItems} items`;
    }

    // Cập nhật subtotal
    const subtotalElement = document.querySelector('.price-breakdown .price-row:first-child span:last-child');
    if (subtotalElement) {
        subtotalElement.textContent = `${subtotal.toLocaleString('vi-VN')}đ`;
    }

    // Giả sử có giảm giá 20%
    const discount = subtotal * 0.2;
    const discountElement = document.querySelector('.price-breakdown .price-row:nth-child(2) .discount');
    if (discountElement) {
        discountElement.textContent = `-${discount.toLocaleString('vi-VN')}đ`;
    }

    // Tính tổng tiền sau giảm giá
    const total = subtotal - discount;
    const totalElement = document.querySelector('.price-breakdown .total span:last-child');
    if (totalElement) {
        totalElement.textContent = `${total.toLocaleString('vi-VN')}đ`;
    }

    // Cập nhật tổng tiền trên nút thanh toán
    const checkoutTotalElement = document.querySelector('.checkout-total');
    if (checkoutTotalElement) {
        checkoutTotalElement.textContent = `${total.toLocaleString('vi-VN')}đ`;
    }
}

// Hàm xử lý tăng số lượng
function increaseQuantity(button) {
    const input = button.parentElement.querySelector('.quantity-input');
    let value = parseInt(input.value);
    if (!isNaN(value)) {
        value++;
        input.value = value;
        updateCartSummary();
    }
}

// Hàm xử lý giảm số lượng
function decreaseQuantity(button) {
    const input = button.parentElement.querySelector('.quantity-input');
    let value = parseInt(input.value);
    if (!isNaN(value) && value > 1) {
        value--;
        input.value = value;
        updateCartSummary();
    }
}

// Hàm xử lý thay đổi số lượng từ input
function changeQuantity(input) {
    let value = parseInt(input.value);
    if (isNaN(value) || value < 1) {
        value = 1;
    } else if (value > 10) {
        value = 10;
    }
    input.value = value;
    updateCartSummary();
}

// Hàm xử lý xóa sản phẩm
function removeItem(button) {
    const item = button.closest('.cart-item');
    if (item) {
        item.remove();
        updateCartSummary();
    }
}

// Hàm xử lý xóa tất cả sản phẩm
function removeAllItems() {
    const cartItems = document.querySelector('.cart-items');
    if (cartItems) {
        cartItems.innerHTML = '';
        updateCartSummary();
    }
}

// Hàm xử lý tiếp tục mua sắm
function continueShopping() {
    window.location.href = 'Trangchu.html';
}

// Hàm xử lý thanh toán
function proceedToCheckout() {
    alert('Chức năng thanh toán sẽ được thực hiện sau!');
    // Có thể chuyển hướng đến trang thanh toán ở đây
    // window.location.href = 'checkout.html';
}

// Gán sự kiện khi DOM load xong
document.addEventListener('DOMContentLoaded', function () {
    // Gán sự kiện cho các nút tăng số lượng
    document.querySelectorAll('.qty-btn.plus').forEach(button => {
        button.addEventListener('click', function () {
            increaseQuantity(this);
        });
    });

    // Gán sự kiện cho các nút giảm số lượng
    document.querySelectorAll('.qty-btn.minus').forEach(button => {
        button.addEventListener('click', function () {
            decreaseQuantity(this);
        });
    });

    // Gán sự kiện cho các input số lượng
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function () {
            changeQuantity(this);
        });
    });

    // Gán sự kiện cho các nút xóa
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function () {
            removeItem(this);
        });
    });

    // Gán sự kiện cho nút xóa tất cả
    const removeAllButton = document.querySelector('.cart-actions .btn-outline:last-child');
    if (removeAllButton) {
        removeAllButton.addEventListener('click', removeAllItems);
    }

    // Gán sự kiện cho nút tiếp tục mua sắm
    const continueButton = document.querySelector('.cart-actions .btn-outline:first-child');
    if (continueButton) {
        continueButton.addEventListener('click', continueShopping);
    }

    // Gán sự kiện cho nút thanh toán
    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', proceedToCheckout);
    }

    // Cập nhật tổng tiền ban đầu
    updateCartSummary();
});
