import axios from 'axios';
import { screen, waitFor } from '@testing-library/react';
import renderWithRouter from '../../../__testHelper__/testHelper';
import { BASE_URL, PRODUCTS } from '../../utils/testutils';
import DetailsPage from '../DetailsPage';
const data = { productId: 1 };
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => data,
}));

describe('Details Page', () => {
  it('should load page with data', async () => {
    const product = { data: { product: PRODUCTS[0] } };
    axios.mockImplementation(({ url }) => {
      switch (url) {
        case `${BASE_URL}/products/1`:
          return Promise.resolve(product);
        default:
          return Promise.reject(new Error('not found'));
      }
    });
    renderWithRouter(<DetailsPage />, { route: `detail_page/${1}` });
    expect(screen.getByText('Please Wait ...')).toBeVisible();
    await waitFor(() => {
      expect(screen.queryByText('Please Wait ...')).toBeNull();
    });
    expect(screen.getByText(PRODUCTS[0].name)).toBeVisible();
    expect(screen.getByText(`$ ${PRODUCTS[0].price}`)).toBeVisible();
    expect(screen.getByText(PRODUCTS[0].description)).toBeVisible();
    expect(screen.getByRole('img')).toHaveAttribute('src',PRODUCTS[0].avatar);
  });

  it('should show error message if api fails',async()=>{
    axios.mockImplementation(({ url }) => {
      switch (url) {
        case `${BASE_URL}/products/1`:
          return Promise.reject(new Error('invalid end point'));
        default:
          return Promise.reject(new Error('not found'));
      }
    });
    renderWithRouter(<DetailsPage />, { route: `detail_page/${1}` });
    expect(screen.getByText('Please Wait ...')).toBeVisible();
    await waitFor(() => {
      expect(screen.queryByText('Unable To Fetch Data :( Try Reloding...')).toBeVisible();
    });
  });
});
