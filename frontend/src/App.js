import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/googlelogin';
import Home from './pages/home';
import AddProduct from './pages/addProduct';
import Profile from './pages/Profile';
import UpdateProduct from './pages/updateProduct';
import AddToCart from './pages/addToCart';
import Cart from './pages/Cart';
import PreferOrders from './pages/PreferOrders';
import AddRepair from './pages/addRepair';
import Repairs from './pages/Repairs';
import UpdateRepair from './pages/updateRepair';
import AddFeedback from './pages/AddFeedback';
import Feedbacks from './pages/Feedbacks';
import AdminCheckouts from './pages/AdminCheckouts';
import Checkouts from './pages/Checkouts';
import AdminPCheckouts from './pages/AdminPCheckouts';
import Pcheckouts from './pages/Pcheckouts';
import AdminRepairs from './pages/AdminRepairs';
import News from './pages/News';
import { useEffect, useState } from 'react';
import Transtion from './pages/Transtion';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(user ? true : false);
  }, []);

  const user = JSON.parse(localStorage.getItem('user'));
  const userMail = user ? user.email : null;
  const admin = userMail === 'vinnathvanuja@gmail.com';
  return (
    <Router>
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/addToCart' element={<AddToCart />} />
        <Route path='/news' element={<News />} />

        {isLoggedIn && (
          <>
            <Route path='/feedback' element={<Feedbacks />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/prefer' element={<PreferOrders />} />
            <Route path='/repair' element={<AddRepair />} />
            <Route path='/repairs' element={<Repairs />} />
            <Route path='/updateR/:_id/:cname/:billNo/:billDate/:pname/:description/:mobile' element={<UpdateRepair />} />
            <Route path='/addfeedback' element={<AddFeedback />} />
            <Route path='/Checkouts' element={<Checkouts />} />
            <Route path='/PCheckouts' element={<Pcheckouts />} />
            <Route path='/profile' element={<Profile />} />
          </>
        )}

        {admin && (
          <>
            <Route path='/admincheckout' element={<AdminCheckouts />} />
            <Route path='/adminpcheckout' element={<AdminPCheckouts />} />
            <Route path='/addproduct' element={<AddProduct />} />
            <Route path='/adminRepairs' element={<AdminRepairs />} />
          </>
        )}

        <Route path='/trs' element={<Transtion />} />
      </Routes>
    </Router>
  );
}

export default App;
