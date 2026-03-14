import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCurrentUser, logout } from '../redux/features/auth/authSlice';
import { 
  selectCartCount, 
  selectIsCartOpen, 
  setCartOpen 
} from '../redux/features/cart/cartSlice';
import { useCreateOrderMutation } from '../redux/features/order/orderApi';

import { FrontendNavbar } from '../components/frontend/Navbar';
import { FrontendFooter } from '../components/frontend/Footer';
import { CartDrawer } from '../components/frontend/CartDrawer';
import { FloatingCartButton } from '../components/frontend/FloatingCartButton';

export const FrontendLayout: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    
    const user = useSelector(useCurrentUser);
    const cartCount = useSelector(selectCartCount);
    
    const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle scroll to section if hash exists
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const scrollTarget = params.get('scroll');
        if (scrollTarget) {
            setTimeout(() => {
                const element = document.getElementById(scrollTarget);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems = ["Home", "About", "Menu", "Events", "Reservations", "Contact"];

    const scrollToSection = (id: string) => {
        setIsMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSetIsCartOpen = (open: boolean) => {
        dispatch(setCartOpen(open));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <FrontendNavbar
                isScrolled={isScrolled}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                user={user}
                handleLogout={handleLogout}
                navigate={navigate}
                scrollToSection={scrollToSection}
                navItems={navItems}
                setIsCartOpen={handleSetIsCartOpen}
                cartCount={cartCount}
            />

            <main>
                <Outlet />
            </main>

            <CartDrawer
                user={user}
                navigate={navigate}
                createOrder={createOrder}
                isOrdering={isOrdering}
            />

            <FloatingCartButton 
                onClick={() => handleSetIsCartOpen(true)} 
            />

            <FrontendFooter
                navItems={navItems}
                scrollToSection={scrollToSection}
                navigate={navigate}
            />
        </div>
    );
};
