import { Toast, showToast } from './../../../shared/utils/toast.util';
import { Company, Category, Product } from '@prisma/client';
import axios from 'axios';
import { useMutation } from 'react-query';

export const addProduct = async (data: Product) => {
  try {
    const response = await axios.post('/api/admin/companies', data);
    return response.data;
  } catch (error) {
    showToast(Toast.error, 'Something went wrong while adding the company');
  }
};

export const updateProduct = async (data: Product) => {
  try {
    const response = await axios.put(`/api/admin/companies?id=${data.id}`, data);
    return response.data;
  } catch (error) {
    showToast(Toast.error, 'Something went wrong while updating company');
  }
};

export const getCompanies = async (params: { page: number; limit: number }) => {
  try {
    const response = await axios.get(`/api/admin/companies?page=${params.page}&limit=${params.limit}`);
    return response.data;
  } catch (error) {
    console.error(error);
    showToast(Toast.error, 'Something went wrong while getting companies');
  }
};

export const getProduct = async (id: string) => {
  try {
    const response = await axios.get(`/api/admin/products/${id}`);
    return response.data;
  } catch (error) {
    showToast(Toast.error, 'Something went wrong while getting the company.');
  }
};

export const deleteCompany = async (id: string) => {
  try {
    const response = await axios.delete(`/api/admin/companies?id=${id}`);
    return response.data;
  } catch (error) {
    showToast(Toast.error, 'Something went wrong while deleting company');
  }
};
