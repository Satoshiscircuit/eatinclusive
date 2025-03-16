// Main JavaScript file for EatInclusive

document.addEventListener('DOMContentLoaded', function() {
    // Initialize API service
    if (typeof apiService !== 'undefined') {
        console.log('API Service initialized');
        
        // Handle restaurant search form
        const searchForm = document.getElementById('restaurant-search');
        if (searchForm) {
            searchForm.addEventListener('submit', handleSearch);
        }
        
        // Handle newsletter subscription
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', handleNewsletterSubmit);
        }
        
        // Load featured restaurants on homepage
        loadFeaturedRestaurants();
    }
    
    // Initialize tooltips and popovers
    initializeBootstrapComponents();
});

// Function to handle search form submission
async function handleSearch(event) {
    event.preventDefault();
    
    // Show loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    const searchResults = document.getElementById('search-results');
    
    if (loadingIndicator && searchResults) {
        loadingIndicator.classList.remove('d-none');
        searchResults.innerHTML = '';
    }
    
    // Get form values
    const location = document.getElementById('location')?.value || '';
    const cuisine = document.getElementById('cuisine')?.value || '';
    
    // Get dietary filters
    const dietaryFilters = [];
    document.querySelectorAll('.dietary-check input:checked').forEach(checkbox => {
        dietaryFilters.push(checkbox.value);
    });
    
    // Perform search
    try {
        const results = await apiService.searchRestaurants({
            location: location,
            cuisine: cuisine,
            dietaryOptions: dietaryFilters
        });
        
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.classList.add('d-none');
        }
        
        // Display results
        displaySearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
        if (loadingIndicator) {
            loadingIndicator.classList.add('d-none');
        }
        if (searchResults) {
            searchResults.innerHTML = '<div class="col-12"><div class="alert alert-danger">Error searching restaurants. Please try again later.</div></div>';
        }
    }
}

// Function to display search results
function displaySearchResults(restaurants) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    if (restaurants.length === 0) {
        searchResults.innerHTML = '<div class="col-12"><div class="alert alert-info">No restaurants found matching your criteria. Please try different filters.</div></div>';
        return;
    }
    
    let html = '';
    
    restaurants.forEach(restaurant => {
        html += createRestaurantCard(restaurant);
    });
    
    searchResults.innerHTML = html;
}

// Function to create a restaurant card HTML
function createRestaurantCard(restaurant) {
    const stars = '★'.repeat(Math.floor(restaurant.rating)) + '☆'.repeat(5 - Math.floor(restaurant.rating));
    
    const dietaryTagsHtml = restaurant.dietaryOptions.map(option => {
        let icon = 'check-circle';
        let color = 'success';
        
        if (option === 'vegan') {
            icon = 'leaf';
            color = 'success';
        } else if (option === 'vegetarian') {
            icon = 'seedling';
            color = 'success';
        } else if (option === 'dairy-free') {
            icon = 'ban';
            color = 'danger';
        } else if (option === 'pescatarian') {
            icon = 'fish';
            color = 'primary';
        }
        
        return `<span class="tag-item"><i class="fas fa-${icon} text-${color} me-1"></i>${option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>`;
    }).join('');
    
    let badgeHtml = '';
    if (restaurant.featured) {
        badgeHtml = '<div class="restaurant-card-badge">Featured</div>';
    } else if (restaurant.popular) {
        badgeHtml = '<div class="restaurant-card-badge">Popular</div>';
    }
    
    return `
    <div class="col-md-6 col-lg-4 mb-4">
        <div class="restaurant-card">
            <div class="restaurant-card-image">
                <img src="/api/placeholder/400/300" alt="${restaurant.name}">
                ${badgeHtml}
            </div>
            <div class="restaurant-card-content">
                <div class="restaurant-card-rating">
                    <span class="stars">${stars}</span>
                    <span class="count">(${restaurant.reviewCount})</span>
                </div>
                <h3 class="restaurant-card-title">${restaurant.name}</h3>
                <p class="restaurant-card-location"><i class="fas fa-map-marker-alt me-1"></i> ${restaurant.neighborhood} • ${restaurant.cuisine}</p>
                <p class="restaurant-card-description">${restaurant.description}</p>
                <div class="restaurant-card-tags">
                    ${dietaryTagsHtml}
                </div>
                <div class="restaurant-card-footer">
                    <a href="/restaurants/${restaurant.id}" class="btn btn-outline-primary"><i class="fas fa-info-circle me-1"></i>Details</a>
                    <a href="#" class="btn btn-primary"><i class="fas fa-external-link-alt me-1"></i>Reserve</a>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Function to load featured restaurants
async function loadFeaturedRestaurants() {
    const featuredSection = document.getElementById('search-results');
    if (!featuredSection || !window.location.pathname.includes('index') && window.location.pathname !== '/') {
        return;
    }
    
    try {
        const restaurants = await apiService.getFeaturedRestaurants();
        displaySearchResults(restaurants);
    } catch (error) {
        console.error('Error loading featured restaurants:', error);
    }
}

// Function to handle newsletter submissions
async function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput?.value;
    
    if (!email) {
        return;
    }
    
    try {
        const result = await apiService.subscribeToNewsletter(email);
        
        // Show success message
        const formGroup = emailInput.closest('.input-group');
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success mt-2';
        successMessage.textContent = 'Successfully subscribed to the newsletter!';
        
        formGroup.parentNode.appendChild(successMessage);
        
        // Reset form
        event.target.reset();
        
        // Remove message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        
        // Show error message
        const formGroup = emailInput.closest('.input-group');
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-danger mt-2';
        errorMessage.textContent = 'Error subscribing to the newsletter. Please try again later.';
        
        formGroup.parentNode.appendChild(errorMessage);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    }
}

// Initialize Bootstrap components
function initializeBootstrapComponents() {
    // Initialize tooltips if they exist
    if (typeof bootstrap !== 'undefined' && typeof bootstrap.Tooltip !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Initialize popovers if they exist
    if (typeof bootstrap !== 'undefined' && typeof bootstrap.Popover !== 'undefined') {
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function(popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
}
