"use client";

import { useEffect, useState } from "react";
import { supabase } from "@api/supabaseClient";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navigation } from "@/data/navigation";
import { motion } from "framer-motion";
import { LoadingAnimation } from "@components/loading";

export default function Home() {
  interface Article {
    title: string;
    excerpt: string;
    content: string;
    published_at: string;
    author: { name: string } | null;
    main_image: string;
    slug: string;
  }

  const router = useRouter();
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [secondaryFeatured, setSecondaryFeatured] = useState<Article[]>([]);
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Fetch the primary featured article
        const { data: articles, error } = await supabase
          .from("articles")
          .select(`
            title,
            excerpt,
            content,
            published_at,
            main_image,
            slug,
            author:authors!articles_author_id_fkey (name)
          `)
          .eq("is_primary", true)
          .limit(1);

        if (error) throw error;

        if (articles && articles.length > 0) {
          const article = articles[0];
          const formattedArticle: Article = {
            ...article,
            author: Array.isArray(article.author) ? article.author[0] : article.author || { name: "Unknown" },
            main_image: article.main_image || "",
            slug: article.slug,
            published_at: new Date(article.published_at).toLocaleDateString(),
          };
          setFeaturedArticle(formattedArticle);
        }

        // Fetch secondary articles with one of the secondary primary flags set to true
        const { data: secondaryArticles, error: secondaryError } = await supabase
          .from("articles")
          .select(`
            title,
            excerpt,
            content,
            published_at,
            main_image,
            slug,
            author:authors!articles_author_id_fkey (name)
          `)
          .or("is_secondary_primary_1.eq.true,is_secondary_primary_2.eq.true,is_secondary_primary_3.eq.true,is_secondary_primary_4.eq.true")
          .order("published_at", { ascending: true }) // Optional: Sort by date

        if (secondaryError) throw secondaryError;

        if (secondaryArticles) {
          const formattedSecondary = secondaryArticles.map((article) => ({
            ...article,
            author: Array.isArray(article.author) ? article.author[0] : article.author || { name: "Unknown" },
            main_image: article.main_image || "",
            slug: article.slug,
          }));
          setSecondaryFeatured(formattedSecondary);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleImageLoad = (slug: string) => {
    setImageLoaded((prev) => ({ ...prev, [slug]: true }));
  };

  const handleKeyPress = (event: React.KeyboardEvent, onClick: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      onClick();
    }
  };

  return (
    <div className="h-full w-full">
      {loading && <LoadingAnimation />}

      {!loading && featuredArticle && (
        <motion.div
          className="w-full flex justify-center items-center md:mt-32 mt-20 libre-regular"
          tabIndex={0}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex flex-col lg:flex-row gap-5 hover:bg-neutral-50 dark:hover:bg-neutral-900 items-center p-2 rounded-lg hover:cursor-pointer transition-all duration-300 ease-in-out"
            onClick={() => router.push(`/stories/${featuredArticle.slug}`)}
            onKeyDown={(e) => handleKeyPress(e, () => router.push(`/stories/${featuredArticle.slug}`))}
          >
            <div className="w-full md:w-[440px] h-[240px] md:h-[360px] relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded[featuredArticle.slug] ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  className="rounded-lg transition-all duration-500 ease-in-out"
                  src={featuredArticle.main_image}
                  alt="Featured Article"
                  layout="fill"
                  objectFit="cover"
                  onLoadingComplete={() => handleImageLoad(featuredArticle.slug)}
                />
              </motion.div>
            </div>
            <div className="flex flex-col gap-3 md:ml-5 max-w-prose">
              <div className="flex items-center gap-3 text-base md:text-lg">
                <p>{featuredArticle.author?.name || "Unknown"}</p>
                <div className="bg-black dark:bg-white rounded-full w-1 h-1">&nbsp;</div>
                <p>{new Date(featuredArticle.published_at).toLocaleDateString()}</p>
              </div>
              <h1 className="text-xl md:text-3xl font-bold">{featuredArticle.title}</h1>
              {featuredArticle.excerpt && <p className="text-base md:text-lg">{featuredArticle.excerpt}</p>}
            </div>
          </motion.div>
        </motion.div>
      )}

      {!loading && secondaryFeatured.length > 0 && (
        <>
          <div className="justify-between flex items-center mt-20 px-4 text-lg md:text-xl libre-medium-heavy">
            <p>Latest Stories:</p>
            <Link href={navigation.links.stories.url} className="text-base md:text-lg p-4 hover:underline" tabIndex={0}>
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 libre-regular">
            {secondaryFeatured.map((article, index) => (
              <motion.div
                key={index}
                className="md:p-4 p-1 rounded-lg flex flex-col items-start hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:cursor-pointer"
                tabIndex={0}
                onClick={() => router.push(`/stories/${article.slug}`)}
                onKeyDown={(e) => handleKeyPress(e, () => router.push(`/stories/${article.slug}`))}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <motion.div
                  className="w-full md:w-[320px] h-[180px] md:h-[240px] relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded[article.slug] ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    className="rounded-lg transition-all duration-500 ease-in-out"
                    src={article.main_image}
                    alt="Secondary Article"
                    layout="fill"
                    objectFit="cover"
                    onLoadingComplete={() => handleImageLoad(article.slug)}
                  />
                </motion.div>
                <div className="flex items-center md:flex-row flex-col gap-2 mt-3 text-base md:text-lg">
                  <p>{article.author?.name || "Unknown"}</p>
                  <div className="bg-black dark:bg-white rounded-full w-1 h-1 md:block hidden">&nbsp;</div>
                  <p>{new Date(article.published_at).toLocaleDateString()}</p>
                </div>
                <h2 className="text-xl md:text-2xl font-bold mt-2">{article.title}</h2>
                {article.excerpt && <p className="text-base md:text-lg mt-1">{article.excerpt}</p>}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
