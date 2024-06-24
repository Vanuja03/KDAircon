import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './H.css';
import { FaShoppingCart } from 'react-icons/fa';
import Axios from 'axios';
import kdlogo from '../images2/kdhomelg.png';
import { Popover, Typography } from '@mui/material';
import Profiles from '../pages/Profile';
import Login from '../pages/googlelogin';

const Header = () => {

    const user = JSON.parse(localStorage.getItem('user'));
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [booking, setBooking] = useState([]);
    const userMail = user ? user.email : null;

    const Profile = () => {
        navigate('/profile');
    }

    useEffect(() => {
        if (userMail) {
            getBooking(userMail);
        }
    }, [userMail]);

    const getBooking = (userMail) => {
        Axios.get(`http://localhost:4000/api/Booking/${userMail}`)
            .then(response => {
                console.log('Data from server: ', response.data);
                setBooking(response.data);
            })
            .catch(error => {
                console.error("Axios error: ", error);
            });
    };

    const bsize = booking.length;

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    if (user) {
        return (
            <>
                <nav className="navbar navbar-expand-lg ">
                    <div className="container-fluid">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <Link to="/" className="navbar-brand" ><img src={kdlogo} height={50} width={200} /></Link>
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li className='nav-item'>
                                    <NavLink to='/' className='nav-link'>Home</NavLink>
                                </li>
                                <li className="nav-item dropdown" onMouseEnter={() => document.getElementById("navbarDropdown").click()}>
                                    <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"

                                    >
                                        Products
                                    </a>
                                    <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
                                        <li><NavLink to='/addToCart' className='dropdown-item'>View Products</NavLink></li>
                                        <li><NavLink to='/repair' className='dropdown-item'>Repairs</NavLink></li>
                                    </ul>
                                </li>
                                <li className='nav-item'>
                                    <button onClick={() => navigate('/cart')} className='nav-link shpcart'><FaShoppingCart /> ({bsize})</button>
                                </li>
                                <li className='nav-item'>
                                    <NavLink to='/addproduct' className='nav-link'>Admin</NavLink>
                                </li>
                                <li className='nav-item '>
                                    <Button className='btnlname' onClick={handleProfileClick}>Hi {user.displayName} !</Button>
                                    {user && (<img onClick={handleProfileClick} className='logimg' src={user.photoURL} alt='Userphoto' width={50} height={50} />)}
                                </li>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    className='poppover'
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <Profiles />
                                </Popover>
                            </ul>
                        </div>
                    </div>
                </nav>
            </>
        )
    } else {
        return (
            <>
                <nav className="navbar navbar-expand-lg ">
                    <div className="container-fluid">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <Link to="/" className="navbar-brand" >KD Aircon</Link>
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li className='nav-item'>
                                    <NavLink to='/' className='nav-link'>Home</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink to='/addToCart' className='nav-link'>Products</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink to='/addproduct' className='nav-link'>Admin</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <Button className='btnlog' onClick={handleProfileClick} >Login</Button>
                                </li>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    className='poppover'
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <Login />
                                </Popover>
                            </ul>
                        </div>
                    </div>
                </nav>
            </>
        )
    }
}

export default Header;
