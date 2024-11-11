"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@api/supabaseClient";
import { jsonToHtml, Article } from "@components/jsonHtmlTranslator";
import React from "react";
import { motion } from "framer-motion"; // Import framer-motion
import { LoadingAnimation } from "@/components/loading";

const StoryPage: React.FC = () => {
  const { slug } = useParams();
  const [articleData, setArticleData] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        console.log("Fetching article with slug:", slug);
        const trimmedSlug = slug.toString().trim();

        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("slug", trimmedSlug)
          .single();

        if (error) {
          console.error("Error querying database:", error);
          throw new Error("Article not found or query failed.");
        }

        if (!data) {
          console.error("No data returned for slug:", trimmedSlug);
          throw new Error("Article not found.");
        }

        console.log("Data fetched from database:", data);

        setArticleData(data.content);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching article:", error.message);
        } else {
          console.error("Error fetching article:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <LoadingAnimation />
    );
  }

  if (!articleData) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Article not found or there was an error fetching data.
      </motion.p>
    );
  }

  // Convert the JSON structure to HTML using the translator function
  const htmlContent = jsonToHtml(articleData);

  return (
    <motion.div
      className="max-w-prose mx-auto mt-20 libre-regular bg-background p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </motion.div>
  );
};

export default StoryPage;
