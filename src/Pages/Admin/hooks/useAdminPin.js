import { useState } from "react";

export default function useAdminPin() {

  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const openPin = () => setShowPin(true);

  const closePin = () => {
    setShowPin(false);
    setPin("");
  };

  return {
    showPin,
    pin,
    setPin,
    loading,
    setLoading,
    openPin,
    closePin
  };
}