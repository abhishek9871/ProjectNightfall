export async function getUserCountry(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code || 'US'; // Default to US
  } catch (error) {
    console.error('Geo detection failed:', error);
    return 'US'; // Fallback
  }
}