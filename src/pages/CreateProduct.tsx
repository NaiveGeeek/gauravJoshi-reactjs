import React, { useState, useEffect } from "react";
import { makeRequest } from "../utils/api";
import { validateForm } from "../utils/helperFunction";
import { Category, ChangeEvent, FormStateObject } from "../utils/types";
const initialState = { productName: '', description: '', imageUrl: '', category: '', price: '' };
const CreateProduct: React.FC = () => {
    const [formState, updateFormState] = useState<FormStateObject>(initialState);
    const [errors, setErrors] = useState<FormStateObject>(initialState);
    const [loadState, updateLoadState] = useState({ isLoading: false, isSubmitting: false, showMessage: false, message: '', isError:false });
    const [categories, updateCategories] = useState([]);

    const handleChange = (event: ChangeEvent) => {
        const { value, name } = event.target;
        updateFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handlePost = () => {
        const product = formState;
        const payload = {
            name: product.productName,
            category: product.category,
            price: Number(product.price),
            description: product.description,
            avatar: product.imageUrl,
            developerEmail: process.env.REACT_APP_EMAIL,
        };
        makeRequest({
            url: '/products',
            method: 'post',
            options: {
                data: payload,
                cb: ({ isError = false }) => {
                    if (!isError) {
                        updateFormState(initialState);
                        setErrors(initialState);
                        updateLoadState((prevState) => ({ ...prevState, isSubmitting: false, showMessage: true, message: `Product Created Successfully :)` ,isError}));

                    } else {
                        updateLoadState((prevState) => ({ ...prevState, isSubmitting: false, showMessage: true, message: `Couldn't make it :( , Please try again`,isError }));

                    }
                    setTimeout(() => {
                        updateLoadState((prevState) => ({ ...prevState, showMessage: false, message: '' ,isError:false}));
                    }, 1000);
                }
            }
        })


    }

    const fetchCategories = () => {
        makeRequest({
            url: '/categories',
            method: 'get',
            options: {
                cb: ({ data = { categories: [] } }) => {
                    const { categories } = data;
                    updateCategories(categories);
                    updateLoadState((prevState) => ({ ...prevState, isLoading: false }));

                }
            }
        });
    }
    useEffect(() => {
        updateLoadState((prevState) => ({ ...prevState, isLoading: true }));
        fetchCategories();

    }, []);

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        const { errors, isValid } = validateForm(formState);
        if (isValid) {
            updateLoadState((prevState) => ({ ...prevState, isSubmitting: true }));
            handlePost();
        } else {
            setErrors(errors);
        }
    };
    return <>
        {loadState.isLoading ? <div className="fixed top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%]">
            <span className="text-base">Please Wait ...</span>
        </div> : <>
            {categories.length > 0 && (<div className="max-w-[500px] mx-auto p-1 mt-20">
                <h1 className="text-center text-2xl font-bold">Create Product</h1>
                <form className="w-full flex flex-col gap-2 mt-8" onSubmit={handleSubmit}  >
                    <div className="relative pb-5">
                        <input type="text" className="shadow rounded placeholder-slate-400 focus:outline-none  p-1 w-full" placeholder="Product name" name="productName" value={formState.productName} onChange={handleChange} />
                        <p className="text-red-600 text-sm absolute">{errors.productName}</p>
                    </div>
                    <div className="relative pb-5">
                        <textarea rows={4} className="shadow rounded placeholder-slate-400 focus:outline-none  p-1 w-full" placeholder="Description" name="description" value={formState.description} onChange={handleChange} />
                        <p className="text-red-600 text-sm absolute">{errors.description}</p>
                    </div>
                    <div className="relative pb-5">
                        <input type="text" className="shadow rounded placeholder-slate-400 focus:outline-none  p-1 w-full" placeholder="Image URL" name="imageUrl" value={formState.imageUrl} onChange={handleChange} />
                        <p className="text-red-600 text-sm absolute">{errors.imageUrl}</p>
                    </div>
                    <div className="relative pb-5">
                        <select className="bg-white shadow rounded focus:border-none focus:outline-none p-1 w-full" placeholder="Select Category" name="category" value={formState.category} onChange={handleChange}>
                            <option disabled value=''> -- Select Category-- </option>
                            {categories.map((category: Category) => {
                                return <option key={category._id} value={category.name}>{category.name}</option>
                            })}
                        </select>
                        <p className="text-red-600 text-sm absolute">{errors.category}</p>
                    </div>
                    <div className="relative pb-5">
                        <input type="number" className="shadow rounded placeholder-slate-400 focus:outline-none  p-1 w-full" placeholder="Price" name="price" value={formState.price} onChange={handleChange} />
                        <p className="text-red-600 text-sm absolute">{errors.price}</p>
                    </div>
                    <div className="relative pb-5">
                        <button type="submit" className="shadow w-full rounded placeholder-slate-400 focus:outline-none  p-1 bg-white disabled:bg-slate-200 hover:cursor-pointer disabled:text-slate-400 disabled:cursor-not-allowed" disabled={loadState.isSubmitting}>Submit</button>
                        <p className={`${loadState.isError?'text-red-600':'text-green-600'} text-sm absolute`}>{loadState.showMessage?loadState.message:''}</p>
                    </div>
                </form>
            </div>)}
            {categories.length === 0 && <div className="fixed top-[50%] left-[50%] translate-x-[-50%] traslate-y-[-50%] text-lg "> Unable To Fetch Data :( Try Reloding... </div>}
        </>
        }
    </>
}

export default CreateProduct;