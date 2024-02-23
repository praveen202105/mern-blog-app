import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Register = () => {
    const [fullName, setfullName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setconfirmpassword] = useState();
    const navigate = useNavigate();

    // const handleSubmit = (event) => {
    //     console.log("called");
    //     event.preventDefault();
       
    //     axios.post( 'http://localhost:5000/api/v1/user/register', {fullName, email, password,confirmpassword})
    //     .then(result => {
    //         console.log(result);
    //         // alert(result.data.message);  1
    //         if(result.message === "Email already exists"){
    //             alert("E-mail already registered! Please Login to proceed.");
    //             navigate('/login');
    //         }
    //         else{
    //             alert("Registered successfully! Please Login to proceed.")
    //             navigate('/login');
    //         }
            
    //     })
    //     .catch(err => {
    //         alert(err.response.data.message);
    //         console.log(err)});
    // }
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/api/v1/user/register', {fullName, email, password,confirmpassword},{ withCredentials: true });
          console.log(response);
          if(response.message === "Email already exists"){
            alert("E-mail already registered! Please Login to proceed.");
            navigate('/login');
        }
        else{
            alert("Registered successfully")
            const cookieValue = response.headers['set-cookie'];
            if (cookieValue) {
                // Assuming the cookie value is a token
                Cookies.set('token', cookieValue, { expires: 7 });
            }
            navigate('/login');
        }
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
                    <h2 className='mb-3 text-primary'>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                                <strong >FullName</strong>
                            </label>
                            <input 
                                type="text"
                                placeholder="Enter Name"
                                className="form-control" 
                                id="exampleInputname" 
                                onChange={(event) => setfullName(event.target.value)}
                                required
                            /> 
                        </div>
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
                            <input 
                                type="password" 
                                placeholder="Enter Confirm Password"
                                className="form-control" 
                                id="exampleInputPassword1" 
                                onChange={(event) => setconfirmpassword(event.target.value)}
                                required
                            />
                        </div>
                        <button type="Submit"  className="btn btn-primary">Register</button>
                    </form>

                    <p className='container my-2'>Already have an account ?</p>
                    <Link to='/login' className="btn btn-secondary">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Register