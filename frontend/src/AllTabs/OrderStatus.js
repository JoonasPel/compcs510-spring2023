import React, { useState, useEffect } from 'react';
import './OrderStatus.css';

function OrderStatus(props) {
  const orderedSandwiches = props.orderedSandwiches;
  const [statusArray, setStatusArray] = useState([]);

  const getOrderStatus = async (orderedSandwiches) => {
    const fetchedStatusArray = [];

    for (const id of orderedSandwiches) {
      const response = await fetch(`http://localhost:3001/order/${id}/`);
      const data = await response.json();
      fetchedStatusArray.push({ id, status: data.status });
    }

    return fetchedStatusArray;
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const fetchedStatusArray = await getOrderStatus(orderedSandwiches);
      setStatusArray(fetchedStatusArray);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [orderedSandwiches]);

  return (
    <div className="order-status-container">
      <label> Page refreshes automatically, please wait. </label>
      <ul className="order-status-list">
        {statusArray.sort((a, b) => b.id - a.id).map((item) => (
          <div key={item.id}>Order ID: {item.id}, Order Status: {item.status}</div>
        ))}
      </ul>
    </div>
  );
}

export default OrderStatus;