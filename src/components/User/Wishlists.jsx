import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsFillBookmarkHeartFill } from 'react-icons/bs';
import { useMediaQuery } from 'react-responsive';
import UserNavbar from './Navbar/UserNavbar';
import MiniNavBar from './Navbar/MiniNavBar';
import MiniNavbarFooter from './Navbar/MiniNavbarFooter';
import '../Styles/style.css'


function Wishlists() {

    const navigate = useNavigate();
    const authrole = localStorage.getItem('authrole');
    if(authrole!='user'){
      navigate('*')
    }
    const isMobile = useMediaQuery({ query: '(max-width: 980px)' });
    const selectedTheme = localStorage.getItem("selectedTheme");
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const [product, setProduct] = useState([]);

  const deleteProduct = async (productId) => {
    const authid = localStorage.getItem('authid');
    try {
      await axios.delete(`https://shophub-backend.onrender.com/api/wishlist/wishlist/${authid}/${productId}`);
      fetchProduct();
    } catch (error) {
      console.error('Error deleting product from wishlist:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`https://shophub-backend.onrender.com/api/wishlist/getwishlistbyuserid/${localStorage.getItem('authid')}`);
      const wishlistData = res.data;
      const productIds = wishlistData.map(wishlist => wishlist.productId);
  
      const productsWithDetails = await Promise.all(
        productIds.map(async (productId) => {
          ////console.log('ProductId:', productId);
          
          const ratingRes = await axios.get(`https://shophub-backend.onrender.com/api/review/getProductReviews/${productId}`);
          const userCountRes = await axios.get(`https://shophub-backend.onrender.com/api/review/count/${productId}`);
  
          // Fetch price and offer from the wishlist item itself
          const wishlistItem = wishlistData.find(item => item.productId === productId);
          const price = parseInt(wishlistItem.productDetails.price);
          const offer = parseInt(wishlistItem.productDetails.offer);
          const discount = Math.floor(price * offer / 100);
          const old = price + discount;

          ////console.log("old: ",old)
  
          return {
            ...wishlistItem.productDetails,
            rating: ratingRes.data[0] ? ratingRes.data[0].review : 0,
            reviewCount: userCountRes.data.reviewCount,
            commentCount: userCountRes.data.commentCount,
            old: old,
            offer: offer
          };
        })
      );
  
      setProduct(productsWithDetails);
    } catch (error) {
      console.error('Error fetching wishlist products:', error);
    }
  };
  
  

  useEffect(() => {
    const authid = localStorage.getItem('authid');
    if (!authid) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleCardClick = (productId) => {
    ////console.log(productId);
    navigate(`/productdetails?productId=${productId}`);
  };


  return (
    
<div className='wishlist-div' style={{minHeight:'100vh'}}>
  <div>
    {isMobile ? <MiniNavBar /> : <UserNavbar />} 
  </div>
      <div className='container'>
        <div className='wishlisthead'>
          <h1 className='mt-5'>
            <BsFillBookmarkHeartFill className='wishlistheadicon' size={52} color="red" />
            My Wishlist
          </h1>
        </div>
        <div className='container'>
          <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-lg-4 mt-5 g-4'>
            {product.map((wishlist, index) => {
              return (
                <div className='col' key={index}>
                  <div className='card h-100 border-0 home-card' onClick={() => handleCardClick(wishlist._id)} data-theme={selectedTheme}>
                    <img className='home-card-img' src={`${wishlist.image}`} alt='Card' style={{ height: '300px' }} />
                    <div className='card-body d-flex'>
                      <h5 className='text-left'>{wishlist.productName}</h5>
                    </div>
                    <div className='d-flex'>
                      <p className={`card-rtng ${selectedTheme === 'dark' ? 'order-1' : ''}`} style={{  fontSize:'18px' }}>{wishlist.rating}★</p>
                      <p className='ps-2' style={{color:'gray', fontWeight:'bold'}}>{wishlist.reviewCount} Rating &nbsp; & </p>
                      <p className='ps-2' style={{color:'gray', fontWeight:'bold'}}>{wishlist.commentCount} Coment</p>
                    </div>
                    <div className='d-flex'>
                      <p style={{ textAlign: 'left', paddingLeft: '1%', fontSize: 'larger', fontFamily:'times new roman' }}>₹{wishlist.price}</p>
                      <p className='card-offer ps-2 pt-1'style={{textDecoration:'line-through', color:'gray'}}>₹{wishlist.old}</p>
                      <p className='pt-1 ps-2 text-success' style={{fontWeight:'bold'}}>{wishlist.offer}% off</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div>
        {isMobile && <MiniNavbarFooter />}      
      </div>
    </div>
    
    )
}

export default Wishlists