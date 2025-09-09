// Simple fix for dropdown menus
document.addEventListener('DOMContentLoaded', function() {
    // Remove any conflicting event listeners by cloning elements
    document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
    });
}); 