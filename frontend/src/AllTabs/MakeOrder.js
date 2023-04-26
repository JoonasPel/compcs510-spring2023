import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import './MakeOrder.css';

function MakeOrder(props) {
  const isAdmin = props.isAdmin;
  const orderedSandwiches = props.orderedSandwiches;
  const setOrderedSandwiches = props.setOrderedSandwiches;
  const [sandwiches, setSandwiches] = useState([]);

  
  const fetchSandwiches = async () => {
    try {
      const response = await fetch('http://localhost:3001/sandwich');
      if (response.ok) {
        const data = await response.json();

        const formattedData = data.map((sandwich) => {
          const toppingsArray = sandwich.toppings.map((topping) => {
            return topping.name;
          });
          return {
            sandwich_id: sandwich.sandwich_id,
            sandwich_name: sandwich.sandwich_name,
            bread_type: sandwich.bread_type,
            toppings: toppingsArray
          };
        });
        setSandwiches(formattedData);
      } else {
        console.error('Error:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  // Get all possible sandwiches from server
  useEffect(() => {
    fetchSandwiches();
  }, []);

  const deleteSandwich = async (str) => {
    const apiKey = window.prompt('Enter API key:');
    if (!apiKey) {
      // User clicked "Cancel" or entered an empty string
      return;
    }
    const data = { apiKey };
    console.log(apiKey);
    try {
      const response = await fetch(`http://localhost:3001/sandwich/${str}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        console.log('sandwich deleted');
        fetchSandwiches();
      } else {
        console.error('Error:', response);
      }
    } catch (error) {

      console.error('Error:', error);
    }
  };

  // Sending sandwich order to server
  const sendOrder = async (str) => {
    try {
      const response = await fetch('http://localhost:3001/order', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(str),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setOrderedSandwiches([...orderedSandwiches, data.id]);
      } else {
        console.error('Error:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='background'>
      <List sx={{ width: '100%', bgcolor: '#474c57' }}>
        {sandwiches.map((sandwich) => (
          <React.Fragment key={sandwich.sandwich_id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                isAdmin ? (
                  <>
                    <button
                      className="order-button"
                      onClick={() =>
                        sendOrder({
                          sandwichId: sandwich.sandwich_id,
                          status: "ordered",
                        })
                      }
                    >
                      Order
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteSandwich(sandwich.sandwich_id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    className="order-button"
                    onClick={() =>
                      sendOrder({
                        sandwichId: sandwich.sandwich_id,
                        status: "ordered",
                      })
                    }
                  >
                    Order
                  </button>
                )
              }
            >
              <ListItemText primary={sandwich.sandwich_name} secondary={"Bread Type: " + sandwich.bread_type} />
              <ListItemText primary="Toppings:" secondary={sandwich.toppings.join(', ')} />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default MakeOrder;