# Project Phoenix: SEO Indexing Implementation Plan

**Objective:** Implement Static Site Generation (SSG) to solve the critical search engine indexing failure. This plan will make all 387+ pages of Project Nightfall visible and indexable by search engines like Google, Bing, and Yandex.

**Chosen Technology:** `vite-plugin-prerender`. This provides a robust, build-time pre-rendering solution with minimal disruption to the existing React 19 + Vite 6.2 codebase.

**AI Coder Directive:** Read this entire document. Analyze the existing project codebase and intelligently apply the following phased implementation plan. Do not overwrite files blindly; modify them contextually based on their existing structure.

---

## Phase 1: Setup & Dependencies

Your first task is to install the necessary pre-rendering tool.

1.  **Analyze `package.json`:** Open the `package.json` file.
2.  **Add Dev Dependency:** Add the following package to the `devDependencies` section. Use the specified version for stability.
    ```json
    "vite-plugin-prerender": "^0.5.11"
    ```
3.  **Install Dependencies:** Run `npm install` (or your package manager's equivalent) to install the new dependency.

---

## Phase 2: Architectural Scaffolding

Next, create the new files required for the pre-rendering process. These files will house the server-side rendering logic.

1.  **Create `entry-prerender.tsx`:** In the `src/` directory, create a new file named `entry-prerender.tsx`. This file will be the server-side entry point for rendering your React app to an HTML string. Populate it with the following content:

    ```typescript
    // src/entry-prerender.tsx
    import React from 'react';
    import { renderToString } from 'react-dom/server';
    import { StaticRouter } from 'react-router-dom/server';
    import { HelmetProvider } from 'react-helmet-async';
    import App from './App'; // Assuming App.tsx is the root component

    // This function will be called by the prerender script for each route.
    export function renderPage(url: string) {
      const helmetContext: { helmet?: any } = {};

      const html = renderToString(
        <React.StrictMode>
          <HelmetProvider context={helmetContext}>
            <StaticRouter location={url}>
              <App />
            </StaticRouter>
          </HelmetProvider>
        </React.StrictMode>
      );

      // Return both the rendered HTML and the captured helmet data (meta tags, title, etc.)
      return {
        html,
        helmet: helmetContext.helmet,
      };
    }
    ```

2.  **Create `prerender.ts`:** In the project's root directory (alongside `vite.config.ts`), create a new file named `prerender.ts`. This script will be the brain of the operation, discovering all routes and orchestrating the rendering for each one. Populate it with the following blueprint (you will complete the rendering logic in Phase 5):

    ```typescript
    // prerender.ts
    import { PrerenderConfig } from 'vite-plugin-prerender';
    import path from 'path';
    import fs from 'fs';

    // AI Coder: Analyze the data files to confirm the export names and paths are correct.
    import { videos } from './src/data/videos';
    import { allCategories } from './src/data/categories'; // Use 'allCategories' for completeness
    import { renderPage } from './src/entry-prerender';

    const prerender: PrerenderConfig['prerender'] = async (manifest, { outDir, route }) => {
        // This is where the magic happens. This function will be detailed in Phase 5.
        // For now, this structure sets up the file.
        return {
            html: `<!DOCTYPE html><html><head></head><body>Rendered route: ${route}</body></html>`,
            links: new Set<string>(),
        };
    };

    const discoverRoutes = () => {
        const routes = new Set<string>();

        // 1. Add static routes
        routes.add('/');
        routes.add('/categories');
        routes.add('/top-rated');
        // Add all legal/static pages
        routes.add('/about-us');
        routes.add('/contact');
        routes.add('/privacy-policy');
        routes.add('/terms-of-service');
        routes.add('/dmca');
        routes.add('/2257-statement');

        // 2. Add dynamic category routes
        allCategories.forEach(category => {
            if (category.slug) routes.add(`/category/${category.slug}`);
        });

        // 3. Add dynamic video routes
        videos.forEach(video => {
            // AI Coder: Analyze the video object in videos.ts to confirm the unique identifier.
            // Assuming 'id' is the unique identifier for the URL.
            if (video.id) routes.add(`/watch/${video.id}`);
        });

        return Array.from(routes);
    };

    export default {
        routes: discoverRoutes(),
        prerender,
    };
    ```

---

## Phase 3: Client-Side Hydration

Now, modify the existing client-side code to "hydrate" the pre-rendered HTML instead of re-rendering it from scratch.

1.  **Analyze `src/index.tsx`:** This is the most critical modification. The current file uses `ReactDOM.createRoot(...).render(...)`. You must change this to support hydration.
2.  **Implement Hydration Logic:** Modify the file to check if the root element already contains server-rendered content. If it does, use `ReactDOM.hydrateRoot`. If not (for development server), fall back to the original `createRoot`.

    **Replace the existing rendering logic with this pattern:**
    ```typescript
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App';
    import './index.css'; // Or your main CSS file
    import { HelmetProvider } from 'react-helmet-async';
    import { BrowserRouter } from 'react-router-dom';

    const container = document.getElementById('root'); // AI Coder: Verify the root element ID is 'root' or 'app' in index.html.

    if (container) {
      const root = (
        <React.StrictMode>
          <HelmetProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </HelmetProvider>
        </React.StrictMode>
      );

      // Check if the container has been pre-rendered
      if (container.hasChildNodes()) {
        ReactDOM.hydrateRoot(container, root);
      } else {
        ReactDOM.createRoot(container).render(root);
      }
    }
    ```
    *Note: Ensure `BrowserRouter` and `HelmetProvider` wrap your `App` here for the client-side, as they were used in `StaticRouter` on the server-side.*

---

## Phase 4: Build Process Integration

Integrate the pre-rendering logic into the Vite build process.

1.  **Analyze `vite.config.ts`:** Open the Vite configuration file.
2.  **Import and Configure the Plugin:** Import `vitePrerenderPlugin` and add it to the `plugins` array. The configuration will point to the `prerender.ts` script you created.

    ```typescript
    // vite.config.ts
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import { vitePrerenderPlugin } from 'vite-plugin-prerender';
    import path from 'path';

    export default defineConfig({
      // ... your existing config (plugins: [react()], etc.)
      plugins: [
        react(),
        // Add the prerender plugin here
        vitePrerenderPlugin({
          // AI Coder: Verify the root element ID from public/index.html and ensure it matches here.
          renderTarget: '#root', 
          prerenderScript: path.resolve(__dirname, 'prerender.ts'), // Path to your prerender script
        }),
      ],
      // ... rest of your config
    });
    ```

3.  **Complete the `prerender.ts` Rendering Logic:** Now, return to `prerender.ts` and implement the main rendering function. This function reads the base `index.html`, injects the rendered React app and meta tags, and returns the final static HTML.

    **Replace the placeholder `prerender` function in `prerender.ts` with this complete version:**
    ```typescript
    // In prerender.ts

    const prerender: PrerenderConfig['prerender'] = async (manifest, { outDir, route }) => {
      const { html: appHtml, helmet } = renderPage(route);

      // 1. Read the base index.html template from the build output
      const template = fs.readFileSync(path.resolve(outDir, 'index.html'), 'utf-8');

      // 2. Inject the rendered app HTML
      let html = template.replace(`<div id="root"></div>`, `<div id="root">${appHtml}</div>`);
      
      // 3. Inject the SEO meta tags, title, etc., from React Helmet
      html = html.replace(/<title>.*<\/title>/, helmet.title.toString());
      html = html.replace(/<meta name="description" content="[^"]*" \/>/, helmet.meta.toString());
      // A more robust replacement for all head elements
      html = html.replace('</head>', `${helmet.meta.toString()}${helmet.link.toString()}${helmet.script.toString()}</head>`);

      return {
        html,
        links: new Set<string>(), // You can implement link discovery later if needed
      };
    };
    ```

---

## Phase 5: SEO & Compliance Enhancement

This is a critical step to ensure the pre-rendered pages are not just visible but also correctly classified by search engines.

**Directive:** Analyze the codebase for a central SEO component (likely `SEOHead.tsx` or similar) or apply this logic directly within page components (`WatchPage.tsx`, `CategoryPage.tsx`, etc.).

1.  **Implement RTA and Adult Meta Tags:** Ensure the following meta tags are present on all relevant pages.
    ```html
    <meta name="RATING" content="RTA-5042-1996-1400-1577-RTA" />
    <meta name="rating" content="adult" />
    ```

2.  **Implement `VideoObject` JSON-LD Schema:** For every video page (`/watch/:id`), a rich `VideoObject` schema is essential. Generate this dynamically using data for the specific video.

    **Example for `WatchPage.tsx` using `react-helmet-async`:**
    ```typescript
    // In WatchPage.tsx, where you have access to `videoData`

    const videoJsonLd = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": videoData.title,
      "description": videoData.description || "Watch this video on Project Nightfall.",
      "thumbnailUrl": videoData.thumbnail,
      "uploadDate": videoData.uploadDate, // AI Coder: Ensure this is in ISO 8601 format
      "duration": videoData.duration,   // AI Coder: Ensure this is in ISO 8601 duration format (e.g., "PT12M34S")
      "embedUrl": videoData.embedUrl,
      "isFamilyFriendly": "false", // This is CRITICAL.
      // ... other properties like interactionStatistic if available
    };

    return (
      <>
        <Helmet>
          {/* ... other tags like title, description ... */}
          <script type="application/ld+json">
            {JSON.stringify(videoJsonLd)}
          </script>
        </Helmet>
        {/* ... rest of the component ... */}
      </>
    );
    ```

---

## Phase 6: Final Verification Protocol

After you have completed the implementation, you must verify that it works correctly before deployment.

1.  **Run Production Build:** Execute `npm run build`. The build process should now take longer as it pre-renders all 387+ pages.
2.  **Inspect Build Output:** Look inside the `dist/` directory. You should now see subdirectories corresponding to your routes (`/category/anal/index.html`, `/watch/123/index.html`, etc.) containing complete HTML files.
3.  **Use Local Preview:** Run `npm run preview` to start a local server for the production build.
4.  **Verify with "View Page Source":**
    *   Navigate to a few pages in your browser (e.g., homepage, a category page, a video page).
    *   Right-click and select **"View Page Source"**.
    *   **CRITICAL:** The source code you see MUST contain the full page content (headings, text, links), not just an empty `<div id="root"></div>`. It must also contain the correct `<title>` and meta tags in the `<head>`.
5.  **Test with Google's Rich Results Test:**
    *   If you can expose your local preview server to the internet (using a tool like `ngrok`), test a few URLs with the [Google Rich Results Test](https://search.google.com/test/rich-results).
    *   The test should show the rendered HTML and successfully detect your `VideoObject` schema.

---

**Conclusion:** Once all phases are complete and the verification protocol passes, the project is ready for deployment. After deploying to Cloudflare Pages, all sitemap and indexing issues in Google Search Console, Bing, and Yandex will be resolved. The site will become fully visible to search engines, enabling the start of organic traffic acquisition.