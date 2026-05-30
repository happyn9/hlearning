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
import { DollarSign, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import HomeSkeleton from '../../Components/HomeSkeleton';
import ChatBot from '../../Components/ChatBot';
import { motion, AnimatePresence } from "framer-motion";
import Usermodal from '../../Components/Home/Usermodal';


export default function HomePage() {
  const { user, loading } = useUser();
  const connected = Boolean(user);
  const navigate = useNavigate();
  const [chatbot,setChatbot] =useState(false);
  const [usermodal,setUsermodal] = useState(false);

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

      {!chatbot &&
      <div onClick={()=>setChatbot(true)} className="fixed bottom-6 cursor-pointer right-6 z-50 w-14 h-14 rounded-full
                   bg-linear-to-tr from-slate-600 to-slate-600
                   shadow-xl flex items-center justify-center text-white">
        <MessageSquare className="w-6 h-6" />
      </div>
      }

      {/* Hero reçoit le handler pour Get Started */}
      <Hero onModalUser={()=>{setUsermodal(!usermodal)}} onFeedback={()=>setChatbot(true)} onGetStarted={handleGetStarted} onWatch={onWatch} />

      <div ref={watchRef} className="max-w-6xl mx-auto">
        <HowItWorks />
      </div>

      {chatbot &&
      <ChatBot onClose={()=>setChatbot(false)} />
      }

      <Tuition />

      {/* SECTION PREMIUM */}
      <div ref={premiumRef}>
        <Premium />
      </div>

      <CoursesSection />
      <WhyChooseSection />
      <Technologies />
      <Footer />
    </main>
  );
}