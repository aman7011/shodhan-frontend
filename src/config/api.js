// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_ENDPOINTS = {
  // Disease endpoints
  DISEASES: `${API_BASE_URL}/api/diseases`,
  DISEASES_BY_CATEGORY: (categoryName) => `${API_BASE_URL}/api/diseases/category/${categoryName}`,
  DISEASE_BY_ID: (id) => `${API_BASE_URL}/api/diseases/${id}`,
  
  // Category endpoints
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  CATEGORY_BY_ID: (categoryId) => `${API_BASE_URL}/api/categories/${categoryId}?includeDiseases=true`,
  
  // Service endpoints
  SERVICES: `${API_BASE_URL}/api/services`,
  SERVICE_BY_ID: (id) => `${API_BASE_URL}/api/services/${id}`,
  
  // Clinic endpoints
  CLINICS: `${API_BASE_URL}/api/clinics`,
  
  // Appointment endpoints
  APPOINTMENTS: `${API_BASE_URL}/api/appointments`,
  
  // Blog endpoints
  BLOGS_PUBLIC: `${API_BASE_URL}/api/blogs/public`,
  BLOGS_FEATURED: `${API_BASE_URL}/api/blogs/public/featured`,
  BLOG_BY_SLUG: (slug) => `${API_BASE_URL}/api/blogs/public/slug/${slug}`,
  BLOGS_SEARCH: (keyword) => `${API_BASE_URL}/api/blogs/public/search?keyword=${encodeURIComponent(keyword)}`,
  BLOGS_BY_AUTHOR: (author) => `${API_BASE_URL}/api/blogs/public/author/${encodeURIComponent(author)}`,
  
  // Admin Blog endpoints
  BLOGS_ADMIN: `${API_BASE_URL}/api/blogs/admin`,
  BLOG_ADMIN_BY_ID: (id) => `${API_BASE_URL}/api/blogs/admin/${id}`,
  BLOG_ADMIN_BY_SLUG: (slug) => `${API_BASE_URL}/api/blogs/admin/slug/${slug}`,
  BLOGS_ADMIN_SEARCH: (keyword) => `${API_BASE_URL}/api/blogs/admin/search?keyword=${encodeURIComponent(keyword)}`,
  BLOG_GENERATE_SLUG: (title) => `${API_BASE_URL}/api/blogs/admin/generate-slug?title=${encodeURIComponent(title)}`,
  BLOG_CHECK_SLUG: (slug) => `${API_BASE_URL}/api/blogs/admin/check-slug?slug=${encodeURIComponent(slug)}`,
  
  // Admin Authentication endpoints  
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/auth/login`,
  ADMIN_VERIFY: `${API_BASE_URL}/api/admin/auth/verify`,
  ADMIN_CHANGE_PASSWORD: `${API_BASE_URL}/api/admin/change-password`,
  
  // Admin Authentication endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/auth/login`,
  ADMIN_VERIFY: `${API_BASE_URL}/api/admin/auth/verify`,
};

export default API_BASE_URL;