const crypto = require('crypto');

class Helpers {
  // Generate unique ID
  generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(4).toString('hex');
    return `${prefix}${timestamp}${random}`.toUpperCase();
  }

  // Format date
  formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  }

  // Format time
  formatTime(date) {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Calculate percentage
  calculatePercentage(part, total, decimals = 2) {
    if (total === 0) return 0;
    return parseFloat(((part / total) * 100).toFixed(decimals));
  }

  // Paginate array
  paginate(array, page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    return {
      data: array.slice(startIndex, endIndex),
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit)
    };
  }

  // Validate email
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Validate phone number
  isValidPhone(phone) {
    const regex = /^[+]?[\d\s-()]+$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  // Sanitize string
  sanitize(str) {
    return str.replace(/[<>]/g, '');
  }

  // Generate random string
  randomString(length = 8) {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
  }

  // Sleep/delay
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Convert to title case
  toTitleCase(str) {
    return str.replace(/\w\S*/g, txt => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  // Remove duplicates from array
  unique(array) {
    return [...new Set(array)];
  }

  // Group array by key
  groupBy(array, key) {
    return array.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {});
  }

  // Check if object is empty
  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  // Deep clone object
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // Get current timestamp
  timestamp() {
    return Math.floor(Date.now() / 1000);
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Generate OTP
  generateOTP(length = 6) {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  // Mask sensitive data
  maskString(str, visibleChars = 4) {
    if (!str || str.length <= visibleChars) return str;
    const visible = str.slice(-visibleChars);
    const masked = '*'.repeat(str.length - visibleChars);
    return masked + visible;
  }
}

module.exports = new Helpers();