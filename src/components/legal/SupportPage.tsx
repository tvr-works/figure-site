import { Link } from '@tanstack/react-router';
import { LegalPage, SupportEmail } from './LegalPage';

export function SupportPage() {
  return <LegalPage title="Support" introduction={<p>Questions, problems or suggestions? Email <SupportEmail />.</p>} sections={[
    {
      id: 'how-to-calculate',
      title: 'How to calculate',
      content: <><p>In Figure, open <strong>… → Help</strong>. Search for a task or browse a topic for short steps and worked examples. Your calculation stays in place while you read. You can also <Link to="/guides">browse the guides online</Link>.</p></>,
    },
    {
      id: 'calculation-problems',
      title: 'Report a calculation problem',
      content: <><p>Include:</p>
    <ul>
      <li>The mode, numbers, units and exact keys you pressed.</li>
      <li>The answer you expected and the answer Figure showed.</li>
    </ul></>,
    },
    {
      id: 'app-problems',
      title: 'Report a display or app problem',
      content: <><p>Include your iPhone model, iOS version and Figure version. For layout problems, note whether the phone was upright or sideways and whether you use larger text. A screenshot helps.</p>
    <p>Leave out client details, addresses and other private information you do not want to share. See our <a href="/privacy">privacy policy</a> for how support messages are handled.</p></>,
    },
  ]} />;
}
