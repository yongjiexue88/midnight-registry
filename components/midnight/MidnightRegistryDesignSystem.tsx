import {
  registryAssetBase,
  registryCharacterAssets,
  registryEndings,
  registryErrorDetails,
  registryNightPlans,
  registryProps,
  registrySheetAssets,
  registryUiComponents,
} from "@/data/midnightRegistryDesignSystem";

const groupedProps = registryProps.reduce<Record<string, typeof registryProps>>((groups, prop) => {
  groups[prop.category] = [...(groups[prop.category] ?? []), prop];
  return groups;
}, {});

const propImageById: Record<string, string> = {
  "archive-folder": "resident-archive-folder",
  "phone-switchboard": "room-call-switchboard",
  "visitor-ledger": "visitor-ledger-book",
  "id-scanner": "id-scanner-device",
  "question-card": "question-prompt-card",
  "security-call": "security-call-stamp",
  "danger-alarm": "danger-alarm-button",
  "mirror-shard": "mirror-shard-clue",
  "corrupted-file": "corrupted-file-card",
};

function getPropImage(id: string) {
  return `${registryAssetBase}/props/${propImageById[id] ?? id}.png`;
}

export function MidnightRegistryDesignSystem() {
  const totalEncounters = registryNightPlans.reduce((sum, night) => sum + night.encounters.length, 0);

  return (
    <main className="registry-storybook">
      <section className="registry-storybook__hero">
        <div>
          <span>Reusable game design system</span>
          <h1>Midnight Registry Assets</h1>
          <p>
            Character cards, props, verification tools, UI states, nightly encounter structure, and
            error-detail rules for a seven-night identity-checking horror game.
          </p>
        </div>
        <dl>
          <div>
            <dt>Characters</dt>
            <dd>{registryCharacterAssets.length}</dd>
          </div>
          <div>
            <dt>Props / tools</dt>
            <dd>{registryProps.length}</dd>
          </div>
          <div>
            <dt>Night encounters</dt>
            <dd>{totalEncounters}</dd>
          </div>
          <div>
            <dt>Story nights</dt>
            <dd>{registryNightPlans.length}</dd>
          </div>
        </dl>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>01</span>
          <h2>Generated Asset Sheets</h2>
        </div>
        <div className="registry-sheet-grid">
          {registrySheetAssets.map((sheet) => (
            <article className="registry-sheet-card" key={sheet.id}>
              <img src={sheet.image} alt={sheet.title} />
              <div>
                <h3>{sheet.title}</h3>
                <p>{sheet.usage}</p>
                <ul>
                  {sheet.reviewNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>02</span>
          <h2>Character Figure Library</h2>
        </div>
        <div className="registry-character-grid">
          {registryCharacterAssets.map((character) => (
            <article className="registry-character-card" data-kind={character.kind} key={character.id}>
              <img src={character.image} alt={`${character.name} character card`} />
              <div>
                <span>{character.kind}</span>
                <h3>{character.name}</h3>
                <strong>{character.room ? `${character.room} - ` : ""}{character.role}</strong>
                <ul>
                  {character.primaryChecks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
                {character.impostorHooks ? (
                  <p>Fake hooks: {character.impostorHooks.join("; ")}</p>
                ) : null}
                <code>{character.id}.png</code>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>03</span>
          <h2>Props, Tools, And Decision Assets</h2>
        </div>
        <div className="registry-prop-groups">
          {Object.entries(groupedProps).map(([category, props]) => (
            <article className="registry-prop-group" key={category}>
              <h3>{category}</h3>
              <div>
                {props.map((prop) => (
                  <span key={prop.id}>
                    <img src={getPropImage(prop.id)} alt={`${prop.label} asset`} />
                    <strong>{prop.label}</strong>
                    <small>{prop.usage}</small>
                    <code>{prop.id}</code>
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>04</span>
          <h2>Reusable UI Components</h2>
        </div>
        <div className="registry-component-grid">
          {registryUiComponents.map((component) => (
            <span key={component}>{component}</span>
          ))}
        </div>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>05</span>
          <h2>Error Detail Rules</h2>
        </div>
        <div className="registry-error-grid">
          {registryErrorDetails.map((detail) => (
            <article key={detail.id}>
              <h3>{detail.label}</h3>
              <dl>
                <div>
                  <dt>Real</dt>
                  <dd>{detail.real}</dd>
                </div>
                <div>
                  <dt>Fake</dt>
                  <dd>{detail.impostorExample}</dd>
                </div>
                <div>
                  <dt>Check</dt>
                  <dd>{detail.checkWith}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>06</span>
          <h2>Seven-Night Encounter Flow</h2>
        </div>
        <div className="registry-night-grid">
          {registryNightPlans.map((night) => (
            <article className="registry-night-card" key={night.id}>
              <header>
                <span>Night {night.id}</span>
                <h3>{night.title}</h3>
                <strong>{night.visitorTarget}</strong>
              </header>
              <p>{night.mechanic}</p>
              <ol>
                {night.rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ol>
              <div className="registry-encounter-list">
                {night.encounters.map((encounter) => (
                  <span key={encounter.id} data-decision={encounter.correctDecision}>
                    <strong>{encounter.visitor}</strong>
                    <small>{encounter.claim}</small>
                    <em>{encounter.correctDecision}</em>
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>07</span>
          <h2>Endings</h2>
        </div>
        <div className="registry-ending-grid">
          {registryEndings.map((ending) => (
            <article key={ending.id}>
              <h3>{ending.label}</h3>
              <p>{ending.trigger}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
