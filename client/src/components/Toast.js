import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => <ToastContainer />;

export const showToast = (message, type = 'success') => {
  toast[type](message, { position: 'top-right', autoClose: 3000 });
};

export default Toast;