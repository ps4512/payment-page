import React, { useState } from 'react';
import PaymentFlow from './components/PaymentFlow';
import './App.css';
import logo from './logo.png'; 
import checkout from './checkout.png'; 

function App() {
  const publicKey = 'pk_sbox_ahx7jdh2ompwcbpudatt76jcsq4';

  const item = 
    { description: 'Green T-shirt', unitPrice: 1, quantity: 2 };

    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false); 

  
    const handleNameChange = (e) => {
      console.log(e);
      setCustomerName(e.target.value);
    };
  
    const handleEmailChange = (e) => {
      console.log(e);
      setCustomerEmail(e.target.value);
    };
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
      setIsSubmitted(true);
    };

  return (
    <div className="App">
      <div id="logo-container">
          <img src={logo} alt="Company Logo" className="logo" />
          <img src={checkout} alt="Checkout Logo" className="logo" />
      </div>
      {isSubmitted ?
      <PaymentFlow publicKey={publicKey} 
      totalAmount={((item.unitPrice * item.quantity))} 
      customerName={customerName}
      customerEmail={customerEmail}/>
      :
      <>
      <div className="order-summary">
        <h2>Order Summary</h2>
          <div>{item.description}</div>
          <div>Quantity: {item.quantity}</div>
          <div>Unit Price: £{((item.unitPrice) / 100).toFixed(2)}</div>
          <div>Total Price: £{((item.unitPrice * item.quantity) / 100).toFixed(2)}</div>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div>
          <label>
            {'Name'}:
            <input type="text" value={customerName} onChange={handleNameChange} required />
          </label>
        </div>
        <div>
          <label>
            {'Email'}:
            <input type="email" value={customerEmail} onChange={handleEmailChange} required />
          </label>
        </div>
        <button type="submit">{'Pay'}</button>
      </form>
      </>
}
    </div>
  );
}

export default App;
