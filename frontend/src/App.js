import React, { useState } from 'react';
import './App.css';
import MakeOrder from './AllTabs/MakeOrder'
import OrderStatus from './AllTabs/OrderStatus';
import User from './AllTabs/User';



function App() {
  const [currentPage, setCurrentPage] = useState('API');

  const handleNavClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
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
        {currentPage === 'API' && <MakeOrder />}
        {currentPage === 'OrderStatus' && <OrderStatus />}
        {currentPage === 'User' && <User />}
      </div>
    </div>
  );
}

export default App;
