import React, { useEffect, useState } from "react";
import { siteTheme } from "@/app/siteTheme";
import { motion } from "framer-motion";

const SnowfallEffect: React.FC = () => {
  const [isChristmasTheme, setIsChristmasTheme] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    siteTheme().then(settings => {
      setIsChristmasTheme(settings.setIsChristmas === true);
      setLoading(false); // Mark loading as complete
    });
  }, []);

  useEffect(() => {
    if (!isChristmasTheme || loading) return;

    const canvas = document.getElementById("snowfall-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set initial canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    type Snowflake = {
      x: number;
      y: number;
      radius: number;
      speed: number;
      drift: number;
      opacity: number;
    };

    const snowflakes: Snowflake[] = Array.from({ length: 30 }, createSnowflake);

    function createSnowflake(): Snowflake {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.01 + 0.1,
        drift: Math.random() * 0.3 - 0.15,
        opacity: Math.random() * 0.3 + 0.2,
      };
    }

    function updateSnowflakes() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      snowflakes.forEach((snowflake) => {
        ctx.beginPath();
        ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(115, 155, 208, ${snowflake.opacity})`;
        ctx.fill();
        ctx.closePath();

        snowflake.y += snowflake.speed;
        snowflake.x += snowflake.drift;

        if (snowflake.y > canvas.height) {
          snowflake.y = -snowflake.radius;
          snowflake.x = Math.random() * canvas.width;
        }
        if (snowflake.x > canvas.width || snowflake.x < 0) {
          snowflake.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(updateSnowflakes);
    }

    updateSnowflakes();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isChristmasTheme, loading]);

  if (loading) return null;
  if (!isChristmasTheme) {
    console.log("SnowfallEffect: Christmas theme is not enabled.");
    return null;
  }

  // Use motion.div for a smooth fade-in effect
  return (
    <motion.canvas
      id="snowfall-canvas"
      className="absolute top-0 left-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    ></motion.canvas>
  );
};

export default SnowfallEffect;
