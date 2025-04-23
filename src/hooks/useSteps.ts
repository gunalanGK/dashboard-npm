import { useState, useEffect } from "react";

export const useSteps = (totalSteps: number, stepDuration: number = 30000) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prevStep) => (prevStep < totalSteps - 1 ? prevStep + 1 : prevStep));
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, [totalSteps, stepDuration]);

  return { step };
};