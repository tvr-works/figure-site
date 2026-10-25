import { LegalPage, SupportEmail } from './LegalPage';

export function PrivacyPage() {
  return <LegalPage title="Privacy" updated={{ dateTime: '2026-10-21', label: 'October 21, 2026' }} introduction={<p>Figure calculates on your device. The app does not send your measurements, calculations or settings to us. It has no accounts, advertising, tracking or third-party analytics.</p>} sections={[
    {
      id: 'saved-on-your-device',
      title: 'Saved on your device',
      content: <><p>Figure saves preferences, Recent Values and selected calculator settings locally so you can use them again. They stay there until you change or clear them, or delete the app. Figure does not operate a separate cloud-sync or backup service. Your device’s backup settings may include app data.</p>
    <ul>
      <li>Delete individual values or clear the list in <strong>… → Recent Values</strong>.</li>
      <li><strong>… → Settings → Clear All Calculation Data</strong> clears saved calculation inputs. It keeps Recent Values and preferences.</li>
      <li>Deleting the app removes its local app data. Device backups are managed separately through your device settings.</li>
    </ul></>,
    },
    {
      id: 'apple-diagnostics',
      title: 'Apple diagnostics and TestFlight',
      content: <><p>Apple may collect and share app diagnostics according to your device settings and <a href="https://www.apple.com/legal/privacy/">Apple’s privacy policy</a>. During TestFlight testing, Apple also handles beta feedback and diagnostic information. Figure does not include a separate analytics or crash-reporting service.</p></>,
    },
    {
      id: 'support-messages',
      title: 'When you contact support',
      content: <><p>If you contact support, we receive your email address, message and attachments through our email providers. We use them to reply, troubleshoot problems and improve Figure.</p>
    <p>We keep support correspondence as needed to resolve your request and maintain a record of the issue. To request deletion, email <SupportEmail />. We will delete it unless retention is required by law. You do not need to contact support or provide personal information to use the calculator.</p></>,
    },
    {
      id: 'website',
      title: 'This website',
      content: <><p>This website uses Cloudflare for hosting and security, which involves processing basic connection information such as your IP address. We don’t add advertising or analytics.</p></>,
    },
    {
      id: 'questions',
      title: 'Questions or changes',
      content: <><p>For privacy questions or deletion requests, email <SupportEmail />. If these practices change, we will update this page and its date.</p></>,
    },
  ]} />;
}
