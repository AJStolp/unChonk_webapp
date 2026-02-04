<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation Bar -->
    <nav class="bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a href="/" class="text-xl font-bold text-gray-900">
              unChonk
            </a>
          </div>
          <div class="flex items-center gap-4">
            <a
              href="/subscription"
              class="text-gray-700 hover:text-gray-900 font-medium transition duration-300"
            >
              Pricing
            </a>
            <a
              href="https://chromewebstore.google.com/detail/unchonk-text-to-speech/ofnbgiiljbejpfnmjjnnbmpoiepkmkao"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-700 hover:text-gray-900 font-medium transition duration-300"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Privacy Policy Content -->
    <main class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p class="text-gray-600 mb-8">Last updated: January 19, 2026</p>

      <div class="prose prose-gray max-w-none">
        <p class="text-gray-700 mb-8">
          unChonk ("we," "our," or "us") operates the unChonk browser extension and website (unchonk.com). This Privacy Policy explains how we collect, use, and protect your information.
        </p>

        <!-- Information We Collect -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">Account Information</h3>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Email address (for account creation and login)</li>
            <li>Authentication tokens (stored locally in your browser)</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">Usage Data</h3>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Character/word counts for text-to-speech usage</li>
            <li>Subscription status and plan information</li>
            <li>Feature usage statistics</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">Website Content</h3>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Text content from webpages you choose to convert to speech</li>
            <li>This content is processed in real-time and is not stored on our servers</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
          <p class="text-gray-700 mb-2">When you use our extension or website, we may automatically collect:</p>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li>IP address and approximate location</li>
            <li>Browser type, version, and language</li>
            <li>Device information</li>
            <li>Usage and performance data (e.g., errors, extension version)</li>
          </ul>
          <p class="text-gray-700 mt-2">This data helps us provide, maintain, and improve the service.</p>
        </section>

        <!-- How We Use Your Information -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Provide our service:</strong> Convert text to natural-sounding speech</li>
            <li><strong>Track usage:</strong> Monitor character limits based on your subscription plan</li>
            <li><strong>Manage your account:</strong> Process authentication and subscription status</li>
            <li><strong>Improve our service:</strong> Analyze aggregate usage patterns</li>
          </ul>
        </section>

        <!-- Third-Party Services -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
          <p class="text-gray-700 mb-4">We use the following third-party services:</p>

          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-200 mb-4">
              <thead>
                <tr class="bg-gray-50">
                  <th class="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-800">Service</th>
                  <th class="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-800">Purpose</th>
                  <th class="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-800">Their Privacy Policy</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-200 px-4 py-2 text-gray-700">Text-to-Speech Engine</td>
                  <td class="border border-gray-200 px-4 py-2 text-gray-700">Text-to-speech synthesis</td>
                  <td class="border border-gray-200 px-4 py-2">
                    <a href="https://aws.amazon.com/privacy/" target="_blank" rel="noopener noreferrer" class="text-[#749076] hover:underline">aws.amazon.com/privacy</a>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-200 px-4 py-2 text-gray-700">Stripe</td>
                  <td class="border border-gray-200 px-4 py-2 text-gray-700">Payment processing</td>
                  <td class="border border-gray-200 px-4 py-2">
                    <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" class="text-[#749076] hover:underline">stripe.com/privacy</a>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-200 px-4 py-2 text-gray-700">Umami</td>
                  <td class="border border-gray-200 px-4 py-2 text-gray-700">Privacy-focused website analytics</td>
                  <td class="border border-gray-200 px-4 py-2">
                    <a href="https://umami.is/privacy" target="_blank" rel="noopener noreferrer" class="text-[#749076] hover:underline">umami.is/privacy</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="text-gray-700 font-medium">We do not sell or share your personal information with third parties.</p>
        </section>

        <!-- Cookies and Analytics -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Cookies and Analytics</h2>
          <p class="text-gray-700 mb-3">
            We use Umami for privacy-focused website analytics. Umami does not use cookies, does not track users across sites, and does not collect personally identifiable information.
          </p>
          <p class="text-gray-700">
            Authentication data is stored locally in your browser using standard web storage APIs. Third-party services (such as Stripe during checkout) may set their own cookies as necessary to complete transactions.
          </p>
        </section>

        <!-- International Data Transfers -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
          <p class="text-gray-700">
            Your data may be transferred to and processed in the United States or other countries where our service providers (including AWS) operate. We ensure appropriate safeguards are in place, including standard contractual clauses where applicable.
          </p>
        </section>

        <!-- Legal Basis for Processing (GDPR) -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Legal Basis for Processing (GDPR)</h2>
          <p class="text-gray-700 mb-3">If you are in the European Economic Area, we process your data based on:</p>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Contractual necessity:</strong> To provide the TTS service you requested</li>
            <li><strong>Legitimate interests:</strong> For usage analytics, security, and service improvement</li>
            <li><strong>Legal obligations:</strong> Where required by applicable law</li>
          </ul>
        </section>

        <!-- Data Storage and Security -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Data Storage and Security</h2>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>Account data is stored securely on our servers</li>
            <li>Authentication tokens are stored locally in your browser using standard browser storage mechanisms</li>
            <li>All data transmission is encrypted using HTTPS</li>
            <li>Website content sent for TTS processing is not permanently stored</li>
          </ul>
        </section>

        <!-- Your Rights -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
          <p class="text-gray-700 mb-3">You have the right to:</p>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>Access your personal data</li>
            <li>Delete your account and associated data</li>
            <li>Export your account information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
          <p class="text-gray-700 mt-4">
            To exercise these rights, contact us at <a href="mailto:ttsunchonk@gmail.com" class="text-[#749076] hover:underline">ttsunchonk@gmail.com</a>.
          </p>
        </section>

        <!-- California Privacy Rights -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Your California Privacy Rights</h2>
          <p class="text-gray-700 mb-3">
            California residents have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), including:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>The right to know what personal information we collect and how it is used</li>
            <li>The right to delete your personal information</li>
            <li>The right to opt-out of the sale or sharing of personal information</li>
            <li>The right to non-discrimination for exercising your privacy rights</li>
          </ul>
          <p class="text-gray-700 mt-3">
            We do not sell or share personal information as defined under California law. To exercise your rights, contact us at <a href="mailto:ttsunchonk@gmail.com" class="text-[#749076] hover:underline">ttsunchonk@gmail.com</a>.
          </p>
        </section>

        <!-- Refund Policy -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Refund Policy</h2>
          <p class="text-gray-700">
            All sales are final. Once you purchase a subscription or credits and begin using the service, we cannot offer refunds. Unused credits do not expire but are non-refundable. Please use the free tier to evaluate our service before purchasing.
          </p>
        </section>

        <!-- Data Retention -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>Account data is retained while your account is active</li>
            <li>Upon account deletion, your data is removed within 30 days</li>
            <li>Aggregate, anonymized usage statistics may be retained indefinitely</li>
          </ul>
        </section>

        <!-- Children's Privacy -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
          <p class="text-gray-700">
            unChonk is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <!-- Browser Extension -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Browser Extension</h2>
          <p class="text-gray-700">
            Our use of information received from Google APIs adheres to the Chrome Web Store User Data Policy, including the Limited Use requirements.
          </p>
        </section>

        <!-- Changes to This Policy -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
          <p class="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <!-- Contact Us -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p class="text-gray-700 mb-2">If you have any questions about this Privacy Policy, please contact us:</p>
          <ul class="list-none text-gray-700 space-y-1">
            <li>Email: <a href="mailto:ttsunchonk@gmail.com" class="text-[#749076] hover:underline">ttsunchonk@gmail.com</a></li>
          </ul>
        </section>
      </div>

      <!-- Back Link -->
      <div class="text-center mt-12">
        <a href="/" class="text-gray-700 hover:text-gray-900 hover:underline font-medium">
          &larr; Back to Home
        </a>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <nav class="flex justify-center gap-6 mb-4">
            <a href="/" class="text-gray-500 hover:text-gray-700 transition duration-300">Home</a>
            <a href="/subscription" class="text-gray-500 hover:text-gray-700 transition duration-300">Pricing</a>
            <a href="/report" class="text-gray-500 hover:text-gray-700 transition duration-300">Report a Bug</a>
          </nav>
          <p class="text-gray-600">
            &copy; {{ currentYear }} unChonk by Chonky Heads. Text-to-Speech Solution.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
