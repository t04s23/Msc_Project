// Simplified navbar enhancement scripts
document.addEventListener('DOMContentLoaded', function() {
    // Add active class to current nav item
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href) && href !== '#') {
            link.classList.add('active');
        }
    });
    
    // Add ripple effect to all clickable elements in navbar
    document.querySelectorAll('.navbar .nav-link, .navbar .btn, .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Only add ripple if element doesn't have dropdown
            if (!item.classList.contains('dropdown-toggle')) {
                createRipple(e, item);
            }
        });
    });
    
    // Helper function to create ripple effect
    function createRipple(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}); 