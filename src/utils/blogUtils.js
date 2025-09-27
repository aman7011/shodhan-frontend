// Utility functions for API data handling
export const sanitizeBlogs = (blogData) => {
  // Convert tags to comma-separated string for Java backend
  let tagsString = '';
  if (Array.isArray(blogData.tags)) {
    tagsString = blogData.tags.filter(tag => tag && String(tag).trim()).join(', ');
  } else if (blogData.tags) {
    tagsString = String(blogData.tags).trim();
  }

  // Handle imageUrl - omit field if empty/null, otherwise include as string
  const imageUrl = blogData.imageUrl && String(blogData.imageUrl).trim() ? String(blogData.imageUrl).trim().substring(0, 1000) : null;

  const sanitizedData = {
    title: String(blogData.title || '').trim().substring(0, 255), // VARCHAR(255)
    slug: String(blogData.slug || '').trim().substring(0, 255), // VARCHAR(255)
    content: String(blogData.content || '').trim(), // TEXT - no limit
    summary: String(blogData.summary || '').trim().substring(0, 500), // VARCHAR(500)
    author: String(blogData.author || '').trim().substring(0, 100), // VARCHAR(100)
    tags: tagsString.substring(0, 500), // VARCHAR(500) - Send as string, not array
    published: Boolean(blogData.published), // BOOLEAN
    featured: Boolean(blogData.featured) // BOOLEAN
  };

  // Only include imageUrl if it has a value
  if (imageUrl) {
    sanitizedData.imageUrl = imageUrl;
  }

  return sanitizedData;
};

// Convert backend blog data for frontend display
export const prepareBlogForEdit = (blog) => {
  // Handle tags whether they come as string or array from backend
  let tagsForEdit = '';
  if (Array.isArray(blog.tags)) {
    tagsForEdit = blog.tags.join(', ');
  } else if (blog.tags) {
    tagsForEdit = String(blog.tags);
  }

  return {
    title: blog.title || '',
    slug: blog.slug || '',
    content: blog.content || '',
    summary: blog.summary || '',
    author: blog.author || '',
    imageUrl: blog.imageUrl || '',
    tags: tagsForEdit,
    published: Boolean(blog.published),
    featured: Boolean(blog.featured)
  };
};

// Debug function to log data types
export const debugDataTypes = (data, label = 'Data') => {
  console.log(`${label} structure:`);
  Object.entries(data).forEach(([key, value]) => {
    console.log(`  ${key}: ${typeof value} = ${JSON.stringify(value)}`);
  });
};

// Validation function to check field lengths against database limits
export const validateBlogLengths = (blogData) => {
  const errors = {};
  
  if (blogData.title && blogData.title.length > 255) {
    errors.title = `Title is too long (${blogData.title.length}/255 characters)`;
  }
  
  if (blogData.slug && blogData.slug.length > 255) {
    errors.slug = `Slug is too long (${blogData.slug.length}/255 characters)`;
  }
  
  if (blogData.summary && blogData.summary.length > 500) {
    errors.summary = `Summary is too long (${blogData.summary.length}/500 characters)`;
  }
  
  if (blogData.author && blogData.author.length > 100) {
    errors.author = `Author name is too long (${blogData.author.length}/100 characters)`;
  }
  
  if (blogData.imageUrl && blogData.imageUrl.length > 1000) {
    errors.imageUrl = `Image URL is too long (${blogData.imageUrl.length}/1000 characters)`;
  }
  
  if (blogData.tags && blogData.tags.length > 500) {
    errors.tags = `Tags are too long (${blogData.tags.length}/500 characters)`;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Get character count status for UI feedback
export const getCharacterStatus = (text, limit) => {
  const length = String(text || '').length;
  const percentage = (length / limit) * 100;
  
  return {
    length,
    limit,
    remaining: limit - length,
    percentage,
    isOverLimit: length > limit,
    status: percentage > 90 ? 'danger' : percentage > 75 ? 'warning' : 'success'
  };
};