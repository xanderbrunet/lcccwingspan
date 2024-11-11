"use client";
import { navigation } from "@/data/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChristmasTree from "@components/icons";
import SnowfallEffect from "./snowfall";
import { siteTheme } from "@/app/siteTheme";
import { supabase } from "@api/supabaseClient";

export const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChristmasTheme, setIsChristmasTheme] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState<string | null>("Logout");
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    siteTheme().then((settings) => setIsChristmasTheme(settings.setIsChristmas === true));
  }, []);

  useEffect(() => {
    // Check if the user is logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => authListener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (menuOpen || isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, isUserMenuOpen]);

  const handleLogout = async () => {
    setLogoutStatus("Logging out...");
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    setLogoutStatus("Logout");
  };

  const renderLinks = () => (
    <>
      <Link
        href={navigation.links.stories.url}
        className="text-xl libre-regular hover:underline text-black dark:text-white"
      >
        {navigation.links.stories.label}
      </Link>
      <Link
        href={navigation.links.sports.main.url}
        className="text-xl libre-regular hover:underline text-black dark:text-white"
      >
        {navigation.links.sports.main.label}
      </Link>
      <Link
        href={navigation.links.opinion.url}
        className="text-xl libre-regular hover:underline text-black dark:text-white"
      >
        {navigation.links.opinion.label}
      </Link>
      <Link
        href={navigation.links.podcasts.url}
        className="text-xl libre-regular hover:underline text-black dark:text-white"
      >
        {navigation.links.podcasts.label}
      </Link>
      <Link
        href={navigation.links.about.main.url}
        className="text-xl libre-regular hover:underline text-black dark:text-white"
      >
        {navigation.links.about.main.label}
      </Link>
    </>
  );

  return (
    <div className="w-dvw h-16 bg-background fixed top-0 left-0 flex items-center justify-between z-50 px-4 md:px-16">
      <div className="flex items-center">
        <SnowfallEffect />
        <div className="flex items-center gap-2">
          {isChristmasTheme && (
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ChristmasTree width={30} height={35} />
            </motion.div>
          )}
          <h1
            className="text-3xl font-bold md:ml-0 cormorant-medium-heavy hover:cursor-pointer text-black dark:text-white"
            onClick={() => router.push("/")}
          >
            The Wingspan
          </h1>
        </div>
        <div className="hidden lg:flex w-[1px] h-3/4 bg-black dark:bg-white mx-8">&nbsp;</div>
        <div className="hidden lg:flex items-center gap-10 z-40">
          {renderLinks()}
        </div>
      </div>

      {/* Social, Subscribe, and User buttons (Visible on larger screens only) */}
      <div className="hidden lg:flex items-center gap-5 mr-4 md:mr-16 z-50">
        <FaFacebookF
          className="text-xl text-neutral-800 dark:text-neutral-200 hover:cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          onClick={() => window.open(navigation.socials.facebook, "_blank")}
        />
        <FaInstagram
          className="text-3xl text-neutral-800 dark:text-neutral-200 hover:cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          onClick={() => window.open(navigation.socials.instagram, "_blank")}
        />
        <button className="bg-blue-500 hover:bg-blue-600 transition-colors text-md text-white dark:text-black px-3 py-1 rounded-none libre-regular">
          Subscribe
        </button>
        {isAuthenticated && (
          <div ref={userMenuRef} className="relative h-full flex items-center">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="text-xl text-neutral-800 dark:text-neutral-200 hover:cursor-pointer transition-colors"
            >
              <FaUserCircle className="text-2xl" />
            </button>
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-neutral-800 shadow-lg z-50 py-2 rounded-md"
                >
                  <button
                    onClick={() => {
                      router.push("/editor");
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 libre-regular"
                  >
                    Access the Editor
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-red-400 dark:hover:bg-red-700 libre-regular"
                  >
                    {logoutStatus}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Hamburger menu for smaller screens */}
      <div className="lg:hidden flex items-center gap-5 mr-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-xl text-neutral-800 hover:cursor-pointer hover:text-neutral-600 transition-colors"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            className="absolute top-16 left-0 w-full bg-background shadow-xl z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center gap-6 py-4">
              {renderLinks()}

              {/* Social, Subscribe, and User Menu in Mobile Menu */}
              <div className="flex items-center gap-5 mt-4">
                <FaFacebookF
                  className="text-xl text-neutral-800 dark:text-neutral-200 hover:cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  onClick={() => window.open(navigation.socials.facebook, "_blank")}
                />
                <FaInstagram
                  className="text-3xl text-neutral-800 dark:text-neutral-200 hover:cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  onClick={() => window.open(navigation.socials.instagram, "_blank")}
                />
                <button className="bg-blue-500 hover:bg-blue-600 transition-colors text-md text-white dark:text-black px-3 py-1 rounded-none libre-regular">
                  Subscribe
                </button>

                {isAuthenticated && (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="text-xl text-neutral-800 dark:text-neutral-200 hover:cursor-pointer transition-colors"
                  >
                    <FaUserCircle className="text-2xl" />
                  </button>
                )}
              </div>

              {isAuthenticated && isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-3 mt-2"
                >
                  <button
                    onClick={() => {
                      router.push("/editor");
                      setMenuOpen(false);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 libre-regular"
                  >
                    Access the Editor
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-red-400 dark:hover:bg-red-700 libre-regular"
                  >
                    {logoutStatus}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Christmas lightrope */}
      {isChristmasTheme && (
        <motion.ul
          className="lightrope z-10"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {[...Array(42)].map((_, index) => (
            <li key={index}></li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};
