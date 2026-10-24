import { LegalPage, SupportEmail } from './LegalPage';

export function SupportPage() {
  return <LegalPage><main>
    <h1>Figure support</h1>
    <p>Questions, problems or suggestions? Email <SupportEmail />.</p>
    <h2>How to calculate</h2>
    <p>In Figure, open <strong>… → Help</strong>. Search for a task or browse a topic for short steps and worked examples. Your calculation stays in place while you read.</p>
    <h2>Report a calculation problem</h2>
    <p>Include:</p>
    <ul>
      <li>The mode, numbers, units and exact keys you pressed.</li>
      <li>The answer you expected and the answer Figure showed.</li>
    </ul>
    <h2>Report a display or app problem</h2>
    <p>Include your iPhone model, iOS version and Figure version. For layout problems, note whether the phone was upright or sideways and whether you use larger text. A screenshot helps.</p>
    <p>Leave out client details, addresses and other private information you do not want to share. See our <a href="/privacy">privacy policy</a> for how support messages are handled.</p>
  </main>
  <nav aria-label="Site"><a href="/">Figure</a><a href="/support" aria-current="page">Support</a><a href="/privacy">Privacy</a></nav></LegalPage>;
}
