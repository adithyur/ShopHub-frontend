import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AiOutlineHome, AiFillHome } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { FaEye } from 'react-icons/fa';
import { FaRobot } from 'react-icons/fa';
import { FaTag } from 'react-icons/fa';
import { GrUserManager } from "react-icons/gr";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManageSellers() {

    const [showLogoutOverlay, setShowLogoutOverlay] = useState(false);
    const [verifier, setVerifier] = useState([]);
    const navigate=useNavigate()
    const authrole = localStorage.getItem('authrole');
    if(authrole!='admin'){
      navigate('*')
    }

    const logout = () => {
      localStorage.removeItem('authid')
      navigate('/')
    };

      
    useEffect(() => {
    fetchVerifier();
  }, []);

      const fetchVerifier = async () => {
        try {
          const res = await axios.post('https://shophub-backend.onrender.com/api/user/viewseller');
          //console.log("data : ",res.data)
          setVerifier(res.data);
        } catch (error) {
          console.error('Error fetching verifier:', error);
        }
      };
    
      const deleteVerifier = async (userId) => {
        try {
          await axios.delete(`https://shophub-backend.onrender.com/api/user/delete/${userId}`);
          toast.success("seller removed successfully!");
          // Remove the deleted user from the users list
          setVerifier(verifier.filter(user => user._id !== userId));
        } catch (error) {
          toast.error("can't remove seller!");
          console.error('Error deleting user:', error);
        }
      };

  return (

<div className='admin-home'>
        <div className='admin-nav'>
          <a href='/adminhome'>
            <img src='/logo2.png' alt='ShopHub Logo' className='admin-nav-logo' />
          </a>
          <div className='mt-3'>
            <div className='admin-option'>
              <div className='admin-option1 ms-5 d-flex' onClick={()=>{navigate('/adminhome')}}>
                <p className='option-p mt-3'>
                  <AiOutlineHome style={{fontSize:'25'}} className='me-3'/>HOME
                </p>
              </div>
            </div>
            <div className='admin-option'>
              <div className='admin-option2 ms-5 d-flex' onClick={()=>{navigate('/manageuser')}}>
                <p className='option-p mt-3'>
                  <FaUsers style={{fontSize: '25'}} className='me-3'/>MANAGE USER
                </p>
              </div>
            </div>
            <div className='admin-option'>
              <div className='admin-option-active ms-5 d-flex' onClick={()=>{navigate('/manageseller')}}>
                <p className='option-p mt-3'>
                  <GrUserManager style={{fontSize: '25'}} className='me-3'/>MANAGE SELLER
                </p>
              </div>
            </div>
            <div className='admin-option'>
              <div className='admin-option3 ms-5' onClick={()=>{navigate('/manageproduct')}}>
                <p className='option-p mt-3'>
                  <FaTag style={{fontSize: '15'}} className='me-3'/>MANAGE PRODUCT
                </p>
              </div>
            </div>
            <div className='admin-option'>
              <div className='admin-option4 ms-5' onClick={()=>{navigate('/vieworder')}}>
                <p className='option-p mt-3'>
                  <FaEye style={{fontSize: '25'}} className='me-3'/>VIEW ORDER
                </p>
              </div>
            </div>
            <div className='admin-option'>
              <div className='admin-option5 ms-5' onClick={logout}>
                <p className='option-p mt-3'>
                  <BiLogOut style={{fontSize: '25'}} className='me-3'/>LOGOUT
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center align-items-center main-form-div' /*style={{width:'100%'}}*/>
        <div className='table-responsive mx-auto my-auto' style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'auto'}}>
  <table className='admin_product_table3'>
    <thead>
        <tr className='verifierproduct_tr'>
          <th className='verifierproduct_th'>User Id</th>
          <th className='verifierproduct_th'>User Name</th>
          <th className='verifierproduct_th'>Email iD</th>
          <th className='verifierproduct_th'>Trade Type</th>
          <th className='verifierproduct_th'>Status</th>
          <th className='verifierproduct_th'></th>
          
        </tr>
      </thead>
      <tbody>
      {verifier.map((user) => (
            <tr key={user._id} className='verifier_table_tr'>
          
              <td className='verifierproduct_td'>{user._id}</td>
              <td className='verifierproduct_td'>{user.name}</td>
              <td className='verifierproduct_td'>{user.email}</td>
              <td className='verifierproduct_td'>{user.trade}</td>
              <td className='verifierproduct_td'>{user.status}</td>
             <td className='verifierproduct_td'>
                <button className="button-126" role="button" onClick={() => deleteVerifier(user._id)}>REMOVE</button>
      </td>
            </tr>
          ))}

      </tbody>
    </table>

        </div>
    </div>
    <ToastContainer />
  </div>
)
}

export default ManageSellers