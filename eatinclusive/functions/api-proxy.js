const axios = require('axios');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { service, endpoint, params } = JSON.parse(event.body);
    
    // Validate request
    if (!service || !endpoint) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing required parameters' }) 
      };
    }

    let apiResponse;
    
    // Use the appropriate API based on the service requested
    switch (service) {
      case 'yelp':
        apiResponse = await axios({
          method: 'get',
          url: `https://api.yelp.com/v3/${endpoint}`,
          headers: {
            'Authorization': `Bearer ${process.env.YELP_API_KEY}`
          },
          params: params
        });
        break;
        
      case 'google_maps':
        apiResponse = await axios({
          method: 'get',
          url: `https://maps.googleapis.com/maps/api/${endpoint}`,
          params: {
            ...params,
            key: process.env.GOOGLE_MAPS_API_KEY
          }
        });
        break;
        
      case 'opentable':
        apiResponse = await axios({
          method: 'get',
          url: `https://platform.opentable.com/v2/${endpoint}`,
          headers: {
            'Authorization': `Bearer ${process.env.OPENTABLE_API_KEY}`
          },
          params: params
        });
        break;
        
      case 'meetup':
        // To be implemented later
        return { 
          statusCode: 501, 
          body: JSON.stringify({ error: 'Meetup API not yet implemented' }) 
        };
        
      default:
        return { 
          statusCode: 400, 
          body: JSON.stringify({ error: 'Invalid service specified' }) 
        };
    }
    
    // Return the API response
    return {
      statusCode: 200,
      body: JSON.stringify(apiResponse.data)
    };
    
  } catch (error) {
    console.log('Error:', error);
    
    // Return a more useful error message
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message,
        service: JSON.parse(event.body).service
      })
    };
  }
};
