import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AdyenCheckout, Dropin, Card } from '@adyen/adyen-web';
import '@adyen/adyen-web/styles/adyen.css';


const Checkout = () => {

  const [paymentMethodsResponse, setPaymentMethodsResponse] = useState(null);
  const AMOUNT = {
    value: 1000,
    currency: 'EUR',
  };
  const LOCALE = 'zh-CN';
  const COUNTRYCODE= 'NL';

  useEffect(() => {
    const postData = async () => {
      try {
        const response = await fetch('http://localhost:5002/payment-methods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setPaymentMethodsResponse(data); // Update state with fetched data
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
        amount: AMOUNT,
        locale: LOCALE,
        countryCode: COUNTRYCODE,
        paymentMethodsResponse: paymentMethodsResponse,
        onSubmit: async (state, component, actions) => {
          // Handle submission
         async function makePaymentsCall(paymentdata, amount) {
            try {
              const response = await fetch('http://localhost:5002/payments', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                  {
                    amount,
                    reference: "Your order number",
                    paymentMethod: paymentdata.paymentMethod,
                    returnUrl: "https://3000-ps4512-paymentpage-n19h2oaqgu9.ws-us116.gitpod.io/redirect",
                    merchantAccount: "AdyenTechSupport_PengShao_TEST",
                    authenticationData: {
                      attemptAuthentication: "always"
                    }
                   }
                ),

              });
              const data = await response.json();
              return data;
            } catch (error) {
              console.error('Error:', error);
            }
          }

          try {
            // Make a POST /payments request from your server.
            const result = await makePaymentsCall(state.data, AMOUNT);

            console.log("result code is: " + result.resultCode);
       
            // If the /payments request from your server fails, or if an unexpected error occurs.
            if (!result.resultCode) {
              actions.reject();
              return;
            }
       
            const {
              resultCode,
              action,
              order,
              donationToken
            } = result;
       
            // If the /payments request request form your server is successful, you must call this to resolve whichever of the listed objects are available.
            // You must call this, even if the result of the payment is unsuccessful.
            actions.resolve({
              resultCode,
              action,
              order,
              donationToken,
            });
          } catch (error) {
            console.error("onSubmit", error);
            actions.reject();
          }
        },
        onAdditionalDetails: async (state, component, actions) => {
          // Handle additional details
        },
        onPaymentCompleted: (result, component) => {
          console.log("payment succeeded")
          console.info(result, component);
        },
        onPaymentFailed: (result, component) => {
          console.log("payment failed")
          console.info(result, component);
        },
        onError: (error, component) => {
          console.error(error.name, error.message, error.stack, component);
        },
      };

      async function asyncCall() {
        const checkout = await AdyenCheckout(configuration);
      
        // Ensure to mount only when the container exists
        const dropinContainer = document.getElementById('dropin-container');
        if (dropinContainer) {
          // Create an instance of Drop-in.
          const dropin = new Dropin(checkout, {
          // Include the payment methods that imported.
          paymentMethodComponents: [Card],
          // Mount it to the container you created.
          }).mount(dropinContainer);        
        } 
        else {
          console.error("Drop-in container not found.");
        }
      }

      asyncCall()

    }
  }, [paymentMethodsResponse]);

  return <div id="dropin-container"></div>;
}

const RedirectPage = () => {

  const [paymentDetailsResponse, setPaymentDetailsResponse] = useState("");

  useEffect(() => {
    const getPaymentDetails = async () => {
      try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        const response = await fetch('http://localhost:5002/payment-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              redirectResult: urlParams.get('redirectResult')
            }
          )
        });
        const data = await response.json();
        setPaymentDetailsResponse(data); // Update state with fetched data
      } catch (error) {
        console.error('Error:', error);
      }
    };

    getPaymentDetails();
  }, []);

  return (
      <div>
          <h1> Payment Results: {paymentDetailsResponse.resultCode} </h1>
      </div>
  );
};

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Checkout/>}/>
        <Route path="/redirect" element={<RedirectPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;