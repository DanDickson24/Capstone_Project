import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Root from './Root';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Home from './Home';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext'; 
import LoadForm from './Forms/LoadForm';
import Journey from './Journey';
import MyLocation from './MyLocation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<PrivateRoute element={Home} />} />
          <Route path="/load" element={<PrivateRoute element={LoadForm} />} />
          <Route path="/journey" element={<PrivateRoute element={Journey} />} />
          <Route path="/mylocation" element={<MyLocation />} /> 
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
