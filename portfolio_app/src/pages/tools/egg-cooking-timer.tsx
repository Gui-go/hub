"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const eggStages = {
  soft: { label: "Soft-boiled (runny yolk)", time: 300 }, // 5 min
  medium: { label: "Medium-boiled (jammy yolk)", time: 450 }, // 7.5 min
  hard: { label: "Hard-boiled (fully set yolk)", time: 600 }, // 10 min
};

const EggTimerPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = (stage: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = eggStages[stage as keyof typeof eggStages].time;
    setTimeLeft(duration);
    setTotalTime(duration);
    setActiveStage(stage);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev > 1) return prev - 1;
        clearInterval(timerRef.current!);
        return 0;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Circle animation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress =
    timeLeft !== null && totalTime > 0
      ? circumference - (timeLeft / totalTime) * circumference
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="prose max-w-none mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              🥚 Egg Cooking Timer
            </h1>
            <p className="text-gray-600 mb-8">
              Choose your egg style and let the timer guide you to perfection.
            </p>

            {/* Stage Buttons */}
            <div className="flex justify-center gap-4 mb-10">
              {Object.entries(eggStages).map(([key, stage]) => (
                <button
                  key={key}
                  onClick={() => startTimer(key)}
                  className={`px-4 py-2 rounded-xl shadow-md font-medium transition ${
                    activeStage === key
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-100 hover:bg-yellow-200"
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>

            {/* Timer Circle */}
            <div className="flex flex-col items-center justify-center mb-10">
              <svg className="w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="none"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#facc15"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={progress}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: progress }}
                  transition={{ ease: "linear", duration: 0.5 }}
                />
              </svg>

              {/* Countdown */}
              <div className="text-2xl font-bold text-gray-800 mt-4">
                {timeLeft !== null
                  ? timeLeft > 0
                    ? formatTime(timeLeft)
                    : "✅ Egg is ready!"
                  : "--:--"}
              </div>
            </div>

            {/* Animated Congrats */}
            <AnimatePresence>
              {timeLeft === 0 && (
                <motion.div
                  className="text-green-600 text-xl font-semibold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  🎉 Enjoy your perfect egg!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EggTimerPage;
