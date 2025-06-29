export default function PrivacyNoticePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Notice</h1>

      <p className="mb-4">
        At <strong>Cauri</strong>, your privacy is important to us. This Privacy Notice explains how we collect, use,
        disclose, and safeguard your information when you visit our website or use our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Personal data (name, email, phone number, etc.)</li>
        <li>Account information and preferences</li>
        <li>Location and device data</li>
        <li>Browsing behavior and analytics</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use your data to:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Provide and manage your account</li>
        <li>Process transactions</li>
        <li>Send service-related updates</li>
        <li>Improve our services and platform</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Sharing Your Information</h2>
      <p className="mb-4">
        We do not sell your information. We only share it with service providers or when legally required.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Choices</h2>
      <p className="mb-4">
        You can access, update, or delete your account information anytime. You may also opt out of certain communications.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Security</h2>
      <p className="mb-4">
        We implement security measures to protect your personal data. However, no method is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact Us</h2>
      <p>
        If you have questions about this Privacy Notice, contact us at:{' '}
        <a href="mailto:support@cauri.com" className="text-blue-600 underline">
          support@cauri.com
        </a>
      </p>
    </div>
  );
}
