import { Toast, showToast } from '../../../../shared/utils/toast.util';
import { Company, Category } from '@prisma/client';
import axios from 'axios';
import { useMutation } from 'react-query';

export const addCategory = async (data: Company) => {
  try {
    const response = await axios.post('/api/admin/categories', data);
    return response.data;
  } catch (error) {
    showToast(Toast.error, 'Something went wrong while adding the company');
  }
};

export const updateCategory = async (data: Company) => {
  try {
    const response = await axios.put(`/api/admin/categories/${data.id}`, data);
    return response.data;
  } catch (error) {
    showToast(Toast.error, 'Something went wrong while updating company');
  }
};

export const getCategories = async (params: { page: number; limit: number }) => {
  try {
    const response = await axios.get(`/api/admin/categories?page=${params.page}&limit=${params.limit}`);
    return response.data;
  } catch (error) {
    console.error(error);
    showToast(Toast.error, 'Something went wrong while getting companies');
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await axios.delete(`/api/admin/categories/${id}`);
    return response.data;
  } catch (error) {
    showToast(Toast.error, 'Something went wrong while deleting company');
  }
};

export const getCategory = async (id: string) => {
  try {
    const response = await axios.get(`/api/admin/categories/${id}`);
    return response.data;
  } catch (error) {
    showToast(Toast.error, 'Something went wrong while getting company');
  }
};
