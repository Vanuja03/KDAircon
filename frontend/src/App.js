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

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/addproduct' element={<AddProduct />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/addToCart' element={<AddToCart />} />
        <Route path='/updateP/:pid/:pname/:pdescription/:pprice/:pquantity/:image' element={<UpdateProduct />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/prefer' element={<PreferOrders />} />
        <Route path='/repair' element={<AddRepair />} />
        <Route path='/repairs' element={<Repairs />} />
        <Route path='/feedback' element={<Feedbacks />} />
        <Route path='/updateR/:_id/:cname/:billNo/:billDate/:pname/:description/:mobile' element={<UpdateRepair />} />
        {/* <Route path='/updaterep/:_id' element={<UpdateRepair />} /> */}
        <Route path='/addfeedback' element={<AddFeedback />} />
        <Route path='/admincheckout' element={<AdminCheckouts />} />
        <Route path='/adminpcheckout' element={<AdminPCheckouts />} />
        <Route path='/Checkouts' element={<Checkouts />} />
        <Route path='/PCheckouts' element={<Pcheckouts />} />
        <Route path='/adminRepairs' element={<AdminRepairs />} />
        <Route path='/news' element={<News />} />
      </Routes>
    </Router>
  );
}

export default App;
