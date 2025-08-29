import React from "react";
import { Link } from "react-router-dom";
export default function PrivacyPolicy() {
  const updated = "August 17, 2025"; // change as needed
  return (
    <main className="min-h-screen  text-white">
      <div className=" flex   mx-auto px-4 py-2 "> 
                  <Link
                    to="/"
                    className="px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl shadow-md transition"
                  >
                    ⬅ Back to Home
                  </Link>
                </div>
      
      <section className="max-w-5xl mx-auto px-4 py-10">
          
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-sm  mt-2">Last updated: {updated}</p>
        </header>

        {/* TOC */}
        <nav className=" rounded-2xl shadow p-4 mb-8">
          <p className="font-semibold mb-2">Contents</p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            <li><a href="#info-we-collect" className="hover:text-pink-600">1. Information We Collect</a></li>
            <li><a href="#how-we-use" className="hover:text-pink-600">2. How We Use Your Information</a></li>
            <li><a href="#sharing" className="hover:text-pink-600">3. Sharing & Disclosure</a></li>
            <li><a href="#cookies" className="hover:text-pink-600">4. Cookies & Tracking</a></li>
            <li><a href="#data-security" className="hover:text-pink-600">5. Data Security</a></li>
            <li><a href="#your-rights" className="hover:text-pink-600">6. Your Rights & Choices</a></li>
            <li><a href="#retention" className="hover:text-pink-600">7. Data Retention</a></li>
            <li><a href="#children" className="hover:text-pink-600">8. Children’s Privacy</a></li>
            <li><a href="#intl" className="hover:text-pink-600">9. International Transfers</a></li>
            <li><a href="#changes" className="hover:text-pink-600">10. Changes to This Policy</a></li>
            <li><a href="#contact" className="hover:text-pink-600">11. Contact Us</a></li>
          </ul>
        </nav>

        <div className="space-y-8">
          <section id="intro" className=" rounded-2xl shadow p-6">
            <p>
              This Privacy Policy describes how <span className="font-semibold">Hari Book Store</span>
              {" "} (“we”, “us”, or “our”) collects, uses, and shares your information when you
              visit our website, create an account, or purchase products and services.
            </p>
          </section>

          <section id="info-we-collect" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-semibold">Account & Contact Data:</span> name, email, phone, address.</li>
              <li><span className="font-semibold">Order & Payment Data:</span> order history, transaction details (processed via secure payment gateways; we do not store full card numbers).</li>
              <li><span className="font-semibold">Usage Data:</span> pages visited, device/browser info, IP address.</li>
              <li><span className="font-semibold">Communications:</span> messages you send to our support or feedback forms.</li>
            </ul>
          </section>

          <section id="how-we-use" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Process orders, payments, deliveries, and returns.</li>
              <li>Provide customer support and respond to inquiries.</li>
              <li>Improve our website, products, and user experience.</li>
              <li>Send transactional emails; with consent, send marketing updates (you can opt out anytime).</li>
              <li>Detect, prevent, and address technical or security issues and fraud.</li>
            </ul>
          </section>

          <section id="sharing" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">3. Sharing & Disclosure</h2>
            <p className="mb-2">
              We may share information with trusted providers who help us run our business, such as:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Payment processors, shipping partners, analytics providers, and email services.</li>
              <li>Compliance with legal obligations, court orders, or to protect rights and safety.</li>
            </ul>
            <p className="mt-2">We do not sell your personal information.</p>
          </section>

          <section id="cookies" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">4. Cookies & Tracking</h2>
            <p className="mb-2">
              We use cookies and similar technologies to remember your preferences, analyze traffic,
              and personalize content. You can control cookies via your browser settings. Disabling
              cookies may affect site functionality.
            </p>
          </section>

          <section id="data-security" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">5. Data Security</h2>
            <p>
              We implement administrative, technical, and physical safeguards designed to protect
              your data. However, no method of transmission or storage is 100% secure.
            </p>
          </section>

          <section id="your-rights" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">6. Your Rights & Choices</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access, correct, or delete your personal information.</li>
              <li>Opt out of marketing emails via the unsubscribe link.</li>
              <li>Request a copy of your data or restrict certain processing (subject to local laws).</li>
            </ul>
          </section>

          <section id="retention" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">7. Data Retention</h2>
            <p>
              We retain information only as long as necessary for the purposes outlined in this
              policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section id="children" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">8. Children’s Privacy</h2>
            <p>
              Our services are not directed to children under 13. If you believe a child has provided
              us personal data, please contact us and we will take appropriate steps.
            </p>
          </section>

          <section id="intl" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">9. International Transfers</h2>
            <p>
              Your data may be transferred and processed outside your country. We take steps to ensure
              appropriate safeguards are in place.
            </p>
          </section>

          <section id="changes" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be
              highlighted on this page with a new “Last updated” date.
            </p>
          </section>

          <section id="contact" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">11. Contact Us</h2>
            <p>
              Questions? Email{" "}
              <a href="mailto:privacy.haribookstore@gmail.com" className="text-blue-500 hover:underline font-semibold">
                privacy.haribookstore@gmail.com
              </a>{" "}
              or write to: Hari Book Store, 4-47 Main Street, Srikakulam, Andhara Pradesh , India. Phone: +91 6305219267
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
