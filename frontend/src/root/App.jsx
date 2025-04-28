// App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '@pages/Home.jsx';
import Taches from '@pages/Taches.jsx';
import Login from '@pages/login.jsx'; // Corriger la casse et le chemin
import Register from '@pages/register.jsx'; // Corriger la casse
import Navbar from '../component/Navbar.jsx';
import PrivateRoute from '../component/PrivateRoutes.jsx'; // Nouveau composant pour protéger les routes

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/taches"
          element={
            <PrivateRoute>
              <Taches />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;