import React, { useState, useEffect } from 'react';

function OrderStatus(props) {
  const orderedSandwiches = props.orderedSandwiches;
  const [statusArray, setStatusArray] = useState([]);


  // Get statuses for orders made from your tab (Does not get all results just the ones made from your current tab
  // This means that multiple users should be able to make orders and not get them mixed up)
  const getOrderStatus = async (orderedSandwiches) => {
    const fetchedStatusArray = [];

    for (const id of orderedSandwiches) {
      const response = await fetch(`http://localhost:3001/order/${id}/`);
      const data = await response.json();
      fetchedStatusArray.push({ id, status: data.status });
    }

    return fetchedStatusArray;
  }

  const handleRefreshClick = async () => {
    const fetchedStatusArray = await getOrderStatus(orderedSandwiches);
    setStatusArray(fetchedStatusArray);
  }

  useEffect(() => {
    const fetchStatuses = async () => {
      const fetchedStatusArray = await getOrderStatus(orderedSandwiches);
      setStatusArray(fetchedStatusArray);
    }
    fetchStatuses();
  }, [orderedSandwiches]);

  return (
    <div>
      <button onClick={handleRefreshClick}>Refresh</button>
      <ul>
        {statusArray.map((item) => (
          <div key={item.id}>Order ID: {item.id}, Order Status: {item.status}</div>
        ))}
      </ul>
    </div>
  );
}

export default OrderStatus;