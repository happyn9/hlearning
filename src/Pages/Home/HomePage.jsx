import React, { useRef, useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext';
import Hero from '../../Components/Home/Hero'
import HowItWorks from '../../Components/HowItWorks';
import Tuition from '../../Components/Tuition';
import Technologies from '../../Components/Technologies';
import CoursesSection from '../../Components/CoursesSection';
import WhyChooseSection from '../../Components/WhyChooseSection';
import Premium from '../../Components/Premium';
import Footer from '../../Components/Footer';
import { DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import HomeSkeleton from '../../Components/HomeSkeleton';
import { motion, AnimatePresence } from "framer-motion";
import Usermodal from '../../Components/Home/Usermodal';
import CertificateSection from '../../Components/Certificatesection';
import VisaSection from '../../Components/VisaSection';
import VisaRenewalSection from '../../Components/VisaRenewalSection';
import ChatWidget from '../ChatWidget';


export default function HomePage() {
  const { user, loading } = useUser();
  const connected = Boolean(user);
  const navigate = useNavigate();
  const [usermodal, setUsermodal] = useState(false);

  const premiumRef = useRef(null);
  const watchRef = useRef(null)
  const [minDelayDone, setMinDelayDone] = useState(false);

  useEffect(() => {
    setMinDelayDone(false);
    const timer = setTimeout(() => setMinDelayDone(true), 3000);
    return () => clearTimeout(timer);
  }, [user]);

  if (loading || !minDelayDone) return <HomeSkeleton />;

  const handleGetStarted = () => {
    if (connected) {
      // Scroll smoothly vers la section Premium
      premiumRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/auth'); // Redirige si pas connecté
    }
  };

  const onWatch = () => {
    if (connected) {
      // Scroll smoothly vers la section Premium
      watchRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/auth'); // Redirige si pas connecté
    }
  };

  return (
    <main className='relative'>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#111",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />

      {usermodal &&
      <Usermodal  />
      }

      {/* Hero reçoit le handler pour Get Started */}
      <Hero onModalUser={()=>{setUsermodal(!usermodal)}} onGetStarted={handleGetStarted} onWatch={onWatch} />

      <div ref={watchRef} className="max-w-6xl mx-auto">
        <HowItWorks />
      </div>

      {/* Assistant IA — remplace l'ancien ChatBot */}
      <ChatWidget />

      <Tuition />

      {/* SECTION PREMIUM */}
      <div ref={premiumRef}>
        <Premium />
      </div>

      <CoursesSection />
      <CertificateSection onGetStarted={handleGetStarted} />
      <VisaSection />
      <WhyChooseSection />
      <Technologies />
      <Footer />
    </main>
  );
}