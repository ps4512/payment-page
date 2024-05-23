import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentFlow = ({ publicKey }) => {
  const [paymentSession, setPaymentSession] = useState(null);

  useEffect(() => {
    const createPaymentSession = async () => {
      try {
        const response = await axios.post('http://localhost:5002/create-payment-session', {
            "amount": 1000,
            "currency": "GBP",
            "reference": "ORD-123A",
            "processing_channel_id": "pc_56oh7ociwgkebnldq7t2kxpc4i",
            "billing": {
              "address": {
                "address_line1": "123 High St.",
                "address_line2": "Flat 456",
                "city": "London",
                "zip": "SW1A 1AA",
                "country": "GB"              }
            },
            "customer": {
              "name": "Jia Tsang",
              "email": "jia.tsang@example.com"
            },
            "success_url": "http://localhost:3000",
            "failure_url": "http://localhost:3000"
          });
        setPaymentSession(response.data);
      } catch (error) {
        console.error('Error creating payment session', error);
      }
    };

    createPaymentSession();
  }, []);

  useEffect(() => {
    const initializeCheckout = async () => {
      if (paymentSession) {
        const { loadCheckoutWebComponents } = await import('@checkout.com/checkout-web-components');
        console.log(paymentSession)
        const checkout = await loadCheckoutWebComponents({
            publicKey,
            environment: "sandbox",
            locale: "en-GB",
            paymentSession,
            onReady: () => {
              console.log("onReady");
            },
            onPaymentCompleted: (_component, paymentResponse) => {
              console.log("Create Payment with PaymentId: ", paymentResponse.id);
            },
            onChange: (component) => {
              console.log(
                `onChange() -> isValid: "${component.isValid()}" for "${
                  component.type
                }"`,
              );
            },
            onError: (component, error) => {
              console.log("onError + abc", error, "Component", component.type);
            },
            onPaymentCompleted: async (_component, paymentResponse) => {
                console.log('Payment completed with PaymentId:', paymentResponse.id);
                // Handle synchronous payments
                await handlePayment(paymentResponse.id);
              },
          });
        

        const flowComponent = checkout.create('flow');
        flowComponent.mount('#flow-container');
      }
    };

    const handlePayment = async (paymentId) => {
        try {
          const response = await axios.get(`http://localhost:5000/payment-details/${paymentId}`);
          console.log('Payment Details:', response.data);
        } catch (error) {
          console.error('Error fetching payment details', error);
        }
      };

    initializeCheckout();
  }, [paymentSession, publicKey]);

  return (
    <div>
      <div id="flow-container"></div>
    </div>
  );
};

export default PaymentFlow;
