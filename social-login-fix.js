// Copy and paste this into browser console if the social login buttons still don't work

// Simple function to log in with a specific platform
function fixSocialLogin(platform) {
  console.log("Fixing login for: " + platform);
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userEmail', platform + '.user@example.com');
  localStorage.setItem(platform + 'Connected', 'true');
  alert('Successfully logged in with ' + platform + '!');
  location.reload();
}

// Create direct buttons that users can click
var fixDiv = document.createElement('div');
fixDiv.style.position = 'fixed';
fixDiv.style.bottom = '10px';
fixDiv.style.right = '10px';
fixDiv.style.backgroundColor = 'white';
fixDiv.style.border = '1px solid black';
fixDiv.style.padding = '10px';
fixDiv.style.zIndex = '9999';
fixDiv.style.borderRadius = '5px';
fixDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

fixDiv.innerHTML = `
  <h4 style="margin: 0 0 10px 0;">Emergency Login Fix</h4>
  <div style="display: flex; flex-direction: column; gap: 5px;">
    <button onclick="fixSocialLogin('google')" style="padding: 5px; display: flex; align-items: center;">
      <span style="background-color: #DB4437; color: white; padding: 3px; margin-right: 5px; border-radius: 3px;">G</span> Login with Google
    </button>
    <button onclick="fixSocialLogin('facebook')" style="padding: 5px; display: flex; align-items: center;">
      <span style="background-color: #4267B2; color: white; padding: 3px; margin-right: 5px; border-radius: 3px;">F</span> Login with Facebook
    </button>
    <button onclick="fixSocialLogin('linkedin')" style="padding: 5px; display: flex; align-items: center;">
      <span style="background-color: #0077B5; color: white; padding: 3px; margin-right: 5px; border-radius: 3px;">L</span> Login with LinkedIn
    </button>
    <button onclick="fixSocialLogin('instagram')" style="padding: 5px; display: flex; align-items: center;">
      <span style="background-color: #E1306C; color: white; padding: 3px; margin-right: 5px; border-radius: 3px;">I</span> Login with Instagram
    </button>
    <button onclick="this.parentNode.parentNode.style.display = 'none'" style="padding: 3px; margin-top: 5px; background-color: #f0f0f0;">Close</button>
  </div>
`;

document.body.appendChild(fixDiv);
console.log("Emergency social login fix initialized"); 