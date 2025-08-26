/**
 * Direct Login System - Bypasses modal to avoid black screen issues
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Direct login system initialized');
    
    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        console.log('User already logged in');
        updateUIForLoggedInUser();
        return;
    }
    
    // Add direct login button to replace modal
    addDirectLoginButton();
    
    // Set up auto-login if needed
    setTimeout(function() {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            console.log('Attempting auto-login');
            performDirectLogin('demo@liquetax.com', 'demo123');
        }
    }, 1000);
});

/**
 * Add a direct login button to the page
 */
function addDirectLoginButton() {
    // Find the original login button
    const originalLoginBtn = document.getElementById('loginToConnectBtn');
    if (!originalLoginBtn) {
        console.error('Original login button not found');
        return;
    }
    
    // Create a clone of the button with direct login functionality
    const directLoginBtn = originalLoginBtn.cloneNode(true);
    directLoginBtn.id = 'directLoginBtn';
    
    // Replace the original button with our direct login button
    if (originalLoginBtn.parentNode) {
        originalLoginBtn.parentNode.replaceChild(directLoginBtn, originalLoginBtn);
    }
    
    // Add event listener to the direct login button
    directLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Show inline login form instead of modal
        showInlineLoginForm();
        
        return false;
    });
    
    console.log('Direct login button added');
}

/**
 * Show an inline login form instead of a modal
 */
function showInlineLoginForm() {
    // Create a simple inline form
    const inlineForm = document.createElement('div');
    inlineForm.id = 'inlineLoginForm';
    inlineForm.className = 'card mb-4';
    inlineForm.style.maxWidth = '400px';
    inlineForm.style.margin = '0 auto';
    inlineForm.style.padding = '20px';
    inlineForm.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    
    inlineForm.innerHTML = `
        <h5 class="card-title">Quick Login</h5>
        <div class="alert alert-info mb-3">
            <i class="fas fa-info-circle me-2"></i> Use the following demo credentials:
            <br>Email: <strong>demo@liquetax.com</strong>
            <br>Password: <strong>demo123</strong>
        </div>
        <div id="inline-login-error" class="alert alert-danger mb-3 d-none">
            Invalid credentials! Use demo@liquetax.com / demo123
        </div>
        <div class="mb-3">
            <label for="inline-email" class="form-label">Email</label>
            <input type="email" class="form-control" id="inline-email" value="demo@liquetax.com">
        </div>
        <div class="mb-3">
            <label for="inline-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="inline-password" value="demo123">
        </div>
        <div class="d-grid gap-2">
            <button type="button" id="inline-login-button" class="btn btn-primary">
                <i class="fas fa-sign-in-alt me-2"></i>Login
            </button>
            <button type="button" id="inline-cancel-button" class="btn btn-outline-secondary">
                <i class="fas fa-times me-2"></i>Cancel
            </button>
        </div>
    `;
    
    // Find a good place to insert the form
    const targetContainer = document.querySelector('.main-content');
    if (targetContainer) {
        // Insert at the beginning of the main content
        if (targetContainer.firstChild) {
            targetContainer.insertBefore(inlineForm, targetContainer.firstChild);
        } else {
            targetContainer.appendChild(inlineForm);
        }
        
        // Scroll to the form
        inlineForm.scrollIntoView({ behavior: 'smooth' });
        
        // Add event listeners
        const loginButton = document.getElementById('inline-login-button');
        if (loginButton) {
            loginButton.addEventListener('click', function() {
                const email = document.getElementById('inline-email').value;
                const password = document.getElementById('inline-password').value;
                
                performDirectLogin(email, password);
            });
        }
        
        const cancelButton = document.getElementById('inline-cancel-button');
        if (cancelButton) {
            cancelButton.addEventListener('click', function() {
                inlineForm.remove();
            });
        }
        
        // Focus on email field
        const emailField = document.getElementById('inline-email');
        if (emailField) {
            emailField.focus();
        }
    } else {
        console.error('Target container for inline form not found');
        alert('Please use demo@liquetax.com / demo123 to login');
    }
}

/**
 * Perform direct login without using the modal
 */
function performDirectLogin(email, password) {
    console.log('Performing direct login');
    
    // Basic validation
    if (!email || !password) {
        showInlineError('Please enter both email and password');
        return;
    }
    
    // Check credentials
    if (email === 'demo@liquetax.com' && password === 'demo123') {
        // Store login state
        try {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            console.log('Login successful - data saved to localStorage');
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
        
        // Update UI
        updateUIForLoggedInUser();
        
        // Remove the inline form if it exists
        const inlineForm = document.getElementById('inlineLoginForm');
        if (inlineForm) {
            inlineForm.remove();
        }
        
        // Show success message
        showSuccessMessage('Login successful!');
    } else {
        // Show error
        showInlineError('Invalid credentials! Use demo@liquetax.com / demo123');
    }
}

/**
 * Show inline error message
 */
function showInlineError(message) {
    const errorDiv = document.getElementById('inline-login-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('d-none');
    } else {
        alert(message);
    }
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
    // Create a success toast
    const toast = document.createElement('div');
    toast.className = 'position-fixed top-0 end-0 p-3';
    toast.style.zIndex = '5000';
    
    toast.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-success text-white">
                <strong class="me-auto">Success</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(function() {
        toast.remove();
    }, 3000);
}

/**
 * Update UI for logged in user
 */
function updateUIForLoggedInUser() {
    // Update login button
    const loginBtn = document.getElementById('directLoginBtn') || document.getElementById('loginToConnectBtn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-user me-2"></i>Connected';
        loginBtn.classList.remove('btn-primary');
        loginBtn.classList.add('btn-success');
        loginBtn.disabled = true;
    }
    
    // Enable social connect buttons
    const socialButtons = document.querySelectorAll('.social-connect-btn');
    socialButtons.forEach(btn => {
        btn.disabled = false;
    });
    
    console.log('UI updated for logged in user');
}