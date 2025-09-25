import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
 size?: number;
 color?: string;
}

export function LoadingSpinner({ size =24, color = 'currentColor' }: LoadingSpinnerProps) {
 return (
 <motion.div
 animate={{ rotate:360 }}
 transition={{
 duration:1,
 repeat: Infinity,
 ease: 'linear'
 }}
 style={{ width: size, height: size }}
 >
 <svg
 viewBox="002424"
 fill="none"
 xmlns="http://www.w3.org/2000/svg"
 className="w-full h-full"
 >
 <path
 d="M122C6.47715226.47715212C217.52286.47715221222C17.5228222217.52282212C229.2745520.90976.8037519.14145"
 stroke={color}
 strokeWidth="2.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 className="stroke-current"
 />
 </svg>
 </motion.div>
 );
}