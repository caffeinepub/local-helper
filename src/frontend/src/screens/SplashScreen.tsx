import { MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      data-ocid="splash.page"
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.35 0.15 170) 0%, oklch(0.45 0.18 175) 40%, oklch(0.38 0.2 160) 100%)",
      }}
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/assets/generated/splash-bg.dim_480x850.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Decorative circles */}
      <div
        className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full opacity-10"
        style={{ background: "oklch(0.85 0.1 170)" }}
      />
      <div
        className="absolute bottom-[-60px] left-[-60px] w-48 h-48 rounded-full opacity-10"
        style={{ background: "oklch(0.85 0.1 170)" }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Icon */}
        <motion.div
          className="mb-6 flex items-center justify-center w-20 h-20 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
          }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
        >
          <MapPin className="w-10 h-10 text-white" strokeWidth={1.5} />
        </motion.div>

        {/* App name */}
        <motion.h1
          className="font-display text-5xl font-bold text-white mb-3 tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          Local Helper
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-lg font-body"
          style={{ color: "rgba(255,255,255,0.75)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          Find what you need, instantly
        </motion.p>
      </motion.div>

      {/* Bottom loader */}
      <motion.div
        className="absolute bottom-16 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
