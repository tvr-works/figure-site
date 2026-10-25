import type { GuideArticle, GuideRecipe } from '../../content/catalog';

type Settings = GuideRecipe['exampleSetup'];

export function GuideSettings({ settings, label }: { settings: Settings; label?: string }) {
  if (!settings.length) return null;
  return <div className="guide-settings">{label && <h3>{label}</h3>}<dl data-not-typeset>{settings.map(setting => <div key={setting.id}><dt>{setting.title}</dt><dd>{setting.value}</dd></div>)}</dl></div>;
}

export function GuideDisplaySettings({ recipes }: { recipes: GuideArticle['recipes'] }) {
  const groups = new Map<string, { settings: Settings; examples: string[] }>();
  for (const recipe of recipes) {
    if (!recipe.exampleDisplay.length) continue;
    const key = JSON.stringify(recipe.exampleDisplay);
    const group = groups.get(key);
    if (group) group.examples.push(recipe.title);
    else groups.set(key, { settings: recipe.exampleDisplay, examples: [recipe.title] });
  }
  if (!groups.size) return null;
  return <details className="guide-display-settings">
    <summary>Display and rounding settings</summary>
    <p>These settings explain the units, rounding and formatting shown in the examples.</p>
    {[...groups].map(([key, group]) => <GuideSettings key={key} settings={group.settings} label={groups.size === 1 && group.examples.length === recipes.length ? undefined : group.examples.join('; ')} />)}
  </details>;
}
