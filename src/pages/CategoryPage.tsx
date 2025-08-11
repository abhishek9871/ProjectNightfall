import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { categories } from '../../data/categories';
import { videos } from '../../data/videos';
import { VideoCard } from '../../components/VideoCard';
import { Breadcrumb } from '../../components/Breadcrumb';
import { categoryContent } from '../data/categoryContent';
import { Video } from '../../types';

interface BreadcrumbItem {
  name: string;
  url?: string;
}

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentPageNum, setCurrentPageNum] = useState(1);
  
  const category = categories.find(c => c.slug === slug);
  
  if (!category) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Category Not Found</h1>
          <p className="text-slate-400 mb-6">The category you're looking for doesn't exist.</p>
          <Link 
            to="/" 
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const filteredVideos = useMemo(() => {
    return videos.filter(v => 
      v.category.toLowerCase() === category.id.toLowerCase()
    );
  }, [category.id]);

  // Get enriched content for this category
  const content = categoryContent[category.id] || categoryContent[category.slug];
  const pageTitle = content?.title || `Best ${category.name} Videos - Project Nightfall`;
  const metaDescription = content?.metaDescription || `Discover ${filteredVideos.length} of the best ${category.name} videos. ${category.description}`;

  // Generate comprehensive JSON-LD schema
  useEffect(() => {
    if (!category || !content) return;

    // Clean up existing schemas
    const existingSchemas = document.querySelectorAll('script[data-category-schema]');
    existingSchemas.forEach(script => script.remove());

    try {
      // 1. WebPage Schema
      const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": pageTitle,
        "description": metaDescription,
        "url": `https://project-nightfall.pages.dev/category/${slug}`,
        "mainEntity": {
          "@type": "ItemList",
          "name": `${category.name} Videos`,
          "description": content.intro,
          "numberOfItems": filteredVideos.length,
          "itemListElement": filteredVideos.slice(0, 10).map((video, index) => ({
            "@type": "VideoObject",
            "position": index + 1,
            "name": video.title,
            "description": video.description,
            "thumbnailUrl": video.thumbnailUrl,
            "uploadDate": video.uploadDate,
            "duration": `PT${video.duration.replace(':', 'M')}S`,
            "contentUrl": video.embedUrls[0],
            "embedUrl": video.embedUrls[0],
            "genre": video.category,
            "isFamilyFriendly": false,
            "contentRating": "adult"
          }))
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://project-nightfall.pages.dev"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": category.name,
              "item": `https://project-nightfall.pages.dev/category/${slug}`
            }
          ]
        }
      };

      // 2. FAQ Schema
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": content.faqs.map((faq: any) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      };

      // 3. CollectionPage Schema
      const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${category.name} Porn Videos`,
        "description": content.intro,
        "url": `https://project-nightfall.pages.dev/category/${slug}`,
        "mainEntity": {
          "@type": "VideoGallery",
          "name": `${category.name} Video Collection`,
          "description": content.intro,
          "numberOfItems": filteredVideos.length
        },
        "publisher": {
          "@type": "Organization",
          "name": "Project Nightfall",
          "url": "https://project-nightfall.pages.dev"
        }
      };

      // Inject schemas
      const schemas = [webPageSchema, faqSchema, collectionSchema];
      schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-category-schema', `schema-${index}`);
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });

    } catch (error) {
      console.error('Error injecting category schemas:', error);
    }

    // Cleanup function
    return () => {
      const schemas = document.querySelectorAll('script[data-category-schema]');
      schemas.forEach(script => script.remove());
    };
  }, [category, content, filteredVideos, pageTitle, metaDescription, slug]);

  // Breadcrumb items for the new Breadcrumb component format
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    { name: category.name }
  ];

  // Dummy video click handler - in a real implementation this would trigger modals
  const handleVideoCardClick = (video: Video) => {
    // For now, just navigate to watch page
    window.location.href = `/watch/${video.id}`;
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${category.name.toLowerCase()}, ${category.name.toLowerCase()} porn, ${category.name.toLowerCase()} videos, ${category.name.toLowerCase()} sex, adult videos, porn videos, HD porn`} />
        <link rel="canonical" href={`https://project-nightfall.pages.dev/category/${slug}`} />
        
        {/* Adult Content Rating */}
        <meta name="rating" content="adult" />
        <meta name="content-rating" content="mature" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={`https://project-nightfall.pages.dev/category/${slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Project Nightfall" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:site" content="@ProjectNightfall" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="Project Nightfall" />
        <meta name="publisher" content="Project Nightfall" />
      </Helmet>

      <div className="bg-slate-950 text-slate-300 min-h-screen">
        <main className="flex-1 lg:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Simple breadcrumb for now */}
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link 
                    to="/" 
                    className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-purple-400 transition-colors"
                  >
                    <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="text-sm font-medium text-slate-300" aria-current="page">
                      {category.name}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {category.name} Videos
              </h1>
              
              {/* Introductory Content */}
              {content?.intro && (
                <div className="bg-slate-900 rounded-lg p-6 mb-6">
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {content.intro}
                  </p>
                </div>
              )}
              
              <p className="text-slate-500 text-sm mb-6">
                Discover {filteredVideos.length} of the best {category.name} videos.
              </p>
            </div>

            {/* FAQ Section */}
            {content?.faqs && content.faqs.length > 0 && (
              <div className="bg-slate-900 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {content.faqs.map((faq: any, index: number) => (
                    <div key={index} className="border-b border-slate-800 pb-4 last:border-b-0 last:pb-0">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-slate-300 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">No videos found in this category.</p>
                <p className="text-slate-500 mt-2">Check back later for new content.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onVideoCardClick={handleVideoCardClick}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default CategoryPage;