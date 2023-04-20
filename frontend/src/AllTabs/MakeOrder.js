import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

function MakeOrder(props) {
  const orderedSandwiches = props.orderedSandwiches;
  const setOrderedSandwiches = props.setOrderedSandwiches;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sandwiches, setSandwiches] = useState([]);

  const sendOrder = async (str) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const response = await fetch('http://localhost:3001/order', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(str),
        headers: { 'Content-Type': 'application/json' }
      });
      setLoading(false);
      if (response.ok) {
        setSuccess(true);
        const data = await response.json();
        setOrderedSandwiches([...orderedSandwiches, data.id]);
      } else {
        setError('Failed to send order.');
        console.error('Error:', response);
      }
    } catch (error) {
      setLoading(false);
      setError('Failed to send order.');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const fetchSandwiches = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch('http://localhost:3001/sandwich');
          setLoading(false);
          if (response.ok) {
            const data = await response.json();
            console.log('data:', data); // add this line
            const formattedData = data.map((sandwich) => {
              console.log('sandwichIDasdfasdfasfdas:', sandwich); // add this line
              const toppingsArray = sandwich.toppings.map((topping) => {
                console.log('topping:', topping); // add this line
                console.log(topping.name);
                return topping.name;
              });
              return {
                sandwich_id: sandwich.sandwich_id,
                sandwich_name: sandwich.sandwich_name,
                bread_type: sandwich.bread_type,
                toppings: toppingsArray
              };
            });
            console.log('formattedData:', formattedData); // add this line
            setSandwiches(formattedData);
          } else {
            setError('Failed to fetch sandwiches.');
            console.error('Error:', response);
          }
        } catch (error) {
          setLoading(false);
          setError('Failed to fetch sandwiches.');
          console.error('Error:', error);
        }
      };
    fetchSandwiches();
  }, []);

    return (
        <div>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {sandwiches.map((sandwich) => (
                    <React.Fragment key={sandwich.sandwich_id}>
                        <ListItem
                            alignItems="flex-start"
                            secondaryAction={<button onClick={() => sendOrder({ sandwichId: sandwich.sandwich_id, status: 'ordered' })}>
                                Order
                            </button>}
                        >
                            <ListItemText primary={sandwich.sandwich_name}secondary={"Bread Type: " + sandwich.bread_type} />
                            <ListItemText primary="Toppings:" secondary= {sandwich.toppings.join(', ')}/>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
        </div>
    );
}

export default MakeOrder;