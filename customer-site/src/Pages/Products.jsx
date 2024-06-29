import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import ProductsView from '../Components/ProductsView/ProductsView';
import { useSearchParams } from 'react-router-dom';

const ProductLists = () => {
  const [searchParams] = useSearchParams();
  const minprice = searchParams.get("minprice");
  const maxprice = searchParams.get("maxprice");
  const category = searchParams.get("category");
  return (
    <>
      <Header />
      <main>
        {<ProductsView minprice={minprice} maxprice={maxprice} category={category}/>}
      </main>
      <Footer />
    </>
  )
}

export default ProductLists;