"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const asset = (name) => `/assets/${name}`;

const pets = [
  {
    id: "biscuit",
    name: "Biscuit",
    type: "Dog",
    level: 12,
    rarity: "Starter",
    image: asset("pet-biscuit-corgi.png"),
    trait: "Sunny helper",
  },
  {
    id: "mochi",
    name: "Mochi",
    type: "Cat",
    level: 10,
    rarity: "Charm",
    image: asset("pet-mochi-kitten.png"),
    trait: "Boutique muse",
  },
  {
    id: "pudding",
    name: "Pudding",
    type: "Bunny",
    level: 9,
    rarity: "Agile",
    image: asset("pet-pudding-bunny.png"),
    trait: "Quick learner",
  },
  {
    id: "nugget",
    name: "Nugget",
    type: "Shiba",
    level: 8,
    rarity: "Brave",
    image: asset("pet-nugget-shiba.png"),
    trait: "Job board ace",
  },
  {
    id: "coco",
    name: "Coco",
    type: "Panda",
    level: 7,
    rarity: "Lucky",
    image: asset("pet-coco-panda.png"),
    trait: "Snack expert",
  },
  {
    id: "peanut",
    name: "Peanut",
    type: "Hedgehog",
    level: 6,
    rarity: "Focus",
    image: asset("pet-peanut-hedgehog.png"),
    trait: "Study buddy",
  },
];

const initialNeeds = {
  health: 92,
  mood: 78,
  hunger: 45,
  cleanliness: 66,
  stamina: 80,
};

const initialStats = {
  charm: 128,
  strength: 156,
  intelligence: 142,
  intimacy: 118,
  luck: 132,
};

const tasksSeed = [
  {
    id: "daily-care",
    title: "Daily Care",
    detail: "Care for your pet 3 times",
    progress: 2,
    target: 3,
    reward: { coins: 50, stars: 25 },
    accent: "green",
    icon: "fa-heart",
  },
  {
    id: "part-time",
    title: "Part-Time Helper",
    detail: "Complete 2 town jobs",
    progress: 1,
    target: 2,
    reward: { coins: 80, stars: 40 },
    accent: "amber",
    icon: "fa-briefcase",
  },
  {
    id: "stylist",
    title: "Style Star",
    detail: "Change your pet outfit",
    progress: 0,
    target: 1,
    reward: { coins: 60, gems: 30 },
    accent: "rose",
    icon: "fa-shirt",
  },
];

const inventorySeed = [
  { id: "snack", name: "Town Burger", count: 12, icon: "fa-burger", effect: "hunger" },
  { id: "milk", name: "Mellow Milk", count: 8, icon: "fa-bottle-water", effect: "health" },
  { id: "brush", name: "Cloud Brush", count: 5, icon: "fa-wand-magic-sparkles", effect: "cleanliness" },
  { id: "ball", name: "Bounce Ball", count: 7, icon: "fa-baseball", effect: "mood" },
  { id: "carrot", name: "Lucky Carrot", count: 10, icon: "fa-carrot", effect: "luck" },
  { id: "ticket", name: "Clinic Pass", count: 6, icon: "fa-ticket", effect: "health" },
  { id: "perfume", name: "Charm Mist", count: 3, icon: "fa-spray-can-sparkles", effect: "charm" },
  { id: "ribbon", name: "Ribbon Bow", count: 2, icon: "fa-ribbon", effect: "intimacy" },
  { id: "glasses", name: "Study Specs", count: 1, icon: "fa-glasses", effect: "intelligence" },
];

const locations = [
  { id: "snack-stall", label: "Snack Stall", x: 19, y: 43, icon: "fa-burger", action: "feed" },
  { id: "boutique", label: "Boutique", x: 41, y: 24, icon: "fa-shirt", action: "style" },
  { id: "clinic", label: "Pet Clinic", x: 69, y: 34, icon: "fa-kit-medical", action: "heal" },
  { id: "job-board", label: "Job Board", x: 28, y: 70, icon: "fa-clipboard-list", action: "work" },
  { id: "square", label: "Town Square", x: 70, y: 69, icon: "fa-location-dot", action: "play" },
];

const statConfig = [
  ["charm", "Charm", "fa-star", "rose"],
  ["strength", "Strength", "fa-dumbbell", "red"],
  ["intelligence", "Intelligence", "fa-book", "blue"],
  ["intimacy", "Intimacy", "fa-heart", "pink"],
  ["luck", "Luck", "fa-clover", "green"],
];

const needConfig = [
  ["health", "Health", "fa-heart-pulse", "pink"],
  ["mood", "Mood", "fa-face-smile", "green"],
  ["hunger", "Hunger", "fa-burger", "orange"],
  ["cleanliness", "Cleanliness", "fa-shower", "cyan"],
  ["stamina", "Stamina", "fa-bolt", "yellow"],
];

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

function rewardText(reward) {
  return Object.entries(reward)
    .map(([key, value]) => `${value} ${key}`)
    .join(" · ");
}

function Icon({ name }) {
  return <i className={`fa-solid ${name}`} aria-hidden="true" />;
}

function Meter({ item, value, compact = false }) {
  const [key, label, icon, tone] = item;
  return (
    <div className={`meter ${compact ? "meter--compact" : ""}`} data-tone={tone}>
      <div className="meter__icon">
        <Icon name={icon} />
      </div>
      <div className="meter__body">
        <div className="meter__label">
          <span>{label}</span>
          <span>{Math.round(value)} / 100</span>
        </div>
        <div className="meter__track">
          <span style={{ width: `${clamp(value)}%` }} />
        </div>
      </div>
    </div>
  );
}

function CurrencyPill({ icon, label, tone }) {
  return (
    <button className="currency-pill" data-tone={tone} type="button">
      <span>
        <Icon name={icon} />
      </span>
      <strong>{label}</strong>
      <Icon name="fa-plus" />
    </button>
  );
}

export function App() {
  const [activePetId, setActivePetId] = useState("biscuit");
  const [needs, setNeeds] = useState(initialNeeds);
  const [stats, setStats] = useState(initialStats);
  const [tasks, setTasks] = useState(tasksSeed);
  const [inventory, setInventory] = useState(inventorySeed);
  const [currencies, setCurrencies] = useState({ coins: 18450, gems: 1250, stars: 3260, treats: 45 });
  const [activeLocation, setActiveLocation] = useState("square");
  const [taskTab, setTaskTab] = useState("Daily");
  const [notice, setNotice] = useState("Biscuit is waiting in Town Square.");
  const [rewardModal, setRewardModal] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const stateRef = useRef({});

  const activePet = useMemo(
    () => pets.find((pet) => pet.id === activePetId) ?? pets[0],
    [activePetId],
  );

  const careScore = Math.round(
    Object.values(needs).reduce((total, value) => total + value, 0) / Object.keys(needs).length,
  );

  function pushToast(message) {
    setToast(message);
    window.clearTimeout(window.__pocketTownToast);
    window.__pocketTownToast = window.setTimeout(() => setToast(null), 2400);
  }

  function addTaskProgress(taskId, amount = 1) {
    setTasks((items) =>
      items.map((task) =>
        task.id === taskId
          ? { ...task, progress: Math.min(task.target, task.progress + amount) }
          : task,
      ),
    );
  }

  function applyAction(action) {
    const actionMap = {
      feed: {
        label: "Fed a town snack",
        needs: { hunger: 24, mood: 6 },
        stats: { intimacy: 3 },
        task: "daily-care",
      },
      play: {
        label: "Played in the plaza",
        needs: { mood: 18, stamina: -8 },
        stats: { charm: 4, intimacy: 3 },
        task: "daily-care",
      },
      clean: {
        label: "Cleaned up",
        needs: { cleanliness: 25, mood: 4 },
        stats: { charm: 2 },
        task: "daily-care",
      },
      rest: {
        label: "Took a soft nap",
        needs: { stamina: 24, health: 6 },
        stats: { luck: 2 },
        task: "daily-care",
      },
      gift: {
        label: "Opened a gift",
        needs: { mood: 12 },
        stats: { intimacy: 8, luck: 4 },
        reward: { coins: 150, stars: 75, gems: 10, gift: 1 },
      },
      study: {
        label: "Finished a study lesson",
        needs: { stamina: -10, mood: -2 },
        stats: { intelligence: 9 },
        task: "part-time",
      },
      train: {
        label: "Strength training done",
        needs: { stamina: -12, hunger: -4 },
        stats: { strength: 9 },
        task: "part-time",
      },
      style: {
        label: "Styled a fresh outfit",
        needs: { mood: 10 },
        stats: { charm: 10 },
        task: "stylist",
      },
      heal: {
        label: "Clinic checkup complete",
        needs: { health: 18, cleanliness: 6 },
        stats: { luck: 2 },
      },
      work: {
        label: "Helped a town neighbor",
        needs: { stamina: -12, hunger: -6 },
        stats: { strength: 4, intelligence: 4 },
        reward: { coins: 80, stars: 40 },
        task: "part-time",
      },
    };
    const selected = actionMap[action];
    if (!selected) return;

    setNeeds((current) => {
      const next = { ...current };
      Object.entries(selected.needs).forEach(([key, delta]) => {
        next[key] = clamp((next[key] ?? 0) + delta);
      });
      return next;
    });

    setStats((current) => {
      const next = { ...current };
      Object.entries(selected.stats ?? {}).forEach(([key, delta]) => {
        next[key] = (next[key] ?? 0) + delta;
      });
      return next;
    });

    if (selected.reward) {
      setCurrencies((current) => ({
        coins: current.coins + (selected.reward.coins ?? 0),
        gems: current.gems + (selected.reward.gems ?? 0),
        stars: current.stars + (selected.reward.stars ?? 0),
        treats: current.treats + (selected.reward.gift ?? 0),
      }));
      setRewardModal({ title: selected.label, reward: selected.reward });
    }
    if (selected.task) addTaskProgress(selected.task);
    setNotice(`${activePet.name}: ${selected.label}.`);
    pushToast(selected.label);
  }

  function careAll() {
    setNeeds((current) =>
      Object.fromEntries(Object.entries(current).map(([key, value]) => [key, clamp(value + 12)])),
    );
    addTaskProgress("daily-care");
    setCurrencies((current) => ({ ...current, coins: current.coins - 120 }));
    setNotice(`${activePet.name} feels fully cared for.`);
    pushToast("Care All applied");
  }

  function claimTask(taskId) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task || task.progress < task.target) {
      pushToast("Finish the task first");
      return;
    }
    setCurrencies((current) => ({
      coins: current.coins + (task.reward.coins ?? 0),
      gems: current.gems + (task.reward.gems ?? 0),
      stars: current.stars + (task.reward.stars ?? 0),
      treats: current.treats + (task.reward.treats ?? 0),
    }));
    setTasks((items) => items.map((item) => (item.id === taskId ? { ...item, progress: 0 } : item)));
    setRewardModal({ title: `${task.title} Complete`, reward: task.reward });
    setNotice(`${task.title} reward claimed.`);
  }

  function useInventory(itemId) {
    const item = inventory.find((entry) => entry.id === itemId);
    if (!item || item.count <= 0) return;
    setInventory((items) =>
      items.map((entry) => (entry.id === itemId ? { ...entry, count: entry.count - 1 } : entry)),
    );
    if (needs[item.effect] !== undefined) {
      setNeeds((current) => ({ ...current, [item.effect]: clamp(current[item.effect] + 18) }));
    } else {
      setStats((current) => ({ ...current, [item.effect]: current[item.effect] + 8 }));
    }
    setNotice(`${activePet.name} used ${item.name}.`);
    pushToast(`${item.name} used`);
  }

  useEffect(() => {
    stateRef.current = {
      activePet,
      needs,
      stats,
      tasks,
      inventory,
      currencies,
      activeLocation,
      notice,
      rewardModalOpen: Boolean(rewardModal),
    };
  }, [activePet, needs, stats, tasks, inventory, currencies, activeLocation, notice, rewardModal]);

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        coordinate_system: "DOM UI; percentages for town hotspot positions; origin top-left, x right, y down.",
        mode: rewardModal ? "reward-modal" : drawerOpen ? "design-system-drawer" : "town",
        pet: {
          id: stateRef.current.activePet?.id,
          name: stateRef.current.activePet?.name,
          type: stateRef.current.activePet?.type,
          level: stateRef.current.activePet?.level,
        },
        needs: stateRef.current.needs,
        stats: stateRef.current.stats,
        tasks: stateRef.current.tasks?.map((task) => ({
          id: task.id,
          progress: task.progress,
          target: task.target,
        })),
        currencies: stateRef.current.currencies,
        activeLocation: stateRef.current.activeLocation,
        notice: stateRef.current.notice,
      });
    window.advanceTime = (ms = 1000) => {
      const seconds = Math.max(1, Math.round(ms / 1000));
      setNeeds((current) => ({
        health: clamp(current.health - 0.15 * seconds),
        mood: clamp(current.mood - 0.22 * seconds),
        hunger: clamp(current.hunger - 0.28 * seconds),
        cleanliness: clamp(current.cleanliness - 0.18 * seconds),
        stamina: clamp(current.stamina - 0.08 * seconds),
      }));
    };
    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [drawerOpen, rewardModal]);

  return (
    <main className="game-shell">
      <header className="topbar" aria-label="Pocket Town top navigation">
        <section className="profile-card" aria-label="Current pet profile">
          <img src={activePet.image} alt={`${activePet.name} portrait`} />
          <div>
            <div className="profile-card__name">
              <strong>{activePet.name}</strong>
              <button type="button" aria-label="Edit pet name">
                <Icon name="fa-pen" />
              </button>
            </div>
            <span>{activePet.type} Citizen · Lv. {activePet.level}</span>
            <div className="xp-track"><span style={{ width: "47%" }} /></div>
          </div>
        </section>

        <nav className="currency-bar" aria-label="Currencies">
          <CurrencyPill icon="fa-coins" label={currencies.coins.toLocaleString()} tone="gold" />
          <CurrencyPill icon="fa-gem" label={currencies.gems.toLocaleString()} tone="gem" />
          <CurrencyPill icon="fa-star" label={currencies.stars.toLocaleString()} tone="star" />
          <CurrencyPill icon="fa-cookie-bite" label={`${currencies.treats} / 60`} tone="treat" />
        </nav>

        <section className="top-actions" aria-label="Utility navigation">
          <button type="button" className="icon-button has-badge" aria-label="Gifts" onClick={() => applyAction("gift")}>
            <Icon name="fa-gift" />
            <span>3</span>
          </button>
          <button type="button" className="icon-button has-badge" aria-label="Inbox" onClick={() => setDrawerOpen(true)}>
            <Icon name="fa-envelope" />
            <span>5</span>
          </button>
          <button type="button" className="icon-button" aria-label="Companions">
            <Icon name="fa-user-group" />
          </button>
          <button type="button" className="icon-button" aria-label="Menu" onClick={() => setDrawerOpen((open) => !open)}>
            <Icon name="fa-bars" />
          </button>
        </section>
      </header>

      <section className="playfield">
        <aside className="care-panel surface" aria-label="Care meters">
          <div className="panel-heading">
            <h2>Care</h2>
            <button type="button" className="ghost-button" aria-label="Collapse care panel">
              <Icon name="fa-angles-left" />
            </button>
          </div>
          <div className="care-list">
            {needConfig.map((item) => (
              <Meter key={item[0]} item={item} value={needs[item[0]]} />
            ))}
          </div>
          <button type="button" className="primary-button care-all" onClick={careAll}>
            <Icon name="fa-heart" />
            Care All
            <span>{careScore}</span>
          </button>
        </aside>

        <section className="town-stage" aria-label="Interactive town plaza">
          <img src={asset("town-plaza-scene.png")} alt="Pocket Town plaza with companion pet" />
          <div className="status-bubble">
            <Icon name="fa-heart" />
            <span>{notice}</span>
          </div>
          {locations.map((location) => (
            <button
              key={location.id}
              type="button"
              className={`hotspot ${activeLocation === location.id ? "is-active" : ""}`}
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
              onClick={() => {
                setActiveLocation(location.id);
                applyAction(location.action);
              }}
            >
              <Icon name={location.icon} />
              {location.label}
            </button>
          ))}
        </section>

        <aside className="tasks-panel surface" aria-label="Tasks and events">
          <div className="panel-heading">
            <h2>Tasks & Events</h2>
            <button type="button" className="ghost-button" onClick={() => setTasks(tasksSeed)} aria-label="Refresh tasks">
              <Icon name="fa-rotate" />
            </button>
          </div>
          <div className="segmented" role="tablist" aria-label="Task categories">
            {["Daily", "Growth", "Adventure"].map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={taskTab === tab}
                className={taskTab === tab ? "is-selected" : ""}
                onClick={() => setTaskTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="task-list">
            {tasks.map((task) => (
              <article key={task.id} className="task-row" data-accent={task.accent}>
                <span className="task-row__icon">
                  <Icon name={task.icon} />
                </span>
                <div className="task-row__content">
                  <strong>{task.title}</strong>
                  <span>{task.detail}</span>
                  <div className="task-progress">
                    <span style={{ width: `${(task.progress / task.target) * 100}%` }} />
                  </div>
                  <small>{rewardText(task.reward)}</small>
                </div>
                <button type="button" onClick={() => claimTask(task.id)} aria-label={`Claim ${task.title}`}>
                  <Icon name={task.progress >= task.target ? "fa-check" : "fa-arrow-right"} />
                </button>
              </article>
            ))}
          </div>
          <article className="event-strip">
            <Icon name="fa-ticket" />
            <div>
              <strong>Weekend Carnival</strong>
              <span>Play mini games to earn 120 event tokens.</span>
            </div>
            <button type="button" onClick={() => setRewardModal({ title: "Weekend Carnival", reward: { stars: 120 } })}>
              View
            </button>
          </article>
          <article className="map-card" aria-label="Pocket Town mini map">
            <div className="map-card__header">
              <strong>Pocket Town</strong>
              <span>5 areas</span>
            </div>
            <div className="map-card__viewport">
              <img src={asset("town-plaza-scene.png")} alt="Mini map of Pocket Town" />
              {locations.slice(0, 4).map((location, index) => (
                <button
                  key={location.id}
                  type="button"
                  style={{
                    left: `${[20, 43, 64, 76][index]}%`,
                    top: `${[52, 36, 45, 68][index]}%`,
                  }}
                  onClick={() => {
                    setActiveLocation(location.id);
                    setNotice(`${location.label} selected on the town map.`);
                  }}
                  aria-label={`Select ${location.label}`}
                >
                  <Icon name="fa-location-dot" />
                </button>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section className="companion-bar" aria-label="Companions and quick actions">
        <div className="companions">
          <div className="section-title">
            <h2>My Companions</h2>
            <span>{pets.length} / 12</span>
          </div>
          <div className="pet-track">
            {pets.map((pet) => (
              <button
                key={pet.id}
                type="button"
                className={`pet-card ${pet.id === activePetId ? "is-active" : ""}`}
                onClick={() => {
                  setActivePetId(pet.id);
                  setNotice(`${pet.name} joined the plaza.`);
                }}
              >
                <img src={pet.image} alt={`${pet.name} pet portrait`} />
                <strong>{pet.name}</strong>
                <span>Lv. {pet.level} · {pet.rarity}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <div className="section-title">
            <h2>Quick Actions</h2>
            <button type="button" onClick={() => setDrawerOpen(true)}>Design Kit</button>
          </div>
          <div className="action-grid">
            {[
              ["feed", "Feed", "fa-burger"],
              ["play", "Play", "fa-baseball"],
              ["clean", "Clean", "fa-shower"],
              ["rest", "Rest", "fa-bed"],
              ["gift", "Gift", "fa-gift"],
              ["study", "Study", "fa-book-open"],
              ["train", "Train", "fa-dumbbell"],
              ["style", "Style", "fa-shirt"],
            ].map(([id, label, icon]) => (
              <button key={id} type="button" onClick={() => applyAction(id)}>
                <Icon name={icon} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="system-shelf" aria-label="Reusable design system components">
        <div className="system-block care-rail">
          <h3>Care Meter Rail</h3>
          <Meter item={needConfig[2]} value={needs.hunger} compact />
          <div className="chip-row">
            {["Dog", "Cat", "Bunny", "Panda", "Hedgehog"].map((label) => (
              <span key={label} className="type-chip">{label}</span>
            ))}
          </div>
          <div className="bubble-row">
            {needConfig.map((item) => (
              <span key={item[0]} className="status-chip" data-tone={item[3]}>
                <Icon name={item[2]} />
              </span>
            ))}
          </div>
        </div>

        <div className="system-block">
          <h3>Stat Chips</h3>
          <div className="stat-grid">
            {statConfig.map(([key, label, icon, tone]) => (
              <span key={key} className="stat-chip" data-tone={tone}>
                <Icon name={icon} />
                <strong>{stats[key]}</strong>
                <small>{label}</small>
              </span>
            ))}
          </div>
          <h3>Skill Badges</h3>
          <div className="badge-row">
            {["Fast Learner", "Social Butterfly", "Strong Paws", "Lucky Find"].map((label, index) => (
              <span key={label} className="skill-badge">
                <Icon name={["fa-gem", "fa-heart", "fa-paw", "fa-clover"][index]} />
                <small>{label}</small>
              </span>
            ))}
          </div>
        </div>

        <div className="system-block inventory-block">
          <h3>Inventory Slots</h3>
          <div className="inventory-grid">
            {inventory.map((item) => (
              <button key={item.id} type="button" onClick={() => useInventory(item.id)} disabled={item.count <= 0}>
                <Icon name={item.icon} />
                <span>{item.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="system-block achievement-block">
          <h3>Achievement Badge</h3>
          <div className="achievement">
            <Icon name="fa-crown" />
            <strong>Town Legend</strong>
            <span>Complete 100 tasks</span>
            <div className="task-progress"><span style={{ width: "78%" }} /></div>
          </div>
        </div>

        <div className="system-block reward-preview">
          <h3>Reward Preview Modal</h3>
          <div className="mini-modal">
            <button type="button" aria-label="Close preview">
              <Icon name="fa-xmark" />
            </button>
            <strong>You Received</strong>
            <div>
              <span><Icon name="fa-coins" />150</span>
              <span><Icon name="fa-star" />75</span>
              <span><Icon name="fa-gem" />10</span>
            </div>
            <button type="button" onClick={() => setRewardModal({ title: "Preview Reward", reward: { coins: 150, stars: 75, gems: 10 } })}>
              Awesome
            </button>
          </div>
        </div>
      </section>

      {drawerOpen && (
        <aside className="drawer" aria-label="Design system drawer">
          <div className="drawer__header">
            <div>
              <span>Design System</span>
              <strong>Pocket Town Kit</strong>
            </div>
            <button type="button" className="icon-button" onClick={() => setDrawerOpen(false)} aria-label="Close design drawer">
              <Icon name="fa-xmark" />
            </button>
          </div>
          <div className="token-list">
            <span style={{ "--swatch": "#ff8f61" }}>Peach Action</span>
            <span style={{ "--swatch": "#22c9d6" }}>Town Cyan</span>
            <span style={{ "--swatch": "#8bd44f" }}>Mood Lime</span>
            <span style={{ "--swatch": "#ffcf4f" }}>Reward Gold</span>
            <span style={{ "--swatch": "#ff5e94" }}>Charm Pink</span>
          </div>
          <p>Reusable surfaces: HUD pills, care meters, task rows, pet cards, inventory slots, skill badges, reward modal.</p>
        </aside>
      )}

      {rewardModal && (
        <div className="modal-backdrop" role="presentation">
          <section className="reward-modal" role="dialog" aria-modal="true" aria-label="Reward received">
            <button type="button" className="modal-close" onClick={() => setRewardModal(null)} aria-label="Close reward modal">
              <Icon name="fa-xmark" />
            </button>
            <span className="modal-kicker">You Received</span>
            <h2>{rewardModal.title}</h2>
            <div className="reward-grid">
              {Object.entries(rewardModal.reward).map(([key, value]) => (
                <span key={key}>
                  <Icon name={key === "coins" ? "fa-coins" : key === "gems" ? "fa-gem" : key === "stars" ? "fa-star" : "fa-gift"} />
                  <strong>{value}</strong>
                  <small>{key}</small>
                </span>
              ))}
            </div>
            <button type="button" className="primary-button" onClick={() => setRewardModal(null)}>
              Awesome
            </button>
          </section>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
