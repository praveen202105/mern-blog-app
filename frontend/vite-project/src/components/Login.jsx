import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
// import { useContext } from 'react';
// import { idContext } from '../context-api/id.context';

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    // const { setId } = useContext(idContext); 
    // const { Id } = useContext(idContext); 
    // const id=useContext(idContext);
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/api/v1/user/login', { email, password},{ withCredentials: true } );
          const token = response.data.token;

        // Save the token in a cookie
        Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
        
        // console.log(id);
        //   console.log("id: "+Id);
            // navigate('/post');
            // console.log(response.data.user._id)
            alert("login successfully! .")
         
            // const cookieValue = response.headers['set-cookie'];
         
            // if (cookieValue) {
            //     // Assuming the cookie value is a token
            //     Cookies.set('token', cookieValue, { expires: 7 });
            // }  
           
             navigate('/post');
        }
        
        catch (err) {
            alert(err.response.data.message);
         console.log(err);
        }
      
        
    }
    


    return (
        <div>
            <div className="d-flex justify-content-center align-items-center text-center vh-100" style= {{backgroundImage : "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))"}}>
                <div className="bg-white p-3 rounded" style={{width : '40%'}}>
                    <h2 className='mb-3 text-primary'>Login</h2>
                    <form onSubmit={handleSubmit}>
                       
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                                <strong>Email Id</strong>
                            </label>
                            <input 
                                type="email" 
                                placeholder="Enter Email"
                                className="form-control" 
                                id="exampleInputEmail1" 
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            /> 
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputPassword1" className="form-label">
                                <strong>Password</strong>
                            </label>
                            <input 
                                type="password" 
                                placeholder="Enter Password"
                                className="form-control" 
                                id="exampleInputPassword1" 
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                            
                        </div>
                        <button type="Submit"  className="btn btn-primary">Login</button>
                    </form>


                    <Link to='/forget-password' className="btn btn-secondary">Forget Password</Link>
                </div>
            </div>
        </div>
    )
}

export default Login;
