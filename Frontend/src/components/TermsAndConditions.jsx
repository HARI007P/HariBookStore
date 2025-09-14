import React from "react";
import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  const updated = "August 17, 2025";
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
          <h1 className="text-3xl md:text-4xl font-bold">Terms & Conditions</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: {updated}</p>
        </header>

        {/* TOC */}
        <nav className=" rounded-2xl shadow p-4 mb-8">
          <p className="font-semibold mb-2">Contents</p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            <li><a href="#acceptance" className="hover:text-pink-600">1. Acceptance of Terms</a></li>
            <li><a href="#accounts" className="hover:text-pink-600">2. Accounts & Eligibility</a></li>
            <li><a href="#orders" className="hover:text-pink-600">3. Orders, Pricing & Payments</a></li>
            <li><a href="#shipping" className="hover:text-pink-600">4. Shipping & Delivery</a></li>
            <li><a href="#returns" className="hover:text-pink-600">5. Returns & Refunds</a></li>
            <li><a href="#use" className="hover:text-pink-600">6. Acceptable Use</a></li>
            <li><a href="#ip" className="hover:text-pink-600">7. Intellectual Property</a></li>
            <li><a href="#disclaimers" className="hover:text-pink-600">8. Disclaimers & Liability</a></li>
            <li><a href="#indemnity" className="hover:text-pink-600">9. Indemnification</a></li>
            <li><a href="#law" className="hover:text-pink-600">10. Governing Law</a></li>
            <li><a href="#changes" className="hover:text-pink-600">11. Changes to Terms</a></li>
            <li><a href="#contact" className="hover:text-pink-600">12. Contact</a></li>
          </ul>
        </nav>

        <div className="space-y-8">
          <section id="acceptance" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Hari Book Store website and services, you agree to be bound
              by these Terms & Conditions. If you do not agree, please do not use our services.
            </p>
          </section>

          <section id="accounts" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">2. Accounts & Eligibility</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You must be at least 13 years old to use our services.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>Provide accurate information and promptly update any changes.</li>
            </ul>
          </section>

          <section id="orders" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">3. Orders, Pricing & Payments</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>All prices are listed in INR unless stated otherwise and are subject to change.</li>
              <li>Placing an order constitutes an offer; we may accept or cancel at our discretion (e.g., stock issues, pricing errors).</li>
              <li>Payments are processed securely by third-party gateways; we do not store full card details.</li>
            </ul>
          </section>

          <section id="shipping" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">4. Shipping & Delivery</h2>
            <p>
              Estimated delivery times are provided at checkout and may vary due to logistics,
              courier delays, or regional restrictions. Risk of loss passes to you upon delivery.
            </p>
          </section>

          <section id="returns" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">5. Returns & Refunds</h2>
            <p className="mb-2">
              If you receive a damaged or incorrect item, contact us within 7 days of delivery.
              Items must be unused and in original condition/packaging.
            </p>
            <p>
              Refunds are issued to the original payment method once we receive and inspect the item.
              Shipping fees may be non-refundable unless the return is due to our error.
            </p>
          </section>

          <section id="use" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">6. Acceptable Use</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Do not use the site for unlawful, fraudulent, or harmful activities.</li>
              <li>No attempts to disrupt, reverse engineer, or gain unauthorized access.</li>
              <li>Do not post or transmit content that is illegal, abusive, or infringing.</li>
            </ul>
          </section>

          <section id="ip" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">7. Intellectual Property</h2>
            <p>
              All content, trademarks, and logos on this site are the property of Hari Book Store or
              its licensors and are protected by applicable laws. You may not use our IP without prior
              written consent.
            </p>
          </section>

          <section id="disclaimers" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">8. Disclaimers & Limitation of Liability</h2>
            <p className="mb-2">
              Services are provided “as is” and “as available.” We disclaim all warranties to the
              fullest extent permitted by law.
            </p>
            <p>
              To the maximum extent permitted by law, Hari Book Store shall not be liable for indirect,
              incidental, or consequential damages arising from your use of the site or services.
            </p>
          </section>

          <section id="indemnity" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Hari Book Store and its affiliates from any
              claims, damages, liabilities, and expenses arising from your violation of these Terms
              or misuse of the services.
            </p>
          </section>

          <section id="law" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">10. Governing Law & Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of India. Courts in Chennai, Tamil Nadu shall have
              exclusive jurisdiction over disputes, subject to applicable consumer protection laws.
            </p>
          </section>

          <section id="changes" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">11. Changes to Terms</h2>
            <p>
              We may modify these Terms from time to time. Continued use of the website after changes
              constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section id="contact" className=" rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">12. Contact</h2>
            <p>
              For questions about these Terms, email{" "}
              <a href="mailto:legal.haribookstore@gmail.com" className="text-blue-500 font-semibold hover:underline">
                legal.haribookstore@gmail.com
              </a>{" "}
              or write to: Hari Book Store, 4-47,Main Street,Srikakulam, Andhra Pradesh, India.532401    Phone: +91 7416219267
            </p>
          </section>
        </div>
         
      </section>
    </main>
  );
}
