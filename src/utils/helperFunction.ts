import { FormStateObject, validationFunction } from "./types";
const numberRegexForPrice = /^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/;

export const validateForm = ({productName, price,category,description,imageUrl}:FormStateObject):validationFunction =>{
const errors:FormStateObject={productName:'',price:'',category:'',description:'', imageUrl:''};
let isValid = true;
if(!productName.trim()){
  errors.productName='Please enter Product name !!';
  isValid=false;
}
if(!price.trim()){
    errors.price='Please enter Price !!';
    isValid=false;
}else{
    const isPriceValid = numberRegexForPrice.test(price);
    errors.price = isPriceValid?'':'Please enter valid price !!';
    isValid=isValid?isPriceValid:isValid;
}
if(!category.trim()){
    errors.category='Please select category !!';
    isValid=false;
}
if(!description.trim()){
    errors.description='Please enter Description !!';
    isValid=false;
}
if(!imageUrl.trim()){
    errors.imageUrl='Please enter Image URL !!';
    isValid=false;
}else{
    const isValidUrl = (url:string):boolean=> {
        try { 
            return Boolean(new URL(url)); 
        }
        catch(e){ 
            return false; 
        }
    }
    const validlink = isValidUrl(imageUrl);
    errors.imageUrl = validlink?'':'Please enter valid Image Url !!';
    isValid=isValid?validlink:isValid;
}
return {errors,isValid};
}