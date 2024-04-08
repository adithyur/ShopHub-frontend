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
      //console.log("data : ",res.data)
      const productsWithRatings = await Promise.all(
        res.data.map(async (product) => {
          const ratingRes = await axios.get(`https://shophub-backend.onrender.com/api/review/getProductReviews/${product._id}`);
          //console.log('Rating Response:', ratingRes.data);
          const userCountRes = await axios.get(`https://shophub-backend.onrender.com/api/review/count/${product._id}`);
          //console.log('User Count Response:', userCountRes.data.reviewCount);
          const price=parseInt(product.price)
          //console.log("price : ",price)
          const offer = product.offer
          const discount= Math.floor(price* (offer)/100)
          const old= price + discount
          //console.log("offer : ",offer)

          return {
            ...product,
            rating: ratingRes.data[0] ? ratingRes.data[0].review : 0,
            rating: ratingRes.data[0] ? ratingRes.data[0].review : 0,
            reviewCount: userCountRes.data.reviewCount,
            commentCount: userCountRes.data.commentCount,
            old: old,
            offer: offer
          };
        })
      );

      setTopSaleProducts(productsWithRatings);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCardClick = (productId) => {
    //console.log(productId);
    navigate(`/productdetails?productId=${productId}`);
  };

  const isLatestProduct = (date) => {
    const currentDate = new Date();
    const productDate = new Date(date);
    const timeDifference = Math.abs(currentDate - productDate);
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference <= 7; // Highlight products added in the last 7 days
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
                {topSaleProducts.map((cardData, index) => (
                  <div className={`col ${isLatestProduct(cardData.date) ? 'latest-product' : ''}`} key={index}>
                    <div className='card h-100 border-0 home-card' onClick={() => handleCardClick(cardData._id)} data-theme={selectedTheme}>
                      {isLatestProduct(cardData.date) && <div className='new-label'>New</div>}
                        <img className='home-card-img' src={`${cardData.image}`} alt='Card' style={{ height: '300px' }} />
                        <div className='card-body d-flex'>
                          <h5 className='text-left' style={{textAlign:'left'}}>{cardData.productName}</h5>
                        </div>
                        <div className='d-flex'>
                          <p className={`card-rtng ${selectedTheme === 'dark' ? 'order-1' : ''}`} style={{  fontSize:'18px' }}>{cardData.rating}★</p>
                          <p className='ps-2' style={{color:'gray', fontWeight:'bold'}}>{cardData.reviewCount} Rating &nbsp; & </p>
                          <p className='ps-2' style={{color:'gray', fontWeight:'bold'}}>{cardData.commentCount} Comment</p>
                        </div>
                        <div className='d-flex'>
                          <p style={{ textAlign: 'left', paddingLeft: '1%', fontSize: 'larger', fontFamily:'times new roman' }}>₹{cardData.price}</p>
                          <p className='card-offer ps-2 pt-1'style={{textDecoration:'line-through', color:'gray'}}>₹{cardData.old}</p>
                          <p className='pt-1 ps-2 text-success' style={{fontWeight:'bold'}}>{cardData.offer}% off</p>
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