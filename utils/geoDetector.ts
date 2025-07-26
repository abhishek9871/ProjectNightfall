/**
 * Detects user country using client-side browser APIs only.
 * No external API calls, completely CORS-free and error-free.
 * 
 * @returns Promise<string> - Country code ('IN' for India, 'US' as default)
 */
export async function getUserCountry(): Promise<string> {
  try {
    // Primary detection: Use browser's timezone information
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Check for Indian timezones
    if (timezone === 'Asia/Kolkata' || 
        timezone === 'Asia/Calcutta' ||
        timezone.includes('Asia/Kolkata') || 
        timezone.includes('Asia/Calcutta')) {
      return 'IN';
    }
    
    // Secondary detection: Use browser language/locale settings
    const language = navigator.language || navigator.languages?.[0] || '';
    const languages = navigator.languages || [language];
    
    // Check for Indian language codes
    const indianLanguageCodes = [
      'hi',      // Hindi
      'hi-IN',   // Hindi (India)
      'en-IN',   // English (India)
      'bn-IN',   // Bengali (India)
      'te-IN',   // Telugu (India)
      'mr-IN',   // Marathi (India)
      'ta-IN',   // Tamil (India)
      'gu-IN',   // Gujarati (India)
      'kn-IN',   // Kannada (India)
      'ml-IN',   // Malayalam (India)
      'or-IN',   // Odia (India)
      'pa-IN',   // Punjabi (India)
      'as-IN',   // Assamese (India)
      'ur-IN'    // Urdu (India)
    ];
    
    // Check primary language
    if (indianLanguageCodes.some(code => 
        language.toLowerCase().startsWith(code.toLowerCase()))) {
      return 'IN';
    }
    
    // Check all languages in preference list
    for (const lang of languages) {
      if (indianLanguageCodes.some(code => 
          lang.toLowerCase().startsWith(code.toLowerCase()))) {
        return 'IN';
      }
    }
    
    // Tertiary detection: Check for Indian timezone patterns in resolved options
    try {
      const dateTimeFormat = new Intl.DateTimeFormat('en', { timeZone: timezone });
      const resolvedOptions = dateTimeFormat.resolvedOptions();
      
      // Additional timezone checks
      if (resolvedOptions.timeZone && 
          (resolvedOptions.timeZone.includes('Kolkata') || 
           resolvedOptions.timeZone.includes('Calcutta'))) {
        return 'IN';
      }
    } catch {
      // Silently continue if timezone resolution fails
    }
    
    // Default fallback - no console logs, no errors
    return 'US';
    
  } catch {
    // Silent fallback - never log errors to console
    return 'US';
  }
}