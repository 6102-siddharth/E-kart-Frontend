import React, { useState } from 'react';
import { Shield, Eye, Users, Lock, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  const [activeTab, setActiveTab] = useState('privacy');

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  const Section = ({ title, children, icon: Icon }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="text-blue-600" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="text-gray-600 leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  );

  const PrivacyContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mt-4 text-gray-700">
          At CCTV Camera Store, we are committed to protecting your privacy and ensuring the security of your personal information. 
          This policy explains how we collect, use, and safeguard your data when you use our camera inventory management system.
        </p>
      </div>

      <Section title="Information We Collect" icon={Eye}>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Personal Information:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name, email address, and contact information</li>
            <li>Billing and shipping addresses</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Account credentials and preferences</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Technical Information:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>IP address, browser type, and device information</li>
            <li>Website usage patterns and navigation data</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Camera equipment searches and inventory interactions</li>
          </ul>
        </div>
      </Section>

      <Section title="How We Use Your Information" icon={Users}>
        <p>We use your information to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Process orders and manage your camera equipment purchases</li>
          <li>Provide customer support and respond to inquiries</li>
          <li>Send order confirmations, shipping updates, and important notices</li>
          <li>Improve our inventory management system and user experience</li>
          <li>Personalize product recommendations based on your interests</li>
          <li>Prevent fraud and ensure platform security</li>
          <li>Comply with legal obligations and industry regulations</li>
        </ul>
      </Section>

      <Section title="Data Protection & Security" icon={Lock}>
        <p>
          We implement industry-standard security measures to protect your personal information, including:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>SSL/TLS encryption for all data transmissions</li>
          <li>Secure payment processing through PCI-compliant providers</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Access controls and employee training on data privacy</li>
          <li>Automated backups and disaster recovery procedures</li>
        </ul>
        <p className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <strong>Note:</strong> While we strive to protect your information, no method of transmission over the internet 
          is 100% secure. We cannot guarantee absolute security but are committed to protecting your data.
        </p>
      </Section>

      <Section title="Cookies & Tracking" icon={AlertCircle}>
        <p>We use cookies and similar technologies to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Remember your login status and preferences</li>
          <li>Analyze website traffic and user behavior</li>
          <li>Provide personalized camera equipment recommendations</li>
          <li>Enable shopping cart functionality</li>
          <li>Support our advertising and marketing efforts</li>
        </ul>
        <p className="mt-4">
          You can control cookie settings through your browser preferences. However, disabling certain cookies 
          may limit some functionality of our camera inventory system.
        </p>
      </Section>

      <Section title="Your Rights" icon={CheckCircle}>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Access and review your personal information</li>
          <li>Request corrections to inaccurate data</li>
          <li>Delete your account and associated data</li>
          <li>Opt-out of marketing communications</li>
          <li>Request data portability</li>
          <li>Lodge complaints with relevant authorities</li>
        </ul>
        <p className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          To exercise these rights, contact us at <strong>cctvcamerastore@gmail.com</strong> or through your account settings.
        </p>
      </Section>

      <Section title="Contact Information" icon={FileText}>
        <p>For privacy-related questions or concerns:</p>
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <p><strong>Email:</strong> cctvcamerastore@gmail.com</p>
          <p><strong>Phone:</strong> 7218140400</p>
          <p><strong>Address:</strong> Miraj , Sangli</p>
        </div>
      </Section>
    </div>
  );

  const TermsContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Terms & Conditions</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mt-4 text-gray-700">
          These terms govern your use of CCTV Camera Store, inventory management system and e-commerce platform. 
          By using our services, you agree to these terms and conditions.
        </p>
      </div>

      <Section title="Acceptance of Terms" icon={FileText}>
        <p>
          By accessing or using CCTV Camera Store, camera inventory management system, you acknowledge that you have read, 
          understood, and agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, 
          you may not use our service.
        </p>
      </Section>

      <Section title="User Accounts" icon={Users}>
        <p>To access certain features, you must create an account. You agree to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide accurate and complete registration information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Notify us immediately of any unauthorized account access</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Use the service only for lawful purposes related to camera equipment</li>
        </ul>
      </Section>

      <Section title="Product Information & Pricing" icon={Eye}>
        <p>
          We strive to provide accurate product descriptions, specifications, and pricing for all camera equipment. 
          However, we do not warrant that product descriptions, pricing, or other content is error-free. 
          We reserve the right to correct errors and update information at any time.
        </p>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-4">
          <p><strong>Price Changes:</strong> Prices are subject to change without notice. Orders are processed at the price displayed at the time of purchase confirmation.</p>
        </div>
      </Section>

      <Section title="Orders & Payment" icon={CheckCircle}>
        <p>Order processing terms:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>All orders are subject to acceptance and inventory availability</li>
          <li>We reserve the right to refuse or cancel orders at our discretion</li>
          <li>Payment must be received before order fulfillment</li>
          <li>We accept major credit cards and secure payment methods</li>
          <li>International orders may be subject to customs duties and taxes</li>
        </ul>
      </Section>

      <Section title="Shipping & Returns" icon={AlertCircle}>
        <p><strong>Shipping:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Shipping times are estimates and not guaranteed</li>
          <li>Risk of loss transfers upon delivery to carrier</li>
          <li>International shipping may require additional documentation</li>
        </ul>
        <p className="mt-4"><strong>Returns:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>30-day return policy for unused items in original packaging</li>
          <li>Customer responsible for return shipping costs</li>
          <li>Refunds processed within 5-10 business days</li>
          <li>Some items may be subject to restocking fees</li>
        </ul>
      </Section>

      <Section title="Intellectual Property" icon={Lock}>
        <p>
          All content on CameraHub, including text, graphics, logos, images, and software, is protected by copyright, 
          trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works 
          without explicit written permission.
        </p>
      </Section>

      <Section title="Limitation of Liability" icon={Shield}>
        <p>
          CameraHub shall not be liable for any indirect, incidental, special, or consequential damages arising from 
          your use of our service or purchase of camera equipment. Our total liability shall not exceed the amount 
          paid for the specific product or service giving rise to the claim.
        </p>
      </Section>

      <Section title="Contact for Terms" icon={FileText}>
        <p>For questions about these terms:</p>
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <p><strong>Email:</strong> cctvcamerastore@gmail.com</p>
          <p><strong>Phone:</strong> 7218140400</p>
          <p><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM </p>
        </div>
      </Section>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">CCTV CAMERA STORE</h1>
          </div>
          <p className="text-xl text-gray-600">Camera Inventory Management System</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <TabButton
            id="privacy"
            label="Privacy Policy"
            icon={Shield}
            isActive={activeTab === 'privacy'}
            onClick={setActiveTab}
          />
          <TabButton
            id="terms"
            label="Terms & Conditions"
            icon={FileText}
            isActive={activeTab === 'terms'}
            onClick={setActiveTab}
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {activeTab === 'privacy' ? <PrivacyContent /> : <TermsContent />}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg shadow">
          <p className="text-gray-600">
            © 2025 CCTV CAMERA STORE. All rights reserved. | 
            
            <span className="ml-2">Questions?   <Link to="/contact" className="hover:text-orange-500 transition-colors">
              Contact-us
            </Link> </span>
            
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;