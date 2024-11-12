import React, { useState, useEffect } from "react";
import { supabase } from "@api/supabaseClient";
import { motion } from "framer-motion";
import classNames from "classnames";

interface Article {
    id: string;
    title: string;
    slug: string;
    author_id: string;
    authors: { name: string } | { name: string }[] | null;
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
  
  interface ArticleFormProps {
    article?: Article;
    onSave: (article: ArticleInput) => void;
  }
  
  interface ArticleInput {
    id?: string;
    title: string;
    content?: string;
    excerpt?: string;
    main_image?: string;
    type: "story" | "sports" | "opinion" | "podcast" | "other";
    slug: string;
    author_id: string;
    published_at?: string;
    is_primary: boolean;
    is_secondary_primary_1: boolean;
    is_secondary_primary_2: boolean;
    is_secondary_primary_3: boolean;
    is_secondary_primary_4: boolean;
  }

  const ArticleForm: React.FC<ArticleFormProps> = ({ article, onSave }) => {
    const [title, setTitle] = useState(article?.title || "");
    const [content, setContent] = useState(article?.content || "");
    const [excerpt, setExcerpt] = useState(article?.excerpt || "");
    const [mainImage, setMainImage] = useState(article?.main_image || "");
    const [slug, setSlug] = useState(article?.slug || "");
    const [authorId, setAuthorId] = useState(article?.author_id || "");
  
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      setTitle(e.target.value);
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setContent(e.target.value);
    const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setExcerpt(e.target.value);
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      setMainImage(e.target.value);
    const handleAuthorIdChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      setAuthorId(e.target.value);
  
    // Initialize the initial category and slot based on the article prop
    const initialArticleCategory: "primary" | "secondary" | "regular" = article?.is_primary == true
      ? "primary"
      : article?.is_secondary_primary_1 == true ||
        article?.is_secondary_primary_2 == true ||
        article?.is_secondary_primary_3 == true ||
        article?.is_secondary_primary_4 == true
      ? "secondary"
      : "regular";
  
    const initialSecondarySlot = article?.is_secondary_primary_1 === true
      ? 1
      : article?.is_secondary_primary_2 === true
      ? 2
      : article?.is_secondary_primary_3 === true
      ? 3
      : article?.is_secondary_primary_4 === true
      ? 4
      : null;
  
    const [articleCategory, setArticleCategory] = useState<
      "primary" | "secondary" | "regular"
    >(initialArticleCategory);
    const [secondarySlot, setSecondarySlot] = useState<number | null>(
      initialSecondarySlot
    );
  
    const [currentPrimaryArticle, setCurrentPrimaryArticle] = useState<Article | null>(
      null
    );
    const [currentSecondaryArticle, setCurrentSecondaryArticle] = useState<Article | null>(
      null
    );
    const [existingSecondaryArticle, setExistingSecondaryArticle] = useState<Article | null>(
      null
    );
    const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
    const [reassignTarget, setReassignTarget] = useState<"regular" | number | null>(
      null
    );
  
    // New state variables for form errors and warnings
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [formWarnings, setFormWarnings] = useState<string[]>([]);
  
    useEffect(() => {
      if (title) {
        const newSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        setSlug(newSlug);
      }
    }, [title]);
  
    // Fixing the slug check to only run once 2 seconds after the last change
    useEffect(() => {
      if (slug) {
        setIsSlugAvailable(null); // reset availability status when slug changes
  
        const timeout = setTimeout(async () => {
          const { data, error } = await supabase
            .from("articles")
            .select("id")
            .eq("slug", slug)
            .single();
  
          if (error && error.code === "PGRST116") {
            setIsSlugAvailable(true);
          } else if (data && data.id !== article?.id) {
            setIsSlugAvailable(false);
          } else {
            setIsSlugAvailable(true);
          }
        }, 2000); // Delay of 2 seconds
  
        return () => clearTimeout(timeout);
      }
    }, [slug, article?.id]);
  
    useEffect(() => {
      if (articleCategory === "primary") {
        const fetchPrimaryArticle = async () => {
          const { data, error } = await supabase
            .from("articles")
            .select("*")
            .eq("is_primary", true)
            .limit(1)
            .single();
  
          if (!error && data && data.id !== article?.id) {
            setCurrentPrimaryArticle(data);
          } else {
            setCurrentPrimaryArticle(null);
          }
        };
        fetchPrimaryArticle();
      } else {
        setCurrentPrimaryArticle(null);
      }
    }, [articleCategory, article?.id]);
  
    useEffect(() => {
      if (articleCategory === "secondary" && secondarySlot) {
        const fetchSecondaryArticle = async () => {
          const { data, error } = await supabase
            .from("articles")
            .select("*")
            .eq(`is_secondary_primary_${secondarySlot}`, true)
            .single();
  
          if (!error && data && data.id !== article?.id) {
            setCurrentSecondaryArticle(data);
          } else {
            setCurrentSecondaryArticle(null);
          }
        };
        fetchSecondaryArticle();
      } else {
        setCurrentSecondaryArticle(null);
      }
    }, [articleCategory, secondarySlot, article?.id]);
  
    // Fetch existing secondary article when reassigning primary to a secondary slot
    useEffect(() => {
      if (articleCategory === "primary" && typeof reassignTarget === "number") {
        const fetchExistingSecondaryArticle = async () => {
          const { data, error } = await supabase
            .from("articles")
            .select("*")
            .eq(`is_secondary_primary_${reassignTarget}`, true)
            .single();
  
          if (!error && data && data.id !== currentPrimaryArticle?.id) {
            setExistingSecondaryArticle(data);
          } else {
            setExistingSecondaryArticle(null);
          }
        };
        fetchExistingSecondaryArticle();
      } else {
        setExistingSecondaryArticle(null);
      }
    }, [articleCategory, reassignTarget, currentPrimaryArticle?.id]);
  
    // Determine if category or slot has changed
    const categoryChanged = initialArticleCategory !== articleCategory;
    const secondarySlotChanged = initialSecondarySlot !== secondarySlot;
  
    const handleSave = async () => {
      setFormErrors([]);
      setFormWarnings([]);
  
      // Validate inputs
      if (isSlugAvailable === false) {
        setFormErrors((prevErrors) => [
          ...prevErrors,
          "Slug is already taken. Please choose a different one.",
        ]);
        return;
      }
  
      if (!authorId) {
        setFormErrors((prevErrors) => [...prevErrors, "Author ID is required."]);
        return;
      }

    const newArticle: ArticleInput = {
      id: article?.id,
      title,
      content,
      excerpt,
      main_image: mainImage,
      type: article?.type || "story",
      slug,
      author_id: authorId,
      is_primary: articleCategory === "primary",
      is_secondary_primary_1: articleCategory === "secondary" && secondarySlot === 1,
      is_secondary_primary_2: articleCategory === "secondary" && secondarySlot === 2,
      is_secondary_primary_3: articleCategory === "secondary" && secondarySlot === 3,
      is_secondary_primary_4: articleCategory === "secondary" && secondarySlot === 4,
      published_at: article?.published_at || new Date().toISOString(),
    };

    // Prevent changing within the same category and slot
    if (!categoryChanged && (!secondarySlotChanged || initialSecondarySlot === null || secondarySlot === null)) {
      // No changes in category or slot
      // Proceed to save other changes
      const { error: saveError } = await supabase.from("articles").update(newArticle).eq("id", article?.id);

      if (saveError) {
        console.error("Error saving article:", saveError);
        setFormErrors((prevErrors) => [...prevErrors, "There was an error saving the article. Please try again."]);
      } else {
        onSave(newArticle);
      }
      return;
    } else {
      try {
        // Handle transitions
        if (articleCategory === "primary") {
          // Moving to Primary
          if (currentPrimaryArticle) {
            if (!reassignTarget) {
              setFormErrors((prevErrors) => [
                ...prevErrors,
                "Please select where to move the current primary article.",
              ]);
              return;
            }

            const updates: Partial<ArticleInput> & { [key: string]: boolean } = {
              is_primary: false,
              is_secondary_primary_1: false,
              is_secondary_primary_2: false,
              is_secondary_primary_3: false,
              is_secondary_primary_4: false,
            };

            if (reassignTarget === "regular") {
              // Move current primary to regular
            } else if (typeof reassignTarget === "number") {
              // Move current primary to selected secondary slot
              updates[`is_secondary_primary_${reassignTarget}`] = true;

              // Reassign existing secondary article in that slot to regular
              if (existingSecondaryArticle) {
                await supabase
                  .from("articles")
                  .update({
                    [`is_secondary_primary_${reassignTarget}`]: false,
                  })
                  .eq("id", existingSecondaryArticle.id);
              }
            }

            await supabase.from("articles").update(updates).eq("id", currentPrimaryArticle.id);
          }
        } else if (articleCategory === "secondary") {
          // Moving to Secondary
          if (currentSecondaryArticle) {
            // Reassign current secondary article to regular
            await supabase
              .from("articles")
              .update({
                [`is_secondary_primary_${secondarySlot}`]: false,
              })
              .eq("id", currentSecondaryArticle.id);
          }

          if (initialArticleCategory === "primary") {
            // Warn that there is currently no active primary
            setFormWarnings((prevWarnings) => [
              ...prevWarnings,
              "Warning: There will be no active primary article after this change.",
            ]);
          }
        } else if (articleCategory === "regular") {
          // Moving to Regular
          if (initialArticleCategory === "primary") {
            // Warn that there is currently no active primary
            setFormWarnings((prevWarnings) => [
              ...prevWarnings,
              "Warning: There will be no active primary article after this change.",
            ]);
          } else if (initialArticleCategory === "secondary") {
            // Warn that there is an empty slot for secondary
            setFormWarnings((prevWarnings) => [
              ...prevWarnings,
              "Warning: There will be an empty slot for secondary articles after this change.",
            ]);
          }
        }

        // Update the current article's category flags
        if (article) {
          const articleUpdates = {
            is_primary: newArticle.is_primary,
            is_secondary_primary_1: newArticle.is_secondary_primary_1,
            is_secondary_primary_2: newArticle.is_secondary_primary_2,
            is_secondary_primary_3: newArticle.is_secondary_primary_3,
            is_secondary_primary_4: newArticle.is_secondary_primary_4,
          };

          await supabase.from("articles").update(articleUpdates).eq("id", article.id);
        }

        // Save the new or updated article
        const { error: saveError } = await supabase
      .from("articles")
      .upsert(newArticle, { onConflict: "slug" });

    if (saveError) {
      console.error("Error saving article:", saveError);
      setFormErrors((prevErrors) => [...prevErrors, "There was an error saving the article. Please try again."]);
      return;
    }

    onSave(newArticle);
      } catch (error) {
        console.error("Error saving article:", error);
        setFormErrors((prevErrors) => [...prevErrors, "There was an error saving the article. Please try again."]);
      }
    }
  };

  const handleReassign = (moveTo: "regular" | number) => {
    setReassignTarget(moveTo);
    if (moveTo !== "regular") {
      setSecondarySlot(moveTo);
    }
  };

  return (
    <div className="space-y-4">
      {/* Display form errors */}
      {formErrors.length > 0 && (
        <div className="p-4 bg-red-200 dark:bg-red-900 rounded-md libre-regular">
          {formErrors.map((error, index) => (
            <p key={index} className="text-red-800 dark:text-red-200">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Display form warnings */}
      {formWarnings.length > 0 && (
        <div className="p-4 bg-orange-200 dark:bg-orange-900 rounded-md libre-regular">
          {formWarnings.map((warning, index) => (
            <p key={index} className="text-yellow-900 dark:text-yellow-100">
              {warning}
            </p>
          ))}
        </div>
      )}

      {/* Form Fields */}
      <div>
        <label className="block mb-1 libre-bold">Title</label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full p-2 border border-gray-500 rounded-md libre-regular dark:bg-neutral-900 dark:text-white"
        />
      </div>

      {/* Slug Field */}
      <div>
        <label className="block mb-1 libre-bold">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className={`w-full p-2 border ${
            isSlugAvailable === false ? "border-red-500" : "border-gray-500"
          } rounded-md libre-regular dark:bg-neutral-900 dark:text-white`}
        />
        {isSlugAvailable === false && (
          <p className="text-red-500 text-sm">
            Slug is already taken, please choose a different one.
          </p>
        )}
      </div>

      {/* Other form fields */}
      <div>
        <label className="block mb-1 libre-bold">Content</label>
        <textarea
          value={content}
          onChange={handleContentChange}
          className="w-full p-2 border border-gray-500 rounded-md libre-regular dark:bg-neutral-900 dark:text-white"
          rows={6}
        />
      </div>

      <div>
        <label className="block mb-1 libre-bold">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={handleExcerptChange}
          className="w-full p-2 border border-gray-500 rounded-md libre-regular dark:bg-neutral-900 dark:text-white"
          rows={3}
        />
      </div>

      <div>
        <label className="block mb-1 libre-bold">Main Image URL</label>
        <input
          type="text"
          value={mainImage}
          onChange={handleMainImageChange}
          className="w-full p-2 border border-gray-500 rounded-md libre-regular dark:bg-neutral-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block mb-1 libre-bold">Author ID</label>
        <input
          type="text"
          value={authorId}
          onChange={handleAuthorIdChange}
          className="w-full p-2 border border-gray-500 rounded-md libre-regular dark:bg-neutral-900 dark:text-white"
        />
      </div>

      {/* Article Category Selection */}
      <div>
        <label className="block mb-1 libre-bold">Article Category</label>
        <select
          value={articleCategory}
          onChange={(e) =>
            setArticleCategory(e.target.value as "primary" | "secondary" | "regular")
          }
          className="w-full p-2 border border-gray-500 rounded-md libre-regular dark:bg-neutral-900 dark:text-white"
        >
          <option value="regular">Regular</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select>
      </div>

      {/* Secondary Slot Selection */}
      {articleCategory === "secondary" && (
        <div className="mt-4">
          <label className="block mb-1 libre-bold">Select Secondary Spot</label>
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                disabled={initialSecondarySlot === num}
                className={classNames(
                  "py-2 px-4 rounded-md text-white",
                  secondarySlot === num ? "bg-blue-600" : "bg-gray-400 hover:bg-blue-500",
                  initialSecondarySlot === num && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => setSecondarySlot(num)}
              >
                Secondary {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Warnings and Reassignment Options */}
      {categoryChanged && (
        <>
          {articleCategory === "primary" && currentPrimaryArticle && (
            <div className="mt-4 p-4 bg-orange-200 dark:bg-orange-900 rounded-md libre-regular">
              <p className="text-yellow-900 dark:text-yellow-100">
                Setting this article as primary will remove the following article from the
                primary spot:
              </p>
              <div className="mt-2">
                <h2 className="text-xl libre-bold">{currentPrimaryArticle.title}</h2>
                <p className="text-neutral-700 dark:text-neutral-300 libre-regular">
                  {currentPrimaryArticle.slug} •{" "}
                  {getAuthorNames(currentPrimaryArticle.authors)} •{" "}
                  {currentPrimaryArticle.published_at
                    ? `Published: ${currentPrimaryArticle.published_at}`
                    : "Not Published"}
                </p>
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  className={classNames(
                    "py-2 px-4 rounded-md text-white",
                    reassignTarget === "regular"
                      ? "bg-blue-600"
                      : "bg-gray-400 hover:bg-blue-500"
                  )}
                  onClick={() => handleReassign("regular")}
                >
                  Set as Regular
                </button>
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    className={classNames(
                      "py-2 px-4 rounded-md text-white",
                      reassignTarget === num
                        ? "bg-blue-600"
                        : "bg-gray-400 hover:bg-blue-500"
                    )}
                    onClick={() => handleReassign(num)}
                  >
                    Set as Secondary {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {articleCategory === "secondary" && currentSecondaryArticle && (
            <div className="mt-4 p-4 bg-orange-200 dark:bg-orange-900 rounded-md libre-regular">
              <p className="text-yellow-900 dark:text-yellow-100">
                The following article from Secondary {secondarySlot} will be moved to Regular:
              </p>
              <div className="mt-2">
                <h2 className="text-xl libre-bold">{currentSecondaryArticle.title}</h2>
                <p className="text-neutral-700 dark:text-neutral-300 libre-regular">
                  {currentSecondaryArticle.slug} •{" "}
                  {getAuthorNames(currentSecondaryArticle.authors)} •{" "}
                  {currentSecondaryArticle.published_at
                    ? `Published: ${currentSecondaryArticle.published_at}`
                    : "Not Published"}
                </p>
              </div>
            </div>
          )}

          {/* Display warning when existing secondary article will be moved to regular due to reassigning primary */}
          {articleCategory === "primary" &&
            typeof reassignTarget === "number" &&
            existingSecondaryArticle && (
              <div className="mt-4 p-4 bg-orange-200 dark:bg-orange-900 rounded-md libre-regular">
                <p className="text-yellow-900 dark:text-yellow-100">
                  The following article from Secondary {reassignTarget} will be moved to
                  Regular due to reassignment:
                </p>
                <div className="mt-2">
                  <h2 className="text-xl libre-bold">{existingSecondaryArticle.title}</h2>
                  <p className="text-neutral-700 dark:text-neutral-300 libre-regular">
                    {existingSecondaryArticle.slug} •{" "}
                    {getAuthorNames(existingSecondaryArticle.authors)} •{" "}
                    {existingSecondaryArticle.published_at
                      ? `Published: ${existingSecondaryArticle.published_at}`
                      : "Not Published"}
                  </p>
                </div>
              </div>
            )}
        </>
      )}

      <motion.button
        onClick={handleSave}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        whileTap={{ scale: 0.98 }}
      >
        {article ? "Update Article" : "Publish Article"}
      </motion.button>
    </div>
  );
};

// Helper function to get the author names
const getAuthorNames = (
    authors: { name: string } | { name: string }[] | null
  ): string => {
    if (!authors) {
      return "Unknown Author";
    }
    if (Array.isArray(authors)) {
      return authors.length > 0
        ? authors.map((author) => author.name).join(", ")
        : "Unknown Author";
    }
    return authors.name;
  };

export default ArticleForm;
