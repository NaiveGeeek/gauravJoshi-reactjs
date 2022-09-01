import CreateProduct from "../pages/CreateProduct";
import DetailsPage from "../pages/DetailsPage";
import ProductPage from "../pages/ProductPage";

const routes = [{
    path:'',
    isIndex:true,
    Component: ProductPage,
    id:1,
},{
    path:'detail_page/:productId',
    Component: DetailsPage,
    id:2,
},{
    path:'create_product',
    isIndex:false,
    Component: CreateProduct,
    id:3,
}];

export default routes;