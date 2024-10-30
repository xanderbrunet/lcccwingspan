// /app/components/footer.tsx
"use client";
import Image from "next/image";
import { navigation } from "@/data/navigation";
import Link from "next/link";
import { FaInstagram, FaFacebookF } from "react-icons/fa6";

export const Footer = () => {
  return (
    <div className="w-full h-fit bg-background flex flex-col md:flex-row gap-10 md:gap-20 py-10 px-5">
      <div className="flex flex-col md:w-1/4 justify-between">
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold text-primary ml-0 md:ml-8 cormorant-medium-heavy">
            {navigation.site_name_short}
          </h1>
          <h3 className="text-xl text-neutral-500 dark:text-neutral-400 ml-0 md:ml-8 libre-regular">
            {navigation.site_description}
          </h3>
          <div className="flex items-center gap-5 ml-0 md:ml-8 mb-5">
            <FaFacebookF
              className="text-xl text-neutral-800 dark:text-neutral-200 hover:cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
              onClick={() => window.open(navigation.socials.facebook, "_blank")}
            />
            <FaInstagram
              className="text-3xl text-neutral-800 dark:text-neutral-200 hover:cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
              onClick={() =>
                window.open(navigation.socials.instagram, "_blank")
              }
            />
          </div>
        </div>
        <h5 className="text-lg text-neutral-500 dark:text-neutral-400 ml-0 md:ml-8 libre-regular">
          {navigation.copyright}
        </h5>
      </div>
      <div className="flex items-center justify-center h-full order-first md:order-none">
        <Image
          src="/static/lccc.webp"
          alt="LCCC Logo"
          width={150}
          height={150}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-24">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-primary cormorant-bold">
            {navigation.links.campus.main.label}:
          </h2>
          <Link
            href={navigation.links.campus.events.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.campus.events.label}
          </Link>
          <Link
            href={navigation.links.campus.clubs.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.campus.clubs.label}
          </Link>
          <Link
            href={navigation.links.campus.regulations.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.campus.regulations.label}
          </Link>
          <Link
            href={navigation.links.campus.classes.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.campus.classes.label}
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-primary cormorant-bold">
            {navigation.links.sports.main.label}:
          </h2>
          <Link
            href={navigation.links.sports.volleyball.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.sports.volleyball.label}
          </Link>
          <Link
            href={navigation.links.sports.soccer.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.sports.soccer.label}
          </Link>
          <Link
            href={navigation.links.sports.basketball.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.sports.basketball.label}
          </Link>
          <Link
            href={navigation.links.sports.handball.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.sports.handball.label}
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-primary cormorant-bold">
            {navigation.links.about.main.label}:
          </h2>
          <Link
            href={navigation.links.about.staff.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.about.staff.label}
          </Link>
          <Link
            href={navigation.links.about.history.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.about.history.label}
          </Link>
          <Link
            href={navigation.links.about.awards.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.about.awards.label}
          </Link>
          <Link
            href={navigation.links.about.contact.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.about.contact.label}
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href={navigation.links.legal.privacy.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.legal.privacy.label}
          </Link>
          <Link
            href={navigation.links.legal.terms.url}
            className="text-lg text-neutral-700 dark:text-neutral-300 libre-regular hover:underline"
          >
            {navigation.links.legal.terms.label}
          </Link>
        </div>
      </div>
    </div>
  );
};
