import { Toast, showToast } from '@/shared/utils/toast.util';
import { ORDER_STATUS, PAYMENT_STATUS } from '@prisma/client';
import axios from 'axios';

export const changeOrderStatus = async (data: { paymentStatus: PAYMENT_STATUS; status: ORDER_STATUS; orderId: string }) => {
  const response = await axios.patch(`/api/admin/orders/change-status/${data.orderId}`, {
    paymentStatus: data.paymentStatus,
    status: data.status,
  });
  return response.data;
};

export const addPartialPayment = async (data: { orderId: string; partiallyPaidAmount: number }) => {
  const response = await axios.patch(`/api/admin/orders/partially-paid`, {
    orderId: data.orderId,
    partiallyPaidAmount: data.partiallyPaidAmount,
  });
  return response.data;
};

export const getUserOrders = async (params: { page: number; user_id: string }) => {
  try {
    const response = await axios.get(`/api/admin/orders?page=${params.page}&user_id=${params.user_id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    showToast(Toast.error, 'Something went wrong while getting the categories.');
  }
};

export const getOrderItems = async (params: { page: number; orderNumber: string }) => {
  const response = await axios.get(`/api/orders/items?page=${params.page}&orderNumber=${params.orderNumber}`);
  return response.data;
};
