import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Cloud({ x, y, size }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        width: size,
        height: size / 2,
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '50%',
        filter: 'blur(20px)'
      }}
      animate={{
        x: [x, x + 100, x],
        y: [y, y + 20, y]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      }}
    />
  );
}

function Lightning({ trigger }) {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(255,255,255,0.7)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </AnimatePresence>
  );
}

function BatSymbol({ x, y }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        width: 100,
        height: 100,
        background: 'white',
        clipPath: 'polygon(0% 50%, 25% 0%, 50% 50%, 75% 0%, 100% 50%, 75% 100%, 50% 50%, 25% 100%)'
      }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
}

export default function BatSignalScene() {
  const [mouse, setMouse] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });
  const [lightning, setLightning] = useState(false);

  const windSound = useRef(null);
  const thunderSound = useRef(null);

  useEffect(() => {
    const handleMouse = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);

    const interval = setInterval(() => {
      setLightning(true);
      thunderSound.current.currentTime = 0;
      thunderSound.current.play();
      setTimeout(() => setLightning(false), 200);
    }, 1000 + Math.random() * 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Autoplay policy: deve ser iniciado após interação do usuário
    const handleClick = () => {
      windSound.current.loop = true;
      windSound.current.play();
      document.removeEventListener('click', handleClick);
    };
    document.addEventListener('click', handleClick);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: 'black',
        overflow: 'hidden'
      }}
    >
      <audio
        ref={windSound}
        src="https://cdn.pixabay.com/download/audio/2022/02/14/audio_4da8681768.mp3?filename=strong-wind-blowing-ambient-120911.mp3"
      />
      <audio
        ref={thunderSound}
        src="https://cdn.pixabay.com/download/audio/2022/03/28/audio_2d82e77f82.mp3?filename=thunder-and-rain-109197.mp3"
      />

      <Cloud x={100} y={150} size={200} />
      <Cloud x={400} y={300} size={250} />
      <Cloud x={700} y={200} size={180} />

      <motion.div
        style={{
          position: 'absolute',
          left: '20%',
          bottom: '20%',
          width: 300,
          height: 300,
          background:
            'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 80%)'
        }}
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <BatSymbol x={mouse.x} y={mouse.y} />

      <Lightning trigger={lightning} />
    </div>
  );
}
