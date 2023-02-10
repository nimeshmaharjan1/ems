import { Toast, showToast } from './../../../shared/utils/toast.util';
import { Category } from '@prisma/client';
import axios from 'axios';
import { useMutation } from 'react-query';

export const addCategory = async (data: Category) => {
  try {
    const response = await axios.post('/api/admin/categories', data);
    return response.data;
  } catch (error) {
    showToast(Toast.error, 'Something went wrong while adding the category');
  }
};

export const updateCategory = async (data: Category) => {
  try {
    const response = await axios.put(`/api/admin/categories?id=${data.id}`, data);
    return response.data;
  } catch (error) {
    showToast(Toast.error, 'Something went wrong while updating category');
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get('/api/admin/categories');
    return response.data;
  } catch (error) {
    showToast(Toast.error, 'Something went wrong while getting categories');
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await axios.delete(`/api/admin/categories?id=${id}`);
    return response.data;
  } catch (error) {
    showToast(Toast.error, 'Something went wrong while deleting category');
  }
};
