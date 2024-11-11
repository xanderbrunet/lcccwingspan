import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ChristmasTree from "@components/icons";
import { siteTheme } from "@/app/siteTheme";

export const LoadingAnimation: React.FC = () => {
  const [isChristmasTheme, setIsChristmasTheme] = useState(false);

  useEffect(() => {
    siteTheme().then(settings => setIsChristmasTheme(settings.setIsChristmas === true));
  }, []);

  return (
    <div className="flex items-center justify-center fixed top-0 left-0 w-screen h-screen bg-background z-30">
      {/* Wrapper for text and snowfall effect */}
      <div className="relative flex items-center justify-center loading02 space-x-4">
        {isChristmasTheme && (
          <motion.div
            initial={{ opacity: 0, x: 0 }} // Start off-screen slightly to the left
            animate={{ opacity: 1, x: 0 }}    // Fade in and slide into position
            transition={{ duration: 1 }}       // Adjust duration as needed for smoothness
          >
            <ChristmasTree width={60} height={65} />
          </motion.div>
        )}
        {/* Animated text overlay */}
        <section>
          <motion.div
            className="loading02 cormorant-med text-5xl flex space-x-1"
            initial={{ x: isChristmasTheme ? 20 : 0 }} // Shift text based on Christmas tree presence
            animate={{ x: 0 }}
            transition={{ duration: 1 }}
          >
            {["T", "h", "e", " ", "W", "i", "n", "g", "s", "p", "a", "n"].map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
};
