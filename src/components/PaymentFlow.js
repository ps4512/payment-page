import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SuccessPage from './SuccessPage';
import FailurePage from './FailurePage';

const PaymentFlow = ({ publicKey, totalAmount, customerName, customerEmail}) => {
  const [paymentSession, setPaymentSession] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createPaymentSession = async () => {
      try {
        const response = await axios.post('https://5002-ps4512-paymentserver-qw5gp71ih8u.ws-us116.gitpod.io/create-payment-session', {
          amount: totalAmount,
          currency: "GBP",
          reference: "ORD-123A",
          processing_channel_id: "pc_7ymlzdvrgi3ufljhfzfauz3un4",
          billing: {
            address: {
              country: "GB"
            }
          },
          customer: {
            name: customerName,
            email: customerEmail
          },
          success_url: "http://localhost:3000/result",
          failure_url: "http://localhost:3000/result"
        });
        setPaymentSession(response.data);
      } catch (error) {
        console.error('Error creating payment session', error);
      }
    };

    createPaymentSession();
  }, [customerEmail, customerName, totalAmount]);

  useEffect(() => {
    const initializeCheckout = async () => {
      if (paymentSession) {
        try {
          const { loadCheckoutWebComponents } = await import('@checkout.com/checkout-web-components');
          const checkout = await loadCheckoutWebComponents({
            publicKey,
            environment: "sandbox",
            locale: 'zh',
            paymentSession,
            onReady: () => {
              console.log("onReady");
            },
            onPaymentCompleted: async (_component, paymentResponse) => {
              console.log('Payment completed with Payment ID:', paymentResponse.id);
              const paymentResult = await handlePayment(paymentResponse.id);
              setPaymentResponse(paymentResult);
              console.log("paymentResult: " + paymentResult)
            },
            onChange: (component) => {
              console.log(`onChange() -> isValid: "${component.isValid()}" for "${component.type}"`);
            },
            onError: (component, error) => {
              console.log("onError", error, "Component", component.type);
              setError(error.message);
            }
          });

          const flowComponent = checkout.create('flow');
          flowComponent.mount('#flow-container');

        } catch (error) {
          console.error('CheckoutWebComponents failed to load:', error);
        }
      }
    };

    const handlePayment = async (paymentId) => {
      try {
        const response = await axios.get(`https://5002-ps4512-paymentserver-qw5gp71ih8u.ws-us116.gitpod.io/payment-details/${paymentId}`);
        console.log('Payment Details:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching payment details', error);
        setError(error.message);
      }
    };

    initializeCheckout();
  }, [paymentSession, publicKey]);

  useEffect(() => {
    const clearPaymentStatus = async () => {
      try {
        console.log("clearing payment status")
        await axios.post('https://5002-ps4512-paymentserver-qw5gp71ih8u.ws-us116.gitpod.io/clear-payment-status');
      } catch (error) {
        console.log('clear status failed');
      }
    };
    clearPaymentStatus();
  }, []);

  if (paymentResponse) {
    return <SuccessPage amount={paymentResponse.amount} currency={paymentResponse.currency} />;
  }

  if (error) {
    return <FailurePage />;
  }

  return (
    <div>
      <div id="flow-container"></div>
    </div>
  );
};

export default PaymentFlow;