import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Mail, MessageCircle } from 'lucide-react';

interface MenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

interface SocialItem {
  label: string;
  link: string;
}

interface StaggeredMenuProps {
  position?: 'left' | 'right';
  items: MenuItem[];
  socialItems?: SocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  changeMenuColorOnOpen?: boolean;
  colors?: [string, string];
  logoUrl?: string;
  accentColor?: string;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  items,
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  colors = ['#B19EEF', '#5227FF'],
  logoUrl,
  accentColor = '#ff6b6b',
  onMenuOpen,
  onMenuClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      onMenuOpen?.();
    } else {
      onMenuClose?.();
    }
  };

  const handleMenuItemClick = (link: string) => {
    if (link && link !== '#') {
      navigate(link);
    }
    setIsOpen(false);
    onMenuClose?.();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleContactClick = (type: 'telegram' | 'email') => {
    if (type === 'telegram') {
      window.open('https://t.me/quickboostsupport', '_blank');
    } else {
      window.open('mailto:quickboostbusiness@gmail.com', '_blank');
    }
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="p-3 rounded-full transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: isOpen && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor,
          color: isOpen && changeMenuColorOnOpen ? '#000' : '#000',
        }}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
            opacity: isOpen ? 1 : 0,
          }}
          onClick={toggleMenu}
        />
      )}

      {/* Menu Content */}
      <div
        className={`fixed inset-0 z-40 flex items-center justify-center transition-all duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        }}
      >
        <div className="text-center">
          {/* Logo */}
          {logoUrl && (
            <div className="mb-12">
              <img src={logoUrl} alt="Logo" className="h-16 mx-auto" />
            </div>
          )}

          {/* Menu Items */}
          <nav className="mb-12">
            <ul className="space-y-6">
              {items.map((item, index) => (
                <li
                  key={item.label}
                  className={`transform transition-all duration-700 ${
                    isOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  {item.label === 'Contact Us' ? (
                    <div className="space-y-4">
                      <div className="text-4xl font-bold text-white mb-4">
                        {displayItemNumbering && (
                          <span className="text-2xl opacity-60 mr-4">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        )}
                        Contact Us
                      </div>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleContactClick('telegram')}
                          className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
                        >
                          <MessageCircle size={20} />
                          <span>Telegram</span>
                        </button>
                        <button
                          onClick={() => handleContactClick('email')}
                          className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
                        >
                          <Mail size={20} />
                          <span>Email</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <a
                      onClick={() => handleMenuItemClick(item.link)}
                      aria-label={item.ariaLabel}
                      className="block text-4xl font-bold text-white hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                    >
                      {displayItemNumbering && (
                        <span className="text-2xl opacity-60 mr-4">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      )}
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Links */}
          {displaySocials && socialItems.length > 0 && (
            <div
              className={`transform transition-all duration-700 ${
                isOpen
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: `${items.length * 100}ms`,
              }}
            >
              <div className="flex justify-center space-x-8">
                {socialItems.map((social) => (
                  <a
                    key={social.label}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white text-lg transition-colors duration-300"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StaggeredMenu;