// Backend Java model expectations based on your database schema
export const getExpectedBlogModel = () => {
  return {
    // Required fields based on NOT NULL constraints
    required: ['title', 'slug', 'content', 'author'],
    
    // Optional fields
    optional: ['summary', 'imageUrl', 'tags', 'published', 'featured'],
    
    // Field constraints
    constraints: {
      title: { maxLength: 255, required: true },
      slug: { maxLength: 255, required: true, unique: true, pattern: /^[a-z0-9-]+$/ },
      content: { required: true }, // TEXT - no length limit
      summary: { maxLength: 500 },
      author: { maxLength: 100, required: true },
      imageUrl: { maxLength: 1000 },
      tags: { maxLength: 500 },
      published: { type: 'boolean', default: false },
      featured: { type: 'boolean', default: false }
    }
  };
};

// Validate blog data against expected model
export const validateAgainstBackendModel = (blogData) => {
  const model = getExpectedBlogModel();
  const errors = [];
  const warnings = [];

  // Check required fields
  model.required.forEach(field => {
    if (!blogData[field] || String(blogData[field]).trim() === '') {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Check field constraints
  Object.entries(model.constraints).forEach(([field, constraint]) => {
    const value = blogData[field];
    
    if (constraint.maxLength && value && String(value).length > constraint.maxLength) {
      errors.push(`${field} exceeds max length of ${constraint.maxLength} characters`);
    }
    
    if (constraint.pattern && value && !constraint.pattern.test(String(value))) {
      errors.push(`${field} does not match required pattern`);
    }
    
    if (constraint.type === 'boolean' && value !== undefined && typeof value !== 'boolean') {
      warnings.push(`${field} should be boolean, got ${typeof value}`);
    }
  });

  // Check for unexpected fields
  Object.keys(blogData).forEach(field => {
    if (!model.required.includes(field) && !model.optional.includes(field)) {
      warnings.push(`Unexpected field: ${field}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Generate test data that should definitely work with backend
export const generateValidTestData = () => {
  return {
    title: "Valid Test Blog",
    slug: "valid-test-blog",
    content: "This is valid test content for the blog post.",
    author: "TestUser"
    // Only include required fields - let backend set defaults
  };
};