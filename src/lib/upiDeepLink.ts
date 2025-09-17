// lib/upiDeepLink.ts
export class UPIDeepLinkService {
  // Generate UPI deep link for different apps
  static generateUPILink(amount: number, upiId: string, note: string = 'QuickBoost Deposit'): {
    universal: string;
    apps: { name: string; url: string; package: string }[];
  } {
    const encodedNote = encodeURIComponent(note);
    
    // Universal UPI link (works on most apps)
    const universalLink = `upi://pay?pa=${upiId}&pn=QuickBoost&am=${amount}&cu=INR&tn=${encodedNote}`;
    
    // App-specific deep links
    const appLinks = {
      phonepe: `phonepe://pay?pa=${upiId}&pn=QuickBoost&am=${amount}&cu=INR`,
      gpay: `tez://upi/pay?pa=${upiId}&pn=QuickBoost&am=${amount}&cu=INR`,
      paytm: `paytmmp://upi/pay?pa=${upiId}&pn=QuickBoost&am=${amount}&cu=INR`,
      bhim: `bhim://upi/pay?pa=${upiId}&pn=QuickBoost&am=${amount}&cu=INR`
    };

    return {
      universal: universalLink,
      apps: [
        {
          name: 'PhonePe',
          url: appLinks.phonepe,
          package: 'com.phonepe.app'
        },
        {
          name: 'Google Pay',
          url: appLinks.gpay,
          package: 'com.google.android.apps.nbu.paisa.user'
        },
        {
          name: 'Paytm',
          url: appLinks.paytm,
          package: 'net.one97.paytm'
        },
        {
          name: 'BHIM',
          url: appLinks.bhim,
          package: 'in.org.npci.upiapp'
        }
      ]
    };
  }

  // Check if UPI app is installed
  static async checkUPIAppInstalled(packageName: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    // This works on mobile devices
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = `intent://${packageName}#Intent;scheme=package;end`;
      document.body.appendChild(iframe);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          document.body.removeChild(iframe);
          resolve(true);
        }, 2000);
      });
    } catch (error) {
      return false;
    }
  }

  // Open UPI app
  static openUPIApp(deepLink: string, fallbackUrl?: string) {
    if (typeof window === 'undefined') return;
    
    window.location.href = deepLink;
    
    // Fallback to app store if app not installed
    setTimeout(() => {
      if (!document.hidden) {
        if (fallbackUrl) {
          window.location.href = fallbackUrl;
        }
      }
    }, 500);
  }
  }
