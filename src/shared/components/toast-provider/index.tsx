import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

const ToastProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return <ToastContainer />;
};

export default ToastProvider;
