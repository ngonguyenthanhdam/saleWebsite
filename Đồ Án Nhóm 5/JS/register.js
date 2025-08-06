// Register Page JavaScript

// User database (simulate backend data)
let userDatabase = JSON.parse(localStorage.getItem('userDatabase')) || [
    {
        id: 1,
        email: "admin@techstore.vn",
        password: "admin123",
        name: "Admin TechStore",
        firstName: "Admin",
        lastName: "TechStore",
        phone: "1900-1234",
        address: "QTSC 9 Building, Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh",
        city: "hcm",
        district: "Quận 12",
        birthDate: "1990-01-01",
        role: "admin"
    },
    {
        id: 2,
        email: "user@example.com",
        password: "user123",
        name: "Nguyễn Văn A",
        firstName: "Nguyễn Văn",
        lastName: "A",
        phone: "0123456789",
        address: "123 Đường ABC, Quận 1",
        city: "hcm",
        district: "Quận 1",
        birthDate: "1995-05-15",
        role: "user"
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeRegisterForm();
    initializePasswordStrength();
    initializePasswordToggles();
});

// Initialize register form
function initializeRegisterForm() {
    const registerForm = document.querySelector('.register-form');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegister();
    });
}

// Initialize password strength checker
function initializePasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        
        updatePasswordStrengthUI(strength, strengthFill, strengthText);
    });
}

// Initialize password toggles
function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });
}

// Handle register
function handleRegister() {
    const formData = getFormData();
    
    if (!validateForm(formData)) {
        return;
    }
    
    if (isEmailExists(formData.email)) {
        showMessage('Email đã tồn tại trong hệ thống!', 'error');
        return;
    }
    
    // Show loading
    showLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
        const success = registerUser(formData);
        
        if (success) {
            showMessage('Đăng ký thành công! Đang chuyển đến trang đăng nhập...', 'success');
            
            // Redirect to login page after delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage('Có lỗi xảy ra! Vui lòng thử lại.', 'error');
        }
        
        showLoading(false);
    }, 1500);
}

// Get form data
function getFormData() {
    return {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value,
        district: document.getElementById('district').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        birthDate: document.getElementById('birthDate').value,
        agree: document.getElementById('agree').checked
    };
}

// Validate form
function validateForm(data) {
    // Check required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'district', 'password', 'confirmPassword', 'birthDate'];
    
    for (let field of requiredFields) {
        if (!data[field]) {
            showMessage(`Vui lòng điền đầy đủ thông tin ${field}!`, 'error');
            return false;
        }
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Email không đúng định dạng!', 'error');
        return false;
    }
    
    // Check phone format
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(data.phone)) {
        showMessage('Số điện thoại không đúng định dạng!', 'error');
        return false;
    }
    
    // Check password match
    if (data.password !== data.confirmPassword) {
        showMessage('Mật khẩu xác nhận không khớp!', 'error');
        return false;
    }
    
    // Check password strength
    const strength = checkPasswordStrength(data.password);
    if (strength.score < 2) {
        showMessage('Mật khẩu quá yếu! Vui lòng chọn mật khẩu mạnh hơn.', 'error');
        return false;
    }
    
    // Check terms agreement
    if (!data.agree) {
        showMessage('Vui lòng đồng ý với điều khoản sử dụng!', 'error');
        return false;
    }
    
    return true;
}

// Check if email exists
function isEmailExists(email) {
    return userDatabase.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Register user
function registerUser(userData) {
    try {
        const newUser = {
            id: userDatabase.length + 1,
            email: userData.email,
            password: userData.password,
            name: `${userData.firstName} ${userData.lastName}`,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
            address: userData.address,
            city: userData.city,
            district: userData.district,
            birthDate: userData.birthDate,
            role: "user",
            createdAt: new Date().toISOString()
        };
        
        userDatabase.push(newUser);
        localStorage.setItem('userDatabase', JSON.stringify(userDatabase));
        
        return true;
    } catch (error) {
        console.error('Registration error:', error);
        return false;
    }
}

// Check password strength
function checkPasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 8) {
        score += 1;
    } else {
        feedback.push('Mật khẩu phải có ít nhất 8 ký tự');
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Cần có ít nhất 1 chữ hoa');
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Cần có ít nhất 1 chữ thường');
    }
    
    // Number check
    if (/[0-9]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Cần có ít nhất 1 số');
    }
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Cần có ít nhất 1 ký tự đặc biệt');
    }
    
    return {
        score: score,
        maxScore: 5,
        feedback: feedback
    };
}

// Update password strength UI
function updatePasswordStrengthUI(strength, strengthFill, strengthText) {
    const percentage = (strength.score / strength.maxScore) * 100;
    
    strengthFill.style.width = percentage + '%';
    
    // Update color based on strength
    if (strength.score <= 1) {
        strengthFill.style.backgroundColor = '#e74c3c';
        strengthText.textContent = 'Rất yếu';
    } else if (strength.score <= 2) {
        strengthFill.style.backgroundColor = '#f39c12';
        strengthText.textContent = 'Yếu';
    } else if (strength.score <= 3) {
        strengthFill.style.backgroundColor = '#f1c40f';
        strengthText.textContent = 'Trung bình';
    } else if (strength.score <= 4) {
        strengthFill.style.backgroundColor = '#27ae60';
        strengthText.textContent = 'Mạnh';
    } else {
        strengthFill.style.backgroundColor = '#2ecc71';
        strengthText.textContent = 'Rất mạnh';
    }
}

// Show loading spinner
function showLoading(show) {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        if (show) {
            spinner.classList.remove('hidden');
        } else {
            spinner.classList.add('hidden');
        }
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

// Social register handlers
function handleGoogleRegister() {
    showMessage('Chức năng đăng ký Google sẽ được phát triển sau!', 'info');
}

function handleFacebookRegister() {
    showMessage('Chức năng đăng ký Facebook sẽ được phát triển sau!', 'info');
}

// Backend integration functions (for future use)

// Register API call
async function registerAPI(userData) {
    try {
        // const response = await fetch('/api/auth/register', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(userData)
        // });
        // const data = await response.json();
        // return data;
        console.log('Register API call:', userData);
        return { success: true };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
    }
} 