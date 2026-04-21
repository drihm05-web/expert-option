import React, { createContext, useContext, useState, useEffect } from 'react';

export const defaultSiteOptions = {
  fontHeading: 'Outfit',
  fontBody: 'Outfit',
  landingTitle: 'GLOBAL PROCUREMENT & LOGISTICS',
  landingSubtitle: 'Your trusted partner in high-value cross-border vehicle and machinery sourcing from South Africa.',
  aboutTitle: 'Our Mission',
  aboutImage: 'https://images.unsplash.com/photo-1577953331668-cb0aa7608abf?auto=format&fit=crop&q=80',
  heroImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80',
  tagline: 'THE EXPORT ORACLES',
  serviceVehiclesImage: 'https://images.unsplash.com/photo-1590362891991-f2009d3233bf?q=80&w=2069&auto=format&fit=crop',
  serviceMachineryImage: 'https://images.unsplash.com/photo-1581452292723-d343c683b791?q=80&w=2070&auto=format&fit=crop',
  serviceGoodsImage: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c50a63?q=80&w=2070&auto=format&fit=crop',
};

export const SiteContext = createContext({
  siteData: defaultSiteOptions,
  loading: true,
  refreshSiteData: () => {}
});

export const useSiteData = () => useContext(SiteContext);

export const SiteProvider = ({ children }: { children: React.ReactNode }) => {
  const [siteData, setSiteData] = useState(defaultSiteOptions);
  const [loading, setLoading] = useState(true);

  const fetchGlobalSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const settings = await res.json();
        const newSiteData = { ...defaultSiteOptions };
        settings.forEach((s: any) => {
          if (s.id in newSiteData) {
            (newSiteData as any)[s.id] = s.value;
          }
        });
        setSiteData(newSiteData);
        applyCSSVariables(newSiteData);
      }
    } catch (err) {
      console.error("Failed to load global settings", err);
    } finally {
      setLoading(false);
    }
  };

  const applyCSSVariables = (data: typeof defaultSiteOptions) => {
    document.documentElement.style.setProperty('--custom-heading', `"${data.fontHeading}"`);
    document.documentElement.style.setProperty('--custom-body', `"${data.fontBody}"`);
    
    // Dynamically inject Google Fonts
    const linkId = 'dynamic-google-fonts';
    let link = document.getElementById(linkId) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    const families = [data.fontHeading, data.fontBody, 'Playfair Display'].filter((v, i, a) => a.indexOf(v) === i);
    const fontQuery = families.map(f => `family=${f.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700`).join('&');
    link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
  };

  useEffect(() => {
    fetchGlobalSettings();
  }, []);

  return (
    <SiteContext.Provider value={{ siteData, loading, refreshSiteData: fetchGlobalSettings }}>
      {children}
    </SiteContext.Provider>
  );
};
