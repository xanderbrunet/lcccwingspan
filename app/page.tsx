"use client";
import { useEffect, useState } from "react";
import { supabase } from "@api/supabaseClient";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { navigation } from "@/data/navigation";

export default function Home() {
  // Define the structure of an article to maintain consistency throughout the component
  interface Article {
    title: string;
    excerpt: string;
    content: string;
    published_at: string;
    author: { name: string } | null;
    main_image: string; // Add the main_image field
    slug: string; // Add slug field for navigation
  }

  const router = useRouter(); // Initialize Next.js router

  // State for storing the primary featured article
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);

  // Loading state to track if the data is still being fetched
  const [loading, setLoading] = useState(true);

  // State for storing the secondary featured articles
  const [secondaryFeatured, setSecondaryFeatured] = useState<Article[]>([]);

  // Effect hook to fetch the articles when the component is mounted
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Fetch primary article marked as `is_primary`
        const { data: articles, error } = await supabase
          .from("articles")
          .select(
            `
          title,
          excerpt,
          content,
          published_at,
          main_image,
          slug,
          author:authors!articles_author_id_fkey (name)
        `
          )
          .eq("is_primary", true)
          .limit(1); // Limit to one primary article

        if (error) throw error;

        // If primary article is fetched, set it to the state
        if (articles && articles.length > 0) {
          const article = articles[0];
          // Format the author field to ensure it is always an object
          const formattedArticle: Article = {
            ...article,
            author: Array.isArray(article.author)
              ? article.author[0]
              : article.author || { name: "Unknown" },
            main_image: article.main_image || "",
            slug: article.slug,
          };
          setFeaturedArticle(formattedArticle);
        }

        // Fetch up to 4 secondary featured articles marked as `is_secondary_primary`
        const { data: secondaryArticles, error: secondaryError } =
          await supabase
            .from("articles")
            .select(
              `
            title,
            excerpt,
            content,
            published_at,
            main_image,
            slug,
            author:authors!articles_author_id_fkey (name)
          `
            )
            .eq("is_secondary_primary", true)
            .limit(4)
            .order("published_at", { ascending: false }); // Order by published date, most recent first

        if (secondaryError) throw secondaryError;

        // If secondary articles are fetched, set them to the state
        if (secondaryArticles) {
          const formattedSecondary = secondaryArticles.map((article) => ({
            ...article,
            author: Array.isArray(article.author)
              ? article.author[0]
              : article.author || { name: "Unknown" },
            main_image: article.main_image || "",
            slug: article.slug,
          }));
          setSecondaryFeatured(formattedSecondary);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        // Set loading to false after fetching is done
        setLoading(false);
      }
    };

    fetchArticles();
  }, []); // Empty dependency array ensures this effect runs only once

  // Function to handle key press to simulate click on Enter or Space
  const handleKeyPress = (event: React.KeyboardEvent, onClick: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      onClick();
    }
  };

  return (
    <div className="h-full w-full">
      {/* Featured Article Section */}
      {!loading && featuredArticle && (
        <div
          className="w-full flex justify-center items-center md:mt-32 mt-20 libre-regular"
          tabIndex={0} // Make this element focusable
          onClick={() => router.push(`/stories/${featuredArticle.slug}`)} // Navigate using the slug
          onKeyDown={(e) =>
            handleKeyPress(e, () =>
              router.push(`/stories/${featuredArticle.slug}`)
            )
          } // Handle key press for accessibility
        >
          <div className="flex flex-col md:flex-row gap-5 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors items-center p-2 rounded-lg hover:cursor-pointer">
            {/* Wrapper for Image with responsive height and width */}
            <div className="w-full md:w-[440px] h-[240px] md:h-[360px] relative">
              <Image
                className="rounded-lg"
                src={featuredArticle.main_image}
                alt="Featured Article"
                layout="fill" // Fill the wrapper div
                objectFit="cover" // Ensure the image is zoomed to fill the space and maintain aspect ratio
              />
            </div>
            <div className="flex flex-col gap-3 md:ml-5 max-w-prose">
              {/* Author name and published date */}
              <div className="flex items-center gap-3 text-base md:text-lg">
                <p>{featuredArticle.author?.name || "Unknown"}</p>
                <div className="bg-black dark:bg-white rounded-full w-1 h-1">
                  &nbsp;
                </div>
                <p>
                  {new Date(featuredArticle.published_at).toLocaleDateString()}
                </p>
              </div>
              {/* Title and excerpt of the primary featured article */}
              <h1 className="text-xl md:text-3xl font-bold">
                {featuredArticle.title}
              </h1>
              {featuredArticle.excerpt && (
                <p className="text-base md:text-lg">
                  {featuredArticle.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section Title for Latest Stories with a link to view all stories */}
      <div className="justify-between flex items-center mt-20 px-4 text-lg md:text-xl libre-medium-heavy">
        <p>Latest Stories:</p>
        <Link
          href={navigation.links.stories.url}
          className="text-base md:text-lg p-4 hover:underline"
          tabIndex={0}
        >
          View All
        </Link>
      </div>

      {/* Secondary Featured Articles Grid Section */}
      {!loading && secondaryFeatured.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 libre-regular">
          {secondaryFeatured.map((article, index) => (
            <div
              key={index}
              className="md:p-4 p-1 rounded-lg flex flex-col items-start hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:cursor-pointer"
              tabIndex={0} // Make each article focusable
              onClick={() => router.push(`/stories/${article.slug}`)} // Navigate using the slug
              onKeyDown={(e) =>
                handleKeyPress(e, () => router.push(`/stories/${article.slug}`))
              } // Handle key press for accessibility
            >
              {/* Wrapper for Image with responsive height and width */}
              <div className="w-full md:w-[320px] h-[180px] md:h-[240px] relative">
                <Image
                  className="rounded-lg"
                  src={article.main_image}
                  alt="Secondary Article"
                  layout="fill" // Fill the wrapper div
                  objectFit="cover" // Ensure the image is zoomed to fill the space and maintain aspect ratio
                />
              </div>
              {/* Author name and published date */}
              <div className="flex items-center md:flex-row flex-col gap-2 mt-3 text-base md:text-lg">
                <p>{article.author?.name || "Unknown"}</p>
                <div className="bg-black dark:bg-white rounded-full w-1 h-1 md:block hidden">
                  &nbsp;
                </div>
                <p>{new Date(article.published_at).toLocaleDateString()}</p>
              </div>
              {/* Title and excerpt of the secondary article */}
              <h2 className="text-xl md:text-2xl font-bold mt-2">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="text-base md:text-lg mt-1">{article.excerpt}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Section Title for Podcasts with a link to view all stories */}
      <div className="justify-between flex items-center mt-20 px-4 text-lg md:text-xl libre-medium-heavy">
        <p>Podcasts:</p>
        <Link
          href={navigation.links.stories.url}
          className="text-base md:text-lg p-4 hover:underline"
          tabIndex={0}
        >
          View All
        </Link>
      </div>
    </div>
  );
}
