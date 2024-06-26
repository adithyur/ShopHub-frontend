import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Styles/style.css';

function MiniNavBar() {
  const selectedTheme = localStorage.getItem("selectedTheme");
  const [userName, setUserName] = useState('');
  const [searchData, setSearchData] = useState('');
  const [isInputClicked, setIsInputClicked] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleInputClick = () => {
    setIsInputClicked(true);
  };

  const handleInputBlur = () => {
    setIsInputClicked(false);
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        //console.log('user id : ', localStorage.getItem('authid'));
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

  const imgclick = () => {
    //console.log('clicked')
    navigate('/')
  }

  const searchProduct = () => {
    //console.log("search : ",searchData)
    navigate(`/searchproduct?searchdata=${searchData}`);
  };

  return (
    <div className='mini-nav-bar' style={{backgroundColor:'#2a55e5'}}>
      <div className='container' style={{backgroundColor:'#2a55e5'}}>
        <div className='d-flex'>
            <div className='col-sm-5' onClick={imgclick}>
                <img src='/logo2.png' alt='ShopHub Logo' className='nav-logo-mini' style={{height:'60px'}}/>
            </div>
            <div className="mt-3 col-sm-7 d-flex" style={{ borderRadius: '20px', border: '1px solid gray', width: '240px', height:'45px', marginLeft:'15px' }}>
                <input
                    type="text"
                    name="search"
                    value={searchData}
                    onChange={(e) => setSearchData(e.target.value)}
                    onClick={handleInputClick}
                    onBlur={handleInputBlur}
                    placeholder="Find your items"
                    className={`srch-plchldr mt-1 rounded-0 align-items-center ${isInputClicked ? 'no-border' : 'no-border'}`}
                    style={{ color:'white', width: '125px', border: 'none', backgroundColor: 'transparent',outline: 'none', paddingLeft: '5px' }}
                />
                <button
                    className="mt-2 navbutton2"
                    onClick={searchProduct}
                    style={{ borderRadius: '50px',backgroundColor:'transparent', color: 'white', border: 'none', marginLeft:"-8px" }}
                >
                    <FaSearch />
                </button>
            </div>
        </div> 
      </div>  
    </div>
  );
}

export default MiniNavBar;
