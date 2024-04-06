import  React, { useState , useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { useMediaQuery } from 'react-responsive';
import UserNavbar from './User/Navbar/UserNavbar';
import MiniNavBar from './User/Navbar/MiniNavBar';
import NavbarCategory from './User/Navbar/NavbarCategory';
import MiniNavbarFooter from './User/Navbar/MiniNavbarFooter';
import Footer from './User/Footer';

function SearchProduct() {

    const [showUser, setShowUser] = useState(false);
    const [showUser1, setShowUser1] = useState(false);
    const userid = localStorage.getItem('authid');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isMobile = useMediaQuery({ query: '(max-width: 980px)' });
    const selectedTheme = localStorage.getItem("selectedTheme");
    const searchdata = searchParams.get('searchdata');

    const handleCheck = async () => {
        
        if(userid){
          setShowUser1(true);
          
        }
        else{
          setShowUser(true);
        }
      }

      useEffect(() => {
        handleCheck();
    },[])

    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
  
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`https://shophub-backend.onrender.com/api/products/searchdata/${searchdata}`);
        console.log("Products:", res.data);
  
        const productsWithRatings = await Promise.all(
          res.data.map(async (product) => {
            const ratingRes = await axios.get(`https://shophub-backend.onrender.com/api/review/getProductReviews/${product._id}`);
            //console.log("Rating Response:", ratingRes.data);
            const userCountRes = await axios.get(`https://shophub-backend.onrender.com/api/review/usercount/${product._id}`);
            //console.log('User Count Response:', userCountRes.data);
            const price=parseInt(product.price)
            const offer = parseInt(product.offer)
            const discount= Math.floor(price* (offer)/100)
            const old= price + discount
            console.log("price : ",old)

            return {
              ...product,
              rating: ratingRes.data[0] ? ratingRes.data[0].review : 0,
              userCount: userCountRes.data.userCount,
              old: old,
              offer: offer
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
    }, [searchdata]);
  
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
    <div className='container'>
        <div>
          {isMobile ? <MiniNavBar /> : <UserNavbar />} 
        </div>
        <div>
          <NavbarCategory/>
        </div>
        <div className='user-home' data-theme={selectedTheme}>
            <div className='container border-0 mt-3'>
                <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-lg-4 g-4'>
                    {products.length > 0 ? (
                        products.map((cardData, index) => (
                          <div className={`col ${isLatestProduct(cardData.date) ? 'latest-product' : ''}`} key={index}>
                            <div className='card h-100 border-0 home-card' onClick={() => handleCardClick(cardData._id)} data-theme={selectedTheme}>
                              {isLatestProduct(cardData.date) && <div className='new-label'>New</div>}
                              <img className='home-card-img' src={`${cardData.image}`} alt='Card' style={{ height: '300px' }} />
                              <div className='card-body d-flex'>
                                <h5 className='text-left' style={{textAlign:'left'}}>{cardData.productName}</h5>
                              </div>
                              <div className='d-flex'>
                                <p className={`card-rtng ${selectedTheme === 'dark' ? 'order-1' : ''}`} style={{  fontSize:'18px' }}>{cardData.rating}★</p>
                                <p className='ps-2'>({cardData.userCount})</p>
                              </div>
                              <div className='d-flex'>
                                <p style={{ textAlign: 'left', paddingLeft: '1%', fontSize: 'larger', fontFamily:'times new roman' }}>₹{cardData.price}</p>
                                <p className='card-offer ps-2 pt-1'style={{textDecoration:'line-through', color:'gray'}}>₹{cardData.old}</p>
                                <p className='pt-1 ps-2 text-success' style={{fontWeight:'bold'}}>{cardData.offer}% off</p>
                              </div>
                            </div>  
                          </div>
                        ))
                    ) : (
                        <div className="text-invalid mt-3">
                            <h1 className='mt-5'>No products found</h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div>
          <Footer/>
        </div>
        <div>
            {isMobile && <MiniNavbarFooter />}
        </div>
    </div>
  )
}

export default SearchProduct