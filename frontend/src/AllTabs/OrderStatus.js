import React, { useState } from 'react';

function OrderStatus() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('');

  const handleOrderIdChange = (event) => {
    setOrderId(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/order/${orderId}`);
      const data = await response.json();
      console.log(data);
      setStatus(data.status);
    } catch (error) {
      console.error('Error fetching order status:', error);
    }
  };

  return (
    <div>
      <div>Order Status: {status}</div>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="orderId">Order ID:</label>
        <input
          type="text"
          id="orderId"
          value={orderId}
          onChange={handleOrderIdChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default OrderStatus;