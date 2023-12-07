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
import Layout from './Layout';
import EditVehicle from './EditVehicle';
import PastJourneys from './PastJourneys';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Root /></Layout>}/>
          <Route path="/signup" element={<Layout><SignUp /></Layout>} />
          <Route path="/signin" element={<Layout><SignIn /></Layout>} />
          <Route path="/home" element={<PrivateRoute element={<Layout><Home /></Layout>} />} />
          <Route path="/editvehicle" element={<PrivateRoute element={<Layout><EditVehicle /></Layout>} />} />
          <Route path="/load" element={<PrivateRoute element={<Layout><LoadForm /></Layout>} />} />
          <Route path="/journey" element={<PrivateRoute element={<Layout><Journey /></Layout>} />} />
          <Route path="/mylocation" element={<PrivateRoute element={<Layout><MyLocation /></Layout>} />} /> 
          <Route path="/pastjourneys" element={<PrivateRoute element={<Layout><PastJourneys /></Layout>} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
