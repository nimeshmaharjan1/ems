import { Category } from '@prisma/client';
import axios from 'axios';

export const addCategory = async (data: Category) => {
  const response = await axios.post('/api/admin/categories', data);
  return response.data;
};

export const updateCategory = async (data: Category) => {
  const response = await axios.put('/api/admin/categories', data);
  return response.data;
};

export const getCategories = async () => {
  const response = await axios.get('/api/admin/categories');
  return response.data?.categories;
};
