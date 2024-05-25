// SuccessPage.js
import React from 'react';

const SuccessPage = ({ amount, currency }) => {
  return (
    <div className="success-page">
      <h1>Payment Successful</h1>
      <p>Your payment of {amount / 100} {currency} has been processed successfully.</p>
    </div>
  );
};

export default SuccessPage;
