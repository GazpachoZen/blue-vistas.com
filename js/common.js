// Simplified Header HTML content - no conditional logic
const headerHTML = `
<div class="container">
    <div class="header-content">
        <div class="logo">
            <a href="index.html">
                <img src="images/blue-vista-logo.png" alt="Blue Vista Solutions Logo" class="logo-img">
                <h1>Blue Vista Solutions</h1>
            </a>
        </div>
        <div class="menu-toggle" id="mobile-menu">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <nav id="navigation">
            <ul>
                <li><a href="danoggin.html">Danoggin</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
        </nav>
    </div>
</div>
`;

// Footer HTML content
const footerHTML = `
<div class="container">
    <div class="copyright">
        <p>&copy; ${new Date().getFullYear()} Blue Vista Solutions. All rights reserved.</p>
    </div>
</div>
`;

// Function to insert header HTML
function insertHeader() {
    const headerElement = document.querySelector('header');
    if (headerElement) {
        headerElement.innerHTML = headerHTML;
    }
}

// Function to insert footer HTML
function insertFooter() {
    const footerElement = document.querySelector('footer');
    if (footerElement) {
        footerElement.innerHTML = footerHTML;
    }
}

// Simple hamburger menu toggle functionality
function setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const nav = document.getElementById('navigation');
    
    if (menuToggle && nav) {
        // Toggle menu on hamburger click
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            nav.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a menu item
        nav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                nav.classList.remove('active');
            }
        });
    }
}

// Insert header and footer once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    insertHeader();
    insertFooter();
    setupMobileMenu();
});

// Fallback for cases where DOMContentLoaded has already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(function() {
        insertHeader();
        insertFooter();
        setupMobileMenu();
    }, 100);
}