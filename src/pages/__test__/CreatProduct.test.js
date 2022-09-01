import axios from 'axios';
import { screen, waitFor } from '@testing-library/react';
import renderWithRouter from '../../../__testHelper__/testHelper';
import { BASE_URL, CATEGORIES } from '../../utils/testutils';
import CreateProduct from '../CreateProduct';
jest.mock('axios');
const formData = [
  {
    text: 'Product name',
    type: 'input',
    testCases: [
      { value: '', message: 'Please enter Product name !!' },
      { value: 'Alphabet', message: '' },
    ],
  },
  {
    text: 'Description',
    type: 'input',
    testCases: [
      { value: '', message: 'Please enter Description !!' },
      { value: 'test', message: '' },
    ],
  },
  {
    text: 'Image URL',
    type: 'input',
    testCases: [
      { value: '', message: 'Please enter Image URL !!' },
      { value: 'api', message: 'Please enter valid Image Url !!' },
      { value: 'https://m.media-amazon.com/images/I/61EXU8BuGZL._SX679_.jpg', message: '' },
    ],
  },
  {
    text: 'Select Category',
    type: 'selectbox',
    testCases: [
      { value: '', message: 'Please select category !!' },
      { value: 'Electronics', message: '' },
    ],
  },
  {
    text: 'Price',
    type: 'input',
    testCases: [
      { value: '', message: 'Please enter Price !!' },
      { value: '-1', message: 'Please enter valid price !!' },
    ],
  },
];

const correctFormData = [
  {
    text: 'Product name',
    type: 'input',
    value: 'Alphabet',
  },
  {
    text: 'Description',
    type: 'input',
    value: 'test',
  },
  {
    text: 'Image URL',
    type: 'input',
    value: 'https://m.media-amazon.com/images/I/61EXU8BuGZL._SX679_.jpg',
  },
  {
    text: 'Select Category',
    type: 'select',
    value: 'Electronics',
  },
  {
    text: 'Price',
    type: 'input',
    value: '1.5',
  },
];

describe('Create Product', () => {
  it('should render initially with loading text', async () => {
    const categoryResponse = { data: { categories: CATEGORIES } };
    axios.mockImplementation(({ url }) => {
      switch (url) {
        case `${BASE_URL}/categories`:
          return Promise.resolve(categoryResponse);
        default:
          return Promise.reject(new Error('not found'));
      }
    });
    renderWithRouter(<CreateProduct />, { route: '/create_product' });
    expect(screen.getByText('Please Wait ...')).toBeVisible();
    await waitFor(() => {
      expect(screen.queryByText('Please Wait ...')).toBeNull();
    });
  });

  it('should render proper message while validating form', async () => {
    const categoryResponse = { data: { categories: CATEGORIES } };
    axios.mockImplementation(({ url }) => {
      switch (url) {
        case `${BASE_URL}/categories`:
          return Promise.resolve(categoryResponse);
        default:
          return Promise.reject(new Error('not found'));
      }
    });
    const { user } = renderWithRouter(<CreateProduct />, { route: '/create_product' });
    await waitFor(() => {
      expect(screen.queryByText('Please Wait ...')).toBeNull();
    });
    for (let item of formData) {
      const { type, text, testCases } = item;
      for (let testCase of testCases) {
        const { value, message } = testCase;
        const submitButton = await screen.findByRole('button');
        const inputElement = await screen.findByPlaceholderText(text);
        if (value && type === 'input') {
          await user.clear(inputElement);
          await user.type(inputElement, value);
        } else if (value) {
          user.selectOptions(screen.getByRole('combobox'), screen.getByRole('option', { name: value }));
        }
        await user.click(submitButton);
        // eslint-disable-next-line testing-library/no-node-access
        const errorElement = inputElement.nextSibling;
        await waitFor(() => {
          expect(errorElement).toHaveTextContent(message);
        });
      }
    }
  });

  it('should post the form and get success msg', async () => {
    const categoryResponse = { data: { categories: CATEGORIES } };
    axios.mockImplementation(({ url }) => {
      switch (url) {
        case `${BASE_URL}/categories`:
          return Promise.resolve(categoryResponse);
        case `${BASE_URL}/products`:
          return Promise.resolve({ data: { success: true } });
        default:
          return Promise.reject(new Error('not found'));
      }
    });
    const { user } = renderWithRouter(<CreateProduct />, { route: '/create_product' });
    await waitFor(() => {
      expect(screen.queryByText('Please Wait ...')).toBeNull();
    });
    for (let item of correctFormData) {
      const { text, type, value } = item;
      const inputElement = await screen.findByPlaceholderText(text);
      if (value && type === 'input') {
        await user.clear(inputElement);
        await user.type(inputElement, value);
      } else if (value) {
        user.selectOptions(screen.getByRole('combobox'), screen.getByRole('option', { name: value }));
      }
    }
    const submitButton = await screen.findByRole('button');
    await user.click(submitButton);
    await expect(screen.getByText('Product Created Successfully :)')).toBeVisible();
    await waitFor(() => expect(screen.queryByText('Product Created Successfully :)')).toBeNull());
  });

  it('should render error messge when fail to post from', async () => {
    const categoryResponse = { data: { categories: CATEGORIES } };
    axios.mockImplementation(({ url }) => {
      switch (url) {
        case `${BASE_URL}/categories`:
          return Promise.resolve(categoryResponse);
        case `${BASE_URL}/products`:
          return Promise.reject(new Error('not found'));
        default:
          return Promise.reject(new Error('not found'));
      }
    });
    const { user } = renderWithRouter(<CreateProduct />, { route: '/create_product' });
    await waitFor(() => {
      expect(screen.queryByText('Please Wait ...')).toBeNull();
    });
    for (let item of correctFormData) {
      const { text, type, value } = item;
      const inputElement = await screen.findByPlaceholderText(text);
      if (value && type === 'input') {
        await user.clear(inputElement);
        await user.type(inputElement, value);
      } else if (value) {
        user.selectOptions(screen.getByRole('combobox'), screen.getByRole('option', { name: value }));
      }
    }
    const submitButton = await screen.findByRole('button');
    await user.click(submitButton);
    await expect(screen.getByText(`Couldn't make it :( , Please try again`)).toBeVisible();
    await waitFor(() => expect(screen.queryByText(`Couldn't make it :( , Please try again`)).toBeNull());
  });

  it('should render error message', async () => {
    axios.mockImplementation(({ url }) => {
      switch (url) {
        case `${BASE_URL}/categories`:
          return Promise.reject(new Error('not a valid end point'));
        default:
          return Promise.reject(new Error('not found'));
      }
    });
    renderWithRouter(<CreateProduct />, { route: '/create_product' });
    await waitFor(() => {
      expect(screen.getByText('Unable To Fetch Data :( Try Reloding...')).toBeVisible();
    });
  });
});
