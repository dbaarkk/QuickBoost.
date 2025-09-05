import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AddFunds from './pages/AddFunds';
import Services from './pages/Services';
import PlaceOrder from './pages/PlaceOrder';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-funds" element={<AddFunds />} />
          <Route path="/services" element={<Services />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;