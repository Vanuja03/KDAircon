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
        {/* <Route path='/updateR/:r_id/:billNo/:billDate/:pname/:description/:image/:mobile' element={<UpdateRepair />} />
        <Route path='/updaterep/:_id' element={<UpdateRepair />} /> */}
        <Route path='/addfeedback' element={<AddFeedback />} />
      </Routes>
    </Router>
  );
}

export default App;
