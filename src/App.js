import React from 'react';
import PaymentFlow from './components/PaymentFlow';
import './App.css';

function App() {
  const publicKey = 'Bearer pk_sbox_ukfr4an7yqs5fn3ke6elg7dcte3';

  return (
    <div className="App">
      <h1>Checkout Payment Page</h1>
      <PaymentFlow publicKey={publicKey} />
    </div>
  );
}

export default App;
