import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCurrentUser } from '../../redux/features/auth/authSlice';
import { useGetAllMenuQuery } from '../../redux/features/menu/menuApi';
import { useCreateReservationMutation } from '../../redux/features/reservation/reservationApi';

import { MenuItem, Category } from '../../types/frontend';
import { addToCart, setCartOpen } from '../../redux/features/cart/cartSlice';

import { HeroSection } from '../../components/frontend/HeroSection';
import { AboutSection } from '../../components/frontend/AboutSection';
import { MenuPreviewSection } from '../../components/frontend/MenuPreviewSection';
import { ReservationSection } from '../../components/frontend/ReservationSection';
import { ContactSection } from '../../components/frontend/ContactSection';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#020617',
  color: '#fff',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export function RestaurantFrontend() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);

  const [activeCategory, setActiveCategory] = useState<Category>('All');

  // Reservation Form State
  const [reservation, setReservation] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    requests: ''
  });

  const { data: menuData, isLoading: isMenuLoading } = useGetAllMenuQuery(undefined);
  const [createReservation, { isLoading: isReserving }] = useCreateReservationMutation();

  const menuItems: MenuItem[] = menuData?.data || [];

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addToCart(item));
    dispatch(setCartOpen(true));
  };

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to make a reservation.',
        icon: 'info',
        confirmButtonColor: '#f97316',
        showCancelButton: true,
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        }
      });
      return;
    }

    try {
      await createReservation({
        ...reservation,
        email: user.email,
        guests: Number(reservation.guests)
      }).unwrap();
      Toast.fire({
        icon: 'success',
        title: 'Reservation submitted successfully!'
      });
      setReservation({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        requests: ''
      });
    } catch (err: any) {
      const getFriendlyMessage = (errorObj: any) => {
        const data = errorObj?.data;
        const formatError = (e: any) => {
          const field = e.path?.[e.path.length - 1] || '';
          if (field === 'phone') return 'Contact number must be 11 digits (e.g., 01XXXXXXXXX).';
          if (field === 'date') return 'Please select a valid date for your visit.';
          if (field === 'time') return 'Please select a preferred dining time.';
          return e.message?.replace(/Invalid string: must match pattern .*/, 'is not in the correct format.');
        };

        if (Array.isArray(data)) return data.map(formatError).join('\n');
        if (typeof data === 'string') {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) return parsed.map(formatError).join('\n');
          } catch { return data; }
        }
        return errorObj?.data?.message || errorObj?.message || 'Failed to submit reservation. Please try again.';
      };

      Swal.fire({
        title: 'Reservation Status',
        text: getFriendlyMessage(err),
        icon: 'info',
        confirmButtonColor: '#f97316',
        customClass: {
          popup: 'rounded-[2rem]',
          confirmButton: 'rounded-xl px-8 py-3 font-bold'
        }
      });
    }
  };

  const filteredItems =
    activeCategory === 'All' ?
      menuItems :
      menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="overflow-hidden">
      <HeroSection 
        navigate={navigate} 
        scrollToSection={(id) => {
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }} 
      />

      <div id="About">
        <AboutSection />
      </div>

      <div id="Menu">
        <MenuPreviewSection 
          isMenuLoading={isMenuLoading}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          filteredItems={filteredItems}
          addToCart={handleAddToCart}
        />
      </div>

      <div id="Reservations">
        <ReservationSection 
          reservation={reservation}
          setReservation={setReservation}
          handleReservationSubmit={handleReservationSubmit}
          isReserving={isReserving}
        />
      </div>

      <div id="Contact">
        <ContactSection />
      </div>
    </div>
  );
}