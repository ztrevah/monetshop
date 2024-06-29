import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import About from './Pages/About.jsx';
import ForgotPassword from './Pages/ForgotPassword.jsx';
import Signup from './Pages/Signup.jsx';
import Products from './Pages/Products.jsx';
import "./App.css"
import Product from './Pages/Product.jsx';
import Cart from './Pages/Cart.jsx';
import Purchase from './Pages/Purchase.jsx';
import Orders from './Pages/Orders.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/products",
    element: <Products />
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />
  },
  {
    path: "/signup/step1",
    element: <Signup step={1} />
  },
  {
    path: "/signup",
    element: <Signup step={1} />
  },
  {
    path: "/signup/step2",
    element: <Signup step={2} />
  },
  {
    path: "/signup/step3",
    element: <Signup step={3} />
  },
  {
    path: "products/:productid",
    element: <Product />
  },
  {
    path: "/cart",
    element: <Cart />
  },
  {
    path: "/purchase",
    element: <Purchase />
  },
  {
    path: "/orders",
    element: <Orders />
  },
  {
    path: "/error",
    element: <h1>There is something wrong!</h1>
  }
])

function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
    
  );
}

export default App;
