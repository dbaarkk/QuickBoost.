// lib/socialUtils.ts
export interface PlatformConfig {
  id: string;
  name: string;
  regex: RegExp;
  example: string;
  cleanPattern: RegExp;
  baseUrl: string;
}

export const PLATFORMS: { [key: string]: PlatformConfig } = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    regex: /(instagram\.com\/|^@?)([a-zA-Z0-9._]+)/i,
    example: 'instagram.com/username or @username',
    cleanPattern: /(https?:\/\/)?(www\.)?instagram\.com\/|@/g,
    baseUrl: 'https://www.instagram.com/'
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    regex: /(facebook\.com\/|^@?)([a-zA-Z0-9.-]+)/i,
    example: 'facebook.com/username or @username',
    cleanPattern: /(https?:\/\/)?(www\.)?facebook\.com\/|@/g,
    baseUrl: 'https://www.facebook.com/'
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter',
    regex: /(twitter\.com\/|^@?)([a-zA-Z0-9_]+)/i,
    example: 'twitter.com/username or @username',
    cleanPattern: /(https?:\/\/)?(www\.)?twitter\.com\/|@/g,
    baseUrl: 'https://twitter.com/'
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    regex: /(tiktok\.com\/@|^@?)([a-zA-Z0-9._]+)/i,
    example: 'tiktok.com/@username or @username',
    cleanPattern: /(https?:\/\/)?(www\.)?tiktok\.com\/@?|@/g,
    baseUrl: 'https://www.tiktok.com/'
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    regex: /(youtube\.com\/@|youtube\.com\/channel\/|^@?)([a-zA-Z0-9_-]+)/i,
    example: 'youtube.com/@username or @username',
    cleanPattern: /(https?:\/\/)?(www\.)?youtube\.com\/(@|channel\/)?|@/g,
    baseUrl: 'https://www.youtube.com/'
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    regex: /(linkedin\.com\/in\/|^@?)([a-zA-Z0-9-]+)/i,
    example: 'linkedin.com/in/username',
    cleanPattern: /(https?:\/\/)?(www\.)?linkedin\.com\/in\/|@/g,
    baseUrl: 'https://www.linkedin.com/in/'
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    regex: /(pinterest\.com\/|^@?)([a-zA-Z0-9_]+)/i,
    example: 'pinterest.com/username',
    cleanPattern: /(https?:\/\/)?(www\.)?pinterest\.com\/|@/g,
    baseUrl: 'https://www.pinterest.com/'
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    regex: /(open\.spotify\.com\/user\/|spotify\.com\/user\/|^@?)([a-zA-Z0-9]+)/i,
    example: 'open.spotify.com/user/username',
    cleanPattern: /(https?:\/\/)?(open\.|www\.)?spotify\.com\/user\/|@/g,
    baseUrl: 'https://open.spotify.com/user/'
  },
  website: {
    id: 'website',
    name: 'Website',
    regex: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/i,
    example: 'example.com',
    cleanPattern: /(https?:\/\/)?(www\.)?/g,
    baseUrl: ''
  },
  google_reviews: {
    id: 'google_reviews',
    name: 'Google Reviews',
    regex: /(google\.com\/maps\/place\/|maps\.app\.goo\.gl\/)([a-zA-Z0-9/+]+)/i,
    example: 'google.com/maps/place/Business+Name',
    cleanPattern: /(https?:\/\/)?(www\.)?google\.com\/maps\/place\/|maps\.app\.goo\.gl\//g,
    baseUrl: 'https://www.google.com/maps/place/'
  }
};

export const detectPlatform = (url: string): { platform: string; username: string; error?: string } => {
  if (!url.trim()) {
    return { platform: 'unknown', username: '', error: 'Please enter a URL' };
  }

  // Test against all platforms
  for (const [platformId, config] of Object.entries(PLATFORMS)) {
    const match = url.match(config.regex);
    if (match && match[2]) {
      const username = match[2].replace(config.cleanPattern, '');
      return { platform: platformId, username };
    }
  }

  // If no platform matched, try to extract domain for website traffic
  const websiteMatch = url.match(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/i);
  if (websiteMatch) {
    return { platform: 'website', username: url.replace(/(https?:\/\/)?(www\.)?/g, '') };
  }

  return { platform: 'unknown', username: '', error: 'Unsupported platform or invalid URL' };
};

export const validateSocialUrl = (url: string, platform: string): { isValid: boolean; username: string; error?: string } => {
  const config = PLATFORMS[platform];
  if (!config) {
    return { isValid: false, username: '', error: 'Unsupported platform' };
  }

  const match = url.match(config.regex);
  if (!match || !match[2]) {
    return { isValid: false, username: '', error: `Invalid ${config.name} URL. Example: ${config.example}` };
  }

  const username = match[2].replace(config.cleanPattern, '');
  
  // Platform-specific validation
  switch (platform) {
    case 'instagram':
    case 'twitter':
    case 'tiktok':
      if (!/^[a-zA-Z0-9._]+$/.test(username)) {
        return { isValid: false, username: '', error: 'Invalid characters in username' };
      }
      break;
    case 'website':
      if (!/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(username)) {
        return { isValid: false, username: '', error: 'Invalid website URL' };
      }
      break;
  }

  return { isValid: true, username };
};

export const formatProfileUrl = (username: string, platform: string): string => {
  const config = PLATFORMS[platform];
  if (!config) return username;
  
  return config.baseUrl + username;
};
