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
