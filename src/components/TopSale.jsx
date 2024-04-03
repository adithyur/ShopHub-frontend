import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import UserNavbar from './User/Navbar/UserNavbar';
import MiniNavbarFooter from './User/Navbar/MiniNavbarFooter';
import NavbarCategory from './User/Navbar/NavbarCategory';
import MiniNavBar from './User/Navbar/MiniNavBar';
import { FcSalesPerformance } from "react-icons/fc";


function TopSale() {

    const selectedTheme = localStorage.getItem("selectedTheme");
    const isMobile = useMediaQuery({ query: '(max-width: 980px)' });
    const navigate = useNavigate();
    const [topSaleProducts, setTopSaleProducts] = useState([]);

  useEffect(() => {
    fetchTopSaleProducts();
  }, []);

  const fetchTopSaleProducts = async () => {
    try {
      const res = await axios.get('https://shophub-backend.onrender.com/api/order/top-sale-products');
      
      const productsWithRatings = await Promise.all(
        res.data.map(async (product) => {
          const ratingRes = await axios.get(`https://shophub-backend.onrender.com/api/review/getProductReviews/${product._id}`);
          console.log('Rating Response:', ratingRes.data);
          return {
            ...product,
            rating: ratingRes.data[0] ? ratingRes.data[0].review : 0,
          };
        })
      );

      setTopSaleProducts(productsWithRatings);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCardClick = (productId) => {
    console.log(productId);
    navigate(`/productdetails?productId=${productId}`);
  };

  return (
    <div className='user-home' data-theme={selectedTheme} style={{minHeight:'100vh'}}>
        <div>
            {isMobile ? <MiniNavBar /> : <UserNavbar />} 
        </div>
        <div>
            <NavbarCategory/>
        </div>
        <div className='container'>
            <div className='wishlisthead'>
                <h1 className='mt-5'>
                <FcSalesPerformance className='wishlistheadicon' size={52} color="red" />
                Top Sale Products
                </h1>
            </div>
            <div className='container'>
                <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-lg-4 mt-5 g-4'>
                {topSaleProducts.map(product => (
                    <div className='col' key={product._id}>
                    <div className='card h-100 border-0 home-card' onClick={() => handleCardClick(product._id)} data-theme={selectedTheme}>
                        <img className='home-card-img' src={`${product.image}`} alt='Card' style={{ height: '300px' }} />
                        <div className='card-body d-flex'>
                        <h5 className='text-left' style={{textAlign:'left'}}>{product.productName}</h5>
                        </div>
                        <div className='d-flex justify-content-between'>
                        <p className='col-lg-11 col-md-11 col-sm-11' style={{ textAlign: 'left', paddingLeft: '1%', fontSize: 'larger' }}>₹{product.price}</p>
                        <p className={`col-lg-1 col-md-1 col-sm-1 ${selectedTheme === 'dark' ? 'order-1' : ''}`} style={{ textAlign: 'right'}}>{product.rating}★</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
            <div>
            {isMobile && <MiniNavbarFooter />}      
            </div>
        </div>

  );
}

export default TopSale