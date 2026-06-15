import {
  registryAnimationAssets,
  registryAssetBase,
  registryAudioAssets,
  registryCharacterAssets,
  registryCctvAssets,
  registryEndings,
  registryErrorDetails,
  registryMonsterAssets,
  registryNightPlans,
  registryPrepAssets,
  registryProps,
  registrySheetAssets,
  registryStoryPillars,
  registryUiComponents,
} from "@/data/midnightRegistryDesignSystem";
import { playableVisitors } from "@/data/midnightRegistryData";

const groupedProps = registryProps.reduce<Record<string, typeof registryProps>>((groups, prop) => {
  groups[prop.category] = [...(groups[prop.category] ?? []), prop];
  return groups;
}, {});

function getAudioCategory(file: string) {
  if (file.includes("phone")) return "Phone";
  if (file.includes("cctv")) return "CCTV";
  if (file.includes("scanner")) return "Scanner";
  if (file.includes("stamp") || file.includes("decision") || file.includes("door") || file.includes("security") || file.includes("alarm")) return "Decisions";
  if (file.includes("damage") || file.includes("sanity") || file.includes("safety") || file.includes("reputation")) return "Pressure";
  if (file.includes("visitor") || file.includes("knock") || file.includes("breath") || file.includes("flesh") || file.includes("skin") || file.includes("bone") || file.includes("hollow") || file.includes("parasite") || file.includes("glass")) return "Visitor / horror";
  if (file.includes("doc") || file.includes("archive") || file.includes("paper") || file.includes("evidence")) return "Documents";
  return "Environment / system";
}

const groupedAudio = registryAudioAssets.reduce<Record<string, typeof registryAudioAssets>>((groups, asset) => {
  const category = getAudioCategory(asset.file);
  groups[category] = [...(groups[category] ?? []), asset];
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
  return (
    <main className="registry-storybook">
      <section className="registry-storybook__hero">
        <div>
          <span>Reusable game design system</span>
          <h1>Midnight Registry Assets</h1>
          <p>
            Character cards, props, verification tools, UI states, nightly encounter structure, and
            story rules for a seven-night horror game where the registry decides who continues to exist.
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
            <dt>Playable cases</dt>
            <dd>{playableVisitors.length}</dd>
          </div>
          <div>
            <dt>Monster templates</dt>
            <dd>{registryMonsterAssets.length}</dd>
          </div>
          <div>
            <dt>Story nights</dt>
            <dd>{registryNightPlans.length}</dd>
          </div>
          <div>
            <dt>Prep materials</dt>
            <dd>{registryPrepAssets.length}</dd>
          </div>
          <div>
            <dt>Audio files</dt>
            <dd>{registryAudioAssets.length}</dd>
          </div>
        </dl>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>01</span>
          <h2>Story Pillars</h2>
        </div>
        <div className="registry-error-grid">
          {registryStoryPillars.map((pillar) => (
            <article key={pillar.id}>
              <h3>{pillar.title}</h3>
              <p>{pillar.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>02</span>
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
          <span>03</span>
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
          <span>04</span>
          <h2>Monster Reveal Templates</h2>
        </div>
        <div className="registry-monster-grid">
          {registryMonsterAssets.map((monster) => (
            <article key={monster.id}>
              <header>
                <div>
                  <span>{monster.category}</span>
                  <h3>{monster.label}</h3>
                  <p>{monster.type} · {monster.nightRange}</p>
                </div>
                <strong data-threat={monster.threatLevel}>威胁等级 {monster.threatLevel}</strong>
              </header>
              <section className="registry-monster-problem">
                <span>核心核验问题</span>
                <p>{monster.investigationProblem}</p>
              </section>
              <div className="registry-monster-timeline">
                {monster.stageImages.map((image, index) => (
                  <figure key={image}>
                    <img src={image} alt={`${monster.label} ${monster.stageLabels[index]}`} />
                    <figcaption>
                      <small>{String(index + 1).padStart(2, "0")}</small>
                      <strong>{monster.stageLabels[index]}</strong>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="registry-monster-pattern">
                <section>
                  <h4>伪装与主谎言</h4>
                  <p><strong>常见伪装：</strong>{monster.commonDisguise}</p>
                  <p>{monster.mainLie}</p>
                </section>
                <section>
                  <h4>证据通道</h4>
                  <dl>
                    {monster.evidenceChannels.map((evidence) => (
                      <div key={evidence.channel}>
                        <dt>{evidence.channel}</dt>
                        <dd>{evidence.clue}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
                <section>
                  <h4>暴露触发</h4>
                  <p>{monster.revealTrigger}</p>
                </section>
                <section>
                  <h4>暴露后行为</h4>
                  <p>{monster.behaviorAfterExposed}</p>
                </section>
                <section className="is-correct">
                  <h4>正确应对</h4>
                  <p>{monster.correctResponse}</p>
                </section>
                <section className="is-failure">
                  <h4>错误后果</h4>
                  <p>{monster.wrongResponse}</p>
                </section>
              </div>
              <section className="registry-monster-rules">
                <h4>可学习规则</h4>
                <ol>
                  {monster.rules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ol>
              </section>
              <footer>
                <span>独特交互机制</span>
                <strong>{monster.uniqueMechanic}</strong>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>05</span>
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
          <span>06</span>
          <h2>Day Preparation Desk Materials</h2>
        </div>
        <div className="registry-prep-asset-grid">
          {registryPrepAssets.map((asset) => (
            <article key={asset.id}>
              <img src={asset.image} alt={`${asset.label} asset`} />
              <div>
                <h3>{asset.label}</h3>
                <p>{asset.usage}</p>
                <code>{asset.id}.png</code>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>07</span>
          <h2>CCTV Scene Materials</h2>
        </div>
        <div className="registry-cctv-asset-grid">
          {registryCctvAssets.map((asset) => (
            <article key={asset.id}>
              <img src={asset.image} alt={`${asset.label} CCTV scene`} />
              <div>
                <h3>{asset.label}</h3>
                <p>{asset.anomaly}</p>
                <code>{asset.id}.png</code>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>08</span>
          <h2>Animation Event Library</h2>
        </div>
        <div className="registry-animation-grid">
          {registryAnimationAssets.map((animation) => (
            <article data-category={animation.category} key={animation.id}>
              <span>{String(animation.id).padStart(2, "0")}</span>
              <h3>{animation.name}</h3>
              <strong>{animation.category}</strong>
              <p>{animation.trigger}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>09</span>
          <h2>Audio Effect Library</h2>
        </div>
        <div className="registry-audio-groups">
          {Object.entries(groupedAudio).map(([category, assets]) => (
            <article className="registry-audio-group" key={category}>
              <h3>{category}</h3>
              <div>
                {assets.map((asset) => (
                  <span key={asset.file}>
                    <strong>{asset.file.replace(/[-_]/g, " ").replace(/\.wav$/, "")}</strong>
                    <audio
                      aria-label={`Play ${asset.file}`}
                      controls
                      preload="none"
                      src={asset.src}
                    />
                    <code>{asset.file}</code>
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-storybook__section">
        <div className="registry-storybook__heading">
          <span>10</span>
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
          <span>11</span>
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
          <span>12</span>
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
              <p><strong>Theme:</strong> {night.storyTheme}</p>
              <p><strong>Key event:</strong> {night.keyEvent}</p>
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
          <span>13</span>
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
