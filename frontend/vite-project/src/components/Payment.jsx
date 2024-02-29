import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { useContext } from 'react';
// import { idContext } from '../context-api/id.context';

const Payment = () => {
    const [amount, setAmount] = useState('');
    const [orderId, setOrderId] = useState('');

    const createOrder = async () => {
        try {
          const res = await axios.post(`http://localhost:5000/api/v1/user/payment`, { amount });
          console.log(res.data.OrderId); 
          setOrderId(res.data.OrderId)
        } catch (error) {
          console.error('Error creating order:', error);
        }
      };
    
      const handlePayment = async () => {
        try {
            if (!orderId) {
                console.error('Order ID is missing. Make sure to create the order first.');
                return;
            }
    
            const options = {
                key: "rzp_test_qG338cWNodRfGK",
                amount: amount * 100, // Amount in paisa (Indian currency)
                currency: 'INR',
                order_id: orderId,
                name: 'Blog app',
                description: 'Premium',
                handler: async function (response) {
                    // Handle successful payment
                    console.log('Payment successful:', response);
                    const res = await axios.post(`http://localhost:5000/api/v1/user/payment/verifypayment`, { response });
                    console.log(res); 
                    
                },
                prefill: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    contact: '9999999999',
                },
                notes: {
                    address: 'Razorpay Corporate Office',
                },
                theme: {
                    color: '#F37254',
                },
            };
    
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Error opening Razorpay payment window:', error);
        }
    };
    


    return (
        <div>
            <div className="d-flex justify-content-center align-items-center text-center vh-100" style= {{backgroundImage : "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))"}}>
                <div className="bg-white p-3 rounded" style={{width : '40%'}}>
                    <h2 className='mb-3 text-primary'>Payment</h2>
                    <div>
                        <input
                            type="number"
                            placeholder="Enter amount (INR)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button onClick={createOrder}>Create Order</button>
                        <button onClick={handlePayment}>Pay Now</button>
                        </div>


                  
                </div>
            </div>
        </div>
    )
}

export default Payment;
