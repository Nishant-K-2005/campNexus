"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const toastTypes = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
    iconColor: "text-green-400",
    textColor: "text-green-100"
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
    iconColor: "text-red-400",
    textColor: "text-red-100"
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
    iconColor: "text-yellow-400",
    textColor: "text-yellow-100"
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
    textColor: "text-blue-100"
  }
};

export default function Toast({ type = "info", message, onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const toastConfig = toastTypes[type];
  const Icon = toastConfig.icon;

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div
        className={`
          ${toastConfig.bgColor} ${toastConfig.borderColor}
          border rounded-lg shadow-lg backdrop-blur-sm p-4
          flex items-start space-x-3 min-w-[300px]
        `}
      >
        <Icon className={`w-5 h-5 ${toastConfig.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${toastConfig.textColor}`}>
            {message}
          </p>
        </div>
        <button
          onClick={handleClose}
          className={`
            ${toastConfig.textColor} hover:opacity-70
            transition-opacity duration-200
          `}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
