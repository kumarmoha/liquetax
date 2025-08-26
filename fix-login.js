/**
 * Fix for login black screen issue
 * Add this script to your HTML file to prevent the black screen issue
 */

// Execute when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login fix script loaded');
    
    // Clean up any stuck modal backdrops
    cleanupModalBackdrops();
    
    // Set up a periodic check for stuck backdrops
    setInterval(cleanupModalBackdrops, 5000);
    
    // Add event listener to handle ESC key to close modals and clean up backdrops
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            console.log('ESC key pressed, cleaning up modals');
            cleanupModalBackdrops();
        }
    });
    
    // Add event listener to login button
    const loginBtn = document.getElementById('loginToConnectBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            console.log('Login button clicked, ensuring modal is properly set up');
            
            // Make sure the modal is properly initialized
            setTimeout(function() {
                const loginModal = document.getElementById('simpleLoginModal');
                if (loginModal) {
                    // Ensure the modal has the correct attributes
                    loginModal.setAttribute('aria-hidden', 'false');
                    loginModal.setAttribute('aria-modal', 'true');
                    loginModal.setAttribute('role', 'dialog');
                    
                    // Focus on email field
                    const emailField = document.getElementById('login-email');
                    if (emailField) {
                        emailField.focus();
                    }
                }
            }, 300);
        });
    }
    
    // Fix login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Found login form, adding fixed event listener');
        
        // Remove existing listeners and add a new one
        const clonedForm = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(clonedForm, loginForm);
        
        clonedForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Login form submitted with fix');
            
            const emailField = document.getElementById('login-email');
            const passwordField = document.getElementById('login-password');
            
            if (!emailField || !passwordField) {
                console.error('Login fields not found');
                return;
            }
            
            const email = emailField.value;
            const password = passwordField.value;
            
            // Basic validation
            if (!email || !password) {
                alert('Please enter both email and password');
                return;
            }
            
            // Perform authentication (using demo credentials)
            if (email === 'demo@liquetax.com' && password === 'demo123') {
                // Store user information in localStorage
                try {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', email);
                } catch (e) {
                    console.error('Failed to save to localStorage:', e);
                }
                
                // Close the modal and clean up
                closeModalSafely();
                
                // Update UI
                updateLoginUI(true);
                
                // Show success message
                alert('Login successful!');
            } else {
                // Show error message
                const errorDiv = document.getElementById('login-error');
                if (errorDiv) {
                    errorDiv.classList.remove('d-none');
                } else {
                    alert('Invalid login credentials');
                }
            }
        });
        
        // Also fix the login button
        const loginButton = clonedForm.querySelector('#login-button');
        if (loginButton) {
            loginButton.addEventListener('click', function(event) {
                event.preventDefault();
                // Trigger the form submission
                const submitEvent = new Event('submit');
                clonedForm.dispatchEvent(submitEvent);
            });
        }
    }
});

/**
 * Clean up any stuck modal backdrops
 */
function cleanupModalBackdrops() {
    try {
        // Remove any existing modal backdrops
        const backdrops = document.querySelectorAll('.modal-backdrop');
        if (backdrops.length > 0) {
            console.log(`Found ${backdrops.length} modal backdrops to clean up`);
            backdrops.forEach(backdrop => {
                backdrop.classList.remove('show');
                backdrop.classList.remove('fade');
                backdrop.remove();
            });
        }
        
        // Reset body classes that Bootstrap might have added
        if (document.body.classList.contains('modal-open')) {
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    } catch (e) {
        console.warn('Error during modal backdrop cleanup:', e);
    }
}

/**
 * Close the modal safely without causing black screen
 */
function closeModalSafely() {
    const loginModal = document.getElementById('simpleLoginModal');
    if (!loginModal) {
        return;
    }
    
    // First clean up any backdrops
    cleanupModalBackdrops();
    
    // Try multiple methods to close the modal
    
    // Method 1: Bootstrap 5 way
    if (typeof bootstrap !== 'undefined') {
        try {
            const bootstrapModal = bootstrap.Modal.getInstance(loginModal);
            if (bootstrapModal) {
                bootstrapModal.hide();
                return;
            }
        } catch (e) {
            console.warn('Error with Bootstrap modal instance:', e);
        }
    }
    
    // Method 2: jQuery way
    if (typeof jQuery !== 'undefined') {
        try {
            jQuery(loginModal).modal('hide');
            return;
        } catch (e) {
            console.warn('Error with jQuery modal:', e);
        }
    }
    
    // Method 3: Click the close button
    try {
        const closeButton = loginModal.querySelector('.btn-close');
        if (closeButton) {
            closeButton.click();
            return;
        }
    } catch (e) {
        console.warn('Error clicking close button:', e);
    }
    
    // Method 4: Direct DOM manipulation
    try {
        loginModal.classList.remove('show');
        loginModal.style.display = 'none';
        loginModal.setAttribute('aria-hidden', 'true');
    } catch (e) {
        console.error('All methods to close modal failed:', e);
    }
}

/**
 * Update UI based on login state
 */
function updateLoginUI(isLoggedIn) {
    const loginBtn = document.getElementById('loginToConnectBtn');
    
    if (isLoggedIn) {
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-user me-2"></i>Connected';
            loginBtn.classList.remove('btn-primary');
            loginBtn.classList.add('btn-success');
            loginBtn.disabled = true;
        }
    } else {
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Login to Connect';
            loginBtn.classList.remove('btn-success');
            loginBtn.classList.add('btn-primary');
            loginBtn.disabled = false;
        }
    }
}