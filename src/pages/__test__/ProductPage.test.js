import axios from "axios";
import {screen, waitFor}  from '@testing-library/react'
import renderWithRouter from '../../../__testHelper__/testHelper';
import { BASE_URL, CATEGORIES, PRODUCTS } from "../../utils/testutils";
import ProductPage from '../ProductPage';

const mockNavigate = jest.fn();

jest.mock("axios");

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));


describe('Product Page', ()=>{
 it('should render in loading state and then should have Loaded page', async()=>{
   const productResponse = {data:{products:PRODUCTS}};
   const categoryResponse = {data:{categories:CATEGORIES}}
   axios.mockImplementation(({url}) => {
      switch (url) {
        case `${BASE_URL}/products`:
          return Promise.resolve(productResponse);
        case `${BASE_URL}/categories`:
          return Promise.resolve(categoryResponse);
        default:
          return Promise.reject(new Error('not found'));
      }
    });
    const {user} = renderWithRouter(<ProductPage/>);
    expect(screen.getByText('Please Wait ...')).toBeVisible();
    await  waitFor(()=>{expect(screen.getByText(PRODUCTS[0].name)).toBeVisible()}); 
    await user.click(screen.getByText('-- Select Category--'));
    for(let val of CATEGORIES){
      expect(screen.getByText(val.name)).toBeVisible();
    }
 });

 it('should be able to filter out on the basis of category', async()=>{
   const productResponse = {data:{products:PRODUCTS}};
   const categoryResponse = {data:{categories:CATEGORIES}}
   axios.mockImplementation(({url}) => {
      switch (url) {
        case `${BASE_URL}/products`:
          return Promise.resolve(productResponse);
        case `${BASE_URL}/categories`:
          return Promise.resolve(categoryResponse);
        default:
          return Promise.reject(new Error('not found'));
      }
    });
    const {user} = renderWithRouter(<ProductPage/>);
    await  waitFor(()=>{expect(screen.getByText(PRODUCTS[0].name)).toBeVisible()});
    user.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: CATEGORIES[0].name } ),
    )
    await waitFor(()=>{expect(screen.queryByText(PRODUCTS[0].name)).toBeNull()}); 
    user.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: CATEGORIES[2].name } ),
    )
    await waitFor(()=>{expect(screen.getByText('No result found try with another category !!')).toBeVisible()});
 });

it('should navigate to create product page', async()=>{
   const productResponse = {data:{products:PRODUCTS}};
   const categoryResponse = {data:{categories:CATEGORIES}}
   axios.mockImplementation(({url}) => {
      switch (url) {
        case `${BASE_URL}/products`:
          return Promise.resolve(productResponse);
        case `${BASE_URL}/categories`:
          return Promise.resolve(categoryResponse);
        default:
          return Promise.reject(new Error('not found'));
      }
    });
    const {user} = renderWithRouter(<ProductPage/>);
    await waitFor(()=>{expect(screen.getByRole('button')).toBeVisible()});
    await user.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/create_product');
});

it('should render error message', async()=>{
   const categoryResponse = {data:{categories:CATEGORIES}}
   axios.mockImplementation(({url}) => {
      switch (url) {
        case `${BASE_URL}/products`:
          return Promise.reject('something went wrong');
        case `${BASE_URL}/categories`:
          return Promise.resolve(categoryResponse);
        default:
          return Promise.reject(new Error('not found'));
      }
    });
   renderWithRouter(<ProductPage/>);
   await waitFor(()=>{expect(screen.getByText('Unable To Fetch Data :( Try Reloding...')).toBeVisible()});
})
});