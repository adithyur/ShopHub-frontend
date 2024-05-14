import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from '../../Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Styles/style.css';
import { FaSearch } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';
import { AiFillHeart } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';

function UserNavbar() {

  const selectedTheme = localStorage.getItem("selectedTheme");
  const authrole = localStorage.getItem('authrole');
  const authid= localStorage.getItem('authid')
  const [userName, setUserName] = useState('');
  const [searchData, setSearchData] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isInputClicked, setIsInputClicked] = useState(false);

  const handleInputClick = () => {
    setIsInputClicked(true);
  };

  const handleInputBlur = () => {
    setIsInputClicked(false);
  };

    const logout = () => {
      localStorage.removeItem('authid')
      navigate('/')
    }
    const navigate=useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
      };

      const freshProduct = () => {
        const productType = 'fresh';
        navigate(`/productype?productType=${productType}`);
      };
    
      const usedProduct = () => {
        const productType = 'used';
        navigate(`/productype?productType=${productType}`);
      };

      useEffect(() => {
        const fetchUserName = async () => {
          try {
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

      const searchProduct =  () => {
        navigate(`/searchproduct?searchdata=${searchData}`);
      }

      useEffect(() => {
        const fetchCartCount = async () => {
          try {
            const authid = localStorage.getItem('authid');
            const res = await axios.get(`https://shophub-backend.onrender.com/api/cart/getcartbyuserid/${authid}`);
            const cartItems = res.data;
            const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalCount);
          } catch (error) {
            console.error('Error fetching cart count:', error);
          }
        };
    
        fetchCartCount();
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
    
<div className='nav-bar-lg' data-theme={selectedTheme} style={{backgroundColor:'#2a55e5'}}>
<div className='container' style={{backgroundColor:'transparent'}}>
  <div className='d-flex align-items-center justify-content-between nav-lg' >
    <div className='col-lg-3 col-md-3 mt-1 justify-content-start d-flex nav-logo-lg-div'>
      <a href='/'>
        <img src='/logo2.png' alt='ShopHub Logo' className='nav-logo-lg' />
      </a>
    </div>

    <div className="mt-1 col-lg-5 col-md-5 d-flex search-div">
    <div className="col-lg-2 col-md-2 mt-2 mb-2 text-center nav-item2" onClick={() => { navigate(`/productype?productype=${'fresh'}`)}}>Fresh</div>
    <div className="col-lg-3 col-md-3 mt-2 mb-2 text-center nav-item2" onClick={() => { navigate(`/productype?productype=${'used'}`) }}>Refurbished</div>
    <div className="col-lg-2 col-md-2 mt-2 mb-2 text-center nav-item2" onClick={() => { navigate('/latest') }}>Latest</div>
    <div className="col-lg-5 col-md-5 mt-2 mb-2 d-flex align-items-center">
        <input
            type="text"
            name="search"
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
            placeholder="Find your items"
            className='srch-plchldr'
            style={{
                border: 'none',
                borderRadius: '5px',
                padding: '8px',
                flex: 1,
                color:'#fff',
                marginRight: '5px',
                userSelect: 'none' ,
                outline: 'none',
                backgroundColor:'transparent'
            }}
        />
        <button
            className="btn"
            style={{
                padding: '8px',
                borderRadius: '5px',
                cursor: 'pointer',
                color: '#fff',
              
            }}
            onClick={searchProduct}
        >
            <FaSearch />
        </button>
    </div>
</div> 
    {!authid ? (<Login />) : (<>
      <a className='pnav' href="/Cart">
        <FaShoppingCart size={18} className='pnav-icon' /> Cart
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </a>
      <a className='pnav' href="/Wishlists">
        <AiFillHeart size={20} className='pnav-icon'/> Wishlist
      </a>
      <a className='pnav' onClick={profile}>
        <FaUser size={18} className='pnav-icon' style={{ color: '#fff' }} /> { userName }
      </a></>
    )}
</div>
</div>
</div>
    
  )
}

export default UserNavbar