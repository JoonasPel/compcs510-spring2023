import React, { useState, useEffect } from 'react';
import './OrderStatus.css';
import logo from '../Images/food.gif';
import delivery from '../Images/delivery.gif';

function OrderStatus(props) {
  const orderedSandwiches = props.orderedSandwiches;
  const [statusArray, setStatusArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getOrderStatus = async (orderedSandwiches) => {
    const fetchedStatusArray = [];

    for (const id of orderedSandwiches) {
      const response = await fetch(`http://tie-webarc-38.it.tuni.fi:3001/order/${id}`);
      const data = await response.json();
      fetchedStatusArray.push({ id, status: data.status });
    }

    return fetchedStatusArray;
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const fetchedStatusArray = await getOrderStatus(orderedSandwiches);
      setStatusArray(fetchedStatusArray);
      setIsLoading(false); // Update isLoading state variable
    }, 1000);

    return () => clearInterval(intervalId);
  }, [orderedSandwiches]);

  const allReady = statusArray.every((item) => item.status === 'ready');

  return (
    <div className="order-status-container">
      {isLoading && orderedSandwiches.length > 0 && (
        <label>Please wait orders will refresh automatically.</label>
      )}
      {!isLoading && allReady && orderedSandwiches.length > 0 && (
        <>
          <label>Your order is ready for delivery.</label>
          <img alt='' src={delivery} height={100} width={150} />
        </>
      )}
      {!isLoading && orderedSandwiches.length > 0 && !allReady && (
        <>
          <label>Food is being prepared.</label>
          <img alt='' src={logo} height={100} width={100} />
        </>
      )}
      {orderedSandwiches.length === 0 && (
        <label>You have no active orders.</label>
      )}
      <ul className={`order-status-list ${isLoading ? 'hidden' : ''}`}>
        {statusArray.sort((a, b) => b.id - a.id).map((item) => (
          <div key={item.id}>
            Order ID: {item.id}, Order Status: {item.status}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default OrderStatus;