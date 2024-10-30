// /app/components/navbar.tsx
"use client";
import { navigation } from "@/data/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

export const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="w-dvw h-16 bg-background fixed t-0 l-0 flex items-center justify-between z-50 px-4 md:px-16">
      <div className="flex items-center">
        <h1
          className="text-3xl font-bold text-primary ml-4 md:ml-0 cormorant-medium-heavy hover:cursor-pointer"
          onClick={() => router.push("/")}
        >
          The Wingspan
        </h1>
        <div className="hidden md:flex w-[1px] h-3/4 bg-black mx-8">&nbsp;</div>
        <div className="hidden md:flex items-center gap-10">
          <Link
            href={navigation.links.stories.url}
            className="text-xl text-primary libre-regular hover:underline"
          >
            {navigation.links.stories.label}
          </Link>
          <Link
            href={navigation.links.sports.main.url}
            className="text-xl text-primary libre-regular hover:underline"
          >
            {navigation.links.sports.main.label}
          </Link>
          <Link
            href={navigation.links.opinion.url}
            className="text-xl text-primary libre-regular hover:underline"
          >
            {navigation.links.opinion.label}
          </Link>
          <Link
            href={navigation.links.podcasts.url}
            className="text-xl text-primary libre-regular hover:underline"
          >
            {navigation.links.podcasts.label}
          </Link>
          <Link
            href={navigation.links.about.main.url}
            className="text-xl text-primary libre-regular hover:underline"
          >
            {navigation.links.about.main.label}
          </Link>
        </div>
      </div>

      {/* Social and Subscribe buttons */}
      <div className="hidden md:flex items-center gap-5 mr-4 md:mr-16">
        <FaFacebookF
          className="text-xl text-neutral-800 hover:cursor-pointer hover:text-neutral-600 transition-colors"
          onClick={() => window.open(navigation.socials.facebook, "_blank")}
        />
        <FaInstagram
          className="text-3xl text-neutral-800 hover:cursor-pointer hover:text-neutral-600 transition-colors"
          onClick={() => window.open(navigation.socials.instagram, "_blank")}
        />
        <button className="bg-blue-500 hover:bg-blue-600 transition-colors text-md text-white dark:text-black px-3 py-1 rounded-none libre-regular">
          Subscribe
        </button>
      </div>

      {/* Hamburger menu for smaller screens */}
      <div className="md:hidden flex items-center gap-5 mr-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-xl text-neutral-800 hover:cursor-pointer hover:text-neutral-600 transition-colors"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Overlay and Dropdown menu for smaller screens */}
      {menuOpen && (
        <>
          {/* Overlay to prevent background clicks */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          ></div>
          <div
            ref={menuRef}
            className="absolute top-16 left-0 w-full bg-background shadow-lg z-50"
          >
            <div className="flex flex-col items-center gap-6 py-4">
              <Link
                href={navigation.links.stories.url}
                onClick={() => setMenuOpen(false)}
                className="text-xl text-primary libre-regular hover:underline"
              >
                {navigation.links.stories.label}
              </Link>
              <Link
                href={navigation.links.sports.main.url}
                onClick={() => setMenuOpen(false)}
                className="text-xl text-primary libre-regular hover:underline"
              >
                {navigation.links.sports.main.label}
              </Link>
              <Link
                href={navigation.links.opinion.url}
                onClick={() => setMenuOpen(false)}
                className="text-xl text-primary libre-regular hover:underline"
              >
                {navigation.links.opinion.label}
              </Link>
              <Link
                href={navigation.links.podcasts.url}
                onClick={() => setMenuOpen(false)}
                className="text-xl text-primary libre-regular hover:underline"
              >
                {navigation.links.podcasts.label}
              </Link>
              <Link
                href={navigation.links.about.main.url}
                onClick={() => setMenuOpen(false)}
                className="text-xl text-primary libre-regular hover:underline"
              >
                {navigation.links.about.main.label}
              </Link>
              <div className="flex items-center gap-5">
                <FaFacebookF
                  className="text-xl text-neutral-800 hover:cursor-pointer hover:text-neutral-600 transition-colors"
                  onClick={() => {
                    window.open(navigation.socials.facebook, "_blank");
                    setMenuOpen(false);
                  }}
                />
                <FaInstagram
                  className="text-3xl text-neutral-800 hover:cursor-pointer hover:text-neutral-600 transition-colors"
                  onClick={() => {
                    window.open(navigation.socials.instagram, "_blank");
                    setMenuOpen(false);
                  }}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-600 transition-colors text-md text-white dark:text-black px-3 py-1 rounded-none libre-regular"
                  onClick={() => setMenuOpen(false)}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
