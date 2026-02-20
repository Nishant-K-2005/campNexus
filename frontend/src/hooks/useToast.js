"use client";

import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, options = {}) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type,
      message,
      duration: options.duration || 5000,
      ...options
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, options) => {
    addToast('success', message, options);
  }, [addToast]);

  const error = useCallback((message, options) => {
    addToast('error', message, options);
  }, [addToast]);

  const warning = useCallback((message, options) => {
    addToast('warning', message, options);
  }, [addToast]);

  const info = useCallback((message, options) => {
    addToast('info', message, options);
  }, [addToast]);

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast
  };
}
