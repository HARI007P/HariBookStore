import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="text-white">
      <hr className="border-gray-700" />

      <div className="container mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Quick Links</h3>
          <ul className="space-y-3 text-gray-300">
            <li>
              <Link to="/about" className="hover:text-pink-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-pink-400 transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-pink-400 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-pink-400 transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Contact</h3>
          <p>
            📞 <span className="font-semibold">+91 6305219267</span>
          </p>
          <p>
            📧{" "}
            <a
              href="mailto:info.haribookstore1@gmail.com"
              className="hover:text-pink-400 transition"
            >
              info.haribookstore1@gmail.com
            </a>
          </p>
          <p>
            🏬{" "}
            <a
              href="https://www.google.com/maps?q=bookstore,+Srikakulam,+Andhra+Pradesh,+India+532401"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition underline"
            >
              Srikakulam, Andhra Pradesh
            </a>
          </p>
        </div>

        {/* Social Icons */}
        <div className="text-center md:text-right space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Follow Us</h3>
          <div className="flex justify-center md:justify-end gap-4">
            {/* X (Twitter) */}
            <a
              href="https://x.com/hariBookStore1"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-800 rounded-full hover:bg-pink-500 transition transform hover:scale-110"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.693l-5.24-6.864-6.002 6.864H1.584l7.73-8.84L1.125 2.25H8l4.713 6.3 5.531-6.3z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@hariBookstore1"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-800 rounded-full hover:bg-pink-500 transition transform hover:scale-110"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19.615 3.184C16.011 2.986 7.987 2.986 4.385 3.184 1.44 3.35.5 5.173.5 12c0 6.828.94 8.65 3.885 8.816 3.602.198 11.626.198 15.23 0 2.945-.166 3.885-1.988 3.885-8.816 0-6.827-.94-8.65-3.885-8.816zM9.75 15.568V8.432L15.818 12 9.75 15.568z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/hari.bookstore1/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-800 rounded-full hover:bg-pink-500 transition transform hover:scale-110"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.97.24 2.427.403a4.9 4.9 0 011.772 1.153 4.9 4.9 0 011.153 1.772c.163.457.347 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.403 2.427a4.9 4.9 0 01-1.153 1.772 4.9 4.9 0 01-1.772 1.153c-.457.163-1.257.347-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.427-.403a4.9 4.9 0 01-1.772-1.153 4.9 4.9 0 01-1.153-1.772c-.163-.457-.347-1.257-.403-2.427C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.056-1.17.24-1.97.403-2.427A4.9 4.9 0 013.789 2.95a4.9 4.9 0 011.772-1.153c.457-.163 1.257-.347 2.427-.403C8.416 2.175 8.796 2.163 12 2.163zm0 3.675a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div >
        <p className="text-center text-sm md:text-base text-gray-400">
          © {new Date().getFullYear()}{" "}
          <span className="text-pink-400 font-semibold">Hari Book Store</span>.  
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
