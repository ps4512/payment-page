import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AdyenCheckout, Dropin } from '@adyen/adyen-web';
import '@adyen/adyen-web/styles/adyen.css';


const Checkout = () => {
  const [customerName, setCustomerName] = useState('');
  const orderItem = { name: "Widget", price: 29.99 };
  let paymentMethodsResponse;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order placed for ${orderItem.name} by ${customerName}`);
  };

  useEffect(async () => {
    const postData = async () => {
      try {
        const response = await fetch('https://ps4512-paymentserver-qw5gp71ih8u.ws-us116.gitpod.io/payment-methods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
        paymentMethodsResponse = data;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    postData();
  }, []);

  useEffect(() => {
    if (paymentMethodsResponse) {
      const configuration = {
        clientKey: "test_HYAHXGJMHRBMVP3MBLIZEZ4UFA6KRRPW",
        environment: "test",
        amount: {
          value: 1000,
          currency: 'EUR',
        },
        locale: 'nl-NL',
        countryCode: 'NL',
        paymentMethodsResponse: paymentMethodsResponse,
        onSubmit: async (state, component, actions) => {
          // Handle submission
        },
        onAdditionalDetails: async (state, component, actions) => {
          // Handle additional details
        },
        onPaymentCompleted: (result, component) => {
          console.info(result, component);
        },
        onPaymentFailed: (result, component) => {
          console.info(result, component);
        },
        onError: (error, component) => {
          console.error(error.name, error.message, error.stack, component);
        },
      };
  
      const checkout = AdyenCheckout(configuration);
      
      // Ensure to mount only when the container exists
      const dropinContainer = document.getElementById('dropin-container');
      if (dropinContainer) {
        new Dropin(checkout).mount(dropinContainer);
      } else {
        console.error("Drop-in container not found.");
      }
    }
  }, [paymentMethodsResponse]);
}

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Checkout/>}/>
      </Routes>
    </Router>
  );
}

export default App;