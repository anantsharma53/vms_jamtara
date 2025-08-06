import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './components/Login/Login';
import Sign from './components/SignUp/Sign';
import SessionExpired from './components/SessionExpired/SessionExpired';
import Admindasboard from './components/AdminDashboard/AdminDasboard';
import VleLayout from './components/VleDashboard/VleDashboard';
import HomeNew from './components/HomeNew/HomeNew';
import ComplaintReceipt from './components/ComplaintReceipt/ComplaintReceipt';
import ComplaintDetails from './components/ComplainDetail/ComplaintDetails';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ComplaintHistory from './components/ComplaintHistory/ComplaintHistory';

function App() {
  return (

    <BrowserRouter>

      <Routes>
        <Route path='/' element={<HomeNew />} />
        <Route path='/register' element={<Sign />} />
        <Route path='/reception' element={<Login />} />
        <Route path='/officer' element={<Login />} />
        <Route path='/public' element={<Login/>}/>        
        <Route path='/reception-dashboard' element={<VleLayout />} />
        <Route path='/public-dashboard' element={<VleLayout />} />
        <Route path='/admindasboard' element={<Admindasboard/>}/>
        <Route path='/sessionexpires' element={<SessionExpired/>}/>  
        <Route path='/complaintreceipt' element={<ComplaintReceipt/>}/>
        <Route path="/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/complaints/:id/history" element={<ComplaintHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
