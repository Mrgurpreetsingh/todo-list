import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '/src/pages/Home.jsx';
import Taches from '/src/pages/Taches.jsx';
import Login from '../pages/login.jsx';
import Register from '/src/pages/register.jsx';

function App() {
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/taches" element={<Taches />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
  );
}

export default App;