import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
 id: string;
 type: 'success' | 'error' | 'warning' | 'info';
 title: string;
 description?: string;
 duration?: number;
 onDismiss: (id: string) => void;
}

export function Toast({
 id,
 type,
 title,
 description,
 duration =5000,
 onDismiss
}: ToastProps) {
 useEffect(() => {
 const timer = setTimeout(() => {
 onDismiss(id);
 }, duration);

 return () => clearTimeout(timer);
 }, [id, duration, onDismiss]);

 const getIcon = () => {
 switch (type) {
 case 'success':
 return <CheckCircle2 className="h-5 w-5 text-green-500" />;
 case 'error':
 return <AlertCircle className="h-5 w-5 text-red-500" />;
 case 'warning':
 return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
 case 'info':
 return <Info className="h-5 w-5 text-blue-500" />;
 default:
 return null;
 }
 };

 const getBackgroundColor = () => {
 switch (type) {
 case 'success':
 return 'bg-green-50';
 case 'error':
 return 'bg-red-50';
 case 'warning':
 return 'bg-yellow-50';
 case 'info':
 return 'bg-blue-50';
 default:
 return 'bg-white';
 }
 };

 const getBorderColor = () => {
 switch (type) {
 case 'success':
 return 'border-green-200';
 case 'error':
 return 'border-red-200';
 case 'warning':
 return 'border-yellow-200';
 case 'info':
 return 'border-blue-200';
 default:
 return 'border-gray-200';
 }
 };

 const getTextColor = () => {
 switch (type) {
 case 'success':
 return 'text-green-800';
 case 'error':
 return 'text-red-800';
 case 'warning':
 return 'text-yellow-800';
 case 'info':
 return 'text-blue-800';
 default:
 return 'text-gray-800';
 }
 };

 return (
 <motion.div
 initial={{ opacity:0, y:50, scale:0.3 }}
 animate={{ opacity:1, y:0, scale:1 }}
 exit={{ opacity:0, scale:0.5, transition: { duration:0.2 } }}
 layout
 className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg ${getBackgroundColor()} border ${getBorderColor()} shadow-lg`}
 >
 <div className="p-4">
 <div className="flex items-start">
 <div className="flex-shrink-0 pt-0.5">
 {getIcon()}
 </div>
 <div className="ml-3 flex-1">
 <p className={`text-sm font-medium ${getTextColor()}`}>{title}</p>
 {description && (
 <p className={`mt-1 text-sm ${getTextColor()}`}>{description}</p>
 )}
 </div>
 <div className="ml-4 flex flex-shrink-0">
 <button
 onClick={() => onDismiss(id)}
 className={`inline-flex rounded-md ${getTextColor()} hover:${getTextColor()}/80 focus:outline-none focus:ring-2 focus:ring-offset-2`}
 >
 <span className="sr-only">Close</span>
 <svg
 className="h-5 w-5"
 viewBox="002020"
 fill="currentColor"
 aria-hidden="true"
 >
 <path
 fillRule="evenodd"
 d="M4.2934.293a110011.4140L108.586l4.293-4.293a110111.4141.414L11.41410l4.2934.293a11001-1.4141.414L1011.414l-4.2934.293a11001-1.414-1.414L8.586104.2935.707a110010-1.414z"
 clipRule="evenodd"
 />
 </svg>
 </button>
 </div>
 </div>
 </div>
 </motion.div>
 );
}