import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeRequest } from '../utils/api';
import { Product } from '../utils/types';

const DetailsPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [pageData, updatePageData] = useState({ product: {}, isError: false });
    const params = useParams();
    const fetchProduct = useCallback(() => {
        const { productId = '' } = params;
        makeRequest({
            url: `/products/${productId}`,
            method: 'get',
            options: {
                cb: ({ data = { product: {} }, isError = false }) => {
                    updatePageData({ product: data.product, isError });
                    setIsLoading(false);
                }
            }
        });
    }, [params]);

    useEffect(() => {
        setIsLoading(true);
        fetchProduct();
    }, [fetchProduct])
    const productDetails: Product = pageData.product;
    return isLoading ? <div className="fixed top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%]">
        <span className="text-base">Please Wait ...</span>
    </div> :
        <div className='sm:container flex flex-col mt-6'>
            {!pageData.isError ? <>
                <div className=' flex flex-row gap-4'>
                    <div className='w-[150px] h-[200px] rounded-lg bg-white flex items-center justify-center'>
                        <img src={productDetails.avatar} alt={productDetails.name || ''} className="h-[130px] w-[130px] object-fill rounded-lg" />
                    </div>
                    <div className='flex-col flex'>
                        <h3 className='md:text-4xl text-2xl'>{productDetails.name || ''}</h3>
                        <p className='md:text-2xl text-base mt-auto'>$ {productDetails.price}</p>
                    </div>
                </div>
                <div className='w-[98%] p-[1px] bg-black mt-3 self-center' ></div>
                <div className='flex flex-col mt-3'>
                    <h3 className=' text-lg'>Description</h3>
                    <p className='mt-3 text-sm'>{productDetails.description}</p>
                </div></> :
                <div className="fixed top-[50%] left-[50%] translate-x-[-50%] traslate-y-[-50%] text-lg "> Unable To Fetch Data :( Try Reloding... </div>}

        </div>
}

export default DetailsPage;