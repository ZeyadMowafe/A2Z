import { useCallback } from 'react';

const API_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000/api"
    : "https://a2z-production.up.railway.app/api";

const apiCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

const useApi = () => {
  const fetchData = useCallback(async (endpoint, options = {}) => {
    // ✅ لو الميثود POST أو PUT أو DELETE (مش GET)
    if (options.method && options.method !== 'GET') {
      try {
        const response = await fetch(`${API_URL}${endpoint}`, options);

        // ⚠️ هنا الإضافة الجديدة لعرض الخطأ الحقيقي
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // 🧹 حذف الكاش لما يحصل تعديل في البيانات
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
        console.error(`❌ Error fetching ${endpoint}:`, error);
        throw error;
      }
    }

    // ✅ GET requests مع الكاش
    const now = Date.now();
    const cached = apiCache[endpoint];

    if (cached && (now - cached.timestamp < CACHE_DURATION)) {
      console.log(`✅ [Cache Hit] ${endpoint}`);
      return cached.data;
    }

    console.log(`🔄 [Fetching] ${endpoint}`);
    try {
      const response = await fetch(`${API_URL}${endpoint}`, options);

      // ⚠️ نفس الإضافة هنا برضو لطلبات GET
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      apiCache[endpoint] = {
        data,
        timestamp: now,
      };

      return data;
    } catch (error) {
      console.error(`❌ Error fetching ${endpoint}:`, error);
      throw error;
    }
  }, []);

  return { fetchData };
};

export default useApi;
