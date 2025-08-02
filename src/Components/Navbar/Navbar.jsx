import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css"; 

const Navbar = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
    <div className={styles.navbarBack} >
    <nav className={styles.NavbarSection}>
      <div className={styles.NavbarLogo}>
        <a href="/admin">
        <img src={Logo} alt="DEUTSOLUTIONS logo" />
        </a>
      </div>
  
    </nav>

    </div>
    </>
  );
};

export default Navbar; 
