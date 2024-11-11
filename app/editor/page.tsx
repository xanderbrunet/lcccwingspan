"use client";
import React, { useState, useEffect } from "react";
import OverlayLogin from "@components/authenticate";
import { LoadingAnimation } from "@components/loading";
import { supabase } from "@api/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

const EditorPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const subpages = [
    "Post Article",
    "Edit Article",
    "Delete Article",
    "Review Submissions",
    "Edit Front Page",
    "Add User",
    "Edit User",
    "Delete User",
  ];

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuthenticated(true);
      }
      setLoading(false); // Loading ends once we know the user's status
    };

    checkSession();

    // Listen for real-time session changes (for example, after login)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
      setLoading(false); // Update loading if auth state changes
    });

    // Unsubscribe on cleanup
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [setAuthenticated, setLoading]);

  const handlePageChange = (index: number) => {
    if (index !== selectedPageIndex) {
      setSelectedPageIndex(index);
    }
  };

  return (
    <div className="mt-20 p-5 max-w-full flex flex-col lg:flex-row relative">
      {loading && <LoadingAnimation />}
      {!loading && !authenticated && (
        <OverlayLogin onAuthenticated={() => setAuthenticated(true)} />
      )}
      {!loading && authenticated && (
        <>
          {/* Sidebar for larger screens */}
          <aside className="hidden lg:block lg:w-1/5 p-4 rounded-none mr-4">
            <h2 className="text-xl font-bold mb-4 libre-bold">Editor Menu</h2>
            <ul className="space-y-3">
              {subpages.map((page, index) => (
                <li
                  key={page}
                  className={`cursor-pointer text-lg libre-regular ${
                    selectedPageIndex === index
                      ? "font-semibold underline"
                      : "text-black dark:text-white hover:underline"
                  }`}
                  onClick={() => handlePageChange(index)}
                >
                  {page}
                </li>
              ))}
            </ul>
          </aside>

          {/* Dropdown menu for mobile */}
          <div className="lg:hidden w-full mb-4 relative">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full text-black dark:text-white py-2 px-4 rounded-none text-left libre-regular border border-gray-300 dark:border-gray-600"
              whileTap={{ scale: 0.98 }}
            >
              {subpages[selectedPageIndex]} <span className="float-right">{isMobileMenuOpen ? "▲" : "▼"}</span>
            </motion.button>
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.ul
                  className="absolute top-full left-0 w-full bg-gray-200 dark:bg-gray-800 p-4 rounded-none mt-2 space-y-3 border border-gray-300 dark:border-gray-600 z-10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {subpages.map((page, index) => (
                    <li
                      key={page}
                      className={`cursor-pointer text-lg libre-regular ${
                        selectedPageIndex === index
                          ? "font-semibold underline"
                          : "text-black dark:text-white hover:underline"
                      }`}
                      onClick={() => {
                        handlePageChange(index);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {page}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Main content area for the selected subpage */}
          <AnimatePresence mode="wait">
            <motion.main
              className="flex-1 p-6 rounded-none border-l border-gray-300 dark:border-gray-600"
              key={selectedPageIndex}
              initial={{
                opacity: 0,
                x: 10, // Slide in from the right
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: -10, // Slide out to the left
                transition: { duration: 0.3 },
              }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-4 libre-regular">{subpages[selectedPageIndex]}</h1>
              {renderSubPageContent(selectedPageIndex)}
            </motion.main>
          </AnimatePresence>
        </>
      )}
    </div>
  );

  // Function to render content based on the selected page index
  function renderSubPageContent(index: number) {
    switch (index) {
      case 0:
        return <div className="libre-regular">Here you can create a new article to be posted on the site.</div>;
      case 1:
        return <div className="libre-regular">Select an article to edit its content and make changes.</div>;
      case 2:
        return <div className="libre-regular">Select an article to delete it permanently.</div>;
      case 3:
        return <div className="libre-regular">Review submitted articles and approve or reject them.</div>;
      case 4:
        return <div className="libre-regular">Edit the layout and content of the front page.</div>;
      case 5:
        return <div className="libre-regular">Add a new user to the system with specific roles and permissions.</div>;
      case 6:
        return <div className="libre-regular">Edit user details and modify their roles.</div>;
      case 7:
        return <div className="libre-regular">Delete an existing user from the system.</div>;
      default:
        return <div className="libre-regular">Welcome to the editor! Select a menu option to get started.</div>;
    }
  }
};

export default EditorPage;
