import { motion } from 'framer-motion';

export default function NightwingLogo({ size = 60, className = '', glow = true }) {
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: 'auto' }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <img
        src="/Nigtwing-logo.png"
        alt="Nightwing Logo"
        className="w-full h-auto object-contain drop-shadow-[0_0_12px_rgba(0,210,255,0.7)]"
      />
      {glow && (
        <div className="absolute inset-0 bg-blue-500/20 blur-xl -z-10 rounded-full pointer-events-none" />
      )}
    </motion.div>
  );
}
