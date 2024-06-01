import React, { useEffect, useState, useRef } from 'react';

const AsyncPaymentStatus = () => {
  const [paymentStatus, setPaymentStatus] = useState('Pending...');
  const POLLING_INTERVAL = 3000; // Poll every 3 seconds
  const intervalRef = useRef(null); 

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await fetch('http://localhost:5002/payment-status');
        const data = await response.json();
        setPaymentStatus(data);
      } catch (error) {
        setPaymentStatus('Error fetching payment status');
      }
    };

    intervalRef.current = setInterval(() => {
        fetchPaymentStatus();
      }, POLLING_INTERVAL);
  
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (paymentStatus === 'payment_captured' || paymentStatus === 'payment_declined') {
        clearInterval(intervalRef.current);
    }
  }, [paymentStatus]);


  return (
    <div>
      <h1>Payment Status: {paymentStatus}</h1>
    </div>
  );
};

export default AsyncPaymentStatus;