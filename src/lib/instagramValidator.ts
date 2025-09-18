// lib/instagramValidator.ts
export const validateInstagramProfile = async (username: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    // Method 1: Check via Instagram's API (if available)
    const response = await fetch(`/api/check-instagram?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { exists: data.exists, error: data.error };
    }

    // Method 2: Fallback to client-side validation (basic check)
    // Try to fetch the profile page (this might be rate-limited)
    try {
      const profileResponse = await fetch(`https://www.instagram.com/${username}/`, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      // If we can make the request, assume it exists
      return { exists: true };
    } catch (error) {
      // If HEAD request fails, try alternative methods
    }

    // Method 3: Use a third-party API (you might want to use a service like this)
    try {
      const thirdPartyResponse = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (thirdPartyResponse.ok) {
        const data = await thirdPartyResponse.json();
        return { exists: !!data.data?.user };
      }
    } catch (error) {
      console.log('Third-party API check failed:', error);
    }

    // If all checks fail, assume it exists and let the SMM API handle it
    return { exists: true };

  } catch (error) {
    console.error('Instagram validation error:', error);
    // Don't block the user - let the SMM API handle the final validation
    return { exists: true };
  }
};

// Client-side validation only (no API calls)
export const validateInstagramClientSide = (username: string): { isValid: boolean; error?: string } => {
  if (!username) {
    return { isValid: false, error: 'Please enter an Instagram username' };
  }

  if (username.length < 1 || username.length > 30) {
    return { isValid: false, error: 'Username must be between 1-30 characters' };
  }

  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, periods, and underscores' };
  }

  if (username.includes(' ')) {
    return { isValid: false, error: 'Username cannot contain spaces' };
  }

  return { isValid: true };
};
