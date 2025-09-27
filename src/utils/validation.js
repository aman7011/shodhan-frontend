// Form validation utilities
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return "Name is required";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }
  if (name.trim().length > 50) {
    return "Name must be less than 50 characters";
  }
  // Check for only letters and spaces
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return "Name can only contain letters and spaces";
  }
  return "";
};

export const validatePhone = (phone) => {
  if (!phone || phone.trim().length === 0) {
    return "Phone number is required";
  }
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid Indian phone number (10 digits)
  if (cleaned.length !== 10) {
    return "Please enter a valid 10-digit phone number";
  }
  
  // Check if it starts with valid digits (6-9)
  if (!/^[6-9]/.test(cleaned)) {
    return "Phone number must start with 6, 7, 8, or 9";
  }
  
  return "";
};

export const validateDescription = (description, isRequired = false) => {
  if (isRequired && (!description || description.trim().length === 0)) {
    return "Description is required";
  }
  
  if (description && description.trim().length > 500) {
    return "Description must be less than 500 characters";
  }
  
  return "";
};

export const validateDate = (date) => {
  if (!date) {
    return "Date is required";
  }
  
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to compare only dates
  
  if (selectedDate < today) {
    return "Please select a future date";
  }
  
  // Check if date is more than 3 months in the future
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  
  if (selectedDate > maxDate) {
    return "Please select a date within the next 3 months";
  }
  
  return "";
};

export const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as XXX-XXX-XXXX for display
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  
  return cleaned;
};

export const sanitizeInput = (input) => {
  if (!input) return '';
  
  // Remove potentially harmful characters and trim
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
    .trim();
};