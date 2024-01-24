import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti';

export default function ConfettiComponent() {
    const [confettiActive, setConfettiActive] = useState(true);
    const [confettiOpacity, setConfettiOpacity] = useState(1);
    const [confettiDimensions, setConfettiDimensions] = useState({
      width: 0,
      height: 0
    });

    useEffect(() => {
        const handleResize = () => {
          setConfettiDimensions({
            width: window.innerWidth,
            height: window.innerHeight
          });
        };
    
        setConfettiDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
    
      useEffect(() => {
        const fadeOutTimeout = setTimeout(() => {
          setConfettiOpacity(0);
          setTimeout(() => {
            setConfettiActive(false);
          }, 1000);
        }, 3000);
    
        return () => {
          clearTimeout(fadeOutTimeout);
        };
      }, []);
  return (
    <>
        {confettiActive && (
        <Confetti
          width={confettiDimensions.width}
          height={confettiDimensions.height}
          style={{ opacity: confettiOpacity, transition: 'opacity 1s ease-out' }}
        />
      )}
    </>
  )
}
