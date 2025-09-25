import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface InfoAlertProps {
 message: string;
 onDismiss?: () => void;
}

export function InfoAlert({ message, onDismiss }: InfoAlertProps) {
 return (
 <motion.div
 initial={{ opacity:0, y: -20 }}
 animate={{ opacity:1, y:0 }}
 exit={{ opacity:0, y:0 }}
 className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 flex items-start gap-4"
 >
 <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
 <div className="flex-1">
 <p className="text-sm font-medium">{message}</p>
 </div>
 {onDismiss && (
 <button
 onClick={onDismiss}
 className="ml-4 text-blue-800 hover:text-blue-600"
 >
 <span className="sr-only">Dismiss</span>
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
 )}
 </motion.div>
 );
}