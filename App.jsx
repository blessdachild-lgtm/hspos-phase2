import React, { useState, useEffect, useCallback } from "react";

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Syne:wght@400;500;600;700;800&display=swap');`;

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

const C = { 
  bg: "#0D0F14", 
  surface: "#13161D", 
  surface2: "#1A1E28", 
  border: "#252A36", 
  text: "#F0F2F8", 
  muted: "#9BA3B5", 
  dim: "#4A5268", 
  gold: "#C9A84C", 
  done: "#4DB87A", 
  doneDim: "#091410", 
  doneBorder: "#0D3020",
};

const SYNTHESIS_CONFIG = {
  state: {
    keyDayIndex: 3,
    keyLabel: "What you named on Day 4",
    keyDescriptor: "Your spike signature",
    direction: "Your spike signature is now named. The next module tests whether your identity holds under that activation.",
    installedCapability: "You can now detect and move through activation instead of waiting for it to pass.",
    verdictStatement: "Seven days ago you didn't have a name for what your body does under pressure. Now you do. That's not small — that's the entire foundation the rest of this system runs on.",
  },
  identity: {
    keyDayIndex: 0,
    keyLabel: "What you wrote on Day 1",
    keyDescriptor: "Your identity anchor",
    direction: "Your identity anchor is installed. The next module tests whether you act from it before your override script runs.",
    installedCapability: "You now have an identity anchor that holds when interest is high and approval is available.",
    verdictStatement: "Seven days ago your behavior was being calibrated by their reaction. Now you have an internal reference point that doesn't move. That's the difference between performing and operating.",
  },
  decision: {
    keyDayIndex: 1,
    keyLabel: "What you named on Day 2",
    keyDescriptor: "Your override script",
    direction: "Your trigger is loaded. The next module tests whether you can read accurately enough to know when to fire it.",
    installedCapability: "You now move on pre-loaded triggers instead of in-the-moment deliberation.",
    verdictStatement: "Seven days ago the window would close before you moved. Now the decision is made before you arrive. That's the only change that matters — and you made it.",
  },
  calibration: {
    keyDayIndex: 4,
    keyLabel: "What you tested on Day 5",
    keyDescriptor: "Your live signal read",
    direction: "All four engines are installed. From here, the work is maintenance, not installation.",
    installedCapability: "You now read signal patterns instead of moments — and you act on evidence, not hope.",
    verdictStatement: "Four modules. Twenty-eight days. You came in with a breakdown point and you're leaving with an operating system. The system doesn't end here — this is where it runs on its own.",
  },
};

const REFERENCE_CARD_CONFIG = {
  state: {
    label: "Spike Signature",
    dayIndex: 3,
    color: "#E8833A",
    colorDim: "#1C1209",
    colorBorder: "#3D2810",
    description: "What your body does under pressure",
  },
  identity: {
    label: "Identity Anchor",
    dayIndex: 0,
    color: "#4A9EDB",
    colorDim: "#091520",
    colorBorder: "#0D2D42",
    description: "Who you are independent of outcome",
  },
  decision: {
    label: "Override Script",
    dayIndex: 1,
    color: "#9B6FDB",
    colorDim: "#120D1C",
    colorBorder: "#261840",
    description: "The exact language that stops you",
  },
  calibration: {
    label: "Signal Read",
    dayIndex: 4,
    color: "#4DB87A",
    colorDim: "#091410",
    colorBorder: "#0D3020",
    description: "Where your reads have been off",
  },
};

const STORAGE_KEY = "hspos_phase2_v1";
const VALID_MODULES = ["state", "identity", "decision", "calibration"];

function getModuleFromUrl() {
  if (typeof window === "undefined") return "state";
  const params = new URLSearchParams(window.location.search);
  const moduleFromUrl = params.get("module");
  return VALID_MODULES.includes(moduleFromUrl) ? moduleFromUrl : "state";
}

function loadState() {
  try {
    const raw = typeof window !== "undefined" && window.localStorage
      ? window.localStorage.getItem(STORAGE_KEY)
      : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function saveState(state) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (e) {}
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

function loadModuleLog(moduleId, dayIndex) {
  const state = loadState();
  if (!state || !state.modules || !state.modules[moduleId]) return "";
  const logs = state.modules[moduleId].logs;
  if (!logs) return "";
  return logs[dayIndex] || "";
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
  } catch (e) {
    return "";
  }
}

// Button Components
function BtnPrimary({ children, onClick, disabled = false, full = false }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        background: disabled ? C.surface2 : (hover ? C.gold : C.text),
        color: disabled ? C.muted : C.bg,
        border: "none",
        padding: "16px 32px",
        width: full ? "100%" : "auto",
        fontFamily: "'Syne', sans-serif",
        fontSize: "15px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {children}
      <span style={{ fontSize: "18px", transition: "transform 0.2s", transform: hover ? "translateX(4px)" : "none" }}>→</span>
    </button>
  );
}

function BtnSecondary({ children, onClick, full = false, style = {} }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: full ? "100%" : "auto",
        background: "transparent",
        border: `2px solid ${hover ? C.dim : C.border}`,
        color: hover ? C.text : C.muted,
        padding: "12px 24px",
        fontFamily: "'Syne', sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Tag({ children, color, bgColor, borderColor }) {
  return (
    <span style={{ 
      fontFamily: "'DM Mono', monospace", 
      fontSize: "12px", 
      letterSpacing: "0.2em", 
      textTransform: "uppercase", 
      color, 
      padding: "6px 14px", 
      border: `2px solid ${borderColor}`, 
      background: bgColor, 
      display: "inline-block",
      fontWeight: 500
    }}>
      {children}
    </span>
  );
}

function SystemTag({ children }) {
  return (
    <div style={{ 
      fontFamily: "'DM Mono', monospace", 
      fontSize: "12px", 
      letterSpacing: "0.25em", 
      color: C.muted, 
      textTransform: "uppercase", 
      marginBottom: "28px", 
      display: "flex", 
      alignItems: "center", 
      gap: "12px" 
    }}>
      <span style={{ width: "32px", height: "2px", background: C.muted, display: "inline-block" }} />
      {children}
    </div>
  );
}

function Wrap({ children, maxWidth = "680px" }) {
  return (
    <div style={{ 
      position: "relative", 
      zIndex: 1, 
      width: "100%",
      maxWidth: maxWidth, 
      margin: "0 auto", 
      padding: "0 20px",
      boxSizing: "border-box"
    }}>
      {children}
    </div>
  );
}

function Page({ children, maxWidth = "680px" }) {
  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100%", 
      maxWidth: "100%",
      background: C.bg, 
      color: C.text,
      margin: 0,
      padding: 0,
      boxSizing: "border-box"
    }}>
      <Wrap maxWidth={maxWidth}>{children}</Wrap>
    </div>
  );
}

// Entry Screen
function EntryScreen({ onEnter }) {
  const [fade, setFade] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg, opacity: fade ? 1 : 0, transition: "opacity 0.8s ease" }}>
      <Wrap>
        <div style={{ padding: "80px 0 48px", borderBottom: `2px solid ${C.border}`, marginBottom: "48px" }}>
          <SystemTag>HS-POS · Phase 2 · Execution Modules</SystemTag>
          <h1 style={{ 
            fontFamily: "'DM Serif Display', serif", 
            fontSize: "clamp(52px, 10vw, 84px)", 
            lineHeight: 0.98, 
            color: C.text, 
            marginBottom: "24px", 
            fontWeight: 400,
            letterSpacing: "-0.02em"
          }}>
            Begin the<br/><em style={{ fontStyle: "italic", color: C.gold }}>Correction.</em>
          </h1>
          <div style={{ 
            fontSize: "18px", 
            color: C.text, 
            lineHeight: 1.65, 
            marginBottom: "32px", 
            fontWeight: 500, 
            borderLeft: `4px solid ${C.gold}`, 
            paddingLeft: "18px" 
          }}>
            You now know the problem. What you don't have yet is the correction.
          </div>
          <div style={{ marginBottom: "40px" }}>
            <p style={{ fontSize: "17px", color: C.muted, lineHeight: 1.8, marginBottom: "16px" }}>
              This is the second phase of HS-POS. The diagnostic identified your primary impediment. This is the structured correction.
            </p>
            <p style={{ fontSize: "17px", color: C.muted, lineHeight: 1.8, marginBottom: "0" }}>
              Each module is a 7-day correction arc. You start with the highest-priority breakdown point and build forward from there.
            </p>
          </div>
          <BtnPrimary onClick={onEnter}>Begin</BtnPrimary>
        </div>
        <div style={{ 
          fontFamily: "'DM Mono', monospace", 
          fontSize: "12px", 
          color: C.muted, 
          lineHeight: 1.8, 
          marginTop: "60px", 
          paddingTop: "32px", 
          borderTop: `2px solid ${C.border}`,
          paddingBottom: "80px"
        }}>
          7-day execution modules. Built to match the diagnostic logic and continue the correction without breaking continuity.<br/>
          Human Social Performance Operating System · 100 Acrez Holdings, LLC
        </div>
      </Wrap>
    </div>
  );
}

// Module Select Screen
function ModuleSelect({ primaryModule, onSelect, completedModules }) {
  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg }}>
      <Wrap maxWidth="min(900px, 100%)">
        <div style={{ padding: "80px 0 120px" }}>
          <SystemTag>Execution Modules</SystemTag>
          <h1 style={{ 
            fontFamily: "'DM Serif Display', serif", 
            fontSize: "clamp(44px, 7vw, 68px)", 
            color: C.text, 
            marginBottom: "20px", 
            lineHeight: 1.05, 
            fontWeight: 400 
          }}>
            Your Correction Arc
          </h1>
          <div style={{ 
            fontFamily: "'Syne', sans-serif", 
            fontSize: "17px", 
            color: C.muted, 
            lineHeight: 1.8, 
            marginBottom: "48px", 
            paddingBottom: "32px", 
            borderBottom: `2px solid ${C.border}` 
          }}>
            Modules unlock sequentially. Each one builds on the last. The architecture starts at State because everything downstream depends on it.
          </div>
          {MODULES.map((mod, i) => {
            const done = completedModules.includes(mod.id);
            const unlocked = i === 0 || completedModules.includes(MODULES[i - 1].id) || mod.id === primaryModule;
            const active = unlocked && !done;
            const primary = mod.id === primaryModule;
            return (
              <div 
                key={mod.id} 
                onClick={() => { if (unlocked) onSelect(mod.id); }} 
                style={{ 
                  background: active ? C.surface : "transparent", 
                  border: `2px solid ${active ? mod.colorBorder : done ? C.doneBorder : unlocked ? C.border : C.dim}`, 
                  padding: "28px 32px", 
                  marginBottom: "16px", 
                  cursor: unlocked ? "pointer" : "default", 
                  transition: "all 0.2s ease", 
                  position: "relative", 
                  overflow: "hidden" 
                }}
              >
                {primary && (
                  <div style={{ 
                    position: "absolute", 
                    top: 0, 
                    right: 0, 
                    background: C.gold, 
                    color: C.bg, 
                    fontFamily: "'DM Mono', monospace", 
                    fontSize: "11px", 
                    letterSpacing: "0.2em", 
                    textTransform: "uppercase", 
                    padding: "6px 14px", 
                    fontWeight: 700 
                  }}>
                    Assigned Route
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: active ? "12px" : 0 }}>
                  <div style={{ 
                    width: "52px", 
                    height: "52px", 
                    borderRadius: "50%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    background: done ? C.doneDim : mod.colorDim, 
                    border: `2px solid ${done ? C.doneBorder : mod.colorBorder}`, 
                    fontFamily: "'DM Mono', monospace", 
                    fontSize: "18px", 
                    fontWeight: 700, 
                    color: done ? C.done : mod.color 
                  }}>
                    {done ? "✓" : mod.number}
                  </div>
                  <div>
                    <div style={{ 
                      fontFamily: "'Syne', sans-serif", 
                      fontSize: "22px", 
                      fontWeight: 700, 
                      color: unlocked ? C.text : C.dim 
                    }}>
                      {mod.title}
                    </div>
                    <div style={{ 
                      fontFamily: "'DM Mono', monospace", 
                      fontSize: "11px", 
                      color: unlocked ? C.muted : C.dim, 
                      letterSpacing: "0.15em", 
                      marginTop: "4px" 
                    }}>
                      {done ? "INSTALLED" : unlocked ? "7 DAYS · 3 PHASES" : `LOCKED — Complete Module ${i} first`}
                    </div>
                  </div>
                </div>
                {active && (
                  <div style={{ 
                    fontFamily: "'Syne', sans-serif", 
                    fontSize: "16px", 
                    color: C.muted, 
                    lineHeight: 1.65, 
                    paddingLeft: "72px" 
                  }}>
                    {mod.subtitle}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Wrap>
    </div>
  );
}

// Day View Screen
function DayView({ mod, dayIndex, existingLog, completedDays, onLog, onBack, onAdvance }) {
  const dayData = mod.days[dayIndex];
  const [log, setLog] = useState(existingLog || "");
  const [saved, setSaved] = useState(!!existingLog);
  const isLastDay = dayIndex === 6;
  const currentPhase = mod.phases.find(p => p.days.includes(dayData.day));
  const canSubmit = log.trim().length > 0;

  const handleSubmit = useCallback(() => {
    onLog(dayIndex, log);
    setSaved(true);
    onAdvance(dayIndex);
  }, [dayIndex, log, onLog, onAdvance]);

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg }}>
      <Wrap>
        <div style={{ padding: "60px 0 100px" }}>
          <div onClick={onBack} style={{ 
            fontFamily: "'DM Mono', monospace", 
            fontSize: "13px", 
            color: C.muted, 
            cursor: "pointer", 
            marginBottom: "32px", 
            display: "flex", 
            alignItems: "center", 
            gap: "10px" 
          }}>
            ← {mod.title}
          </div>
          
          <div style={{ display: "flex", gap: "4px", marginBottom: "28px" }}>
            {mod.days.map((_, i) => (
              <div key={i} style={{ 
                flex: 1, 
                height: "3px", 
                background: i <= dayIndex || completedDays.includes(i) ? mod.color : C.border, 
                opacity: i === dayIndex ? 1 : (i < dayIndex || completedDays.includes(i)) ? 0.5 : 0.2 
              }} />
            ))}
          </div>
          
          <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
            Phase {dayData.phase} — {currentPhase?.name}
          </Tag>
          
          <div style={{ 
            fontFamily: "'DM Serif Display', serif", 
            fontSize: "clamp(44px, 7vw, 64px)", 
            color: C.text, 
            marginTop: "16px", 
            marginBottom: "6px", 
            lineHeight: 1.05, 
            fontWeight: 400 
          }}>
            Day {dayData.day}
          </div>
          
          <div style={{ 
            fontFamily: "'Syne', sans-serif", 
            fontSize: "24px", 
            fontWeight: 600, 
            color: C.text, 
            marginBottom: "28px" 
          }}>
            {dayData.title}
          </div>
          
          <div style={{ 
            background: mod.colorDim, 
            borderLeft: `4px solid ${mod.color}`,
            padding: "18px 22px", 
            marginBottom: "32px", 
            fontFamily: "'Syne', sans-serif", 
            fontSize: "17px", 
            color: C.text, 
            lineHeight: 1.65,
            fontWeight: 500
          }}>
            {dayData.objective}
          </div>
          
          <div style={{ 
            fontFamily: "'Syne', sans-serif", 
            fontSize: "17px", 
            color: "#D0D8E8", 
            lineHeight: 1.85, 
            marginBottom: "36px", 
            whiteSpace: "pre-line" 
          }}>
            {dayData.content}
          </div>
          
          <div style={{ 
            background: C.surface, 
            border: `2px solid ${C.border}`, 
            borderLeft: `4px solid ${C.gold}`, 
            padding: "18px 22px", 
            marginBottom: "36px" 
          }}>
            <div style={{ 
              fontFamily: "'DM Mono', monospace", 
              fontSize: "11px", 
              letterSpacing: "0.2em", 
              textTransform: "uppercase", 
              color: C.gold, 
              marginBottom: "10px" 
            }}>
              Success Metric
            </div>
            <div style={{ 
              fontFamily: "'Syne', sans-serif", 
              fontSize: "16px", 
              color: "#C8D0E0", 
              lineHeight: 1.65, 
              fontStyle: "italic" 
            }}>
              {dayData.metric}
            </div>
          </div>
          
          <div style={{ marginBottom: "36px" }}>
            <div style={{ 
              fontFamily: "'DM Mono', monospace", 
              fontSize: "11px", 
              letterSpacing: "0.2em", 
              textTransform: "uppercase", 
              color: C.muted, 
              marginBottom: "14px", 
              background: C.surface, 
              padding: "12px 20px", 
              border: `2px solid ${C.border}` 
            }}>
              Rep Log
            </div>
            <div style={{ 
              fontFamily: "'Syne', sans-serif", 
              fontSize: "16px", 
              color: mod.color, 
              marginBottom: "14px", 
              fontStyle: "italic", 
              padding: "0 6px" 
            }}>
              {dayData.logPrompt}
            </div>
            <textarea 
              value={log} 
              onChange={(e) => { setLog(e.target.value); setSaved(false); }} 
              placeholder="Record the rep exactly as it happened." 
              style={{ 
                width: "100%", 
                minHeight: "200px", 
                background: C.surface, 
                border: `2px solid ${C.border}`, 
                color: C.text, 
                padding: "18px 22px", 
                fontFamily: "'Syne', sans-serif", 
                fontSize: "16px", 
                lineHeight: 1.7, 
                resize: "vertical", 
                outline: "none" 
              }} 
            />
          </div>
          
          {canSubmit && (
            <BtnPrimary onClick={handleSubmit} disabled={saved} full>
              {saved ? (isLastDay ? "Opening Gate" : `Loading Day ${dayData.day + 1}`) : (isLastDay ? "Log Rep & Open Gate" : "Log Rep & Continue")}
            </BtnPrimary>
          )}
        </div>
      </Wrap>
    </div>
  );
}

// Gate Screen
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
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg }}>
      <Wrap>
        <div style={{ padding: "100px 0 120px", textAlign: "center" }}>
          <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
            Progression Gate · Module {mod.number}
          </Tag>
          <div style={{ 
            fontFamily: "'DM Serif Display', serif", 
            fontSize: "clamp(32px, 5vw, 44px)", 
            color: C.text, 
            lineHeight: 1.3, 
            marginBottom: "20px", 
            marginTop: "28px", 
            fontWeight: 400 
          }}>
            {mod.gate}
          </div>
          
          {(day6Log || day7Log) && (
            <div style={{ 
              background: C.surface, 
              border: `2px solid ${C.border}`, 
              borderLeft: `4px solid ${mod.color}`, 
              padding: "18px 22px", 
              marginBottom: "32px", 
              textAlign: "left" 
            }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: mod.color, marginBottom: "14px" }}>
                Submitted Evidence
              </div>
              {day6Log && (
                <div style={{ marginBottom: day7Log ? "16px" : 0 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: C.dim, marginBottom: "6px" }}>
                    Day 6 — {mod.days[5].title}
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: "#C8D0E0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                    {day6Log}
                  </div>
                </div>
              )}
              {day7Log && (
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: C.dim, marginBottom: "6px" }}>
                    Day 7 — {mod.days[6].title}
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: "#C8D0E0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                    {day7Log}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ 
            background: C.surface, 
            border: `2px solid ${C.border}`, 
            borderLeft: `4px solid ${C.gold}`, 
            padding: "18px 22px", 
            marginBottom: "32px", 
            textAlign: "left" 
          }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "14px" }}>
              Gate Evidence
            </div>
            <div style={{ marginBottom: "18px" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: mod.color, fontStyle: "italic", marginBottom: "6px" }}>
                {gateConfig.signatureLabel}
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "13px", color: C.muted, lineHeight: 1.6, marginBottom: "10px", paddingLeft: "12px", borderLeft: `2px solid ${C.border}` }}>
                {gateConfig.signatureHint}
              </div>
              <textarea
                value={evidenceSignature}
                onChange={(e) => setEvidenceSignature(e.target.value)}
                placeholder="Write the exact pattern in plain language..."
                style={{
                  width: "100%",
                  minHeight: "70px",
                  background: C.bg,
                  border: `2px solid ${C.border}`,
                  color: C.text,
                  padding: "12px 14px",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                  marginBottom: "12px",
                }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: mod.color, fontStyle: "italic", marginBottom: "6px" }}>
                {gateConfig.actionLabel}
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "13px", color: C.muted, lineHeight: 1.6, marginBottom: "10px", paddingLeft: "12px", borderLeft: `2px solid ${C.border}` }}>
                {gateConfig.actionHint}
              </div>
              <textarea
                value={evidenceAction}
                onChange={(e) => setEvidenceAction(e.target.value)}
                placeholder="What you did when it fired..."
                style={{
                  width: "100%",
                  minHeight: "70px",
                  background: C.bg,
                  border: `2px solid ${C.border}`,
                  color: C.text,
                  padding: "12px 14px",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ 
            background: C.surface, 
            border: `2px solid ${C.border}`, 
            borderLeft: `4px solid ${mod.color}`, 
            padding: "18px 22px", 
            marginBottom: "36px", 
            textAlign: "left" 
          }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: mod.color, marginBottom: "14px" }}>
              Required Confirmation
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {Object.entries(gateConfig.checklist).map(([key, label]) => (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "14px",
                    color: "#C8D0E0",
                    lineHeight: 1.55,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checks[key]}
                    onChange={(e) => setChecks((prev) => ({ ...prev, [key]: e.target.checked }))}
                    style={{ marginTop: "3px", width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "center" }}>
            <BtnPrimary onClick={onPass} disabled={!canPass} full>
              Submit Gate Evidence
            </BtnPrimary>
            <BtnSecondary onClick={onRetry} full>
              Gate Not Met — Re-Run Reps
            </BtnSecondary>
          </div>

          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: C.dim, marginTop: "28px", lineHeight: 1.6 }}>
            Progression requires evidence, not momentum.
          </div>
        </div>
      </Wrap>
    </div>
  );
}

// Synthesis Screen
function SynthesisScreen({ mod, logs, onContinue }) {
  const config = SYNTHESIS_CONFIG[mod.id];
  const keyLog = logs?.[config.keyDayIndex] || "";
  const day1Log = logs?.[0] || "";
  const day7Log = logs?.[6] || "";
  const logCount = Object.values(logs || {}).filter(l => l && l.trim().length > 0).length;

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg }}>
      <Wrap>
        <div style={{ padding: "60px 0 100px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
              Module {mod.number} Complete · Your Arc
            </Tag>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(40px, 6vw, 60px)", color: C.text, lineHeight: 1.05, marginTop: "24px", fontWeight: 400 }}>
              {mod.title}
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", color: C.muted, lineHeight: 1.7, marginTop: "16px" }}>
              Seven days. One body of work. Read it back.
            </div>
          </div>

          {/* Key extraction */}
          <div style={{ background: C.surface, border: `2px solid ${C.border}`, borderLeft: `4px solid ${mod.color}`, padding: "32px 28px", marginBottom: "40px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: mod.color, marginBottom: "10px" }}>
              {config.keyDescriptor}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: C.dim, marginBottom: "18px" }}>
              {config.keyLabel}
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(22px, 3.5vw, 28px)", color: C.text, lineHeight: 1.4, fontStyle: "italic", whiteSpace: "pre-wrap", fontWeight: 400 }}>
              {keyLog || "(no entry recorded)"}
            </div>
          </div>

          {/* Day 1 vs Day 7 */}
          {(day1Log || day7Log) && (
            <div style={{ marginBottom: "40px" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, marginBottom: "20px", paddingBottom: "10px", borderBottom: `2px solid ${C.border}` }}>
                Day 1 → Day 7
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                {day1Log && (
                  <div style={{ background: C.surface, border: `2px solid ${C.border}`, padding: "18px 22px" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.dim, marginBottom: "12px" }}>Where you started</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: "#C8D0E0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{day1Log}</div>
                  </div>
                )}
                {day7Log && (
                  <div style={{ background: C.surface, border: `2px solid ${C.border}`, borderLeft: `4px solid ${mod.color}`, padding: "18px 22px" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: mod.color, marginBottom: "12px" }}>Where you ended</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: "#C8D0E0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{day7Log}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Full Arc */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, marginBottom: "20px", paddingBottom: "10px", borderBottom: `2px solid ${C.border}` }}>
              The Full Arc — All Seven Days
            </div>
            {mod.days.map((dayData, idx) => {
              const log = logs?.[idx];
              if (!log) return null;
              return (
                <div key={idx} style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: idx < 6 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.dim, marginBottom: "6px" }}>
                    Day {dayData.day} — {dayData.title}
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "13px", color: mod.color, fontStyle: "italic", marginBottom: "10px" }}>{dayData.logPrompt}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: "#B8C0D4", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{log}</div>
                </div>
              );
            })}
          </div>

          {/* ── SYSTEM VERDICT BLOCK ── */}
          <div style={{ background: C.surface, border: `2px solid ${mod.color}`, padding: "32px 28px", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: mod.color }}>
                System Verdict
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.done, background: C.doneDim, border: `1px solid ${C.doneBorder}`, padding: "4px 12px" }}>
                Evidence Sufficient · {logCount}/7 Days Logged
              </div>
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", color: C.text, lineHeight: 1.4, marginBottom: "20px", fontWeight: 400 }}>
              {config.installedCapability}
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: "#A8B4C8", lineHeight: 1.8, borderTop: `1px solid ${C.border}`, paddingTop: "18px" }}>
              {config.verdictStatement}
            </div>
          </div>

          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: C.dim, marginBottom: "40px", paddingLeft: "4px" }}>
            {logCount === 7 ? "All seven days logged. Full behavioral record confirmed." : `${logCount} of 7 days logged.`}
          </div>

          {/* Direction */}
          <div style={{ background: C.surface, border: `2px solid ${C.border}`, borderLeft: `4px solid ${C.gold}`, padding: "24px 28px", marginBottom: "40px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: C.gold, marginBottom: "14px" }}>Next</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", color: C.text, lineHeight: 1.7, fontWeight: 500 }}>{config.direction}</div>
          </div>

          <BtnPrimary onClick={onContinue} full>Mark Module {mod.number} Installed →</BtnPrimary>
        </div>
      </Wrap>
    </div>
  );
}

// Reference Card Screen
function ReferenceCardScreen({ onBack }) {
  const [copied, setCopied] = useState(false);
  const cardData = Object.entries(REFERENCE_CARD_CONFIG).map(([moduleId, config]) => ({
    moduleId, ...config,
    log: loadModuleLog(moduleId, config.dayIndex),
  }));

  const handleCopy = () => {
    const text = [
      "HS-POS OPERATING REFERENCE — 100 Acrez Holdings, LLC",
      "",
      "MIRP REFLEX: NOTICE → DOWNSHIFT → ANCHOR → MOVE",
      "",
      ...cardData.map(d => `${d.label.toUpperCase()}\n${d.description}\n${d.log || "(not recorded)"}\n`),
      "OPERATING LOOP:",
      "Assess → Regulate → Decide → Enter → Build → Calibrate → Advance or Exit → Review → Update",
    ].join("\n");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg }}>
      <Wrap>
        <div style={{ padding: "60px 0 100px" }}>
          <div onClick={onBack} style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: C.muted, cursor: "pointer", marginBottom: "40px", display: "flex", alignItems: "center", gap: "10px" }}>
            ← Back
          </div>

          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: C.gold, marginBottom: "16px" }}>
              HS-POS · Operating Reference
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 5vw, 48px)", color: C.text, lineHeight: 1.1, fontWeight: 400, marginBottom: "16px" }}>
              Your Field Card
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: C.muted, lineHeight: 1.7 }}>
              Built from your logs. Screenshot this and keep it accessible.
            </div>
          </div>

          {/* MIRP Reflex */}
          <div style={{ background: C.surface, border: `2px solid ${C.gold}`, padding: "20px 24px", marginBottom: "20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "12px" }}>
              MIRP Reflex — Fire When Spike Detected
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: C.text, letterSpacing: "0.05em" }}>
              NOTICE → DOWNSHIFT → ANCHOR → MOVE
            </div>
          </div>

          {/* Four log-based fields */}
          {cardData.map((d) => (
            <div key={d.moduleId} style={{ background: d.colorDim, border: `1px solid ${d.colorBorder}`, borderLeft: `4px solid ${d.color}`, padding: "20px 24px", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: d.color }}>
                  {d.label}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: C.dim }}>
                  {d.description}
                </div>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: d.log ? "#D0D8E8" : C.dim, lineHeight: 1.7, fontStyle: d.log ? "normal" : "italic", whiteSpace: "pre-wrap" }}>
                {d.log || "Not recorded — re-run module to add this entry."}
              </div>
            </div>
          ))}

          {/* Operating Loop */}
          <div style={{ background: C.surface, border: `2px solid ${C.border}`, padding: "20px 24px", marginBottom: "24px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, marginBottom: "12px" }}>
              Operating Loop
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#A8B4C8", lineHeight: 1.9 }}>
              Assess → Regulate → Decide → Enter →<br/>Build → Calibrate → Advance or Exit → Review → Update
            </div>
          </div>

          {/* Re-diagnostic reminder */}
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: C.dim, textAlign: "center", lineHeight: 1.8, marginBottom: "36px" }}>
            Re-run the diagnostic in 30 days.<br/>Impediments shift as the system develops.
          </div>

          {/* Copy button */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
            <button onClick={handleCopy} style={{ background: copied ? C.done : C.gold, color: C.bg, border: "none", padding: "14px 36px", fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", width: "100%", maxWidth: "360px" }}>
              {copied ? "✓ Copied to Clipboard" : "Copy Reference Card"}
            </button>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: C.dim, textAlign: "center" }}>
              Screenshot this screen or copy the text above
            </div>
          </div>
        </div>
      </Wrap>
    </div>
  );
}

// Completion Screen
function CompletionScreen({ mod, onContinue, onViewCard }) {
  const nextMod = MODULES[MODULES.findIndex(m => m.id === mod.id) + 1];
  const completedAt = loadModuleCompletionDate(mod.id);
  const isLast = !nextMod;

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg }}>
      <Wrap>
        <div style={{ padding: "80px 0 120px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", margin: "0 auto 28px", background: mod.colorDim, border: `3px solid ${mod.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", color: mod.color }}>✓</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.25em", textTransform: "uppercase", color: C.done, marginBottom: "8px" }}>
              {isLast ? "System Complete" : `Module ${mod.number} Installed`}
            </div>
            {completedAt && (
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: C.dim, marginBottom: "20px" }}>
                Evidence confirmed · {formatCompletionDate(completedAt)}
              </div>
            )}
          </div>

          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(36px, 5vw, 52px)", color: C.text, marginBottom: "20px", lineHeight: 1.1, fontWeight: 400, textAlign: "center" }}>
            {isLast ? "The Operating Loop is Installed." : `${mod.title} — Installed`}
          </div>

          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", color: C.muted, lineHeight: 1.8, textAlign: "center", maxWidth: "480px", margin: "0 auto 40px" }}>
            {isLast
              ? "Four modules. Four engines. The system is no longer something you're building — it's something you run."
              : `${mod.title} is no longer a concept you understand. It's a pattern you've demonstrated under real conditions.`}
          </div>

          {/* Next unlock — only when not last */}
          {nextMod && (
            <div style={{ background: C.surface, border: `2px solid ${C.border}`, borderLeft: `4px solid ${nextMod.color}`, padding: "22px 26px", marginBottom: "40px" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: nextMod.color, marginBottom: "10px" }}>
                Now Unlocked
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", color: C.text, fontWeight: 600, marginBottom: "6px" }}>
                Module {nextMod.number}: {nextMod.title}
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", color: C.muted, lineHeight: 1.6 }}>
                {nextMod.subtitle}
              </div>
            </div>
          )}

          {/* Full system block — only when last */}
          {isLast && (
            <div style={{ background: C.surface, border: `2px solid ${C.gold}`, padding: "28px", marginBottom: "40px", textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "14px" }}>
                HS-POS · Full System
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: "#A8B4C8", lineHeight: 1.8 }}>
                State Regulation → Identity & Foundation → Decision Engine → Signal Calibration. All four engines installed. Re-run the diagnostic in 30 days. The system grows with you.
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
            <BtnPrimary onClick={onContinue} full>
              {isLast ? "Return to Dashboard" : `Begin Module ${nextMod.number} →`}
            </BtnPrimary>
            {isLast && onViewCard && (
              <button onClick={onViewCard} style={{ width: "100%", maxWidth: "480px", padding: "14px 24px", background: "transparent", border: `2px solid ${C.gold}`, color: C.gold, fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}>
                View Your Reference Card →
              </button>
            )}
          </div>
        </div>
      </Wrap>
    </div>
  );
}

// Retry Screen
function RetryScreen({ mod, logs, onBack }) {
  const day6Log = logs && logs[5];
  const day7Log = logs && logs[6];
  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg }}>
      <Wrap>
        <div style={{ padding: "80px 0 120px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Tag color={C.gold} bgColor="transparent" borderColor={C.border}>
              Module {mod.number} — Not Yet Complete
            </Tag>
            <div style={{ 
              fontFamily: "'DM Serif Display', serif", 
              fontSize: "clamp(36px, 5vw, 52px)", 
              color: C.text, 
              lineHeight: 1.3, 
              marginBottom: "20px", 
              marginTop: "28px", 
              fontWeight: 400 
            }}>
              That's not failure. That's data.
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", color: C.muted, lineHeight: 1.7 }}>
              Review the evidence below. Identify what broke — detection, execution, or exit — then run the phase again with that specific focus.
            </div>
          </div>

          {day6Log && (
            <div style={{ background: C.surface, border: `2px solid ${C.border}`, borderLeft: `4px solid ${mod.color}`, padding: "18px 22px", marginBottom: "20px" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: mod.color, marginBottom: "10px" }}>
                Day 6 — {mod.days[5].title}
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: "#C8D0E0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {day6Log}
              </div>
            </div>
          )}

          {day7Log && (
            <div style={{ background: C.surface, border: `2px solid ${C.border}`, borderLeft: `4px solid ${mod.color}`, padding: "18px 22px", marginBottom: "28px" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: mod.color, marginBottom: "10px" }}>
                Day 7 — {mod.days[6].title}
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: "#C8D0E0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {day7Log}
              </div>
            </div>
          )}

          <div style={{ background: C.surface, border: `2px solid ${C.border}`, borderLeft: `4px solid ${C.gold}`, padding: "18px 22px", marginBottom: "40px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "10px" }}>
              Diagnostic Question
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", color: "#C8D0E0", lineHeight: 1.7, fontStyle: "italic" }}>
              Reading your own logs above — where did the breakdown actually happen? Detection, execution, or exit?
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <BtnSecondary onClick={onBack}>← Back to Module</BtnSecondary>
          </div>
        </div>
      </Wrap>
    </div>
  );
}

// Confirm Re-Run Screen
function ConfirmReRun({ mod, onConfirm, onCancel }) {
  const isState = mod.id === "state";
  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg }}>
      <Wrap>
        <div style={{ padding: "100px 0 120px", textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.25em", textTransform: "uppercase", color: C.gold, marginBottom: "28px" }}>
            Confirm Re-Run
          </div>
          <div style={{ 
            fontFamily: "'DM Serif Display', serif", 
            fontSize: "clamp(32px, 5vw, 44px)", 
            color: C.text, 
            lineHeight: 1.3, 
            marginBottom: "20px", 
            fontWeight: 400 
          }}>
            This will erase your record of {mod.title}.
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", color: C.muted, lineHeight: 1.7, marginBottom: "28px" }}>
            Your logs, completion date, and progress for this module will be wiped. The module will reopen as a fresh 7-day arc.
          </div>
          {isState && (
            <div style={{ background: C.surface, border: `2px solid ${C.border}`, borderLeft: `4px solid ${C.gold}`, padding: "16px 20px", marginBottom: "36px", textAlign: "left" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "8px" }}>
                Important
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: "#C8D0E0", lineHeight: 1.7 }}>
                State is foundational. Re-running State also re-locks Identity, Decision, and Calibration until State is completed again.
              </div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "center" }}>
            <BtnSecondary onClick={onConfirm} full style={{ borderColor: C.gold, color: C.gold }}>
              Yes — Erase and Re-Run
            </BtnSecondary>
            <BtnPrimary onClick={onCancel} full>
              Cancel
            </BtnPrimary>
          </div>
        </div>
      </Wrap>
    </div>
  );
}

// Installed Module View
function InstalledModuleView({ moduleId, onBack, onReRun }) {
  const mod = MODULES.find(m => m.id === moduleId);
  const progress = loadModuleProgress(moduleId);
  const completedAt = loadModuleCompletionDate(moduleId);
  const [expandedDay, setExpandedDay] = useState(null);
  const [confirmReRun, setConfirmReRun] = useState(false);

  if (!mod) {
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: C.bg }}>
        <Wrap>
          <div style={{ padding: "100px 0", textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 5vw, 36px)", color: C.text, marginBottom: "20px", fontWeight: 400 }}>Module Not Found</div>
            <BtnSecondary onClick={onBack}>← Back to Modules</BtnSecondary>
          </div>
        </Wrap>
      </div>
    );
  }

  if (confirmReRun) {
    return <ConfirmReRun mod={mod} onConfirm={() => { resetModuleProgress(moduleId); onReRun(moduleId); }} onCancel={() => setConfirmReRun(false)} />;
  }

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg }}>
      <Wrap>
        <div style={{ padding: "60px 0 100px" }}>
          <div onClick={onBack} style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: C.muted, cursor: "pointer", marginBottom: "32px", display: "flex", alignItems: "center", gap: "10px" }}>
            ← All Modules
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: C.doneDim, border: `2px solid ${C.done}`, color: C.done, fontSize: "22px" }}>✓</div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.25em", textTransform: "uppercase", color: C.done }}>Marked Installed</div>
              {completedAt && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: C.dim, marginTop: "4px" }}>Evidence confirmed · {formatCompletionDate(completedAt)}</div>}
            </div>
          </div>

          <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
            Module {mod.number} · {mod.engine}
          </Tag>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(40px, 6vw, 60px)", color: C.text, marginTop: "20px", marginBottom: "12px", lineHeight: 1.05, fontWeight: 400 }}>
            {mod.title}
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", color: C.muted, lineHeight: 1.7, marginBottom: "36px" }}>
            {mod.subtitle}
          </div>

          <div style={{ background: C.surface, border: `2px solid ${C.border}`, borderLeft: `4px solid ${C.done}`, padding: "16px 20px", marginBottom: "40px", fontFamily: "'Syne', sans-serif", fontSize: "16px", color: "#C8D0E0", lineHeight: 1.7 }}>
            This module is installed. The arc below is now preserved as your reference record.
          </div>

          {mod.phases.map((phase, pi) => (
            <div key={pi} style={{ marginBottom: "28px" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, marginBottom: "14px", paddingBottom: "10px", borderBottom: `2px solid ${C.border}` }}>
                Phase {String.fromCharCode(65 + pi)} — {phase.name}
              </div>
              {phase.days.map(dayNum => {
                const dayIdx = dayNum - 1;
                const dayData = mod.days[dayIdx];
                const log = progress.logs[dayIdx];
                const isExpanded = expandedDay === dayIdx;
                return (
                  <div key={dayNum} style={{ marginBottom: "8px" }}>
                    <div onClick={() => setExpandedDay(isExpanded ? null : dayIdx)} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", background: C.doneDim, border: `2px solid ${C.doneBorder}`, cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: C.doneDim, border: `2px solid ${C.doneBorder}`, fontFamily: "'DM Mono', monospace", fontSize: "12px", color: C.done }}>✓</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 600, color: C.text }}>{dayData.title}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: C.dim, marginTop: "4px" }}>Day {dayNum} · Tap to view log</div>
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "14px", color: C.muted }}>{isExpanded ? "−" : "+"}</div>
                    </div>
                    {isExpanded && log && (
                      <div style={{ background: C.surface, border: `2px solid ${C.border}`, borderTop: "none", borderLeft: `4px solid ${mod.color}`, padding: "16px 20px" }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "13px", color: mod.color, marginBottom: "10px", fontStyle: "italic" }}>{dayData.logPrompt}</div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", color: "#D0D8E8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{log}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <div style={{ marginTop: "40px", paddingTop: "32px", borderTop: `2px solid ${C.border}`, textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, marginBottom: "16px" }}>Module Maintenance</div>
            <BtnSecondary onClick={() => setConfirmReRun(true)}>Re-Run Module</BtnSecondary>
          </div>
        </div>
      </Wrap>
    </div>
  );
}

// Module View (Active Module)
function ModuleView({ moduleId, onBack, onComplete }) {
  const mod = MODULES.find(m => m.id === moduleId);
  const initial = loadModuleProgress(moduleId);
  const [currentDay, setCurrentDay] = useState(null);
  const [completedDays, setCompletedDays] = useState(initial.completedDays);
  const [logs, setLogs] = useState(initial.logs);
  const [view, setView] = useState("overview");

  // Auto-day-jump has been removed - user must manually select days from overview

  useEffect(() => {
    saveModuleProgress(moduleId, completedDays, logs);
  }, [moduleId, completedDays, logs]);

  const handleLog = useCallback((dayIdx, text) => {
    setLogs(prev => ({ ...prev, [dayIdx]: text }));
  }, []);

  const handleAdvance = useCallback((dayIdx) => {
    setCompletedDays(prev => prev.includes(dayIdx) ? prev : [...prev, dayIdx]);
    if (dayIdx === 6) {
      setTimeout(() => { setCurrentDay(null); setView("gate"); }, 300);
      return;
    }
    setTimeout(() => setCurrentDay(dayIdx + 1), 300);
  }, []);

  if (!mod) {
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: C.bg }}>
        <Wrap>
          <div style={{ padding: "100px 0", textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 5vw, 36px)", color: C.text, marginBottom: "20px", fontWeight: 400 }}>Module Not Found</div>
            <BtnSecondary onClick={onBack}>← Back to Modules</BtnSecondary>
          </div>
        </Wrap>
      </div>
    );
  }

  const allDaysComplete = [0,1,2,3,4,5,6].every(i => completedDays.includes(i));
  const allLogsPresent = [0,1,2,3,4,5,6].every(i => logs[i] && logs[i].trim().length > 0);
  const gateReady = allDaysComplete && allLogsPresent;

  if (view === "completion") return (
    <CompletionScreen
      mod={mod}
      onContinue={() => { onComplete(moduleId); onBack(); }}
      onViewCard={!MODULES[MODULES.findIndex(m => m.id === moduleId) + 1]
        ? () => setView("referenceCard")
        : undefined}
    />
  );
  if (view === "referenceCard") return <ReferenceCardScreen onBack={() => { onComplete(moduleId); onBack(); }} />;
  if (view === "retry") return <RetryScreen mod={mod} logs={logs} onBack={() => setView("overview")} />;
  if (view === "synthesis") return <SynthesisScreen mod={mod} logs={logs} onContinue={() => setView("completion")} />;
  if (view === "gate") return <GateScreen mod={mod} logs={logs} onPass={() => { saveModuleCompletion(moduleId); setView("synthesis"); }} onRetry={() => setView("retry")} />;
  if (currentDay !== null) return <DayView key={currentDay} mod={mod} dayIndex={currentDay} existingLog={logs[currentDay]} completedDays={completedDays} onLog={handleLog} onBack={() => setCurrentDay(null)} onAdvance={handleAdvance} />;

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg }}>
      <Wrap>
        <div style={{ padding: "60px 0 100px" }}>
          <div onClick={onBack} style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: C.muted, cursor: "pointer", marginBottom: "32px", display: "flex", alignItems: "center", gap: "10px" }}>
            ← All Modules
          </div>
          
          <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
            Module {mod.number} · {mod.engine}
          </Tag>
          
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(40px, 6vw, 60px)", color: C.text, marginTop: "20px", marginBottom: "12px", lineHeight: 1.05, fontWeight: 400 }}>
            {mod.title}
          </div>
          
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", color: C.muted, lineHeight: 1.7, marginBottom: "40px" }}>
            {mod.subtitle}
          </div>
          
          {mod.phases.map((phase, pi) => (
            <div key={pi} style={{ marginBottom: "28px" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, marginBottom: "14px", paddingBottom: "10px", borderBottom: `2px solid ${C.border}` }}>
                Phase {String.fromCharCode(65 + pi)} — {phase.name}
              </div>
              {phase.days.map(dayNum => {
                const dayIdx = dayNum - 1;
                const dayData = mod.days[dayIdx];
                const isDone = completedDays.includes(dayIdx);
                const isAvailable = dayIdx === 0 || completedDays.includes(dayIdx - 1) || isDone;
                return (
                  <div key={dayNum} onClick={() => { if (isAvailable) setCurrentDay(dayIdx); }} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", background: isDone ? C.doneDim : "transparent", border: `2px solid ${isDone ? C.doneBorder : C.border}`, marginBottom: "8px", cursor: isAvailable ? "pointer" : "default", opacity: isAvailable ? 1 : 0.5, transition: "all 0.2s" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isDone ? C.doneDim : C.surface, border: `2px solid ${isDone ? C.doneBorder : C.border}`, fontFamily: "'DM Mono', monospace", fontSize: "12px", color: isDone ? C.done : C.muted }}>
                      {isDone ? "✓" : dayNum}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 600, color: isAvailable ? C.text : C.dim }}>{dayData.title}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: C.dim, marginTop: "4px" }}>Day {dayNum}{isDone ? " · Logged" : ""}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          
          {gateReady && (
            <div style={{ marginTop: "32px" }}>
              <BtnPrimary onClick={() => setView("gate")} full>Progression Gate</BtnPrimary>
            </div>
          )}
        </div>
      </Wrap>
    </div>
  );
}

// Main App Component
export default function HSPOSPhase2() {
  const [screen, setScreen] = useState("entry");
  const [primaryModule] = useState(() => getModuleFromUrl());
  const [activeModule, setActiveModule] = useState(null);
  const [completedModules, setCompletedModules] = useState(() => loadCompletedModules());

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.textContent = `
      html { 
        scroll-behavior: smooth; 
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }
      html, body, #root {
        margin: 0;
        padding: 0;
        min-height: 100%;
        width: 100%;
        max-width: 100%;
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
      #root, #root > div {
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden !important;
      }
      @media (max-width: 640px) {
        [style*="max-width"] {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
        button {
          padding: 12px 20px !important;
          font-size: 13px !important;
        }
        h1 {
          font-size: clamp(40px, 8vw, 64px) !important;
        }
      }
    `;
    document.head.appendChild(styleTag);
    
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Syne:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(styleTag);
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    saveCompletedModules(completedModules);
  }, [completedModules]);

  const handleComplete = useCallback((id) => {
    setCompletedModules(prev => prev.includes(id) ? prev : [...prev, id]);
    setActiveModule(null);
  }, []);

  const handleReRun = useCallback((id) => {
    setCompletedModules(prev => {
      if (id === "state") return [];
      const cutoff = MODULES.findIndex(m => m.id === id);
      return prev.filter(mid => MODULES.findIndex(m => m.id === mid) < cutoff);
    });
  }, []);

  const handleEnter = useCallback(() => {
    setScreen("dashboard");
    setActiveModule(primaryModule);
  }, [primaryModule]);

  if (screen === "entry") return <EntryScreen onEnter={handleEnter} />;
  if (activeModule) {
    const isInstalled = completedModules.includes(activeModule);
    if (isInstalled) return <InstalledModuleView moduleId={activeModule} onBack={() => setActiveModule(null)} onReRun={handleReRun} />;
    return <ModuleView moduleId={activeModule} onBack={() => setActiveModule(null)} onComplete={handleComplete} />;
  }
  return <ModuleSelect primaryModule={primaryModule} completedModules={completedModules} onSelect={setActiveModule} />;
}
