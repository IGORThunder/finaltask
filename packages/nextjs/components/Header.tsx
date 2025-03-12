"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-indigo-700 text-white shadow-lg" : "text-gray-200"
              } hover:bg-indigo-600 hover:text-white transition-all py-2 px-4 text-sm rounded-xl flex items-center gap-2`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky top-0 navbar bg-gradient-to-r from-purple-600 to-indigo-800 min-h-0 flex-shrink-0 justify-between z-20 shadow-xl px-4 sm:px-6">
      <div className="navbar-start w-auto lg:w-1/2">
        {/* Бургер-меню */}
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <button
            className={`ml-2 btn btn-ghost text-white p-2 rounded-lg transition-all ${
              isDrawerOpen ? "bg-indigo-700" : "hover:bg-indigo-600"
            }`}
            onClick={() => setIsDrawerOpen(prev => !prev)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          {isDrawerOpen && (
            <ul
              className="absolute mt-3 p-2 shadow-lg bg-indigo-700 text-white rounded-lg w-52"
              onClick={() => setIsDrawerOpen(false)}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>

        {/* Логотип */}
        <Link href="/" passHref className="hidden lg:flex items-center gap-3 ml-4 mr-6">
          <div className="relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-lg">Scaffold-ETH</span>
            <span className="text-xs text-gray-300">Ethereum dev stack</span>
          </div>
        </Link>

        {/* Меню для десктопа */}
        <ul className="hidden lg:flex menu menu-horizontal px-1 gap-3">
          <HeaderMenuLinks />
        </ul>
      </div>

      {/* Кнопки справа */}
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
