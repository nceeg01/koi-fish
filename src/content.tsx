import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'motion/react';
import { Koi } from './Koi.tsx';
import quotes from './quotes.json';

const KoiZenContent = () => {
  const [active, setActive] = useState(false);
  const [quote, setQuote] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: -200, y: 100 });
  const [color, setColor] = useState('#D94126');

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.action === 'spawn') {
        startKoiJourney();
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    
    // For demo purposes, we can also trigger it based on a custom event
    window.addEventListener('koi-zen-spawn', startKoiJourney);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
      window.removeEventListener('koi-zen-spawn', startKoiJourney);
    };
  }, []);

  const startKoiJourney = () => {
    if (active) return;
    
    // Load color from storage
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['koiColor'], (result) => {
        if (result.koiColor) setColor(result.koiColor);
        proceedWithSpawn();
      });
    } else {
      proceedWithSpawn();
    }
  };

  const proceedWithSpawn = () => {
    setActive(true);
    setQuote(null);
    const startY = Math.random() * (window.innerHeight - 200) + 100;
    setPosition({ x: -200, y: startY });

    // Fade out after 30 seconds
    setTimeout(() => {
      setActive(false);
    }, 30000);
  };

  const handleKoiClick = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote.text);
    // Hide quote after 8 seconds
    setTimeout(() => setQuote(null), 8000);
  };

  if (!active) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 2147483647,
    }}>
      <motion.div
        initial={{ x: -250, y: position.y, rotate: 0, opacity: 0 }}
        animate={{ 
          x: [ -250, window.innerWidth + 250 ],
          y: [ 
            position.y, 
            position.y + 60, 
            position.y - 60, 
            position.y + 40, 
            position.y - 20, 
            position.y 
          ],
          rotate: [ 0, 10, -10, 8, -5, 0 ],
          opacity: [0, 1, 1, 1, 1, 0]
        }}
        transition={{ 
          x: { duration: 35, ease: "linear" },
          y: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 35, times: [0, 0.1, 0.2, 0.8, 0.9, 1] }
        }}
        onUpdate={(latest: any) => {
          if (latest.x > window.innerWidth + 100) {
            setActive(false);
          }
        }}
        style={{
          position: 'absolute',
          pointerEvents: 'auto',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <AnimatePresence>
          {quote && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20, rotate: -2 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                background: 'white',
                padding: '24px 32px',
                borderRadius: '0 24px 0 24px',
                marginBottom: '16px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                width: '260px',
                fontSize: '18px',
                fontStyle: 'italic',
                lineHeight: '1.4',
                color: '#1A1A1B',
                fontFamily: '"Playfair Display", serif',
                textAlign: 'center',
                border: '1px solid rgba(0,0,0,0.05)',
                position: 'relative'
              }}
            >
              {quote}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '32px',
                height: '1px',
                background: '#D94126'
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        <div onClick={handleKoiClick}>
          <Koi size={100} color={color} />
        </div>
      </motion.div>
    </div>
  );
};

// Injection logic
const init = () => {
  const host = document.createElement('div');
  host.id = 'koi-zen-root-host';
  const shadow = host.attachShadow({ mode: 'open' });
  const rootElement = document.createElement('div');
  shadow.appendChild(rootElement);
  document.body.appendChild(host);

  const root = createRoot(rootElement);
  root.render(<KoiZenContent />);
};

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}
