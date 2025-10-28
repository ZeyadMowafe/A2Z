import { useCallback } from 'react';

// ✅ API URL Configuration
const API_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === "localhost" 
    ? "http://127.0.0.1:8000/api"
    : "https://a2z-production.up.railway.app/api");

console.log('🔗 API URL:', API_URL);
console.log('🌍 Frontend URL:', window.location.origin);

const apiCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const useApi = () => {
  const fetchData = useCallback(async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    
    // ✅ Default fetch options
    const fetchOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    console.log(`🌐 ${options.method || 'GET'} ${url}`);

    // POST/PUT/DELETE - No cache
    if (options.method && options.method !== 'GET') {
      try {
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ [${response.status}]`, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // Clear related cache
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
        if (endpoint.includes('/categories')) {
          delete apiCache['/categories'];
        }

        return await response.json();
      } catch (error) {
        console.error(`❌ Error:`, error.message);
        throw error;
      }
    }

    // GET requests - Use cache
    const now = Date.now();
    const cached = apiCache[endpoint];

    if (cached && (now - cached.timestamp < CACHE_DURATION)) {
      console.log(`✅ [Cache] ${endpoint}`);
      return cached.data;
    }

    console.log(`🔄 [Fetch] ${endpoint}`);
    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [${response.status}]`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      apiCache[endpoint] = {
        data,
        timestamp: now,
      };

      console.log(`✅ [Success] ${endpoint}`);
      return data;
    } catch (error) {
      console.error(`❌ Error:`, error.message);
      throw error;
    }
  }, []);

  return { fetchData };
};

export default useApi;
