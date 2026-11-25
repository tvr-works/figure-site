import { LegalPage, SupportEmail } from './LegalPage';

export const privacyTitle = 'Figure privacy';

export function PrivacyPage() {
  return <LegalPage title={privacyTitle} updated={{ dateTime: '2026-11-24', label: 'November 24, 2026' }} introduction={<p>Figure calculates on your iPhone. The app does not send your measurements, calculations or settings to TVR Works LLC. It has no accounts, advertising, tracking or third-party analytics.</p>} sections={[
    {
      id: 'saved-on-your-device',
      title: 'Data saved on your iPhone',
      content: <><p>Figure saves preferences, Recent Values and selected calculator settings on your iPhone so you can use them again.</p>
    <ul>
      <li>In <strong>… → Recent Values</strong>, you can delete individual entries or tap <strong>Clear All</strong> to empty the list. Your calculation and saved inputs are kept.</li>
      <li><strong>… → Settings → Clear All Calculation Data</strong> clears the current calculation, mode inputs and saved calculation settings such as pitch, spacing and riser height. It keeps Recent Values and preferences.</li>
    </ul>
    <p>Deleting Figure removes its local app data. If you use iCloud Backup, Apple may include Figure’s app data in your backups. You can manage those backups in your device settings.</p></>,
    },
    {
      id: 'apple-diagnostics',
      title: 'Apple diagnostics and TestFlight',
      content: <p>Apple may collect and share app diagnostics according to your device settings. If you use TestFlight, Apple handles any beta feedback you submit and shares crash reports with us. See <a href="https://www.apple.com/legal/privacy/">Apple’s privacy policy</a>. Figure has no separate crash-reporting service.</p>,
    },
    {
      id: 'support-messages',
      title: 'Support email',
      content: <><p>If you email support, we receive your email address, message and any attachments through our email providers. We use them to reply and troubleshoot Figure.</p>
    <p>We keep correspondence as needed to resolve your request and keep a record of the issue. To ask about your correspondence or request deletion, email <SupportEmail />. We will delete it unless retention is required by law.</p></>,
    },
    {
      id: 'website',
      title: 'Website visits',
      content: <p>Cloudflare helps deliver and protect figure.tvr.works and processes request information such as your IP address. Your browser may send Cloudflare <a href="https://developers.cloudflare.com/network-error-logging/">a report</a> if it has trouble connecting to the site. We don’t add advertising or analytics scripts to the site.</p>,
    },
    {
      id: 'questions',
      title: 'Questions or changes',
      content: <p>For other privacy questions, email <SupportEmail />. If these practices change, we will update this page and its date.</p>,
    },
  ]} />;
}
