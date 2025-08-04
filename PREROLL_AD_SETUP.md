# ExoClick Pre-Roll VAST Ad Setup Guide

This document explains how to get your live VAST Tag URL from ExoClick and configure it in the application.

## Step 1: Ensure Site is Ready for Approval

Before creating an ad zone, ensure your site meets ExoClick's guidelines to guarantee fast approval:

1. **Content:** Have at least 5-10 pages with substantial content and 3-5 unique, embedded videos. The site must not look "under construction."
2. **Legal Pages:** Your Terms of Service, Privacy Policy, and 2257 Compliance pages must be fully populated and customized with your site's name. Do not use generic templates.
3. **No Excessive Ads:** Ensure the site is clean and doesn't have other intrusive ads that could violate their policies.

## Step 2: Create the "In-Stream Video" Ad Zone

1. Log in to your ExoClick publisher account.
2. Navigate to **"Sites & Zones"** and click **"New Zone"**.
3. Select your approved website.
4. For **"Ad format"**, choose **Video -> In-Stream**.
5. Give the zone a name (e.g., "Site Pre-Roll VAST").
6. **Frequency Capping:** Set to "1 ad every 1 hour" as a good starting point.
7. **Skip Button:** Enable this and set it to appear after 5 seconds.
8. Save the ad zone.

## Step 3: Retrieve and Configure the VAST Tag URL

1. In the "Sites & Zones" list, find your new zone and click **"Get Code"**.
2. Copy the URL from the **"VAST Tag URL"** field. It will look like `https://s.magsrv.com/v1/vast.php?idzone=...`
3. Open the file `src/App.tsx` in the project.
4. Find the `<PreRollModal />` component in the JSX.
5. Replace the placeholder `"https://s.magsrv.com/v1/vast.php?idzone=YOUR_EXOCLICK_VAST_ZONE_ID"` with the actual URL you copied.
6. Save the file and redeploy the application.

Your pre-roll video ads are now live.