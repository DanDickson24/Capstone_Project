import React from 'react';
import Navbar from './NavBar';
import './Layout.css'; 
const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <div className="content">{children}</div>
        </>
    );
};

export default Layout;