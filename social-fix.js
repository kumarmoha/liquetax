/**
 * Social Media Connection Fix
 * This script replaces the problematic social media connection functionality
 * with a simplified version that doesn't cause black screens
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Social media fix loaded');
    
    // Replace all social media buttons with fixed versions
    replaceSocialButtons();
    
    // Add a global error handler to prevent black screens
    window.addEventListener('error', function(event) {
        console.error('Global error caught:', event.error);
        // Prevent black screen by removing modal backdrops
        cleanupModalBackdrops();
        return false;
    });
});

/**
 * Replace all social media buttons with fixed versions
 */
function replaceSocialButtons() {
    // Find all social media buttons
    const socialButtons = [
        document.getElementById('googleSimpleMethod'),
        document.getElementById('facebookSimpleMethod'),
        document.getElementById('linkedinSimpleMethod'),
        document.getElementById('instagramSimpleMethod'),
        document.getElementById('twitterSimpleMethod')
    ];
    
    // Process each button if it exists
    socialButtons.forEach(function(button) {
        if (button) {
            console.log('Replacing social button:', button.id);
            
            // Clone the button to remove existing event listeners
            const newButton = button.cloneNode(true);
            
            // Add our safe event listener
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get social name and open the corresponding modal
                const socialName = getSocialNameFromButton(this.id);
                openSocialLoginModal(socialName);
                
                return false;
            });
            
            // Replace the original button
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
            }
        }
    });
    
    console.log('Social buttons replaced with safe versions');
}

/**
 * Open the appropriate social media login modal
 */
function openSocialLoginModal(socialName) {
    console.log('Opening modal for:', socialName);
    
    // Check if user is logged in first
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert('Please log in first before connecting social accounts');
        
        // Open the login modal
        const loginModal = document.getElementById('simpleLoginModal');
        if (loginModal) {
            try {
                if (window.bootstrap) {
                    const modal = new bootstrap.Modal(loginModal);
                    modal.show();
                } else if (window.jQuery) {
                    $('#simpleLoginModal').modal('show');
                }
            } catch (e) {
                console.error('Error showing login modal:', e);
                alert('Please log in first before connecting social accounts');
            }
        }
        
        return;
    }
    
    // Open the appropriate modal based on social network
    let modalId = null;
    
    if (socialName === 'Google') {
        modalId = 'connectGoogleModal';
    } else if (socialName === 'Facebook') {
        modalId = 'connectFacebookModal';
    } else if (socialName === 'LinkedIn') {
        modalId = 'connectLinkedinModal';
    } else if (socialName === 'Instagram') {
        modalId = 'connectInstagramModal';
    }
    
    // Open the modal if it exists
    if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            try {
                if (window.bootstrap) {
                    const bsModal = new bootstrap.Modal(modal);
                    bsModal.show();
                } else if (window.jQuery) {
                    $('#' + modalId).modal('show');
                } else {
                    // Fallback - redirect to simple-social.html
                    window.location.href = 'simple-social.html';
                }
            } catch (e) {
                console.error('Error showing modal:', e);
                // Fallback - redirect to simple-social.html
                window.location.href = 'simple-social.html';
            }
        } else {
            // Modal not found, redirect to simple-social.html
            window.location.href = 'simple-social.html';
        }
    } else {
        // Unknown social network, redirect to simple-social.html
        window.location.href = 'simple-social.html';
    }
}

/**
 * Get social network name from button ID
 */
function getSocialNameFromButton(buttonId) {
    if (buttonId.includes('google')) return 'Google';
    if (buttonId.includes('facebook')) return 'Facebook';
    if (buttonId.includes('linkedin')) return 'LinkedIn';
    if (buttonId.includes('instagram')) return 'Instagram';
    if (buttonId.includes('twitter')) return 'Twitter';
    return 'Social Media';
}

/**
 * Mark a social button as connected
 */
function markSocialAsConnected(button, socialName) {
    // Show success message
    alert(socialName + ' connected successfully!');
    
    // Update button appearance
    if (button) {
        // Update text
        button.innerHTML = '<i class="fab fa-' + socialName.toLowerCase() + ' me-2"></i>Connected';
        
        // Update classes based on social network
        if (socialName === 'Google') {
            button.classList.remove('btn-outline-danger');
            button.classList.add('btn-danger');
        } else if (socialName === 'Facebook') {
            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-primary');
        } else if (socialName === 'LinkedIn') {
            button.classList.remove('btn-outline-info');
            button.classList.add('btn-info');
        } else if (socialName === 'Instagram') {
            button.classList.remove('btn-outline-purple');
            button.classList.add('btn-purple');
        } else if (socialName === 'Twitter') {
            button.classList.remove('btn-outline-info');
            button.classList.add('btn-info');
        }
        
        // Store connection state
        try {
            localStorage.setItem(socialName.toLowerCase() + 'Connected', 'true');
            
            // Also update any status badges in the UI
            updateSocialStatusBadges(socialName.toLowerCase());
            
            // Close any open modals
            closeAllModals();
        } catch (e) {
            console.error('Failed to save connection state to localStorage:', e);
        }
    }
}

/**
 * Update social status badges in the UI
 */
function updateSocialStatusBadges(platform) {
    // Update status badges in the social media connections list
    const statusBadges = document.querySelectorAll('[data-platform="' + platform + '"] .badge');
    statusBadges.forEach(function(badge) {
        badge.textContent = 'Connected';
        badge.classList.remove('bg-warning');
        badge.classList.add('bg-success');
    });
    
    // Update settings status badges
    const settingsStatus = document.getElementById(platform + 'SettingsStatus');
    if (settingsStatus) {
        settingsStatus.textContent = 'Connected';
        settingsStatus.classList.remove('bg-warning');
        settingsStatus.classList.add('bg-success');
    }
}

/**
 * Close all open modals
 */
function closeAllModals() {
    // First clean up any modal backdrops
    cleanupModalBackdrops();
    
    // Try to close all modals using Bootstrap
    if (window.bootstrap) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(function(modal) {
            try {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) {
                    bsModal.hide();
                }
            } catch (e) {
                console.warn('Error closing modal:', e);
            }
        });
    } else if (window.jQuery) {
        // Try jQuery fallback
        try {
            $('.modal').modal('hide');
        } catch (e) {
            console.warn('Error closing modals with jQuery:', e);
        }
    }
}

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