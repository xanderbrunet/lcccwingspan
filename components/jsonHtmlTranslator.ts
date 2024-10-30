export interface ContentItem {
  content: string;
  style?: "bold" | "italic" | "underline" | "strikethrough";
  link?: string;
}

export interface ArticleSection {
  heading: { text: string; style?: string };
  subsections?: SubSection[];
  content?: ContentItem[];
  players?: PlayerHighlight[];
  images?: ImageItem[];
  quote?: Quote;
  additionalInfo?: AdditionalInfo;
}

export interface SubSection {
  subheading: { text: string; style?: string };
  content?: Array<{ set: string; text: ContentItem[] }>;
}

export interface PlayerHighlight {
  name: { text: string; style?: string };
  performance?: { text: ContentItem[] };
  quote?: { text: string; source: string };
}

export interface ImageItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface Quote {
  text: string;
  source: string;
}

export interface AdditionalInfo {
  link?: {
    url: string;
    text: string;
  };
}

export interface Article {
  title: { text: string; style?: string };
  location: { text: string; style?: string };
  intro: { text: string };
  main_image?: string;
  sections: ArticleSection[];
}

/**
 * Translates a given JSON article structure to HTML.
 * @param json - The article JSON to be translated.
 * @returns A string of HTML.
 */
export function jsonToHtml(json: Article): string {
  let html = "";

  // Helper function to apply styles
  const applyStyle = (text: string, style?: string, link?: string): string => {
    let formattedText = text;
    switch (style) {
      case "bold":
        formattedText = `<strong>${formattedText}</strong>`;
        break;
      case "italic":
        formattedText = `<em>${formattedText}</em>`;
        break;
      case "underline":
        formattedText = `<u>${formattedText}</u>`;
        break;
      case "strikethrough":
        formattedText = `<s>${formattedText}</s>`;
        break;
      default:
        break;
    }
    if (link) {
      formattedText = `<a href="${link}" target="_blank" class="text-blue-500 underline">${formattedText}</a>`;
    }
    return formattedText;
  };

  // Main Image using Next.js Image component
  if (json.main_image) {
    html += `<div class="image-container my-6 text-center">
               <img src="${json.main_image}" alt="${json.title.text}" class="rounded-lg mb-4 mx-auto max-w-full h-auto" />
             </div>`;
  }

  // Title with Tailwind CSS spacing
  html += `<h1 class="text-4xl font-bold mb-6">${applyStyle(
    json.title.text,
    json.title.style
  )}</h1>`;

  // Location with Tailwind CSS spacing
  html += `<p class="text-xl italic mb-6">${applyStyle(
    json.location.text,
    json.location.style
  )}</p>`;

  // Intro with Tailwind CSS spacing
  html += `<p class="text-xl mb-8">${json.intro.text}</p>`;

  // Sections with Tailwind CSS formatting
  json.sections.forEach((section) => {
    html += `<h2 class="text-2xl font-semibold mt-12 mb-6">${applyStyle(
      section.heading.text,
      section.heading.style
    )}</h2>`;

    if (section.subsections) {
      section.subsections.forEach((subsection) => {
        html += `<h3 class="text-xl font-semibold mt-10 mb-4">${applyStyle(
          subsection.subheading.text,
          subsection.subheading.style
        )}</h3>`;
        if (subsection.content) {
          subsection.content.forEach((contentItem) => {
            html += `<p class="mb-6 text-xl"><strong>${contentItem.set}:</strong> `;
            contentItem.text.forEach((textItem) => {
              html += `${applyStyle(
                textItem.content,
                textItem.style,
                textItem.link
              )} `;
            });
            html += `</p>`;
          });
        }
      });
    }

    if (section.players) {
      section.players.forEach((player) => {
        html += `<h3 class="text-xl font-semibold mt-10 mb-4">${applyStyle(
          player.name.text,
          player.name.style
        )}</h3>`;
        if (player.performance) {
          html += `<p class="mb-6 text-xl">`;
          player.performance.text.forEach((textItem) => {
            html += `${applyStyle(
              textItem.content,
              textItem.style,
              textItem.link
            )} `;
          });
          html += `</p>`;
        }
        if (player.quote) {
          html += `<blockquote class="border-l-4 border-gray-300 pl-4 my-6 italic text-gray-700 dark:text-gray-300 text-lg">${player.quote.text} - <cite>${player.quote.source}</cite></blockquote>`;
        }
      });
    }

    if (Array.isArray(section.content)) {
      section.content.forEach((contentItem) => {
        html += `<p class="mb-6 text-xl">${applyStyle(
          contentItem.content,
          contentItem.style,
          contentItem.link
        )}</p>`;
      });
    }

    if (section.images) {
      section.images.forEach((image) => {
        html += `<div class="image-container my-8 text-center">
                   <img src="${image.src}" alt="${image.alt}" class="rounded-lg mx-auto max-w-full h-auto" />
                 `;
        if (image.caption) {
          html += `<figcaption class="mt-2 italic text-sm text-gray-600 dark:text-gray-400">${image.caption}</figcaption>`;
        }
        html += `</div>`;
      });
    }

    if (section.quote) {
      html += `<blockquote class="border-l-4 border-gray-300 pl-4 my-8 italic text-gray-700 dark:text-gray-300">${section.quote.text} - <cite>${section.quote.source}</cite></blockquote>`;
    }

    if (section.additionalInfo && section.additionalInfo.link) {
      const link = section.additionalInfo.link;
      html += `<p class="mt-8 text-blue-500 underline">${applyStyle(
        link.text,
        undefined,
        link.url
      )}</p>`;
    }
  });

  return html;
}
