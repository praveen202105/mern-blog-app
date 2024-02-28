// import Home from './Home';
// import Login from './Login';
// import AllPost from './components/GetPosts.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import AllPosts from './components/GetPosts.jsx';
import SetNewPassword from './components/Set-new-Password.jsx';
import ForgetPassword from './components/Forget-Password.jsx';
// import { idContext } from './context-api/id.context.js';
function App() {

  return (
    <div  style={{marginTop : '-3.5rem'}}>
      <BrowserRouter >
        <Routes>
          <Route path="/" element ={<Register/>} />
          {/* <Route path="/register" element ={<Register/>} />  */}
          <Route path="/login" element ={<Login/>} /> 
          <Route path="/post" element ={<AllPosts/>} /> 
          <Route path="/forget-password" element={<ForgetPassword/>} />
          <Route path ="/setNewPassword" element={<SetNewPassword/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App