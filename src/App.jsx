import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { ME } from './graphql/query'
import Login from './pages/login/Login';
import EmailVerification from './pages/emailVerification/EmailVerification';
import PassReset from './pages/passReset/PassReset';
import NotFound from './pages/notFound/Index';
import Layout from './pages/dashboard/Layout';
import Dashboard from './pages/dashboard/dashboard/Dashboard';
import FoodItem from './pages/dashboard/foodMenu/Index';
import FoodDetails from './pages/dashboard/foodMenu/FoodDetails';
import Orders from './pages/dashboard/orders/Index';
import OrderDetails from './pages/dashboard/orders/OrderDetails';
import PaymentsHistory from './pages/dashboard/paymentsHistory/Index';
import SalesDetails from './pages/dashboard/paymentsHistory/SalesDetails';
import Invoice from './pages/dashboard/invoice/Index';
import InvoiceDetails from './pages/dashboard/invoice/InvoiceDetails';
import Setting from './pages/setting/Setting';
import WithdrawReq from './pages/dashboard/withdraw-req/Index';
import Notifications from './pages/dashboard/notification/Notifications';
import SalesHistory from './pages/dashboard/salesHistory/Index';

function App() {

  const [token, setToken] = useState(localStorage.getItem('token'));
  const { data: user } = useQuery(ME, {
    skip: !token
  });

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  return (
    <div>
      <Routes>
        <Route path='/' element={token ? <Navigate to='/dashboard' /> : <Login />} />
        <Route path='/email-verification/:token?' element={<EmailVerification />} />
        <Route path='/password-reset/:token?' element={<PassReset />} />
        <Route element={token ? <Layout /> : <Navigate to='/login' />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboard/notifications' element={<Notifications />} />
          <Route path='/dashboard/food-item' element={<FoodItem />} />
          <Route path='/dashboard/:path/food-details/:id' element={<FoodDetails />} />
          <Route path='/dashboard/orders' element={<Orders />} />
          <Route path='/dashboard/orders/details/:id' element={<OrderDetails />} />
          <Route path='/dashboard/sales-history' element={<SalesHistory />} />
          <Route path='/dashboard/withdraw-req' element={<WithdrawReq />} />
          <Route path='/dashboard/payments-history' element={<PaymentsHistory />} />
          <Route path='/dashboard/payments-history/details/:id' element={<SalesDetails />} />
          <Route path='/dashboard/invoice' element={<Invoice />} />
          <Route path='/dashboard/invoice/details/:id' element={<InvoiceDetails />} />
          <Route path='/dashboard/settings' element={<Setting />} />
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
