"use client";
import React, { useState, useEffect } from "react";
import OverlayLogin from "@components/authenticate";
import { LoadingAnimation } from "@components/loading";
import { supabase } from "@api/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import ArticleForm from "@/components/articleForm";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Permissions {
  canPost: boolean;
  canEditAny: boolean;
  canEditOwn: boolean;
  canEditUsers: boolean;
  canCreateUsers: boolean;
  canDeleteUsers: boolean;
  canEditHomePage: boolean;
  canReviewSubmissions: boolean;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  author_id: string;
  authors: {
    name: string;
  } | {
    name: string;
  }[] | null;
  published_at?: string;
  content?: string;
  excerpt?: string;
  main_image?: string;
  type?: "story" | "sports" | "opinion" | "podcast" | "other";
  is_primary?: boolean;
  is_secondary_primary_1?: boolean;
  is_secondary_primary_2?: boolean;
  is_secondary_primary_3?: boolean;
  is_secondary_primary_4?: boolean;
}

interface ArticleInput {
  title: string;
  content?: string;
  excerpt?: string;
  main_image?: string;
  type: "story" | "sports" | "opinion" | "podcast" | "other";
  slug: string;
  published_at?: string;
  is_primary: boolean;
  is_secondary_primary_1: boolean;
  is_secondary_primary_2: boolean;
  is_secondary_primary_3: boolean;
  is_secondary_primary_4: boolean;
}

const EditorPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [permissions, setPermissions] = useState<Permissions>({
    canPost: false,
    canEditAny: false,
    canEditOwn: false,
    canEditUsers: false,
    canCreateUsers: false,
    canDeleteUsers: false,
    canEditHomePage: false,
    canReviewSubmissions: false,
  });

  type PermissionKey = keyof typeof permissions;

  const subpages: { name: string; permission: PermissionKey | PermissionKey[] }[] = [
    { name: "Publish Article", permission: "canPost" },
    { name: "Edit Article", permission: ["canEditAny", "canEditOwn"] },
    { name: "Delete Article", permission: ["canEditAny", "canEditOwn"] },
    { name: "Review Submissions", permission: "canReviewSubmissions" },
    { name: "Edit Front Page", permission: "canEditHomePage" },
    { name: "Add User", permission: "canCreateUsers" },
    { name: "Edit User", permission: "canEditUsers" },
    { name: "Delete User", permission: "canDeleteUsers" },
  ];

  const hasPermission = (requiredPermissions: PermissionKey | PermissionKey[]) => {
    if (Array.isArray(requiredPermissions)) {
      return requiredPermissions.some((permission) => permissions[permission]);
    }
    return permissions[requiredPermissions];
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setAuthenticated(true);
        fetchUserPermissions(session.user.id);
      }
      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
      if (session) {
        fetchUserPermissions(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [setAuthenticated, setLoading]);

  const fetchUserPermissions = async (userId: string) => {
    const { data, error } = await supabase
      .from("authors")
      .select(
        "can_post, can_edit_any, can_edit_own, can_edit_users, can_create_users, can_delete_users, can_edit_homepage, can_review_submissions"
      )
      .eq("id", userId)
      .single();

    if (data) {
      setPermissions({
        canPost: data.can_post ?? false,
        canEditAny: data.can_edit_any ?? false,
        canEditOwn: data.can_edit_own ?? false,
        canEditUsers: data.can_edit_users ?? false,
        canCreateUsers: data.can_create_users ?? false,
        canDeleteUsers: data.can_delete_users ?? false,
        canEditHomePage: data.can_edit_homepage ?? false,
        canReviewSubmissions: data.can_review_submissions ?? false,
      });
    }

    if (error) {
      console.error("Error fetching user permissions:", error);
    }
  };

  const handlePageChange = (index: number) => {
    if (index !== selectedPageIndex) {
      setSelectedPageIndex(index);
    }
  };

  return (
    <div className="mt-20 p-5 max-w-full flex flex-col lg:flex-row relative">
      {loading && <LoadingAnimation />}
      {!loading && !authenticated && <OverlayLogin onAuthenticated={() => setAuthenticated(true)} />}
      {!loading && authenticated && (
        <>
          <aside className="hidden lg:block lg:w-1/5 p-4 rounded-none mr-4">
            <h2 className="text-2xl font-bold mb-4 libre-bold">The Editor</h2>
            <ul className="space-y-3">
              {subpages.map((page, index) =>
                hasPermission(page.permission) && (
                  <li
                    key={page.name}
                    className={`cursor-pointer text-lg libre-regular ${
                      selectedPageIndex === index
                        ? "font-semibold underline"
                        : "text-black dark:text-white hover:underline"
                    }`}
                    onClick={() => handlePageChange(index)}
                  >
                    {page.name}
                  </li>
                )
              )}
            </ul>
          </aside>

          <div className="lg:hidden w-full mb-4 relative">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full text-black dark:text-white py-2 px-4 rounded-none text-left libre-regular border border-gray-300 dark:border-gray-600"
              whileTap={{ scale: 0.98 }}
            >
              {subpages[selectedPageIndex]?.name}{" "}
              <span className="float-right">{isMobileMenuOpen ? "▲" : "▼"}</span>
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
                  {subpages.map((page, index) =>
                    hasPermission(page.permission) && (
                      <li
                        key={page.name}
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
                        {page.name}
                      </li>
                    )
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.main
              className="flex-1 md:p-6 p-2 rounded-none md:border-l border-none border-gray-300 dark:border-gray-600"
              key={selectedPageIndex}
              initial={{
                opacity: 0,
                x: 10,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: -10,
                transition: { duration: 0.3 },
              }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-4 libre-regular">
                {subpages[selectedPageIndex]?.name}
              </h1>
              {renderSubPageContent(selectedPageIndex)}
            </motion.main>
          </AnimatePresence>
        </>
      )}
    </div>
  );

  function renderSubPageContent(index: number) {
    switch (index) {
      case 0: // Post Article
        return (
          <ArticleForm
            onSave={async (articleInput) => {
              // Function to handle save for creating a new article
              const { data, error } = await supabase.from('articles').insert([{
                ...articleInput,
                author_id: (await supabase.auth.getUser()).data?.user?.id, // Assuming author_id is the current logged-in user
              }]);

              if (error) {
                console.error("Error creating article:", error);
              } else {
                console.log("Article created successfully:", data);
              }
            }}
          />
        );
      case 1:
        return <EditArticlePage canEditAny={permissions.canEditAny} canEditOwn={permissions.canEditOwn} />;
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

const EditArticlePage: React.FC<{ canEditAny: boolean; canEditOwn: boolean }> = ({ canEditAny, canEditOwn }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editArticle, setEditArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      let query = supabase.from("articles").select("id, title, slug, author_id, authors(name), published_at, content, excerpt, main_image, type, is_primary");

      if (canEditOwn && !canEditAny) {
        const { data: user } = await supabase.auth.getUser();
        if (user?.user?.id) {
          query = query.eq("author_id", user.user.id);
        }
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching articles:", error);
      } else if (data) {
        setArticles(data);
      }
      setLoading(false);
    };

    fetchArticles();
  }, [canEditAny, canEditOwn]);

  const filteredArticles = articles.filter((article) => {
    const authorName = Array.isArray(article.authors)
      ? article.authors.map((author) => author.name).join(", ")
      : article.authors?.name ?? "";

    return (
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.published_at && article.published_at.includes(searchQuery))
    );
  });

  const handleEditArticle = (article: Article) => {
    setEditArticle(article);
  };

  const handleCloseModal = () => {
    setEditArticle(null);
  };

  const handleSaveArticle = async (updatedArticle: ArticleInput) => {
    if (!editArticle) return;

    const { error } = await supabase
      .from("articles")
      .update(updatedArticle)
      .eq("id", editArticle.id);

    if (error) {
      console.error("Error updating article:", error);
    } else {
      // Update the list of articles with the new details
      setArticles((prev) => prev.map((art) => (art.id === editArticle.id ? { ...art, ...updatedArticle } : art)));
      handleCloseModal(); // Close the modal after saving
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-500 rounded-md libre-regular dark:bg-neutral-900 dark:text-white"
          placeholder="Search by author, title, slug, or date published..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        // Display skeleton placeholders with theming for dark/light mode
        <SkeletonTheme 
          baseColor="var(--skeleton-base-color)" 
          highlightColor="var(--skeleton-highlight-color)"
        >
          {[...Array(10)].map((_, index) => (
            <div key={index} className="flex flex-col justify-center md:p-4 pl-0 py-4 pr-4 rounded-lg">
              <Skeleton width={200} height={30} />
              <div className="flex items-center space-x-2 mt-2">
                <Skeleton width={300} height={20} />
                <p className="text-neutral-600 dark:text-neutral-400">•</p>
                <Skeleton width={100} height={20} />
                <p className="text-neutral-600 dark:text-neutral-400">•</p>
                <Skeleton width={150} height={20} />
              </div>
            </div>
          ))}
        </SkeletonTheme>
      ) : (
        filteredArticles.map((article) => (
          <motion.div
            key={article.id}
            className="flex justify-between items-center md:p-4 pl-0 py-4 pr-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
            onClick={() => handleEditArticle(article)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.5 }}
          >
            <div>
              <h2 className="text-xl libre-bold">{article.title}</h2>
              <p className="text-neutral-600 dark:text-neutral-400 libre-regular">
                {article.slug} • {getAuthorNames(article.authors)} •{" "}
                {article.published_at ? `Published: ${article.published_at}` : "Not Published"}
              </p>
            </div>
            <span className="text-gray-400 text-2xl libre-bold">→</span>
          </motion.div>
        ))
      )}

      {/* Modal for Editing Article */}
      <AnimatePresence>
        {editArticle && (
          <motion.div
            className="fixed top-0 left-0 w-dvw h-dvh bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white dark:bg-neutral-900 p-6 w-full h-full relative overflow-y-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Exit Button */}
              <button
                className="absolute top-0 right-4 text-5xl font-bold text-gray-700 dark:text-gray-300"
                onClick={handleCloseModal}
              >
                &times;
              </button>
              <div className="my-4"></div>
              <ArticleForm article={editArticle} onSave={handleSaveArticle} />

              {/* Cancel Button */}
              <button
                onClick={handleCloseModal}
                className="mt-4 mb-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 float-right libre-bold"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// Helper function to get the author names
const getAuthorNames = (authors: { name: string } | { name: string }[] | null): string => {
  if (!authors) {
    return "Unknown Author";
  }

  if (Array.isArray(authors)) {
    return authors.length > 0 ? authors.map((author) => author.name).join(", ") : "Unknown Author";
  }

  // If authors is not an array, return the single author's name
  return authors.name;
};

export default EditorPage;
