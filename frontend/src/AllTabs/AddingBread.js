import { useState } from 'react';
import './AddingBread.css';

function SandwichForm(props) {
  const setErrorMessage = props.setErrorMessage;
  const [name, setName] = useState('');
  const [toppings, setToppings] = useState([]);
  const [breadType, setBreadType] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !breadType || !toppings.length || !apiKey) {
        setErrorMessage('Please fill in all fields');
        return;
    }

    const newSandwich = { name, toppings, breadType, apiKey };
    const response = await fetch('http://tie-webarc-38.it.tuni.fi:3001/sandwich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSandwich)
    });
    if (response.ok){
      setName('');
      setToppings([]);
      setBreadType('');
      setApiKey('');
      document.getElementById('toppings-input').value = '';
    }
  };

  const handleToppingsChange = (e) => {
    const toppingsArr = e.target.value.split(',');
    setToppings(toppingsArr.map((topping, index) => ({ id: index, name: topping.trim() })));
  };

  return (
    <div className='AddingBread'>
    <form className='form' onSubmit={handleSubmit}>
      <label>
        Sandwich Name: 
        <input className='input' type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
      <label>
        Toppings (separated by commas): 
        <input id='toppings-input' className='input' type="text" onChange={handleToppingsChange} />
      </label>
      <br />
      <label>
        Bread Type: 
        <input className='input' type="text" value={breadType} onChange={(e) => setBreadType(e.target.value)} />
      </label>
      <br />
      <label>
        Enter API-KEY: 
        <input className='input' type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      </label>
      <br />
      <button className='button' type="submit">Submit</button>
    </form>
    </div>
  );
}

export default SandwichForm;