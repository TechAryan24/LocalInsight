import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Form from './pages/Form';
import Map from './pages/Map';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Navbar from './components/Navbar';
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <>
    <Navbar/>
    
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/map" element={<Map/>} />
      <Route path="/form" element={<Form/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
       <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
    </>
  )
}

export default App
