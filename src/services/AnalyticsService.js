// src/services/AnalyticsService.js

/**
 * Sets the user properties for the A/B test in Google Analytics.
 * This should be called once when a user is first assigned to a variant.
 * @param {string} experimentName - The name of the experiment.
 * @param {string} variantName - The name of the assigned variant.
 */
export const setUserExperimentProperties = (experimentName, variantName) => {
    if (typeof window.gtag === 'function') {
        window.gtag('set', 'user_properties', {
            experiment_name: experimentName,
            experiment_variant: variantName,
        });
        console.log(`GA: User property set - ${experimentName}: ${variantName}`);
    }
};

/**
 * Tracks an ad impression event.
 * @param {string} experimentName - The name of the experiment.
 * @param {string} adNetwork - The ad network that was shown.
 */
export const trackAdImpression = (experimentName, adNetwork) => {
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'ad_impression', {
            event_category: 'A/B Testing',
            event_label: `${experimentName} - ${adNetwork}`,
            ad_network: adNetwork,
        });
        console.log(`GA: Event tracked - ad_impression for ${adNetwork}`);
    }
};