// API Service
class ApiService {
    constructor() {
        this.baseUrl = CONFIG.API_BASE_URL;
        this.featuredRestaurants = [
            {
                id: 1,
                name: "True Food Kitchen",
                neighborhood: "River North",
                cuisine: "American",
                rating: 4.8,
                reviewCount: 143,
                description: "Health-focused restaurant with seasonal ingredients and customizable menu items.",
                dietaryOptions: ["gluten-free", "vegan"],
                image: "images/restaurant-1.jpg",
                featured: true
            },
            {
                id: 2,
                name: "Chicago Diner",
                neighborhood: "Logan Square",
                cuisine: "American",
                rating: 4.6,
                reviewCount: 187,
                description: "Meat-free since 1983. Comfort food classics reimagined with plant-based ingredients.",
                dietaryOptions: ["vegan", "vegetarian"],
                image: "images/restaurant-2.jpg",
                popular: true
            },
            {
                id: 3,
                name: "Aba",
                neighborhood: "West Loop",
                cuisine: "Mediterranean",
                rating: 4.7,
                reviewCount: 215,
                description: "Mediterranean dishes with a focus on clean proteins and fresh vegetables.",
                dietaryOptions: ["gluten-free", "dairy-free"],
                image: "images/restaurant-3.jpg"
            },
            {
                id: 4,
                name: "Beatrix",
                neighborhood: "River North",
                cuisine: "American",
                rating: 4.5,
                reviewCount: 178,
                description: "Health-conscious restaurant offering comfort food with a focus on vegetable-forward dishes.",
                dietaryOptions: ["gluten-free", "vegetarian"],
                image: "images/restaurant-4.jpg"
            },
            {
                id: 5,
                name: "Little Beet Table",
                neighborhood: "Gold Coast",
                cuisine: "American",
                rating: 4.4,
                reviewCount: 132,
                description: "100% gluten-free restaurant focusing on seasonal vegetables and wholesome proteins.",
                dietaryOptions: ["gluten-free", "vegetarian", "dairy-free"],
                image: "images/restaurant-5.jpg"
            },
            {
                id: 6,
                name: "Handlebar",
                neighborhood: "Wicker Park",
                cuisine: "American",
                rating: 4.5,
                reviewCount: 156,
                description: "Vegetarian and vegan comfort food with a funky atmosphere and craft beer selection.",
                dietaryOptions: ["vegan", "vegetarian"],
                image: "images/restaurant-6.jpg"
            }
        ];
    }

    // Simulate API calls with local data for demo purposes
    // In production, these would make actual fetch/axios calls to your backend
    
    async getFeaturedRestaurants() {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));
        return this.featuredRestaurants;
    }

    async searchRestaurants(params) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        let results = [...this.featuredRestaurants];
        
        // Filter by location/neighborhood
        if (params.location) {
            results = results.filter(r => 
                r.neighborhood.toLowerCase() === params.location.toLowerCase());
        }
        
        // Filter by cuisine
        if (params.cuisine) {
            results = results.filter(r => 
                r.cuisine.toLowerCase() === params.cuisine.toLowerCase());
        }
        
        // Filter by dietary options
        if (params.dietaryOptions && params.dietaryOptions.length > 0) {
            results = results.filter(r => 
                params.dietaryOptions.every(option => 
                    r.dietaryOptions.includes(option)));
        }
        
        return results;
    }

    async getRestaurantById(id) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return this.featuredRestaurants.find(r => r.id === parseInt(id)) || null;
    }

    // In a real application, these methods would connect to your actual API
    async subscribeToNewsletter(email) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 700));
        return { success: true, message: "Subscription successful!" };
    }
}

// Create and export API service
const apiService = new ApiService();
