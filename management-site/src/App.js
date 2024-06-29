import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from "./Pages/Login.jsx";
import Dashboard from './Pages/Dashboard.jsx';
import Products from './Pages/Products.jsx';
import ProductDetail from './Pages/ProductDetail.jsx';
import Orders from './Pages/Orders.jsx';
import OrderDetail from './Pages/OrderDetail.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/products",
    element: <Products />
  },
  {
    path: "/products/:productid",
    element: <ProductDetail />
  },
  {
    path: "/orders",
    element: <Orders />
  },
  {
    path: "/orders/:orderid",
    element: <OrderDetail />
  }
]);
function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
