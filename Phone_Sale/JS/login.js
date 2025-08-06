// Login Page JavaScript

// User database (simulate backend data)
const userDatabase = JSON.parse(localStorage.getItem('userDatabase')) || [
    {
        id: 1,
        email: "admin@techstore.vn",
        password: "admin123",
        name: "Admin TechStore",
        role: "admin"
    },
    {
        id: 2,
        email: "user@example.com",
        password: "user123",
        name: "Nguyễn Văn A",
        role: "user"
    },
    {
        id: 3,
        email: "test@test.com",
        password: "test123",
        name: "Trần Thị B",
        role: "user"
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginForm();
    initializeForgotPasswordForm();
    checkRememberedUser();
});

// Initialize login form
function initializeLoginForm() {
    const loginForm = document.getElementById('loginFormElement');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const forgotPasswordLink = document.querySelector('.forgot-password');
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
    
    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Show forgot password form
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showForgotPasswordForm();
    });
}

// Initialize forgot password form
function initializeForgotPasswordForm() {
    const forgotForm = document.getElementById('forgotFormElement');
    const backToLogin = document.getElementById('backToLogin');
    
    // Handle forgot password form submission
    forgotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleForgotPassword();
    });
    
    // Back to login form
    backToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
}

// Handle login
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Show loading
    showLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
        const user = authenticateUser(email, password);
        
        if (user) {
            // Save user data
            saveUserSession(user, remember);
            
            // Show success message
            showMessage('Đăng nhập thành công! Đang chuyển hướng...', 'success');
            
            // Redirect to home page after delay
            setTimeout(() => {
                window.location.href = 'Trangchu.html';
            }, 1500);
        } else {
            showMessage('Email hoặc mật khẩu không đúng!', 'error');
        }
        
        showLoading(false);
    }, 1000);
}

// Authenticate user
function authenticateUser(email, password) {
    return userDatabase.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        user.password === password
    );
}

// Save user session
function saveUserSession(user, remember) {
    const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString()
    };
    
    // Save to sessionStorage (cleared when browser closes)
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Save to localStorage if remember is checked
    if (remember) {
        localStorage.setItem('rememberedUser', JSON.stringify(userData));
    } else {
        localStorage.removeItem('rememberedUser');
    }
    
    // Update cart and wishlist if user has saved data
    loadUserData(user.id);
}

// Load user data (cart, wishlist, etc.)
function loadUserData(userId) {
    // Load user's cart
    const userCart = localStorage.getItem(`cart_${userId}`);
    if (userCart) {
        localStorage.setItem('cart', userCart);
    }
    
    // Load user's wishlist
    const userWishlist = localStorage.getItem(`wishlist_${userId}`);
    if (userWishlist) {
        localStorage.setItem('wishlist', userWishlist);
    }
}

// Handle forgot password
function handleForgotPassword() {
    const email = document.getElementById('forgotEmail').value;
    
    showLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
        const user = userDatabase.find(user => user.email.toLowerCase() === email.toLowerCase());
        
        if (user) {
            showMessage('Link đặt lại mật khẩu đã được gửi đến email của bạn!', 'success');
            showLoginForm();
        } else {
            showMessage('Email không tồn tại trong hệ thống!', 'error');
        }
        
        showLoading(false);
    }, 1000);
}

// Show forgot password form
function showForgotPasswordForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('forgotForm').classList.remove('hidden');
}

// Show login form
function showLoginForm() {
    document.getElementById('forgotForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

// Check for remembered user
function checkRememberedUser() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        const user = JSON.parse(rememberedUser);
        document.getElementById('email').value = user.email;
        document.getElementById('remember').checked = true;
    }
}

// Show loading spinner
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

// Show message
function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    
    // Remove existing messages
    messageContainer.innerHTML = '';
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
        <div class="message-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to container
    messageContainer.appendChild(messageElement);
    
    // Show message
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            if (messageContainer.contains(messageElement)) {
                messageContainer.removeChild(messageElement);
            }
        }, 300);
    }, 5000);
}

// Social login handlers
function handleGoogleLogin() {
    showMessage('Chức năng đăng nhập Google sẽ được phát triển sau!', 'info');
}

function handleFacebookLogin() {
    showMessage('Chức năng đăng nhập Facebook sẽ được phát triển sau!', 'info');
}

// Backend integration functions (for future use)

// Login API call
async function loginAPI(email, password) {
    try {
        // const response = await fetch('/api/auth/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ email, password })
        // });
        // const data = await response.json();
        // return data;
        console.log('Login API call:', { email, password });
        return { success: true, user: userDatabase.find(u => u.email === email) };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

// Forgot password API call
async function forgotPasswordAPI(email) {
    try {
        // const response = await fetch('/api/auth/forgot-password', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ email })
        // });
        // const data = await response.json();
        // return data;
        console.log('Forgot password API call:', { email });
        return { success: true };
    } catch (error) {
        console.error('Forgot password error:', error);
        return { success: false, error: error.message };
    }
} 