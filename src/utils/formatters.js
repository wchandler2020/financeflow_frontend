// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date for input fields
export const formatDateForInput = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Get transaction color based on type
export const getTransactionColor = (type) => {
  return type === 'CREDIT' ? 'text-green-600' : 'text-red-600';
};

// Get account type display name
export const getAccountTypeName = (type) => {
  const types = {
    CHECKING: 'Checking',
    SAVINGS: 'Savings',
    CREDIT_CARD: 'Credit Card',
    INVESTMENT: 'Investment',
  };
  return types[type] || type;
};