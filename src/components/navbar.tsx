'use client'

import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/context/cart";
import Link from "next/link";

export default function Navbar(){
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { items } = useCart();
    const router = useRouter();
    const pathname = usePathname();
    
    const navItems = [
        {name: 'Home', href: '/'},
        {name: 'Shop', href: '/shop'},
        // {name: 'Collections', href: '/shop?view=collections'},
        {name: 'About', href: '/#about'},
    ];

    // Handle scroll for navbar background
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        
        // For hash links, scroll to element
        if (href.startsWith('#') || href.includes('/#')) {
            const hash = href.includes('/#') ? href.split('/#')[1] : href.substring(1);
            const element = document.querySelector(`#${hash}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // For regular links, navigate
            router.push(href);
        }
        setIsOpen(false);
    };

    const onGetStarted = () => router.push("/login");

    const isActive = (href: string) => {
        if (href === '/' && pathname === '/') return true;
        if (href !== '/' && pathname?.startsWith(href)) return true;
        return false;
    };

    return (
        <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed w-full top-0 z-50 bg-white shadow-sm transition-all duration-300"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 group">
                        <div className="flex items-center">
                            {/* <span className="font-sora font-extrabold text-2xl tracking-tight text-charcoal group-hover:text-gold-dark transition-colors duration-300">
                                Premium
                            </span> */}
                            <span className="font-sora font-extrabold text-2xl tracking-tight ml-1 text-gold-primary">
                                Luxury
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link 
                                key={item.name}
                                href={item.href}
                                className={`
                                    relative px-4 py-2 font-sora font-medium text-sm tracking-wide
                                    transition-all duration-300 group
                                    ${isActive(item.href) 
                                        ? 'text-gold-primary' 
                                        : 'text-gray-900 hover:text-gold-primary'
                                    }
                                `}
                                onClick={(e) => handleNavClick(e, item.href)}
                            >
                                {item.name}
                                {/* Active underline */}
                                <motion.span
                                    className={`absolute bottom-0 left-0 h-0.5 bg-gold-primary`}
                                    initial={{ width: isActive(item.href) ? '100%' : '0%' }}
                                    animate={{ width: isActive(item.href) ? '100%' : '0%' }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Cart Icon */}
                        <Link 
                            href="/cart" 
                            className="relative p-2 transition-all duration-300 group text-charcoal hover:text-gold-primary"
                        >
                            <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                            {items.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-sora font-semibold text-white bg-gold-primary rounded-full"
                                >
                                    {items.length}
                                </motion.span>
                            )}
                        </Link>

                        {/* Account Icon */}
                        <button
                            onClick={onGetStarted}
                            aria-label="Account"
                            className="p-2 transition-all duration-300 text-charcoal hover:text-gold-primary"
                        >
                            <User className="h-5 w-5" strokeWidth={1.5} />
                        </button>

                        {/* CTA Button */}
                        <Button 
                            onClick={() => router.push('/shop')}
                            className="bg-gold-primary hover:bg-gold-dark text-charcoal font-sora font-semibold text-sm px-6 py-2 rounded-none transition-all duration-300 hover:shadow-[0_0_20px_rgba(230,184,0,0.3)]"
                        >
                            Shop Now
                        </Button>
                    </div>

                   {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link 
                            href="/cart" 
                            className="relative p-2 transition-colors text-charcoal"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-sora font-bold text-white bg-gold-primary rounded-full">
                                    {items.length}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-none transition-colors text-charcoal hover:text-gold-primary"
                            aria-label="Toggle menu"
                            aria-expanded={String(isOpen)}
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="px-4 pt-4 pb-6 space-y-3 bg-white/95 backdrop-blur-md rounded-b-lg">
                                {navItems.map((item, idx) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={`
                                                block px-4 py-3 font-sora font-medium text-base
                                                transition-all duration-300 rounded-none
                                                ${isActive(item.href)
                                                    ? 'text-gold-primary bg-cream'
                                                    : 'text-charcoal hover:text-gold-primary hover:bg-cream'
                                                }
                                            `}
                                            onClick={(e) => handleNavClick(e, item.href)}
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                ))}
                                <div className="pt-4 space-y-3">
                                    <Button 
                                        onClick={onGetStarted}
                                        variant="outline"
                                        className="w-full border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-sora font-semibold rounded-none"
                                    >
                                        Sign In
                                    </Button>
                                    <Button 
                                        onClick={() => {
                                            router.push('/shop');
                                            setIsOpen(false);
                                        }}
                                        className="w-full bg-gold-primary hover:bg-gold-dark text-charcoal font-sora font-semibold rounded-none"
                                    >
                                        Shop Now
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
}