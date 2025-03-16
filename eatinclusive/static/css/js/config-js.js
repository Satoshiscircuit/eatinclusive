// Configuration
const CONFIG = {
    // Environment variables 
    // This is a secure way to store API keys - they will be loaded from environment variables on your hosting platform
    // For Netlify, set these in Site settings > Build & deploy > Environment variables
    API_BASE_URL: process.env.API_BASE_URL || 'https://api.example.com/v1',
    MAPBOX_API_KEY: process.env.MAPBOX_API_KEY || '',
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
    
    // Feature flags
    FEATURES: {
        enableReviews: true,
        enableFavorites: true,
        enableFiltering: true,
        enableReservations: false,
        enableMapView: true
    },
    
    // App settings
    APP: {
        defaultLocation: 'Chicago',
        resultsPerPage: 9,
        defaultDietaryOptions: ['gluten-free', 'vegan', 'vegetarian'],
        maxFilterOptions: 5
    }
};
