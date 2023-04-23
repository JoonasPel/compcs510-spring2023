import React, { useState } from 'react';
import SandwichForm from './AddingBread';
import './User.css';

function User(props) {
  const logOrCreate = props.logOrCreate;
  const setLogOrCreate = props.setLogOrCreate;
  const isAdmin = props.isAdmin;
  const setIsAdmin = props.setIsAdmin;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const createUser = async () => {
    if (!username || !password || !email) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const response = await fetch('http://localhost:3001/user', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email
      })
    });

    if (response.ok){
      console.log("account created");
    }
  }

  const deleteUser = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this account?');
    if (confirmed) {
      const response = await fetch(`http://localhost:3001/user/${username}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: password,
        })
      });

      if (response.ok) {
        console.log("account deleted");
        handleLogout();
      }
    }
  }

  const loginUser = async () => {
    if (!username || !password) {
      setErrorMessage('Please enter a username and password');
      return;
    }
    const response = await fetch('http://localhost:3001/user/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    if (response.ok){
      setLogOrCreate('LoggedIn')
      const data = await response.json();
      if (data.role === "admin"){
        setIsAdmin(true);
      }
      else {
        setIsAdmin(false);
      }
    }
  }

  const handleLogout = () => {
    setLogOrCreate('');
    setErrorMessage('');
    setIsAdmin(false);
  }

  return (
    <div>
      {errorMessage && (
      <div style={{ color: 'red' }}>{errorMessage}</div>)}
      {logOrCreate === '' && (
        <div>
          <button className='button' onClick={() => setLogOrCreate('Login')}>Login</button>
          <button className='button' onClick={() => setLogOrCreate('Create')}>Create Account</button>
        </div>
      )}

      {logOrCreate === 'Login' && (
        <form>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className='button' type="button" onClick={loginUser}>Login</button>
          <button className='button' onClick={() => {setLogOrCreate(''); setErrorMessage('');}}>Back</button>
        </form>
      )}

      {logOrCreate === 'Create' && (
        <form>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <button className='button' type="button" onClick={() => {createUser();
          setLogOrCreate('')}}>Create Account</button>
          <button className='button' onClick={() => {setLogOrCreate(''); setErrorMessage('');}}>Back</button>
        </form>
      )}

      {logOrCreate === 'LoggedIn' && (
        <div>
        <button className='button' onClick={handleLogout}>Logout</button>
        {!isAdmin && (
          <button className='button' onClick={deleteUser}>Delete account</button>
        )}
        {isAdmin && (
          <SandwichForm setErrorMessage={setErrorMessage}></SandwichForm>
        )}
      </div>
    )}
    </div>
  )
}

export default User;