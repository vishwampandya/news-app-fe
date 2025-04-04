const API_BASE_URL = 'https://e143-49-205-38-42.ngrok-free.app/api';
const API_KEY = process.env.REACT_APP_API_KEY;
// const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const fetchArticle = async (articleId) => {
  try {
    const url = `${API_BASE_URL}/news/${articleId}`;
    console.log('Attempting to fetch from:', url); // Debug log
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': API_KEY,
        'Accept': 'application/json',
        'Origin': 'http://192.168.50.117:3000'
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      console.error('Response status:', response.status); // Debug log
      throw new Error(`Failed to fetch article: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data); // Debug log
    return data;
    
  } catch (error) {
    console.error('Detailed fetch error:', error); // Debug log
    throw error;
  }
};

export const fetchIndustries = async () => {
  try {
    const url = `${API_BASE_URL}/industries`;
    console.log('Attempting to fetch industries from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': API_KEY,
        'Accept': 'application/json',
        'Origin': 'http://192.168.50.117:3000'
      },
      mode: 'cors'
    });

    if (!response.ok) {
      console.error('Response status:', response.status);
      throw new Error(`Failed to fetch industries: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received industries data:', data);
    
    // Transform the data structure into the format we need
    if (data.industries) {
      const transformedIndustries = Object.keys(data.industries).map((name, index) => ({
        id: index + 1,
        name: name,
        subIndustries: data.industries[name]
      }));
      return transformedIndustries;
    }
    
    return [];

  } catch (error) {
    console.error('Error fetching industries:', error);
    throw error;
  }
};

export const fetchArticles = async (params) => {
  try {
    console.log('Fetching articles with params:', params);

    const queryParams = new URLSearchParams({
      q: params.q || '',
      industry: params.industry || '',  // This will be comma-separated industries
      keyword: params.keyword || '',    // This will be comma-separated keywords
      india_focus: params.india_focus || 'true',
      business_only: params.business_only || 'true',
      page: '1',
      limit: '100',
      sort_by: 'published_date',
      sort_order: 'desc'
    });

    const url = `${API_BASE_URL}/news/search?${queryParams.toString()}`;
    console.log('Making request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': API_KEY,
        'Accept': 'application/json',
        'Origin': 'http://192.168.50.117:3000'
      },
      mode: 'cors'
    });

    if (!response.ok) {
      console.error('Response status:', response.status);
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received articles data:', data); // Debug log
    return data;
    
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const subscribeNewsletter = async (params) => {
  try {
    console.log('Subscribing to newsletter with params:', params);

    const url = `${API_BASE_URL}/users/subscriptions`;
    console.log('Making request to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Origin': 'http://192.168.50.117:3000'
      },
      body: JSON.stringify({
        mobile_number: params.mobile_number || '',
        is_subscribed: true
      }),
      mode: 'cors'
    });

    if (!response.ok) {
      console.error('Response status:', response.status);
      throw new Error(`Failed to subscribe: ${response.status}`);
    }

    const data = await response.json();
    console.log('Subscription response:', data);
    return data;
    
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
}; 