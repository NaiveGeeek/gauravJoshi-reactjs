import React, { useEffect, useRef, useState } from "react";
import {useNavigate} from'react-router-dom';
import Card from "../components/Card";
import { makeRequest } from "../utils/api";
import { Category, ChangeEvent, Product } from "../utils/types";

const ProductPage: React.FC = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [pageData,updatePageData] = useState({products:[],isError:false,currentCategory:''});
   const [categories,updateCategories] = useState([]);
   const allProducts = useRef([]);
   const navigate = useNavigate();
   const fetchProducts = ()=>{
      makeRequest({
         url:'/products',
         method:'get',
         options:{cb:({data={products:[]},isError=false})=>{
             const {products} = data;
             allProducts.current = products;
             updatePageData((prevState)=>({...prevState, products,isError}));
             setIsLoading(false);
         }}
      });
   };

   const handleChangeCategories = (event:ChangeEvent)=>{
     const {value} = event.target;
     if(value !== pageData.currentCategory){
     const updatedProductList = allProducts.current.filter((product:Product)=> product.category === value);
     updatePageData((prevState)=>({...prevState,products:updatedProductList,currentCategory:value}));
     }
   };
   
   const fetchCategories = ()=>{
      makeRequest({
         url:'/categories',
         method:'get',
         options:{cb:({data={categories:[]}})=>{
             const {categories} = data;
             updateCategories(categories);
         }}
      });
   }
   useEffect(()=>{
      setIsLoading(true);
      fetchCategories();
      fetchProducts();
   },[]);

   const redirect = ()=>{
      navigate('/create_product');
   }
   return isLoading ? <div className="fixed top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%]">
      <span className="text-base">Please Wait ...</span>
   </div> :
      <div className="mt-4">
         <div className="flex flex-1 justify-end">
            {/* <input className="shadow rounded placeholder-slate-400 focus:outline-none  p-1" /> */}
            <select className="bg-white shadow rounded focus:border-none focus:outline-none p-1 min-w-[200px] " value={pageData.currentCategory}  onChange={handleChangeCategories}>
              <option disabled value=''> -- Select Category-- </option>
              {categories.map((category:Category)=>{
               return <option key={category._id} value={category.name}>{category.name}</option>
              })}
            </select>
         </div>
         {pageData.products.length>0 && <div className="mt-16 mx-auto max-w-[90%] p-2 md:container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 ">
            { pageData.products.map((product:Product)=>{
              return <Card key={product._id} productId={product._id || ''} productName={product.name||''} price={product.price?.toFixed(2)||'' } image={product.avatar || ''}/>
            })}
         </div>}
         {pageData.products.length === 0 && pageData.currentCategory&&<div className="fixed top-[50%] left-[50%] translate-x-[-50%] traslate-y-[-50%] text-lg "> No result found try with another category !! </div>}
         {pageData.products.length === 0 && pageData.isError&&<div className="fixed top-[50%] left-[50%] translate-x-[-50%] traslate-y-[-50%] text-lg "> Unable To Fetch Data :( Try Reloding... </div>}
         <button title="Create Product" onClick={redirect}
          className="fixed z-90 bottom-10 lg:right-8 right-2 border-black w-[30px] h-[30px] rounded-full drop-shadow-lg flex justify-center items-center text-slate-800 text-4xl  hover:drop-shadow-2xl">
            ✚
         </button>
      </div>
};

export default ProductPage;