import type { GuideArticle, GuideRecipe } from '../../content/catalog';

type Settings = GuideRecipe['exampleSetup'];

export function GuideSettings({ settings, label }: { settings: Settings; label?: string }) {
  if (!settings.length) return null;
  return <div className="guide-settings">{label && <h3>{label}</h3>}<dl data-not-typeset>{settings.map(setting => <div key={setting.id}><dt>{setting.title}</dt><dd>{setting.value}</dd></div>)}</dl></div>;
}

export function groupDisplaySettings(recipes: GuideArticle['recipes']) {
  const groups = new Map<string, { number: number; settings: Settings; examples: { sectionId: string; title: string }[] }>();
  for (const recipe of recipes) {
    if (!recipe.exampleDisplay.length) continue;
    const key = JSON.stringify([...recipe.exampleDisplay].sort((a, b) => a.id.localeCompare(b.id)));
    const example = { sectionId: recipe.sectionId, title: recipe.title };
    const group = groups.get(key);
    if (group) group.examples.push(example);
    else groups.set(key, { number: groups.size + 1, settings: recipe.exampleDisplay, examples: [example] });
  }
  return [...groups.values()];
}

export function GuideDisplayReference({ number, context }: { number: number; context: string }) {
  return <sup className="guide-note-reference"><a id={`display-ref-${context}`} href={`#display-note-${number}`} aria-label={`Display assumptions, note ${number}`}>{number}</a></sup>;
}

export function GuideDisplayNotes({ notes, shared }: { notes: ReturnType<typeof groupDisplaySettings>; shared: boolean }) {
  if (!notes.length) return null;
  return <section className="guide-footnotes" aria-labelledby="display-notes-title" data-not-typeset>
    <h2 id="display-notes-title">Display assumptions</h2>
    <ol>{notes.map(note => <li key={note.number} id={`display-note-${note.number}`} tabIndex={-1}>
      <p>{note.settings.map(setting => `${setting.title}: ${setting.value}`).join('; ')}.{' '}
        {(shared ? [{ sectionId: 'guide', title: 'guide description' }] : note.examples).map((example, index, references) => <a key={example.sectionId} className="guide-note-return" href={`#display-ref-${example.sectionId}`} aria-label={`Return to ${example.title}`} title={`Return to ${example.title}`}>↩{references.length > 1 && <sup>{index + 1}</sup>}</a>)}
      </p>
    </li>)}</ol>
  </section>;
}
