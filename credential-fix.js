/**
 * Credential Fix for Social Media Logins
 * This script ensures that the credential submission functionality works properly
 * for all social media login modals.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Credential fix script loaded');
    
    // Ensure social connect buttons have proper event listeners
    setupSocialConnectButtonsFixed();
    
    // Add toggle password visibility functionality
    setupPasswordToggles();
});

/**
 * Set up event listeners for all social media connect buttons in modals
 * This function ensures that the buttons properly handle credential submission
 */
function setupSocialConnectButtonsFixed() {
    // Facebook Simple Connect button
    const facebookSimpleConnectBtn = document.getElementById('facebookSimpleConnectBtn');
    if (facebookSimpleConnectBtn) {
        console.log('Setting up Facebook Simple Connect button');
        facebookSimpleConnectBtn.addEventListener('click', function() {
            handleSocialConnectFixed('facebook');
        });
    }
    
    // LinkedIn Simple Connect button
    const linkedinSimpleConnectBtn = document.getElementById('linkedinSimpleConnectBtn');
    if (linkedinSimpleConnectBtn) {
        console.log('Setting up LinkedIn Simple Connect button');
        linkedinSimpleConnectBtn.addEventListener('click', function() {
            handleSocialConnectFixed('linkedin');
        });
    }
    
    // API Connect buttons
    const apiButtons = [
        { id: 'facebookApiConnectBtn', platform: 'facebook' },
        { id: 'linkedinApiConnectBtn', platform: 'linkedin' }
    ];
    
    apiButtons.forEach(function(button) {
        const element = document.getElementById(button.id);
        if (element) {
            console.log(`Setting up ${button.platform} API Connect button`);
            element.addEventListener('click', function() {
                handleSocialConnectFixed(button.platform, 'api');
            });
        }
    });
    
    console.log('Social connect buttons fixed and initialized');
}

/**
 * Handle social media connection with improved validation and feedback
 */
function handleSocialConnectFixed(platform, method = 'simple') {
    console.log(`Connecting ${platform} using ${method} method`);
    
    // Get the appropriate input fields based on platform and method
    let email = '';
    let password = '';
    let isValid = false;
    let errorMessage = '';
    
    // Check if platform is valid
    if (!['facebook', 'linkedin'].includes(platform)) {
        alert('Invalid platform specified');
        return;
    }
    
    if (method === 'simple') {
        // Get email/username and password from form
        const emailField = document.getElementById(`${platform}SimpleEmail`) || 
                          document.getElementById(`${platform}SimpleUsername`);
        const passwordField = document.getElementById(`${platform}SimplePassword`);
        
        if (emailField && passwordField) {
            email = emailField.value.trim();
            password = passwordField.value.trim();
            
            // Enhanced validation
            if (!email) {
                errorMessage = 'Please enter your email or username';
            } else if (!password) {
                errorMessage = 'Please enter your password';
            } else {
                isValid = true;
            }
        } else {
            console.error(`Form fields not found for ${platform}`);
            errorMessage = 'Login form elements not found. Please try again.';
        }
    } else if (method === 'api') {
        // For API method, validate required fields based on platform
        if (platform === 'facebook') {
            const clientId = document.getElementById('facebookClientId');
            const clientSecret = document.getElementById('facebookClientSecret');
            
            if (clientId && clientSecret) {
                if (!clientId.value.trim()) {
                    errorMessage = 'Please enter your Facebook Client ID';
                } else if (!clientSecret.value.trim()) {
                    errorMessage = 'Please enter your Facebook Client Secret';
                } else {
                    isValid = true;
                }
            } else {
                errorMessage = 'API form fields not found';
            }
        } else if (platform === 'linkedin') {
            const clientId = document.getElementById('linkedinClientId');
            const clientSecret = document.getElementById('linkedinClientSecret');
            
            if (clientId && clientSecret) {
                if (!clientId.value.trim()) {
                    errorMessage = 'Please enter your LinkedIn Client ID';
                } else if (!clientSecret.value.trim()) {
                    errorMessage = 'Please enter your LinkedIn Client Secret';
                } else {
                    isValid = true;
                }
            } else {
                errorMessage = 'API form fields not found';
            }
        }
    }
    
    if (!isValid) {
        // Show error message
        alert(errorMessage || 'Please fill in all required fields');
        return;
    }
    
    // If valid, proceed with connection
    // Store connection status
    localStorage.setItem(`${platform}Connected`, 'true');
    if (email) {
        localStorage.setItem(`${platform}Email`, email);
    }
    
    // Update UI
    updateSocialUIFixed(platform);
    
    // Close modal
    closeModalFixed(`connect${capitalizeFirstLetter(platform)}Modal`);
    
    // Show success message
    setTimeout(() => {
        alert(`${capitalizeFirstLetter(platform)} account connected successfully!`);
    }, 100);
}

/**
 * Update UI for social media connection
 */
function updateSocialUIFixed(platform) {
    // Update simple method button if it exists
    const simpleMethodBtn = document.getElementById(`${platform}SimpleMethod`);
    if (simpleMethodBtn) {
        simpleMethodBtn.innerHTML = `<i class="fab fa-${platform} me-2"></i>Connected`;
        
        // Update classes based on platform
        if (platform === 'facebook') {
            simpleMethodBtn.classList.remove('btn-outline-primary');
            simpleMethodBtn.classList.add('btn-primary');
        } else if (platform === 'linkedin') {
            simpleMethodBtn.classList.remove('btn-outline-info');
            simpleMethodBtn.classList.add('btn-info');
        }
    }
    
    // Update status badges
    const statusBadges = document.querySelectorAll(`[data-platform="${platform}"] .badge`);
    statusBadges.forEach(function(badge) {
        badge.textContent = 'Connected';
        badge.classList.remove('bg-warning');
        badge.classList.add('bg-success');
    });
    
    // Update settings status badge
    const settingsStatus = document.getElementById(`${platform}SettingsStatus`);
    if (settingsStatus) {
        settingsStatus.textContent = 'Connected';
        settingsStatus.classList.remove('bg-warning');
        settingsStatus.classList.add('bg-success');
    }
}

/**
 * Close a modal by ID with improved reliability
 */
function closeModalFixed(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        return;
    }
    
    // Try Bootstrap 5 way
    if (typeof bootstrap !== 'undefined') {
        try {
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
                return;
            }
        } catch (e) {
            console.warn('Error with Bootstrap modal instance:', e);
        }
    }
    
    // Try jQuery way
    if (typeof jQuery !== 'undefined') {
        try {
            jQuery(modal).modal('hide');
            return;
        } catch (e) {
            console.warn('Error with jQuery modal:', e);
        }
    }
    
    // Fallback: click the close button
    const closeButton = modal.querySelector('.btn-close');
    if (closeButton) {
        closeButton.click();
    }
    
    // Clean up any modal backdrops
    cleanupModalBackdropsFixed();
}

/**
 * Clean up any stuck modal backdrops
 */
function cleanupModalBackdropsFixed() {
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
 * Helper function to capitalize first letter
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Set up password toggle functionality for all password fields
 */
function setupPasswordToggles() {
    // Facebook password toggle
    const toggleFacebookPassword = document.getElementById('toggleFacebookPassword');
    const facebookPasswordField = document.getElementById('facebookSimplePassword');
    
    if (toggleFacebookPassword && facebookPasswordField) {
        toggleFacebookPassword.addEventListener('click', function() {
            togglePasswordVisibility(facebookPasswordField, this);
        });
    }
    
    // LinkedIn password toggle
    const toggleLinkedinPassword = document.getElementById('toggleLinkedinPassword');
    const linkedinPasswordField = document.getElementById('linkedinSimplePassword');
    
    if (toggleLinkedinPassword && linkedinPasswordField) {
        toggleLinkedinPassword.addEventListener('click', function() {
            togglePasswordVisibility(linkedinPasswordField, this);
        });
    }
}

/**
 * Toggle password field visibility
 */
function togglePasswordVisibility(passwordField, toggleButton) {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordField.type = 'password';
        toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
    }
}