export function initGoogleMaps(apiKey: string, callback?: () => void): void {
  if (typeof window === 'undefined') {
    return;
  }

  if ((window as any).google && (window as any).google.maps) {
    console.log("Google Maps already loaded");
    if (callback) callback();
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    console.log("Google Maps script loaded successfully");
    if (callback) callback();
  };
  
  script.onerror = (error) => {
    console.error("Failed to load Google Maps script:", error);
  };

  document.head.appendChild(script);
}
