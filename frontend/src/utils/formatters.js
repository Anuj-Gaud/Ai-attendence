export const formatters = {
  date: (date, format = 'DD/MM/YYYY') => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year);
  },

  time: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  },

  datetime: (date) => {
    if (!date) return '';
    return `${formatters.date(date)} ${formatters.time(date)}`;
  },

  timeAgo: (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'Just now';
  },

  percentage: (value, total, decimals = 1) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(decimals)}%`;
  },

  currency: (amount, symbol = '$') => {
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  },

  number: (num) => {
    return new Intl.NumberFormat().format(num);
  },

  fileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  titleCase: (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, txt => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  truncate: (str, length = 50) => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + '...';
  },

  phone: (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },

  statusBadge: (status) => {
    const colors = {
      present: 'green',
      absent: 'red',
      late: 'yellow',
      pending_review: 'orange',
      active: 'green',
      completed: 'gray',
      scheduled: 'blue'
    };
    
    return colors[status] || 'gray';
  }
};

export default formatters;