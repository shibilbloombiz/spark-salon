'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/layout/Footer';
import AppointmentRequestDialog, {
  AppointmentConfig,
  OpenAppointmentOptions,
} from '@/components/booking/AppointmentRequestDialog';

type BookingHandler = ((studio?: string) => void) | null;

interface SiteShellContextValue {
  openBooking: (studio?: string) => void;
  openAppointment: (opts?: OpenAppointmentOptions) => void;
  setAppointmentConfig: (config: AppointmentConfig | null) => void;
  setNavbarRevealed: (revealed: boolean) => void;
  registerBookingHandler: (handler: BookingHandler) => () => void;
}

const SiteShellContext = createContext<SiteShellContextValue>({
  openBooking: () => {},
  openAppointment: () => {},
  setAppointmentConfig: () => {},
  setNavbarRevealed: () => {},
  registerBookingHandler: () => () => {},
});

export function useSiteShell() {
  return useContext(SiteShellContext);
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const isAdminRoute = pathname.startsWith('/admin');

  const [navbarRevealed, setNavbarRevealed] = useState<boolean>(pathname !== '/');
  const [appointmentConfig, setAppointmentConfigState] = useState<AppointmentConfig | null>(null);
  const customBookingHandlerRef = useRef<BookingHandler>(null);
  const apptOpenFnRef = useRef<((opts?: OpenAppointmentOptions) => void) | null>(null);

  useEffect(() => {
    if (pathname !== '/') {
      setNavbarRevealed(true);
    }
  }, [pathname]);

  const setAppointmentConfig = useCallback((cfg: AppointmentConfig | null) => {
    setAppointmentConfigState(cfg);
  }, []);

  const registerApptOpenFn = useCallback((fn: (opts?: OpenAppointmentOptions) => void) => {
    apptOpenFnRef.current = fn;
    return () => {
      if (apptOpenFnRef.current === fn) {
        apptOpenFnRef.current = null;
      }
    };
  }, []);

  const registerBookingHandler = useCallback((handler: BookingHandler) => {
    customBookingHandlerRef.current = handler;
    return () => {
      if (customBookingHandlerRef.current === handler) {
        customBookingHandlerRef.current = null;
      }
    };
  }, []);

  const openAppointment = useCallback((opts?: OpenAppointmentOptions) => {
    apptOpenFnRef.current?.(opts);
  }, []);

  const openBooking = useCallback(
    (studio = 'hair') => {
      if (customBookingHandlerRef.current) {
        customBookingHandlerRef.current(studio);
        return;
      }
      apptOpenFnRef.current?.();
    },
    []
  );

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <SiteShellContext.Provider
      value={{
        openBooking,
        openAppointment,
        setAppointmentConfig,
        setNavbarRevealed,
        registerBookingHandler,
      }}
    >
      <Navbar
        onOpenBooking={() => openBooking('hair')}
        isRevealed={navbarRevealed}
      />

      {children}

      <Footer onOpenBooking={() => openBooking('hair')} />

      <AppointmentRequestDialog
        config={appointmentConfig}
        registerOpenFn={registerApptOpenFn}
      />
    </SiteShellContext.Provider>
  );
}

