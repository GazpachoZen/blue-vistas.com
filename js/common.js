// Function to determine if a page is active
function isCurrentPage(href) {
    // Get the current page URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // If href is # or index.html, it's the homepage
    if ((href === '#' || href === 'index.html') && (currentPage === '' || currentPage === 'index.html')) {
        return true;
    }
    
    // Otherwise check if href matches current page
    return href === currentPage;
}

// Header HTML content
const headerHTML = `
<div class="container">
    <div class="header-content">
        <div class="logo">
            <a href="index.html">
                <img src="images/blue-vista-logo.png" alt="Blue Vista Solutions Logo" class="logo-img">
                <h1>Blue Vista Solutions</h1>
            </a>
        </div>
        <nav>
            <ul>
                <li><a href="danoggin.html" ${isCurrentPage('danoggin.html') ? 'class="active"' : ''}>Danoggin</a></li>
                <li><a href="about.html" ${isCurrentPage('about.html') ? 'class="active"' : ''}>About Us</a></li>
                <li><a href="contact.html" ${isCurrentPage('contact.html') ? 'class="active"' : ''}>Contact</a></li>
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

// Insert header and footer once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    insertHeader();
    insertFooter();
});

// If for some reason the DOM content loaded event has already fired,
// try to insert the header and footer immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(function() {
        insertHeader();
        insertFooter();
    }, 100); // Small delay to ensure DOM is accessible
}