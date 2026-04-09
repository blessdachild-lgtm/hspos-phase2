import React, { useState, useEffect, useCallback } from "react";

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');`;

const MODULES = [
  {
    id: "state", number: 1, title: "State Regulation", impediment: "State Breakdown",
    subtitle: "Your nervous system is overriding your execution.", engine: "Engine 2",
    color: "#E8833A", colorDim: "#1C1209", colorBorder: "#3D2810",
    phases: [
      { name: "Installation", days: [1, 2] },
      { name: "Activation Exposure", days: [3, 4, 5] },
      { name: "Integration", days: [6, 7] },
    ],
    days: [
      { day: 1, title: "Baseline Calibration", phase: "A", objective: "A52 becomes a daily physical habit, not a concept you know about.", content: "Three A52 sessions today: morning, midday, evening. Ten minutes each. Nasal, diaphragmatic. 5-second inhale, 5-second exhale, 2-second hold.\n\nThe only thing you're tracking is whether you did it. Not how it felt. Not whether you're calmer.", logPrompt: "What did your body feel like before and after each session?", metric: "Did you run all three sessions? Yes or no." },
      { day: 2, title: "State Awareness Under Zero Pressure", phase: "A", objective: "Build the internal sensor that MIRP requires.", content: "Same three A52 sessions. Add one thing: during normal daily interactions — coworker, cashier, whoever — notice your body state without trying to change it.\n\nShoulders tight? Breathing shallow? Heart rate up? If you can't notice state shifts when nothing is at stake, you won't catch them when something is.", logPrompt: "What physical state did you notice during a normal interaction today? What surprised you?", metric: "Did you notice a body-state shift during at least one low-stakes interaction?" },
      { day: 3, title: "Pre-Contact Regulation", phase: "B", objective: "Run A52 under increasing social pressure.", content: "Before any social interaction you'd normally find even mildly activating, run one A52 cycle. One. Not ten minutes — one cycle. 5 in, 5 out, 2 hold.\n\nThen enter. The goal isn't calm. The goal is functional.", logPrompt: "Did you run the cycle? Did you enter? What did your body do when you entered?", metric: "Did you regulate before contact and then act?" },
      { day: 4, title: "Mid-Contact Awareness", phase: "B", objective: "Find your spike signature.", content: "Same pre-contact cycle. Now add internal monitoring during the interaction. You're not trying to fix anything yet.\n\nYou're learning your spike signature — the specific physical pattern your body runs when state starts to break. For some it's chest tightness. For some it's talking faster. For some it's a jaw clench. Find yours.", logPrompt: "What's your spike signature? When did it fire? What was happening in the interaction at that moment?", metric: "Can you name your spike signature?" },
      { day: 5, title: "First MIRP Dry Run", phase: "B", objective: "Run MIRP live for the first time.", content: "Deliberately enter a low-stakes social interaction. When you notice your spike signature fire — and it will — run MIRP live:\n\n1. NOTICE — name the spike internally\n2. DOWNSHIFT — one A52 cycle\n3. ANCHOR — what is literally happening right now?\n4. MOVE — one simple question or observation\n\nThe interaction quality doesn't matter.", logPrompt: "Did you catch the spike, run the protocol, and stay in? What happened at each MIRP step?", metric: "Did you run MIRP when the spike fired — not after, through it?" },
      { day: 6, title: "Sustained Regulation Rep", phase: "C", objective: "Full loop execution.", content: "Enter a real interaction — not manufactured low-stakes, a real one in your actual life.\n\nRun pre-contact A52. Monitor state throughout. If MIRP is needed, fire it.\n\nNew variable: after the interaction, run the full Post-Rep Check.\n• Did I act?\n• Did I stay composed?\n• Did I read correctly?\n• Did I overstay?", logPrompt: "Post-Rep Check answers. What connected between State regulation and the rest of the loop?", metric: "Did you run the full loop — regulate, act, monitor, review?" },
      { day: 7, title: "System Test", phase: "C", objective: "Prove State is installed, not just understood.", content: "Two reps minimum. Different contexts if possible. Full protocol: pre-contact regulation, internal monitoring, MIRP on detection, post-rep review after each.\n\nAt end of day, answer one question honestly:\n\nIs my nervous system still running the show, or am I starting to run it?", logPrompt: "Two reps documented. For each: what happened, did MIRP fire, how did you exit? Final answer: who's running the show?", metric: "At least one rep where you caught a spike, ran MIRP, stayed in, and executed a clean exit." },
    ],
    gate: "Did you complete a rep where you caught the spike, ran MIRP, stayed in, and executed a clean exit?",
  },
  {
    id: "identity", number: 2, title: "Identity & Foundation", impediment: "Identity Drift",
    subtitle: "Your behavior is being driven by external approval, not internal authority.", engine: "Engine 1",
    color: "#4A9EDB", colorDim: "#091520", colorBorder: "#0D2D42",
    phases: [
      { name: "Anchor Installation", days: [1, 2] },
      { name: "Anti-Validation Training", days: [3, 4, 5] },
      { name: "Identity Stability Under Pressure", days: [6, 7] },
    ],
    days: [
      { day: 1, title: "Identity Audit", phase: "A", objective: "Build the identity statement that holds under pressure.", content: "Answer three questions in writing, not in your head.\n\n1. What do you do, and what does it signal about your competence?\n2. What do you value that doesn't change based on who's in front of you?\n3. What's your pattern under pressure — do you chase approval, withdraw, or perform?\n\nThen write the Identity Anchor Statement:\n\"I am [role/competence] who [core value] — and whether this interaction goes well does not change that.\"", logPrompt: "Your Identity Anchor Statement. The three answers that built it.", metric: "Is the statement written and specific — not generic?" },
      { day: 2, title: "Pressure Test the Anchor", phase: "A", objective: "Map the Identity fault line.", content: "Put the statement somewhere you'll see it. Enter your normal day and notice — when does it feel true and when does it feel like words?\n\nThe gap between those two moments is your Identity fault line. That's where your behavior starts shifting based on external feedback.", logPrompt: "When did the anchor stop feeling true? What triggered the shift? Who was in front of you? What did you want from them?", metric: "Can you identify the exact moment the anchor weakened?" },
      { day: 3, title: "The Withhold Rep", phase: "B", objective: "Break the validation-as-currency habit.", content: "Enter a normal social interaction. One rule: no compliments to relieve tension. Zero.\n\nIf you feel the urge to say something flattering to smooth the moment, that's data — notice it, don't act on it.\n\nYou're training the difference between validation as genuine expression and validation as anxiety management.", logPrompt: "Did the urge fire? When? What were you actually trying to accomplish — connection, or tension relief?", metric: "Did you withhold validation when the urge to smooth fired?" },
      { day: 4, title: "Pace Lock Under Green Signal", phase: "B", objective: "Hold steady when it's working.", content: "Enter an interaction where interest is present. When the green signal hits, your one job: maintain the same pace, tone, and energy you had before the signal arrived.\n\nNo escalation. No spike. No sudden increase in investment. Hold steady when it's working.", logPrompt: "Did you hold pace? If you spiked, identify the exact moment. What did your body do? What did you say that you wouldn't have said thirty seconds earlier?", metric: "Did you maintain baseline energy when positive signals appeared?" },
      { day: 5, title: "Exchange vs. Give", phase: "B", objective: "Validation only as exchange for demonstrated investment.", content: "Today you can use validation — but only as an exchange for demonstrated investment.\n\nSomeone shares something real? Match it. Someone is investing genuine energy? Acknowledge it.\n\nBut if you're giving a compliment and no one earned it — that's the old pattern running. The Anti-Validation Rule isn't \"never be warm.\" It's \"never use warmth to manage your own anxiety.\"", logPrompt: "Every compliment you gave today — was it earned or was it tension relief? Be honest.", metric: "Can you distinguish earned validation from anxiety-driven validation?" },
      { day: 6, title: "Full Loop With Identity Monitoring", phase: "C", objective: "Maintain the same identity from entry to exit.", content: "Real interaction. Run pre-contact A52. Enter with your Identity Anchor active. Monitor throughout for the shift — the moment where who you are starts bending toward who you think they want.\n\nIf you catch it, don't correct with performance. Correct with a pause. One breath. Return to the anchor. Continue at baseline.", logPrompt: "Full Post-Rep Check plus: Did I stay the same person from entry to exit?", metric: "Did you catch an identity shift and correct it without performing?" },
      { day: 7, title: "Outcome Independence Test", phase: "C", objective: "Identity stability when things go sideways.", content: "Two reps minimum. At least one should be an interaction that doesn't go the way you want.\n\nIdentity stability isn't proven when things go well — it's proven when things go sideways and your behavior doesn't degrade.\n\nDid you exit clean? Did you maintain composure? Did you avoid the post-rejection spiral?", logPrompt: "When it didn't go well, did I stay who I am? Or did I start negotiating with myself about what I should have been?", metric: "Did you maintain identity through a negative outcome without degrading?" },
    ],
    gate: "Did you maintain the same identity from entry to exit — including an interaction that didn't resolve in your favor — without shifting to chase approval or recover ego?",
  },
  {
    id: "decision", number: 3, title: "Decision Engine", impediment: "Decision Paralysis",
    subtitle: "Your breakdown occurs before action — not during it.", engine: "Engine 3",
    color: "#9B6FDB", colorDim: "#120D1C", colorBorder: "#261840",
    phases: [
      { name: "Pattern Exposure", days: [1, 2] },
      { name: "If-Then Installation", days: [3, 4, 5] },
      { name: "Decision Automaticity", days: [6, 7] },
    ],
    days: [
      { day: 1, title: "The Hesitation Audit", phase: "A", objective: "Make the avoidance-as-thinking pattern visible.", content: "Carry a simple log. Every time you see a social opening and don't take it, write one line: what the opening was, what your brain told you, and whether you moved.\n\nNo judgment. No correction. You're building the data set.", logPrompt: "How many openings did you see? How many did you take? What's the ratio?", metric: "Did you track honestly — every opening, every decision?" },
      { day: 2, title: "Name the Override Script", phase: "A", objective: "Identify the exact language your brain uses to stop you.", content: "Review yesterday's log. Find the recurring excuse. It's almost always one of four:\n\n• \"Not the right time\"\n• \"She looks busy\"\n• \"I'll do it next time\"\n• \"I need to be in a better state first\"\n\nWrite down your specific override script. The exact language your brain uses.", logPrompt: "What's your override script? Write it verbatim. How many times did it run yesterday?", metric: "Can you name your script on sight?" },
      { day: 3, title: "The 3-Second Rule — First Live Fire", phase: "B", objective: "Replace deliberation with pre-loaded triggers.", content: "One rule today: when you see a valid opening, you have three seconds. Not three seconds to decide — three seconds to move.\n\nRun pre-contact A52. Identify your override script when it fires. Then: 3... 2... 1... move.\n\nYou need one rep today. One. The quality of the interaction is irrelevant.", logPrompt: "Did you fire? If not, what script overrode you? If yes — what happened in your body during those three seconds?", metric: "Did you move within the 3-second window at least once?" },
      { day: 4, title: "Satisficing Under Pressure", phase: "B", objective: "Stop optimizing. Start moving.", content: "Two reps minimum. You are not allowed to optimize your entry. No waiting for the perfect moment. No scanning for a better target. No rehearsing.\n\nSatisfice — take the first action that clears the minimum threshold:\n1. Opening exists\n2. Engagement is socially appropriate\n3. You're regulated enough to function\n\nIf those three are met, you go.", logPrompt: "Did you satisfice or did you catch yourself optimizing? What did the optimization sound like?", metric: "Did you act on the first valid opening without optimizing?" },
      { day: 5, title: "Multi-Rep Volume Day", phase: "B", objective: "Prove the bottleneck was never ability.", content: "Three reps minimum. Different contexts if available. The 3-second trigger is the default. The override script is identified and rejected on detection.\n\nYou are only answering one question: Do I move?\n\nThe answer is pre-loaded. If opening exists → move within three seconds.", logPrompt: "Total reps attempted. Total reps fired. Total scripts that tried to run. Compare the ratio to Day 1.", metric: "Is the action-to-opening ratio improving from Day 1?" },
      { day: 6, title: "Full Loop Integration", phase: "C", objective: "Three engines running simultaneously.", content: "Real interactions, full protocol stack.\n\n• Pre-contact A52 (State)\n• Identity Anchor active (Identity)\n• 3-second trigger loaded (Decision)\n\nEnter, build, calibrate, advance or exit — the full operating loop.", logPrompt: "Full Post-Rep Check plus: Did I move within the window, or did the script try to run? Is the trigger starting to feel automatic?", metric: "Did the 3-second trigger fire without conscious loading?" },
      { day: 7, title: "The Missed Window Accountability Test", phase: "C", objective: "Decision is no longer a bottleneck.", content: "Full day. Normal life. Every opening counts.\n\nAt end of day, answer one question:\n\n\"Did I let any window close today because my brain convinced me it wasn't the right time?\"\n\nIf yes — identify which script ran.\nIf no — and you're being honest — Decision is installed.", logPrompt: "Total windows seen. Total windows acted on. Total scripts fired and overridden. Compare to Day 1 ratio.", metric: "Did you act on every valid opening without the override script winning?" },
    ],
    gate: "Did you complete a day where you acted on every valid opening without the override script winning?",
  },
  {
    id: "calibration", number: 4, title: "Signal Calibration", impediment: "Calibration Breakdown",
    subtitle: "You're engaging. You're not reading or adjusting correctly.", engine: "Engine 6",
    color: "#4DB87A", colorDim: "#091410", colorBorder: "#0D3020",
    phases: [
      { name: "Bias Calibration", days: [1, 2] },
      { name: "Live Signal Reading", days: [3, 4, 5] },
      { name: "Advancement & Exit Timing", days: [6, 7] },
    ],
    days: [
      { day: 1, title: "The Inflation Audit", phase: "A", objective: "Accept the overperception bias as neurological fact.", content: "Review your last five social interactions from memory. For each one:\n\n1. What did you read as the signal?\n2. What was the actual outcome?\n\nWhere did your read and reality diverge? You're not broken — you're running uncalibrated hardware.", logPrompt: "For each interaction: the read vs. the result. Where did you inflate? Where were you accurate?", metric: "Can you identify your inflation pattern?" },
      { day: 2, title: "Signal Vocabulary Installation", phase: "A", objective: "Load the Green/Yellow/Red framework as recognition patterns.", content: "Learn the signal clusters cold:\n\nGREEN: Sustained animated eye contact, body orientation tracking you, re-engagement after pauses, decreasing behavioral variability, increasing signal frequency.\n\nYELLOW: Short answers but not closed, polite but not investing, reactive but not initiating.\n\nRED: Body turned away, one-word responses, no re-engagement, vague future references, reduced eye contact at key moments.", logPrompt: "Can you recite the signal clusters without looking? Write them from memory.", metric: "Are the signal clusters loaded and recallable?" },
      { day: 3, title: "Observation-Only Rep", phase: "B", objective: "Read signals without personal investment bias.", content: "Enter a social environment. Do not engage. Watch three separate interactions between other people.\n\nPractice identifying Green, Yellow, and Red signal clusters from the outside. This removes your investment bias from the equation.\n\nYou can read signals accurately when you have no stake. That's the baseline.", logPrompt: "Three observations. Signal reads for each. What pattern told you it was Green, Yellow, or Red?", metric: "Did you correctly identify signal clusters in interactions that didn't involve you?" },
      { day: 4, title: "Live Read With Discount", phase: "B", objective: "Correct for the overperception bias in real time.", content: "Enter a real interaction. Full stack — A52, Identity Anchor, 3-second trigger.\n\nNew variable: whatever interest level you read, discount it one notch.\n\nGreen → operate as strong Yellow\nYellow → operate as soft Red\nRed → exit immediately\n\nYou're not being pessimistic — you're correcting for documented neurological bias.", logPrompt: "What did you read? What did you discount to? What was the actual outcome? Was the discounted read more accurate?", metric: "Was the discounted read closer to reality than your initial read?" },
      { day: 5, title: "The Yellow Test", phase: "B", objective: "Know when to push once and when to leave.", content: "Stay in a Yellow-signal interaction long enough to test once. One low-stakes direct invitation or one clear question that requires investment to answer.\n\nIf signal upgrades to Green → continue.\nIf stays Yellow or drops to Red → exit clean, immediately.\n\nNo second test. One test. One read. Then decide.", logPrompt: "What was the Yellow signal? What test did you run? What happened? Did you honor the result?", metric: "Did you test once and honor the result — no second chances?" },
      { day: 6, title: "Advance Timing Rep", phase: "C", objective: "Calibrate the transition from conversation to logistics.", content: "Real interaction, full stack. When Green signals cluster — and they must cluster, not just flash — run the Macro-Advance.\n\nMove to specific, low-pressure logistics. Not \"we should hang out sometime.\" A specific invitation with a specific time.\n\nYou advance when mutual investment is present and increasing. Not when you feel ready.", logPrompt: "Did you advance? Was it earned by signal evidence or driven by anxiety? How do you know?", metric: "Did you advance on clustered evidence, not feeling?" },
      { day: 7, title: "The Clean Exit Test", phase: "C", objective: "Exit quality reveals calibration quality.", content: "Two reps minimum. At least one must end in an exit.\n\nThe exit metric:\n• Did you leave at a high or neutral point?\n• Did you leave before value decayed?\n• Did you leave without desperation, over-explaining, or lingering?\n\nA clean exit is a successful rep regardless of whether advancement happened.", logPrompt: "Full Post-Rep Check plus: Did I exit at the right time? How do I know?", metric: "Did you exit cleanly based on signal evidence?" },
    ],
    gate: "Did you accurately read signal clusters, advance only on earned evidence, and exit cleanly when signals indicated exit?",
  },
];

const C = { bg: "#0D0F14", surface: "#13161D", surface2: "#1A1E28", border: "#252A36", borderLight: "#2E3444", text: "#F0F2F8", body: "#D0D8E8", muted: "#9BA3B5", mutedStrong: "#B8C0D4", dim: "#4A5268", gold: "#C9A84C", done: "#4DB87A", doneDim: "#091410", doneBorder: "#0D3020" };

const STORAGE_KEY = "hspos_phase2_v1";

function loadState() {
  try {
    const raw = typeof window !== "undefined" && window.localStorage
      ? window.localStorage.getItem(STORAGE_KEY)
      : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch {}
}

function loadModuleProgress(moduleId) {
  const state = loadState();
  if (!state || !state.modules || !state.modules[moduleId]) {
    return { completedDays: [], logs: {} };
  }
  const m = state.modules[moduleId];
  return {
    completedDays: Array.isArray(m.completedDays) ? m.completedDays : [],
    logs: (m.logs && typeof m.logs === "object") ? m.logs : {},
  };
}

function saveModuleProgress(moduleId, completedDays, logs) {
  const state = loadState() || { modules: {}, completedModules: [] };
  if (!state.modules) state.modules = {};
  const existing = state.modules[moduleId] || {};
  state.modules[moduleId] = { ...existing, completedDays, logs };
  saveState(state);
}

function loadCompletedModules() {
  const state = loadState();
  return (state && Array.isArray(state.completedModules)) ? state.completedModules : [];
}

function saveCompletedModules(completedModules) {
  const state = loadState() || { modules: {}, completedModules: [] };
  state.completedModules = completedModules;
  saveState(state);
}

function saveModuleCompletion(moduleId) {
  const state = loadState() || { modules: {}, completedModules: [] };
  if (!state.modules) state.modules = {};
  if (!state.modules[moduleId]) state.modules[moduleId] = { completedDays: [], logs: {} };
  state.modules[moduleId].completedAt = new Date().toISOString();
  saveState(state);
}

function loadModuleCompletionDate(moduleId) {
  const state = loadState();
  if (!state || !state.modules || !state.modules[moduleId]) return null;
  return state.modules[moduleId].completedAt || null;
}

function resetModuleProgress(moduleId) {
  const state = loadState() || { modules: {}, completedModules: [] };
  if (state.modules && state.modules[moduleId]) {
    delete state.modules[moduleId];
  }
  if (Array.isArray(state.completedModules)) {
    state.completedModules = state.completedModules.filter(id => id !== moduleId);
  }
  saveState(state);
}

function formatCompletionDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}


const VALID_MODULES = ["state", "identity", "decision", "calibration"];

function getModuleFromUrl() {
  if (typeof window === "undefined") return "state";
  const params = new URLSearchParams(window.location.search);
  const moduleFromUrl = params.get("module");
  return VALID_MODULES.includes(moduleFromUrl) ? moduleFromUrl : "state";
}

function SystemTag({ children }) {
  return (
    <div
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.2em",
        color: C.muted,
        textTransform: "uppercase",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ width: 24, height: 1, background: C.muted, display: "inline-block" }} />
      {children}
    </div>
  );
}

function Wrap({ children, maxWidth = 680, style }) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        maxWidth,
        margin: "0 auto",
        padding: "0 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Page({ children, maxWidth = 680 }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <Wrap maxWidth={maxWidth}>{children}</Wrap>
    </div>
  );
}

function BtnPrimary({ children, onClick, disabled = false, full = false, style = {} }) {
  const [hover, setHover] = useState(false);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && onClick) onClick();
    },
    [disabled, onClick]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        width: full ? "100%" : "auto",
        background: disabled ? C.surface2 : hover ? C.gold : C.text,
        color: disabled ? C.muted : C.bg,
        border: "none",
        padding: "16px 32px",
        fontFamily: "'Syne', sans-serif",
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.2s ease",
        minHeight: 54,
        borderRadius: 14,
        boxShadow: disabled ? "none" : "0 10px 30px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function BtnSecondary({ children, onClick, full = false, style = {} }) {
  const [hover, setHover] = useState(false);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onClick) onClick();
    },
    [onClick]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: full ? "100%" : "auto",
        background: "transparent",
        border: `1px solid ${hover ? C.dim : C.border}`,
        color: hover ? C.text : C.muted,
        padding: "12px 24px",
        fontFamily: "'Syne', sans-serif",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.18s ease",
        minHeight: 50,
        borderRadius: 14,
        background: hover ? C.surface2 : "transparent",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Tag({ children, color, bgColor, borderColor }) {
  return (
    <span
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color,
        padding: "6px 12px",
        border: `1px solid ${borderColor}`,
        background: bgColor,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function SummaryPanel({ label, color = C.gold, children }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${color}`,
        padding: "16px 20px",
        marginBottom: 28,
      }}
    >
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function EntryScreen({ onEnter }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ opacity: fade ? 1 : 0, transition: "opacity 0.8s ease" }}>
      <Page>
        <div style={{ padding: "80px 0 48px", borderBottom: `1px solid ${C.border}`, marginBottom: 48 }}>
          <SystemTag>HS-POS · Phase 2 · Execution Modules</SystemTag>

          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(52px, 10vw, 76px)",
              lineHeight: 1.05,
              color: C.text,
              marginBottom: 16,
              fontWeight: 400,
            }}
          >
            Begin the
            <br />
            <em style={{ fontStyle: "italic", color: C.gold }}>Correction.</em>
          </h1>

          <div
            style={{
              fontSize: 18,
              color: C.body,
              lineHeight: 1.7,
              marginBottom: 32,
              fontWeight: 500,
              borderLeft: `3px solid ${C.gold}`,
              paddingLeft: 16,
            }}
          >
            You now know the problem. What you don&apos;t have yet is the correction.
          </div>

          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 17, color: C.body, lineHeight: 1.8, marginBottom: 16 }}>
              Phase 1 identified the breakdown. Phase 2 installs the correction — day by day, rep by rep. Progression is earned through evidence, not vibe.
            </p>
            <p style={{ fontSize: 17, color: C.body, lineHeight: 1.8, marginBottom: 0 }}>
              This is not more explanation. This is structured execution under load.
            </p>
          </div>

          <BtnPrimary onClick={onEnter}>Enter</BtnPrimary>
        </div>

        <div
          style={{
            marginTop: 60,
            paddingTop: 32,
            borderTop: `1px solid ${C.border}`,
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: C.muted,
            lineHeight: 1.8,
            paddingBottom: 60,
          }}
        >
          7-day execution modules. Built to continue the correction without breaking continuity.
          <br />
          Human Social Performance Operating System · 100 Acrez Holdings, LLC
        </div>
      </Page>
    </div>
  );
}

function ModuleSelect({ primaryModule, onSelect, completedModules }) {
  return (
    <Page maxWidth={880}>
      <div style={{ padding: "80px 0 100px" }}>
        <SystemTag>Execution Modules</SystemTag>

        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(42px, 7vw, 64px)",
            lineHeight: 1.08,
            color: C.text,
            marginBottom: 14,
            fontWeight: 400,
          }}
        >
          Your Correction Arc
        </h1>

        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 16,
            color: C.body,
            lineHeight: 1.8,
            marginBottom: 40,
            paddingBottom: 28,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          Modules unlock sequentially. Your route is shown below, but the architecture still starts with State because everything downstream depends on it.
        </div>

        {MODULES.map((mod, i) => {
          const done = completedModules.includes(mod.id);
          const unlocked = i === 0 || completedModules.includes(MODULES[i - 1].id);
          const active = unlocked && !done;
          const primary = mod.id === primaryModule;

          return (
            <div
              key={mod.id}
              role="button"
              tabIndex={unlocked ? 0 : -1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (unlocked) onSelect(mod.id);
              }}
              onKeyDown={(e) => {
                if (!unlocked) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(mod.id);
                }
              }}
              style={{
                background: done ? C.doneDim : unlocked ? (active ? C.surface : C.surface2) : C.surface2,
                border: `1px solid ${done ? C.doneBorder : active ? mod.colorBorder : unlocked ? C.border : C.borderLight}`,
                borderLeft: `3px solid ${done ? C.done : mod.color}`,
                padding: "24px 24px",
                marginBottom: 14,
                cursor: unlocked ? "pointer" : "default",
                opacity: 1,
                transition: "all 0.2s ease",
                position: "relative",
                outline: "none",
                boxShadow: active ? "0 18px 40px rgba(0,0,0,0.18)" : "none",
              }}
            >
              {!unlocked && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "4px 8px",
                    border: `1px solid ${C.border}`,
                    color: C.mutedStrong,
                    background: C.bg,
                  }}
                >
                  Locked
                </div>
              )}

              {primary && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: C.gold,
                    color: C.bg,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    fontWeight: 500,
                  }}
                >
                  Your Route
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: active ? 10 : 0 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: done ? C.doneDim : mod.colorDim,
                    border: `1px solid ${done ? C.doneBorder : mod.colorBorder}`,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13,
                    color: done ? C.done : mod.color,
                    flexShrink: 0,
                  }}
                >
                  {done ? "✓" : mod.number}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: unlocked ? C.text : C.mutedStrong }}>
                    {mod.title}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted, letterSpacing: "0.1em", marginTop: 4 }}>
                    {done ? "COMPLETED" : unlocked ? "7 DAYS · 3 PHASES" : `LOCKED — Complete Module ${i} first`}
                  </div>
                </div>
              </div>

              {(active || primary) && (
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.body, lineHeight: 1.65, paddingLeft: 58 }}>
                  {primary && !active
                    ? `Primary route identified. ${mod.subtitle} Complete upstream modules first.`
                    : mod.subtitle}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Page>
  );
}

function DayView({ mod, dayIndex, existingLog, completedDays, onLog, onBack, onAdvance }) {
  const dayData = mod.days[dayIndex];
  const [log, setLog] = useState(existingLog || "");
  const [saved, setSaved] = useState(!!existingLog);
  const currentPhase = mod.phases.find((p) => p.days.includes(dayData.day));
  const isLastDay = dayIndex === 6;
  const canSubmit = log.trim().length > 0;

  const handleSubmit = useCallback(() => {
    onLog(dayIndex, log);
    setSaved(true);
    onAdvance(dayIndex);
  }, [dayIndex, log, onLog, onAdvance]);

  return (
    <Page>
      <div style={{ padding: "60px 0 100px" }}>
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBack();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onBack();
            }
          }}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: C.muted,
            cursor: "pointer",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 8,
            outline: "none",
          }}
        >
          ← {mod.title}
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
          {mod.days.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 2,
                background: i <= dayIndex || completedDays.includes(i) ? mod.color : C.border,
                opacity: i === dayIndex ? 1 : i < dayIndex || completedDays.includes(i) ? 0.4 : 0.15,
              }}
            />
          ))}
        </div>

        <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
          Phase {dayData.phase} — {currentPhase?.name}
        </Tag>

        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(40px, 7vw, 60px)",
            color: C.text,
            marginTop: 16,
            marginBottom: 6,
            lineHeight: 1.08,
            fontWeight: 400,
          }}
        >
          Day {dayData.day}
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 600, color: C.body, marginBottom: 28 }}>
          {dayData.title}
        </div>

        <div
          style={{
            background: mod.colorDim,
            borderLeft: `3px solid ${mod.color}`,
            padding: "14px 18px",
            marginBottom: 28,
            fontFamily: "'Syne', sans-serif",
            fontSize: 17,
            color: C.body,
            lineHeight: 1.7,
          }}
        >
          {dayData.objective}
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: C.body, lineHeight: 1.9, marginBottom: 32, whiteSpace: "pre-line" }}>
          {dayData.content}
        </div>

        <SummaryPanel label="Success Metric">
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: C.body, lineHeight: 1.65, fontStyle: "italic" }}>
            {dayData.metric}
          </div>
        </SummaryPanel>

        <div style={{ marginBottom: 30 }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.muted,
              marginBottom: 12,
              background: C.surface,
              padding: "10px 16px",
              border: `1px solid ${C.border}`,
            }}
          >
            Post-Session Log
          </div>

          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: mod.color, marginBottom: 12, fontStyle: "italic" }}>
            {dayData.logPrompt}
          </div>

          <textarea
            value={log}
            onChange={(e) => {
              setLog(e.target.value);
              setSaved(false);
            }}
            placeholder="Write your log here..."
            style={{
              width: "100%",
              minHeight: 210,
              background: C.surface2,
              border: `1px solid ${C.dim}`,
              borderRadius: 12,
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.25)",
              color: C.text,
              padding: "16px 18px",
              fontFamily: "'Syne', sans-serif",
              fontSize: 14,
              lineHeight: 1.7,
              resize: "vertical",
              outline: "none",
            }}
          />
        </div>

        {canSubmit && (
          <BtnPrimary
            onClick={handleSubmit}
            disabled={saved}
            full
            style={{ marginTop: 8 }}
          >
            {saved
              ? isLastDay
                ? "Opening Gate..."
                : `Advancing to Day ${dayData.day + 1}...`
              : isLastDay
              ? "Save & Open Gate"
              : "Save & Continue"}
          </BtnPrimary>
        )}
      </div>
    </Page>
  );
}

function GateScreen({ mod, logs, onPass, onRetry }) {
  const day6Log = logs?.[5] || "";
  const day7Log = logs?.[6] || "";

  const [evidenceSignature, setEvidenceSignature] = useState("");
  const [evidenceAction, setEvidenceAction] = useState("");
  const [checks, setChecks] = useState({
    repsComplete: false,
    protocolExecuted: false,
    outcomeHonored: false,
    loggedHonestly: false,
  });

  const gateConfig = {
    state: {
      signatureLabel: "Spike signature",
      signatureHint: "Name the exact physical pattern that fired.",
      actionLabel: "Protocol execution",
      actionHint: "What did you do when it fired? Name the steps you actually ran.",
      checklist: {
        repsComplete: "I completed the required Day 6 and Day 7 reps.",
        protocolExecuted: "I ran MIRP during a live spike, not after the fact.",
        outcomeHonored: "I stayed in and either recovered or exited cleanly.",
        loggedHonestly: "My logs reflect what happened, not what I wish happened.",
      },
    },
    identity: {
      signatureLabel: "Identity shift",
      signatureHint: "Name the exact moment your behavior bent toward approval.",
      actionLabel: "Correction method",
      actionHint: "What did you do when you caught the shift?",
      checklist: {
        repsComplete: "I completed the required Day 6 and Day 7 reps.",
        protocolExecuted: "I corrected a shift without performing harder.",
        outcomeHonored: "I maintained identity through the end of the interaction.",
        loggedHonestly: "My logs show the trigger and the correction honestly.",
      },
    },
    decision: {
      signatureLabel: "Override script",
      signatureHint: "Write the exact language your brain used to delay action.",
      actionLabel: "Trigger fired",
      actionHint: "What did you do when the script fired?",
      checklist: {
        repsComplete: "I completed the required Day 6 and Day 7 reps.",
        protocolExecuted: "I moved on valid openings using the preloaded trigger.",
        outcomeHonored: "I can identify at least one window where I moved on time.",
        loggedHonestly: "My logs capture real openings and whether I acted.",
      },
    },
    calibration: {
      signatureLabel: "Signal pattern",
      signatureHint: "Name the clustered signals you observed, not a single moment.",
      actionLabel: "Decision rule",
      actionHint: "What did you do based on the pattern you observed?",
      checklist: {
        repsComplete: "I completed the required Day 6 and Day 7 reps.",
        protocolExecuted: "I tested once or advanced only on earned evidence.",
        outcomeHonored: "I honored the read instead of forcing continuation.",
        loggedHonestly: "My logs show the signals, decision, and result honestly.",
      },
    },
  }[mod.id];

  const canPass =
    evidenceSignature.trim().length >= 10 &&
    evidenceAction.trim().length >= 10 &&
    Object.values(checks).every(Boolean);

  return (
    <Page>
      <div style={{ padding: "80px 0 110px" }}>
        <div style={{ textAlign: "center" }}>
        <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
          Progression Gate — Module {mod.number}
        </Tag>

        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(28px, 5vw, 38px)",
            color: C.text,
            lineHeight: 1.4,
            marginBottom: 18,
            marginTop: 20,
            fontWeight: 400,
          }}
        >
          Evidence required.
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
          This gate verifies installation using your own recorded reps. It is not a vibe check.
        </div>

        {(day6Log || day7Log) && (
          <SummaryPanel label="Your Evidence" color={mod.color}>
            {day6Log ? (
              <div style={{ textAlign: "left", marginBottom: day7Log ? 14 : 0 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.dim, marginBottom: 6 }}>
                  Day 6 — {mod.days[5].title}
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#C8D0E0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {day6Log}
                </div>
              </div>
            ) : null}

            {day7Log ? (
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.dim, marginBottom: 6 }}>
                  Day 7 — {mod.days[6].title}
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#C8D0E0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {day7Log}
                </div>
              </div>
            ) : null}
          </SummaryPanel>
        )}

        <SummaryPanel label="Gate Evidence" color={C.gold}>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: mod.color, fontStyle: "italic", marginBottom: 6 }}>
              {gateConfig.signatureLabel}
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 8 }}>
              {gateConfig.signatureHint}
            </div>
            <textarea
              value={evidenceSignature}
              onChange={(e) => setEvidenceSignature(e.target.value)}
              placeholder="Write the exact pattern in plain language..."
              style={{
                width: "100%",
                minHeight: 74,
                background: C.bg,
                border: `1px solid ${C.border}`,
                color: C.text,
                padding: "12px 14px",
                fontFamily: "'Syne', sans-serif",
                fontSize: 13,
                lineHeight: 1.7,
                resize: "vertical",
                outline: "none",
                marginBottom: 16,
              }}
            />

            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: mod.color, fontStyle: "italic", marginBottom: 6 }}>
              {gateConfig.actionLabel}
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 8 }}>
              {gateConfig.actionHint}
            </div>
            <textarea
              value={evidenceAction}
              onChange={(e) => setEvidenceAction(e.target.value)}
              placeholder="What you did when it fired..."
              style={{
                width: "100%",
                minHeight: 84,
                background: C.bg,
                border: `1px solid ${C.border}`,
                color: C.text,
                padding: "12px 14px",
                fontFamily: "'Syne', sans-serif",
                fontSize: 13,
                lineHeight: 1.7,
                resize: "vertical",
                outline: "none",
              }}
            />
          </div>
        </SummaryPanel>

        <SummaryPanel label="Confirmation" color={mod.color}>
          <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(gateConfig.checklist).map(([key, label]) => (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 13,
                  color: "#C8D0E0",
                  lineHeight: 1.55,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checks[key]}
                  onChange={(e) =>
                    setChecks((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                  style={{ marginTop: 2 }}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </SummaryPanel>

        </div>

        <div style={{ textAlign: "left" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginTop: 28 }}>
          <BtnPrimary onClick={onPass} disabled={!canPass} full>
            Yes — Gate Passed
          </BtnPrimary>
          <BtnSecondary onClick={onRetry} full>
            Not Yet
          </BtnSecondary>
        </div>

        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.dim, marginTop: 18, lineHeight: 1.6, textAlign: "center" }}>
          Gate logic: evidence + confirmation. No shame in reps.
        </div>
      </div>
    </Page>
  );
}

function CompletionScreen({ mod, onContinue }) {
  const nextMod = MODULES[MODULES.findIndex((m) => m.id === mod.id) + 1];
  const completedAt = loadModuleCompletionDate(mod.id);

  return (
    <Page>
      <div style={{ padding: "90px 0 120px", textAlign: "center" }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            margin: "0 auto 24px",
            background: mod.colorDim,
            border: `2px solid ${mod.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            color: mod.color,
          }}
        >
          ✓
        </div>

        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.done, marginBottom: 6 }}>
          Marked Installed
        </div>

        {completedAt ? (
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.dim, marginBottom: 18 }}>
            Evidence confirmed · {formatCompletionDate(completedAt)}
          </div>
        ) : null}

        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(32px, 5vw, 44px)",
            color: C.text,
            marginBottom: 12,
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          {mod.title}
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 36 }}>
          {nextMod
            ? `Module ${nextMod.number}: ${nextMod.title} is now unlocked.`
            : "All four execution modules complete. The full operating loop is installed."}
        </div>

        <BtnPrimary onClick={onContinue}>
          {nextMod ? `Begin Module ${nextMod.number}` : "Return to Dashboard"}
        </BtnPrimary>
      </div>
    </Page>
  );
}

function RetryScreen({ mod, logs, onBack }) {
  const day6Log = logs?.[5];
  const day7Log = logs?.[6];

  return (
    <Page>
      <div style={{ padding: "80px 0 110px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gold, marginBottom: 22 }}>
            Module {mod.number} — Not Yet Complete
          </div>

          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(30px, 5vw, 42px)", color: C.text, lineHeight: 1.3, marginBottom: 18, fontWeight: 400 }}>
            That&apos;s not failure. That&apos;s data.
          </div>

          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.7 }}>
            Review the evidence below. Identify what broke — detection, execution, or exit — then run the phase again with that specific focus.
          </div>
        </div>

        {day6Log ? (
          <SummaryPanel label={`Day 6 — ${mod.days[5].title}`} color={mod.color}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#C8D0E0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {day6Log}
            </div>
          </SummaryPanel>
        ) : null}

        {day7Log ? (
          <SummaryPanel label={`Day 7 — ${mod.days[6].title}`} color={mod.color}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#C8D0E0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {day7Log}
            </div>
          </SummaryPanel>
        ) : null}

        <SummaryPanel label="Diagnostic Question" color={C.gold}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#C8D0E0", lineHeight: 1.7, fontStyle: "italic" }}>
            Reading your own logs above — where did the breakdown actually happen? Detection, execution, or exit?
          </div>
        </SummaryPanel>

        <BtnSecondary onClick={onBack}>← Back to Module</BtnSecondary>
      </div>
    </Page>
  );
}

function ConfirmReRun({ mod, onConfirm, onCancel }) {
  const isState = mod.id === "state";

  return (
    <Page>
      <div style={{ padding: "90px 0 120px", textAlign: "center" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gold, marginBottom: 22 }}>
          Confirm Re-Run
        </div>

        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 5vw, 38px)", color: C.text, lineHeight: 1.35, marginBottom: 18, fontWeight: 400 }}>
          This will erase your record of {mod.title}.
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 22 }}>
          Your logs, completion date, and progress for this module will be wiped. The module will reopen as a fresh 7-day arc.
        </div>

        {isState ? (
          <SummaryPanel label="Important" color={C.gold}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#C8D0E0", lineHeight: 1.7 }}>
              State is foundational. Re-running State also re-locks Identity, Decision, and Calibration until State is completed again.
            </div>
          </SummaryPanel>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginTop: 26 }}>
          <BtnSecondary onClick={onConfirm} full style={{ borderColor: C.gold, color: C.gold }}>
            Yes — Erase and Re-Run
          </BtnSecondary>
          <BtnPrimary onClick={onCancel} full>
            Cancel
          </BtnPrimary>
        </div>
      </div>
    </Page>
  );
}

function InstalledModuleView({ moduleId, onBack, onReRun }) {
  const mod = MODULES.find((m) => m.id === moduleId);
  const progress = loadModuleProgress(moduleId);
  const completedAt = loadModuleCompletionDate(moduleId);
  const [expandedDay, setExpandedDay] = useState(null);
  const [confirmReRun, setConfirmReRun] = useState(false);

  if (!mod) {
    return (
      <Page>
        <div style={{ padding: "100px 0", textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: C.text, marginBottom: 16, fontWeight: 400 }}>
            Module Not Found
          </div>
          <BtnSecondary onClick={onBack}>← Back to Modules</BtnSecondary>
        </div>
      </Page>
    );
  }

  if (confirmReRun) {
    return (
      <ConfirmReRun
        mod={mod}
        onConfirm={() => {
          resetModuleProgress(moduleId);
          onReRun(moduleId);
        }}
        onCancel={() => setConfirmReRun(false)}
      />
    );
  }

  return (
    <Page>
      <div style={{ padding: "60px 0 100px" }}>
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBack();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onBack();
            }
          }}
          style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, cursor: "pointer", marginBottom: 28, display: "flex", alignItems: "center", gap: 8, outline: "none" }}
        >
          ← All Modules
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: C.doneDim, border: `2px solid ${C.done}`, color: C.done, fontSize: 18 }}>
            ✓
          </div>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.done }}>
              Marked Installed
            </div>
            {completedAt ? (
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.dim, marginTop: 2 }}>
                Evidence confirmed · {formatCompletionDate(completedAt)}
              </div>
            ) : null}
          </div>
        </div>

        <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
          Module {mod.number} · {mod.engine}
        </Tag>

        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(34px, 5vw, 48px)", color: C.text, marginTop: 16, marginBottom: 8, lineHeight: 1.08, fontWeight: 400 }}>
          {mod.title}
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 28 }}>
          {mod.subtitle}
        </div>

        <SummaryPanel label="Reference Material" color={C.done}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#C8D0E0", lineHeight: 1.7 }}>
            This module is installed. The arc below is now preserved as your reference record.
          </div>
        </SummaryPanel>

        {mod.phases.map((phase, pi) => (
          <div key={pi} style={{ marginBottom: 26 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
              Phase {String.fromCharCode(65 + pi)} — {phase.name}
            </div>

            {phase.days.map((dayNum) => {
              const dayIdx = dayNum - 1;
              const dayData = mod.days[dayIdx];
              const log = progress.logs[dayIdx];
              const isExpanded = expandedDay === dayIdx;

              return (
                <div key={dayNum} style={{ marginBottom: 6 }}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setExpandedDay(isExpanded ? null : dayIdx);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setExpandedDay(isExpanded ? null : dayIdx);
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "16px 18px",
                      background: C.doneDim,
                      border: `1px solid ${C.doneBorder}`,
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: C.doneDim, border: `1px solid ${C.doneBorder}`, fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.done }}>
                      ✓
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, color: C.text }}>
                        {dayData.title}
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.dim, marginTop: 2 }}>
                        Day {dayNum} · Tap to view log
                      </div>
                    </div>

                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.muted }}>
                      {isExpanded ? "−" : "+"}
                    </div>
                  </div>

                  {isExpanded && log ? (
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: "none", borderLeft: `3px solid ${mod.color}`, padding: "16px 18px" }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: mod.color, marginBottom: 10, fontStyle: "italic" }}>
                        {dayData.logPrompt}
                      </div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#D0D8E8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                        {log}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}

        <div style={{ marginTop: 32, paddingTop: 28, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 16 }}>
            Module Maintenance
          </div>
          <BtnSecondary onClick={() => setConfirmReRun(true)}>Re-Run Module</BtnSecondary>
        </div>
      </div>
    </Page>
  );
}

function ModuleView({ moduleId, onBack, onComplete }) {
  const mod = MODULES.find((m) => m.id === moduleId);
  const initial = loadModuleProgress(moduleId);
  const [currentDay, setCurrentDay] = useState(null);
  const [completedDays, setCompletedDays] = useState(initial.completedDays);
  const [logs, setLogs] = useState(initial.logs);
  const [view, setView] = useState("overview");

  useEffect(() => {
    if (view === "overview" && currentDay === null) {
      const nextIncomplete = [0, 1, 2, 3, 4, 5, 6].find((i) => !completedDays.includes(i));
      if (nextIncomplete !== undefined) setCurrentDay(nextIncomplete);
    }
  }, [view, currentDay, completedDays]);

  useEffect(() => {
    saveModuleProgress(moduleId, completedDays, logs);
  }, [moduleId, completedDays, logs]);

  const handleLog = useCallback((dayIdx, text) => {
    setLogs((prev) => ({ ...prev, [dayIdx]: text }));
  }, []);

  const handleAdvance = useCallback((dayIdx) => {
    setCompletedDays((prev) => (prev.includes(dayIdx) ? prev : [...prev, dayIdx]));
    if (dayIdx === 6) {
      setTimeout(() => {
        setCurrentDay(null);
        setView("gate");
      }, 250);
      return;
    }
    setTimeout(() => setCurrentDay(dayIdx + 1), 250);
  }, []);

  if (!mod) {
    return (
      <Page>
        <div style={{ padding: "100px 0", textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: C.text, marginBottom: 16, fontWeight: 400 }}>
            Module Not Found
          </div>
          <BtnSecondary onClick={onBack}>← Back to Modules</BtnSecondary>
        </div>
      </Page>
    );
  }

  const allDaysComplete = [0, 1, 2, 3, 4, 5, 6].every((i) => completedDays.includes(i));
  const allLogsPresent = [0, 1, 2, 3, 4, 5, 6].every((i) => logs[i] && logs[i].trim().length > 0);
  const gateReady = allDaysComplete && allLogsPresent;

  if (view === "completion") {
    return <CompletionScreen mod={mod} onContinue={() => { onComplete(moduleId); onBack(); }} />;
  }

  if (view === "retry") {
    return <RetryScreen mod={mod} logs={logs} onBack={() => setView("overview")} />;
  }

  if (view === "gate") {
    return (
      <GateScreen
        mod={mod}
        logs={logs}
        onPass={() => {
          saveModuleCompletion(moduleId);
          setView("completion");
        }}
        onRetry={() => setView("retry")}
      />
    );
  }

  if (currentDay !== null) {
    return (
      <DayView
        key={currentDay}
        mod={mod}
        dayIndex={currentDay}
        existingLog={logs[currentDay]}
        completedDays={completedDays}
        onLog={handleLog}
        onBack={() => setCurrentDay(null)}
        onAdvance={handleAdvance}
      />
    );
  }

  return (
    <Page>
      <div style={{ padding: "60px 0 100px" }}>
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBack();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onBack();
            }
          }}
          style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, cursor: "pointer", marginBottom: 28, display: "flex", alignItems: "center", gap: 8, outline: "none" }}
        >
          ← All Modules
        </div>

        <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
          Module {mod.number} · {mod.engine}
        </Tag>

        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(34px, 5vw, 48px)", color: C.text, marginTop: 16, marginBottom: 8, lineHeight: 1.08, fontWeight: 400 }}>
          {mod.title}
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 30 }}>
          {mod.subtitle}
        </div>

        {mod.phases.map((phase, pi) => (
          <div key={pi} style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
              Phase {String.fromCharCode(65 + pi)} — {phase.name}
            </div>

            {phase.days.map((dayNum) => {
              const dayIdx = dayNum - 1;
              const dayData = mod.days[dayIdx];
              const isDone = completedDays.includes(dayIdx);
              const isAvailable = dayIdx === 0 || completedDays.includes(dayIdx - 1) || isDone;

              return (
                <div
                  key={dayNum}
                  role="button"
                  tabIndex={isAvailable ? 0 : -1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isAvailable) setCurrentDay(dayIdx);
                  }}
                  onKeyDown={(e) => {
                    if (!isAvailable) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setCurrentDay(dayIdx);
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 18px",
                    background: isDone ? C.doneDim : isAvailable ? C.surface2 : C.surface2,
                    border: `1px solid ${isDone ? C.doneBorder : isAvailable ? C.border : C.borderLight}`,
                    borderLeft: `3px solid ${isDone ? C.done : mod.color}`,
                    marginBottom: 8,
                    cursor: isAvailable ? "pointer" : "default",
                    opacity: 1,
                    transition: "all 0.2s ease",
                    outline: "none",
                  }}
                >
                  <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: isDone ? C.doneDim : C.surface, border: `1px solid ${isDone ? C.doneBorder : C.border}`, fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDone ? C.done : C.muted }}>
                    {isDone ? "✓" : dayNum}
                  </div>

                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: isAvailable ? C.text : C.mutedStrong }}>
                      {dayData.title}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.dim, marginTop: 2 }}>
                      Day {dayNum}{isDone ? " · Logged" : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {gateReady ? (
          <BtnPrimary onClick={() => setView("gate")} full style={{ marginTop: 10 }}>
            Progression Gate
          </BtnPrimary>
        ) : null}
      </div>
    </Page>
  );
}

export default function App() {
  const [screen, setScreen] = useState("entry");
  const [primaryModule] = useState(() => getModuleFromUrl());
  const [activeModule, setActiveModule] = useState(null);
  const [completedModules, setCompletedModules] = useState(() => loadCompletedModules());

  useEffect(() => {
    const id = "hspos-phase2-global-styles";
    let styleTag = document.getElementById(id);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = id;
      styleTag.textContent = `
        html { scroll-behavior: smooth; }
        html, body, #root {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background: ${C.bg};
          color: ${C.text};
          font-family: 'Syne', sans-serif;
        }
        *, *::before, *::after { box-sizing: border-box; }
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }
        button:focus-visible, [role="button"]:focus-visible, textarea:focus-visible {
          outline: 2px solid ${C.gold};
          outline-offset: 2px;
        }
        @media (max-width: 480px) {
          textarea { min-height: 160px !important; }
        }
      `;
      document.head.appendChild(styleTag);
    }

    const linkId = "hspos-phase2-fonts";
    let link = document.getElementById(linkId);
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    saveCompletedModules(completedModules);
  }, [completedModules]);

  const handleComplete = useCallback((id) => {
    setCompletedModules((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiveModule(null);
  }, []);

  const handleReRun = useCallback((id) => {
    setCompletedModules((prev) => {
      if (id === "state") return [];
      const cutoff = MODULES.findIndex((m) => m.id === id);
      return prev.filter((mid) => MODULES.findIndex((m) => m.id === mid) < cutoff);
    });
  }, []);

  const handleEnter = useCallback(() => {
    setScreen("dashboard");
    setActiveModule(primaryModule);
  }, [primaryModule]);

  if (screen === "entry") return <EntryScreen onEnter={handleEnter} />;

  if (activeModule) {
    const isInstalled = completedModules.includes(activeModule);
    if (isInstalled) {
      return <InstalledModuleView moduleId={activeModule} onBack={() => setActiveModule(null)} onReRun={handleReRun} />;
    }
    return <ModuleView moduleId={activeModule} onBack={() => setActiveModule(null)} onComplete={handleComplete} />;
  }

  return <ModuleSelect primaryModule={primaryModule} completedModules={completedModules} onSelect={setActiveModule} />;
}
