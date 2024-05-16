"use client";

import { motion } from "framer-motion";

export default function WeatherLoading() {
  return (
    <motion.div
      className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}
