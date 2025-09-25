import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail } from 'lucide-react';

interface NewsletterSignupProps {
 onSubmit: (email: string) => void;
}

export function NewsletterSignup({ onSubmit }: NewsletterSignupProps) {
 const [email, setEmail] = useState('');
 const [isSubmitted, setIsSubmitted] = useState(false);

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (email) {
 onSubmit(email);
 setIsSubmitted(true);
 }
 };

 return (
 <section className="py-12 md:py-24 lg:py-32 bg-muted">
 <div className="container">
 <div className="flex flex-col items-center justify-center space-y-4 text-center">
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5 }}
 >
 <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Newsletter</div>
 </motion.div>
 <motion.h2
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:0.2 }}
 className="text-3xl font-bold tracking-tighter sm:text-5xl"
 >
 Stay Updated
 </motion.h2>
 <motion.p
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:0.4 }}
 className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
 >
 Subscribe to our newsletter for the latest updates, promotions, and exclusive offers.
 </motion.p>
 </div>
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5, delay:0.6 }}
 className="mt-8 max-w-md mx-auto"
 >
 {isSubmitted ? (
 <div className="text-center p-6 bg-background rounded-lg shadow-sm">
 <h3 className="text-xl font-bold mb-2">Thank You!</h3>
 <p className="text-muted-foreground">
 You've successfully subscribed to our newsletter.
 </p>
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="flex gap-2">
 <div className="relative flex-1">
 <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
 <Input
 type="email"
 placeholder="Your email address"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="pl-10 w-full"
 required
 />
 </div>
 <Button type="submit" className="whitespace-nowrap">
 Subscribe
 </Button>
 </form>
 )}
 </motion.div>
 </div>
 </section>
 );
}