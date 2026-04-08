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

const C = { bg: "#0D0F14", surface: "#13161D", surface2: "#1A1E28", border: "#252A36", text: "#F0F2F8", muted: "#9BA3B5", dim: "#4A5268", gold: "#C9A84C", done: "#4DB87A", doneDim: "#091410", doneBorder: "#0D3020" };

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

function Btn({ children, onClick, primary, disabled, full, style: extraStyle }) {
  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && onClick) onClick();
    },
    [onClick, disabled]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        width: full ? "100%" : "auto",
        padding: "14px 18px",
        border: primary ? "none" : `1px solid ${C.border}`,
        background: primary ? C.text : "transparent",
        color: primary ? C.bg : C.muted,
        fontFamily: "'Syne', sans-serif",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderRadius: 10,
        ...extraStyle,
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
        fontSize: 10,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color,
        padding: "4px 10px",
        border: `1px solid ${borderColor}`,
        background: bgColor,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function AppShell({ children, centered = false, narrow = false }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        display: "flex",
        justifyContent: "center",
        alignItems: centered ? "center" : "flex-start",
        padding: centered ? "20px" : "24px 20px 80px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: narrow ? 420 : 420,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: "24px",
          boxShadow: "0 0 40px rgba(0,0,0,0.35)",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
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
      <AppShell centered narrow>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.25em", color: C.muted, textTransform: "uppercase", marginBottom: 28, textAlign: "center" }}>
          100 Acrez Holdings, LLC
        </div>

        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 34, color: C.text, marginBottom: 8, textAlign: "center", lineHeight: 1.05 }}>
          Begin the
          <br />
          <span style={{ color: C.gold, fontStyle: "italic" }}>Correction.</span>
        </div>

        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: C.muted, textTransform: "uppercase", marginBottom: 34, marginTop: 14, textAlign: "center" }}>
          HS-POS · Phase 2 · Execution Modules
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 34, borderLeft: `3px solid ${C.gold}`, paddingLeft: 16 }}>
          You now know the problem.
          <br />
          What you don&apos;t have yet is the correction.
          <br />
          <br />
          This is where it starts — day by day.
        </div>

        <Btn primary full onClick={onEnter}>
          Enter <span style={{ fontSize: 16 }}>→</span>
        </Btn>
      </AppShell>
    </div>
  );
}

function ModuleSelect({ primaryModule, onSelect, completedModules }) {
  return (
    <AppShell>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 24, height: 1, background: C.muted, display: "inline-block" }} />
        Execution Modules
      </div>

      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: C.text, marginBottom: 10, lineHeight: 1.1 }}>
        Your Correction Arc
      </div>

      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 28 }}>
        Modules unlock sequentially. Each one builds on the last. The architecture starts at State because everything downstream depends on it.
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
            style={{
              background: active ? C.surface2 : "transparent",
              border: `1px solid ${active ? mod.colorBorder : done ? C.doneBorder : C.border}`,
              padding: "18px",
              marginBottom: 12,
              cursor: unlocked ? "pointer" : "default",
              opacity: unlocked ? 1 : 0.35,
              transition: "all 0.2s",
              position: "relative",
              overflow: "hidden",
              borderRadius: 12,
            }}
          >
            {primary && (
              <div style={{ position: "absolute", top: 0, right: 0, background: C.gold, color: C.bg, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", padding: "4px 10px", fontWeight: 500 }}>
                Your Route
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: active ? 8 : 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: done ? C.doneDim : mod.colorDim, border: `1px solid ${done ? C.doneBorder : mod.colorBorder}`, fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, color: done ? C.done : mod.color, flexShrink: 0 }}>
                {done ? "✓" : mod.number}
              </div>

              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600, color: unlocked ? C.text : C.muted }}>
                  {mod.title}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted, letterSpacing: "0.1em", marginTop: 2 }}>
                  {done ? "COMPLETED" : unlocked ? "7 DAYS · 3 PHASES" : `LOCKED — Complete Module ${i} first`}
                </div>
              </div>
            </div>

            {active && (
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.6, paddingLeft: 46 }}>
                {mod.subtitle}
              </div>
            )}
          </div>
        );
      })}
    </AppShell>
  );
}

function DayView({ mod, dayIndex, existingLog, completedDays, onLog, onBack, onAdvance }) {
  const dayData = mod.days[dayIndex];
  const [log, setLog] = useState(existingLog || "");
  const [saved, setSaved] = useState(!!existingLog);
  const isLastDay = dayIndex === 6;
  const currentPhase = mod.phases.find((p) => p.days.includes(dayData.day));
  const canSubmit = log.trim().length > 0;

  const handleSubmit = useCallback(() => {
    onLog(dayIndex, log);
    setSaved(true);
    onAdvance(dayIndex);
  }, [dayIndex, log, onLog, onAdvance]);

  return (
    <AppShell>
      <div role="button" tabIndex={0} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBack(); }} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
        ← {mod.title}
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {mod.days.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              background: i <= dayIndex || completedDays.includes(i) ? mod.color : C.border,
              opacity: i === dayIndex ? 1 : i < dayIndex || completedDays.includes(i) ? 0.4 : 0.15,
            }}
          />
        ))}
      </div>

      <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
        Phase {dayData.phase} — {currentPhase?.name}
      </Tag>

      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: C.text, marginTop: 16, marginBottom: 4, lineHeight: 1.1 }}>
        Day {dayData.day}
      </div>

      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 500, color: C.muted, marginBottom: 24 }}>
        {dayData.title}
      </div>

      <div style={{ background: mod.colorDim, borderLeft: `3px solid ${mod.color}`, padding: "14px 16px", marginBottom: 24, fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.text, lineHeight: 1.6, borderRadius: 8 }}>
        {dayData.objective}
      </div>

      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#D0D8E8", lineHeight: 1.85, marginBottom: 28, whiteSpace: "pre-line" }}>
        {dayData.content}
      </div>

      <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.gold}`, padding: "16px 18px", marginBottom: 28, borderRadius: 8 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold, marginBottom: 8 }}>
          Success Metric
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#C8D0E0", lineHeight: 1.6, fontStyle: "italic" }}>
          {dayData.metric}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 12, background: C.surface2, padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8 }}>
          Post-Session Log
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: mod.color, marginBottom: 12, fontStyle: "italic", padding: "0 4px" }}>
          {dayData.logPrompt}
        </div>

        <textarea
          value={log}
          onChange={(e) => { setLog(e.target.value); setSaved(false); }}
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
          placeholder="Write your log here..."
          style={{
            width: "100%",
            minHeight: 120,
            background: C.surface2,
            border: `1px solid ${C.border}`,
            color: C.text,
            padding: "14px 16px",
            fontFamily: "'Syne', sans-serif",
            fontSize: 14,
            lineHeight: 1.7,
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            borderRadius: 10,
          }}
        />
      </div>

      {canSubmit && (
        <Btn
          primary={!saved}
          full
          onClick={handleSubmit}
          disabled={saved}
          style={{ background: saved ? C.surface2 : C.text, color: saved ? C.muted : C.bg }}
        >
          {saved
            ? isLastDay
              ? "Opening Gate..."
              : `Advancing to Day ${dayData.day + 1}...`
            : isLastDay
            ? "Save & Open Gate →"
            : "Save & Continue →"}
        </Btn>
      )}
    </AppShell>
  );
}

function GateScreen({ mod, onPass, onRetry }) {
  return (
    <AppShell centered narrow>
      <div style={{ textAlign: "center" }}>
        <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
          Progression Gate — Module {mod.number}
        </Tag>

        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.text, lineHeight: 1.5, marginBottom: 36, marginTop: 16 }}>
          {mod.gate}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <Btn primary onClick={onPass} style={{ width: "100%" }}>Yes</Btn>
          <Btn onClick={onRetry} style={{ width: "100%" }}>Not Yet</Btn>
        </div>

        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.dim, marginTop: 28, lineHeight: 1.6 }}>
          &quot;Not yet&quot; loops you back. No shame in the rep count.
        </div>
      </div>
    </AppShell>
  );
}

function CompletionScreen({ mod, onContinue }) {
  const nextMod = MODULES[MODULES.findIndex((m) => m.id === mod.id) + 1];
  const completedAt = loadModuleCompletionDate(mod.id);

  return (
    <AppShell centered narrow>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 24px", background: mod.colorDim, border: `2px solid ${mod.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: mod.color }}>
          ✓
        </div>

        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.done, marginBottom: 6 }}>
          Marked Installed
        </div>

        {completedAt && (
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.dim, marginBottom: 16 }}>
            Self-Attested · {formatCompletionDate(completedAt)}
          </div>
        )}

        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: C.text, marginBottom: 12, marginTop: completedAt ? 0 : 12 }}>
          {mod.title}
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 30 }}>
          {nextMod
            ? `Module ${nextMod.number}: ${nextMod.title} is now unlocked.`
            : "All four execution modules complete. The full operating loop is installed."}
        </div>

        <Btn primary full onClick={onContinue}>
          {nextMod ? `Begin Module ${nextMod.number} →` : "Return to Dashboard"}
        </Btn>
      </div>
    </AppShell>
  );
}

function RetryScreen({ mod, logs, onBack }) {
  const day6Log = logs && logs[5];
  const day7Log = logs && logs[6];

  return (
    <AppShell>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gold, marginBottom: 24 }}>
          Module {mod.number} — Not Yet Complete
        </div>

        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: C.text, lineHeight: 1.4, marginBottom: 16 }}>
          That&apos;s not failure. That&apos;s data.
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
          Review your own evidence below. Identify what broke — was it detection, execution, or exit? Then run the phase again with that specific focus. The module stays open.
        </div>
      </div>

      {day6Log && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 16, height: 1, background: C.muted }} />
            Day 6 — {mod.days[5].title}
          </div>

          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${mod.color}`, padding: "16px 18px", fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#C8D0E0", lineHeight: 1.7, whiteSpace: "pre-wrap", borderRadius: 8 }}>
            {day6Log}
          </div>
        </div>
      )}

      {day7Log && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 16, height: 1, background: C.muted }} />
            Day 7 — {mod.days[6].title}
          </div>

          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${mod.color}`, padding: "16px 18px", fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#C8D0E0", lineHeight: 1.7, whiteSpace: "pre-wrap", borderRadius: 8 }}>
            {day7Log}
          </div>
        </div>
      )}

      <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.gold}`, padding: "16px 18px", marginBottom: 28, borderRadius: 8 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold, marginBottom: 8 }}>
          Diagnostic Question
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#C8D0E0", lineHeight: 1.7, fontStyle: "italic" }}>
          Reading your own logs above — where did the breakdown actually happen? Detection (you didn&apos;t notice the spike), execution (you noticed but couldn&apos;t run the protocol), or exit (you stayed too long or left wrong)?
        </div>
      </div>

      <Btn full onClick={onBack}>
        ← Back to Module
      </Btn>
    </AppShell>
  );
}

function ConfirmReRun({ mod, onConfirm, onCancel }) {
  return (
    <AppShell centered narrow>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gold, marginBottom: 24 }}>
          Confirm Re-Run
        </div>

        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.text, lineHeight: 1.4, marginBottom: 20 }}>
          This will erase your record of {mod.title}.
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 32 }}>
          Your logs, completion date, and progress for this module will be wiped. The module will reopen as a fresh 7-day arc. This is intentional friction — make sure you actually want to redo the work, not just review it.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <Btn full onClick={onConfirm} style={{ background: "transparent", border: `1px solid ${C.gold}`, color: C.gold }}>
            Yes — Erase and Re-Run
          </Btn>
          <Btn primary full onClick={onCancel}>
            Cancel
          </Btn>
        </div>
      </div>
    </AppShell>
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
      <AppShell centered narrow>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.text, marginBottom: 16 }}>
            Module Not Found
          </div>
          <Btn full onClick={onBack}>
            ← Back to Modules
          </Btn>
        </div>
      </AppShell>
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
    <AppShell>
      <div role="button" tabIndex={0} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBack(); }} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
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
          {completedAt && (
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.dim, marginTop: 2 }}>
              Self-Attested · {formatCompletionDate(completedAt)}
            </div>
          )}
        </div>
      </div>

      <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
        Module {mod.number} · {mod.engine}
      </Tag>

      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: C.text, marginTop: 14, marginBottom: 8, lineHeight: 1.1 }}>
        {mod.title}
      </div>

      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
        {mod.subtitle}
      </div>

      <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.done}`, padding: "14px 16px", marginBottom: 28, fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#C8D0E0", lineHeight: 1.6, borderRadius: 8 }}>
        You marked this module installed. The arc is now reference material — your record of the work you did. Your logs are preserved below.
      </div>

      {mod.phases.map((phase, pi) => (
        <div key={pi} style={{ marginBottom: 24 }}>
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    background: C.doneDim,
                    border: `1px solid ${C.doneBorder}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    borderRadius: 10,
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: C.doneDim, border: `1px solid ${C.doneBorder}`, fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.done }}>
                    ✓
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 500, color: C.text }}>
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

                {isExpanded && log && (
                  <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderTop: "none", borderLeft: `3px solid ${mod.color}`, padding: "16px 18px", borderRadius: "0 0 10px 10px" }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: mod.color, marginBottom: 10, fontStyle: "italic" }}>
                      {dayData.logPrompt}
                    </div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#D0D8E8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                      {log}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 16 }}>
          Module Maintenance
        </div>
        <Btn full onClick={() => setConfirmReRun(true)}>
          Re-Run Module
        </Btn>
      </div>
    </AppShell>
  );
}

function ModuleView({ moduleId, onBack, onComplete }) {
  const mod = MODULES.find((m) => m.id === moduleId);
  const initial = loadModuleProgress(moduleId);
  const [currentDay, setCurrentDay] = useState(null);
  const [completedDays, setCompletedDays] = useState(initial.completedDays);
  const [logs, setLogs] = useState(initial.logs);
  const [view, setView] = useState("overview");

  if (!mod) {
    return (
      <AppShell centered narrow>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.text, marginBottom: 16 }}>
            Module Not Found
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.muted, marginBottom: 32 }}>
            Something went wrong loading this module.
          </div>
          <Btn full onClick={onBack}>
            ← Back to Modules
          </Btn>
        </div>
      </AppShell>
    );
  }

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
      }, 400);
      return;
    }
    setTimeout(() => setCurrentDay(dayIdx + 1), 300);
  }, []);

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
    <AppShell>
      <div role="button" tabIndex={0} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBack(); }} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
        ← All Modules
      </div>

      <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
        Module {mod.number} · {mod.engine}
      </Tag>

      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: C.text, marginTop: 14, marginBottom: 8, lineHeight: 1.1 }}>
        {mod.title}
      </div>

      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 28 }}>
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  background: isDone ? C.doneDim : "transparent",
                  border: `1px solid ${isDone ? C.doneBorder : C.border}`,
                  marginBottom: 6,
                  cursor: isAvailable ? "pointer" : "default",
                  opacity: isAvailable ? 1 : 0.35,
                  transition: "all 0.2s",
                  borderRadius: 10,
                }}
              >
                <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isDone ? C.doneDim : C.surface2, border: `1px solid ${isDone ? C.doneBorder : C.border}`, fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDone ? C.done : C.muted }}>
                  {isDone ? "✓" : dayNum}
                </div>

                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 500, color: isAvailable ? C.text : C.muted }}>
                    {dayData.title}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.dim, marginTop: 2 }}>
                    Day {dayNum}
                    {isDone ? " · Logged" : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {gateReady && (
        <Btn
          full
          onClick={() => setView("gate")}
          style={{ marginTop: 8, background: mod.colorDim, border: `1px solid ${mod.colorBorder}`, color: mod.color }}
        >
          Progression Gate →
        </Btn>
      )}
    </AppShell>
  );
}

function getModuleFromUrl() {
  if (typeof window === "undefined") return "state";
  const params = new URLSearchParams(window.location.search);
  const moduleFromUrl = params.get("module");
  const validModules = ["state", "identity", "decision", "calibration"];
  return validModules.includes(moduleFromUrl) ? moduleFromUrl : "state";
}

export default function App() {
  const [screen, setScreen] = useState("entry");
  const [primaryModule] = useState(getModuleFromUrl());
  const [activeModule, setActiveModule] = useState(null);
  const [completedModules, setCompletedModules] = useState(() => loadCompletedModules());

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = `
      html, body, #root {
        margin: 0;
        padding: 0;
        background: ${C.bg};
        min-height: 100%;
      }
      * { box-sizing: border-box; }
      ${FONTS_CSS}
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => {
    saveCompletedModules(completedModules);
  }, [completedModules]);

  const handleComplete = useCallback((id) => {
    setCompletedModules((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiveModule(null);
  }, []);

  const handleReRun = useCallback((id) => {
    setCompletedModules((prev) => prev.filter((mid) => mid !== id));
  }, []);

  const handleEnter = useCallback(() => {
    setScreen("dashboard");
    setActiveModule(primaryModule);
  }, [primaryModule]);

  if (screen === "entry") {
    return <EntryScreen onEnter={handleEnter} />;
  }

  if (activeModule) {
    const isInstalled = completedModules.includes(activeModule);

    if (isInstalled) {
      return (
        <InstalledModuleView
          moduleId={activeModule}
          onBack={() => setActiveModule(null)}
          onReRun={handleReRun}
        />
      );
    }

    return (
      <ModuleView
        moduleId={activeModule}
        onBack={() => setActiveModule(null)}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <ModuleSelect
      primaryModule={primaryModule}
      completedModules={completedModules}
      onSelect={setActiveModule}
    />
  );
}
