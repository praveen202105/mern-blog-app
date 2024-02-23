// import Home from './Home';
// import Login from './Login';
import GetPosts from './components/GetPosts.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {

  return (
    <div style={{marginTop : '-3.5rem'}}>
      <BrowserRouter >
        <Routes>
          <Route path="/" element ={<Register/>} />
          {/* <Route path="/register" element ={<Register/>} />  */}
          <Route path="/login" element ={<Login/>} /> 
          <Route path="/home" element ={<GetPosts/>} /> 
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App