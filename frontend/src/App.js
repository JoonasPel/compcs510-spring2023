import React, { useState } from 'react';
import './App.css';
import MakeOrder from './AllTabs/MakeOrder'
import OrderStatus from './AllTabs/OrderStatus';
import User from './AllTabs/User';



function App() {
  // useStates for changing pages
  const [currentPage, setCurrentPage] = useState('API');
  // useState for orders made by the user
  const [orderedSandwiches, setOrderedSandwiches] = useState('');

  const [logOrCreate, setLogOrCreate] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Navigating between pages
  const handleNavClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className='background'>
      <nav className='flex'>
        <button className="pill-button">
          <span className="button-text" onClick={() => handleNavClick('API')}>Make Order</span>
          <hr className="button-divider" />
          <span className="button-text" onClick={() => handleNavClick('OrderStatus')}>Order Status</span>
          <hr className="button-divider" />
          <span className="button-text" onClick={() => handleNavClick('User')}>User</span>
        </button>
      </nav>
      <div>
        {currentPage === 'API' && <MakeOrder  orderedSandwiches={orderedSandwiches} setOrderedSandwiches={setOrderedSandwiches} isAdmin={isAdmin}/>}
        {currentPage === 'OrderStatus' && <OrderStatus orderedSandwiches={orderedSandwiches}/>}
        {currentPage === 'User' && <User logOrCreate={logOrCreate} setLogOrCreate={setLogOrCreate} isAdmin={isAdmin} setIsAdmin={setIsAdmin}/>}
      </div>
    </div>
  );
}

export default App;
