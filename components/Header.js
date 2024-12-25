"use client";

import React, { useEffect } from "react";
import { CarTaxiFront, Package } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // For programmatic navigation
import SignIn from "./SignIn";

const Header = () => {
  const { isSignedIn } = useAuth(); // Check if the user is signed in
  const router = useRouter(); // Next.js router for navigation

  useEffect(() => {
    if (isSignedIn) {
      // Redirect to Userpage if signed in
      router.push("/Userpage");
    }
  }, [isSignedIn, router]); // Dependency array to watch for changes in isSignedIn

  return (
    <div className="flex justify-center w-full fixed top-0 z-50 px-4 pt-4">
      <header className="w-10/12 border-2 border-slate-500 shadow-md rounded-[50px]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Company Name */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ">
            MoveOn
          </h1>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <ul className="flex items-center space-x-4">
              <li
                className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out group"
                onClick={() => alert("CarTaxiFront Selected")}
              >
                <div className="flex flex-col items-center">
                  <CarTaxiFront className="w-8 h-8 text-blue-500 group-hover:text-blue-700" />
                  <span className="text-xs text-gray-600 group-hover:text-blue-700">
                    Taxi
                  </span>
                </div>
              </li>
              <li
                className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out group"
                onClick={() => alert("Package Selected")}
              >
                <div className="flex flex-col items-center">
                  <Package className="w-8 h-8 text-green-500 group-hover:text-green-700" />
                  <span className="text-xs text-gray-600 group-hover:text-green-700">
                    Package
                  </span>
                </div>
              </li>
            </ul>

            {/* Conditionally render SignIn */}
            {!isSignedIn && (
              <SignIn 
                forceRedirectUrl="/Userpage" 
              />
            )}

            {/* User Menu */}
            {isSignedIn && <UserButton />}
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
