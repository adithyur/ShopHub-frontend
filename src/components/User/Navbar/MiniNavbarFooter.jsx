import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import { AiFillHeart } from 'react-icons/ai';
import { FaShoppingCart } from 'react-icons/fa';



function MiniNavbarFooter() {
  const selectedTheme = localStorage.getItem("selectedTheme");
  const authid= localStorage.getItem('authid')
  const authrole = localStorage.getItem('authrole');
  const [userName, setUserName] = useState('');

  const navigate=useNavigate()


  useEffect(() => {
    const fetchUserName = async () => {
      try {
        //console.log("user id : ",localStorage.getItem('authid'))
        const res = await axios.get(`https://shophub-backend.onrender.com/api/user/getname/${localStorage.getItem('authid')}`);
        const userData = res.data;

        if (userData && userData.username) {
          setUserName(userData.username);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUserName();
  }, []);

  const profile = async () => {
          
    if (!authid) {
      navigate('/login');
    }
    
    else {
      if(authrole==='user'){
        navigate('/profile');
      }
      else if(authrole==='admin'){
        navigate('/adminhome');
      }
      else{
        navigate('/sellerhome');
      }
     }
}
  return (
    <div className='mini-navbar-footer' style={{backgroundColor:'#2a55e5'}}>
      <div style={{backgroundColor:'#2a55e5'}}>
        <div className='col-lg-4 mt-2 mb-2 d-flex nav-profile-footer'>    
          <a className='pnav-footer' href="/Cart" style={{textAlign:'left'}}>
            <FaShoppingCart size={22} className='pnav-footer-icon'/>  Cart</a>
          <a className='pnav-footer' href="/Wishlists">
            <AiFillHeart size={24} className='pnav-footer-icon'/> Wishlist
          </a>
          <a className='pnav-footer' onClick={profile}>
            <FaUser size={22} className='pnav-footer-icon' style={{ color: '#fff' }} /> {authid ? userName : 'Login'}
          </a>
        </div>
      </div>
    </div>
  )
}

export default MiniNavbarFooter