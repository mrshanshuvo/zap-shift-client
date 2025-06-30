import React, { useState } from "react";
import {
  FaTwitter,
  FaYoutube,
  FaFacebookF,
  FaLinkedin,
  FaInstagram,
  FaChevronUp,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import PropTypes from "prop-types";
import ProFastLogo from "../ProFastLogo/ProFastLogo";

const Footer = ({ foundingYear = 2020 }) => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log("Subscribed with:", email);
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const socialLinks = [
    {
      name: "Twitter",
      url: "https://twitter.com/profast",
      icon: <FaTwitter className="hover:scale-110 transition-transform" />,
      label: "Follow us on Twitter",
    },
    {
      name: "YouTube",
      url: "https://youtube.com/profast",
      icon: <FaYoutube className="hover:scale-110 transition-transform" />,
      label: "Subscribe to our YouTube channel",
    },
    {
      name: "Facebook",
      url: "https://facebook.com/profast",
      icon: <FaFacebookF className="hover:scale-110 transition-transform" />,
      label: "Like us on Facebook",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/profast",
      icon: <FaLinkedin className="hover:scale-110 transition-transform" />,
      label: "Connect with us on LinkedIn",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/profast",
      icon: <FaInstagram className="hover:scale-110 transition-transform" />,
      label: "Follow us on Instagram",
    },
  ];

  const contactInfo = [
    {
      icon: <MdEmail className="text-xl" />,
      text: "support@profast.com",
      url: "mailto:support@profast.com",
    },
    {
      icon: <MdPhone className="text-xl" />,
      text: "+1 (555) 123-4567",
      url: "tel:+15551234567",
    },
    {
      icon: <MdLocationOn className="text-xl" />,
      text: "123 Business Ave, Suite 100, San Francisco, CA 94107",
    },
  ];

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Blog", path: "/blog" },
        { name: "Press", path: "/press" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", path: "/help" },
        { name: "Tutorials", path: "/tutorials" },
        { name: "Webinars", path: "/webinars" },
        { name: "Documentation", path: "/docs" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Cookie Policy", path: "/cookies" },
        { name: "GDPR", path: "/gdpr" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info & Newsletter */}
          <div className="space-y-6">
            <ProFastLogo className="h-10 w-auto" aria-label="ProFast Logo" />
            <p className="text-sm leading-relaxed">
              Empowering businesses with cutting-edge solutions since{" "}
              {foundingYear}. Join our newsletter to stay updated with the
              latest features and news.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-lg transition-colors duration-300"
                >
                  Subscribe
                </button>
              </div>
              {isSubscribed && (
                <p className="text-green-400 text-sm">
                  Thank you for subscribing!
                </p>
              )}
              <p className="text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>

          {/* Footer Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-white font-semibold text-lg">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.path}
                      className="hover:text-white hover:underline transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="mt-1 text-primary">{item.icon}</span>
                  {item.url ? (
                    <a
                      href={item.url}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <h4 className="text-white font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="bg-gray-800 hover:bg-primary hover:text-white p-3 rounded-full transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Back to Top */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            <p>
              &copy; {foundingYear}
              {currentYear !== foundingYear && `-${currentYear}`} ProFast
              Technologies. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="/privacy"
              className="hover:text-white transition-colors duration-200 text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-white transition-colors duration-200 text-sm"
            >
              Terms of Service
            </a>
            <a
              href="/cookies"
              className="hover:text-white transition-colors duration-200 text-sm"
            >
              Cookie Policy
            </a>
          </div>

          {isVisible && (
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
            >
              <FaChevronUp />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  foundingYear: PropTypes.number,
};

export default Footer;
