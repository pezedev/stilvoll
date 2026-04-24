import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import LoginGate from "@/components/LoginGate";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import MenuGrid from "@/components/MenuGrid";
import DrinksSection from "@/components/DrinksSection";
import ChefsSection from "@/components/ChefsSection";
import ExperiencesSection from "@/components/ExperiencesSection";
import ReservationSection from "@/components/ReservationSection";
import ReviewsSection from "@/components/ReviewsSection";
import DeliveryModal from "@/components/DeliveryModal";
import ContactSection from "@/components/ContactSection";
import SiteFooter from "@/components/SiteFooter";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isLoggedIn, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [preselectedUnit, setPreselectedUnit] = useState("");
  const [pendingAction, setPendingAction] = useState<"delivery" | "reservation" | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleReserveUnit = (unitId: string) => {
    setPreselectedUnit(unitId);
    setTimeout(() => {
      document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDeliveryOpen = () => {
    if (isGuest && !isLoggedIn) {
      setPendingAction("delivery");
      setShowLoginPopup(true);
      return;
    }
    setDeliveryOpen(true);
  };

  const requireAuth = (action: "delivery" | "reservation"): boolean => {
    if (isLoggedIn) return true;
    if (isGuest) {
      setPendingAction(action);
      setShowLoginPopup(true);
      return false;
    }
    return true;
  };

  const handleLoginFromPopup = () => {
    login();
    setIsGuest(false);
    setShowLoginPopup(false);
    if (pendingAction === "delivery") {
      setTimeout(() => setDeliveryOpen(true), 200);
    }
    setPendingAction(null);
  };

  const handleGuest = () => {
    setIsGuest(true);
  };

  const hasAccess = isLoggedIn || isGuest;

  if (loading) return <LoadingScreen isVisible={true} />;
  if (!hasAccess) return <LoginGate onLogin={() => login()} onGuest={handleGuest} />;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader onDelivery={handleDeliveryOpen} />
      <HeroSection />
      <MenuGrid />
      <DrinksSection />
      <ChefsSection />
      <ExperiencesSection onReserveUnit={handleReserveUnit} />
      <ReservationSection preselectedUnit={preselectedUnit} requireAuth={() => requireAuth("reservation")} />
      <ReviewsSection />
      <ContactSection />
      <SiteFooter />
      <DeliveryModal isOpen={deliveryOpen} onClose={() => setDeliveryOpen(false)} />
      <AnimatePresence>
        {showLoginPopup && (
          <LoginGate isPopup onLogin={handleLoginFromPopup} onGuest={() => {}} onClose={() => { setShowLoginPopup(false); setPendingAction(null); }} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
