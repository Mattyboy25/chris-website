const generateOrderNumber = () => {
  const prefix = 'ORD';
  const timestamp = Date.now().toString(36).slice(-6).toUpperCase();
  const random = Math.random().toString(36).slice(-4).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
};

export default generateOrderNumber;
