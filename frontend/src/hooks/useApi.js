import { useCallback } from 'react';

const API_URL = '/api';
const apiCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

const useApi = () => {
  const fetchData = useCallback(async (endpoint, options = {}) => {
    if (options.method && options.method !== 'GET') {
      try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) throw new Error('Network response was not ok');
        
        if (endpoint.includes('/brands')) {
          delete apiCache['/brands'];
        }
        if (endpoint.includes('/products')) {
          Object.keys(apiCache).forEach(key => {
            if (key.includes('/products')) delete apiCache[key];
          });
        }
        if (endpoint.includes('/models')) {
          Object.keys(apiCache).forEach(key => {
            if (key.includes('/models')) delete apiCache[key];
          });
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
      }
    }
    
    const now = Date.now();
    const cached = apiCache[endpoint];
    
    if (cached && (now - cached.timestamp < CACHE_DURATION)) {
      console.log(`✅ [Cache Hit] ${endpoint}`);
      return cached.data;
    }
    
    console.log(`🔄 [Fetching] ${endpoint}`);
    try {
      const response = await fetch(`${API_URL}${endpoint}`, options);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      apiCache[endpoint] = {
        data,
        timestamp: now
      };
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }, []);

  return { fetchData };
};

export default useApi;
