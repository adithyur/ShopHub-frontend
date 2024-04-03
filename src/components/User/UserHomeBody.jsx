import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/style.css';
import DarkMode from '../DarkMode';

function UserHomeBody() {
  const selectedTheme = localStorage.getItem('selectedTheme');
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.post(`https://shophub-backend.onrender.com/api/products/veproducts`);
      console.log('Products:', res.data);

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

      setProducts(productsWithRatings);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleCardClick = (productId) => {
    console.log(productId);
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
    <div className='user-home' data-theme={selectedTheme}>
      <div className='container border-0 mt-3'>
        <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-lg-4 g-4 product-card'>
        {products.map((cardData, index) => (
  <div className={`col ${isLatestProduct(cardData.date) ? 'latest-product' : ''}`} key={index}>
    <div className='card h-100 border-0 home-card' onClick={() => handleCardClick(cardData._id)} data-theme={selectedTheme}>
      {isLatestProduct(cardData.date) && <div className='new-label'>New</div>}
      <img className='home-card-img' src={`${cardData.image}`} alt='Card' style={{ height: '300px' }} />
      <div className='card-body d-flex'>
        <h5 className='text-left' style={{textAlign:'left'}}>{cardData.productName}</h5>
      </div>
      <div className='d-flex justify-content-between' style={{marginTop:'-5px'}}>
        <p className='col-lg-11 col-md-11 col-sm-11' style={{ textAlign: 'left', paddingLeft: '1%', fontSize: 'larger' }}>₹{cardData.price}</p>
        <p className={`col-lg-1 col-md-1 col-sm-1 ${selectedTheme === 'dark' ? 'order-1' : ''}`} style={{ textAlign: 'right', fontSize:'18px' }}>{cardData.rating}★</p>
      </div>
    </div>
  </div>
))}

        </div>
      </div>
    </div>
  );
}

export default UserHomeBody;
