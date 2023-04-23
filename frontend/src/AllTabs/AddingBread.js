import { useState } from 'react';

function SandwichForm(props) {
  const setErrorMessage = props.setErrorMessage;
  const [name, setName] = useState('');
  const [toppings, setToppings] = useState([]);
  const [breadType, setBreadType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !breadType || !toppings.length) {
        setErrorMessage('Please fill in all fields');
        return;
    }

    const newSandwich = { name, toppings, breadType };
    const response = await fetch('http://localhost:3001/user/sandwich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSandwich)
    });
    const data = await response.json();
    console.log(data);
  };

  const handleToppingsChange = (e) => {
    const toppingsArr = e.target.value.split(',');
    setToppings(toppingsArr.map((topping, index) => ({ id: index, name: topping.trim() })));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Sandwich Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
      <label>
        Toppings (separated by commas):
        <input type="text" onChange={handleToppingsChange} />
      </label>
      <br />
      <label>
        Bread Type:
        <input type="text" value={breadType} onChange={(e) => setBreadType(e.target.value)} />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default SandwichForm;