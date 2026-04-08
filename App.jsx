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

/* =========================
   LOCKED LAYOUT SYSTEM
========================= */

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
    <div
      style={{
        opacity: fade ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      <AppShell centered narrow>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.25em",
            color: C.muted,
            textTransform: "uppercase",
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          100 Acrez Holdings, LLC
        </div>

        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 34,
            color: C.text,
            marginBottom: 8,
            textAlign: "center",
            lineHeight: 1.05,
          }}
        >
          Begin the
          <br />
          <span style={{ color: C.gold, fontStyle: "italic" }}>Correction.</span>
        </div>

        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.15em",
            color: C.muted,
            textTransform: "uppercase",
            marginBottom: 34,
            marginTop: 14,
            textAlign: "center",
          }}
        >
          HS-POS · Phase 2 · Execution Modules
        </div>

        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14,
            color: C.muted,
            lineHeight: 1.8,
            marginBottom: 34,
            borderLeft: `3px solid ${C.gold}`,
            paddingLeft: 16,
          }}
        >
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
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
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
        Execution Modules
      </div>

      <div
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 28,
          color: C.text,
          marginBottom: 10,
          lineHeight: 1.1,
        }}
      >
        Your Correction Arc
      </div>

      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          color: C.muted,
          lineHeight: 1.7,
          marginBottom: 28,
        }}
      >
        Modules unlock sequentially. Each one builds on the last. The architecture starts at State
        because everything downstream depends on it.
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

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: active ? 8 : 0 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: done ? C.doneDim : mod.colorDim,
                  border: `1px solid ${done ? C.doneBorder : mod.colorBorder}`,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  fontWeight: 500,
                  color: done ? C.done : mod.color,
                  flexShrink: 0,
                }}
              >
                {done ? "✓" : mod.number}
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 15,
                    fontWeight: 600,
                    color: unlocked ? C.text : C.muted,
                  }}
                >
                  {mod.title}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: C.muted,
                    letterSpacing: "0.1em",
                    marginTop: 2,
                  }}
                >
                  {done ? "COMPLETED" : unlocked ? "7 DAYS · 3 PHASES" : `LOCKED — Complete Module ${i} first`}
                </div>
              </div>
            </div>

            {active && (
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 13,
                  color: C.muted,
                  lineHeight: 1.6,
                  paddingLeft: 46,
                }}
              >
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
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onBack();
        }}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: C.muted,
          cursor: "pointer",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
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

      <div
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 30,
          color: C.text,
          marginTop: 16,
          marginBottom: 4,
          lineHeight: 1.1,
        }}
      >
        Day {dayData.day}
      </div>

      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 16,
          fontWeight: 500,
          color: C.muted,
          marginBottom: 24,
        }}
      >
        {dayData.title}
      </div>

      <div
        style={{
          background: mod.colorDim,
          borderLeft: `3px solid ${mod.color}`,
          padding: "14px 16px",
          marginBottom: 24,
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          color: C.text,
          lineHeight: 1.6,
          borderRadius: 8,
        }}
      >
        {dayData.objective}
      </div>

      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          color: "#D0D8E8",
          lineHeight: 1.85,
          marginBottom: 28,
          whiteSpace: "pre-line",
        }}
      >
        {dayData.content}
      </div>

      <div
        style={{
          background: C.surface2,
          border: `1px solid ${C.border}`,
          borderLeft: `3px solid ${C.gold}`,
          padding: "16px 18px",
          marginBottom: 28,
          borderRadius: 8,
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 8,
          }}
        >
          Success Metric
        </div>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14,
            color: "#C8D0E0",
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          {dayData.metric}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: C.muted,
            marginBottom: 12,
            background: C.surface2,
            padding: "10px 14px",
            border: `1px solid ${C.border}`,
            borderRadius: 8,
          }}
        >
          Post-Session Log
        </div>

        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            color: mod.color,
            marginBottom: 12,
            fontStyle: "italic",
            padding: "0 4px",
          }}
        >
          {dayData.logPrompt}
        </div>

        <textarea
          value={log}
          onChange={(e) => {
            setLog(e.target.value);
            setSaved(false);
          }}
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
          style={{
            background: saved ? C.surface2 : C.text,
            color: saved ? C.muted : C.bg,
          }}
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

        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 22,
            color: C.text,
            lineHeight: 1.5,
            marginBottom: 36,
            marginTop: 16,
          }}
        >
          {mod.gate}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <Btn primary onClick={onPass} style={{ width: "100%" }}>
            Yes
          </Btn>
          <Btn onClick={onRetry} style={{ width: "100%" }}>
            Not Yet
          </Btn>
        </div>

        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: C.dim,
            marginTop: 28,
            lineHeight: 1.6,
          }}
        >
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
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            margin: "0 auto 24px",
            background: mod.colorDim,
            border: `2px solid ${mod.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: mod.color,
          }}
        >
          ✓
        </div>

        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.done,
            marginBottom: 6,
          }}
        >
          Marked Installed
        </div>

        {completedAt && (
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: C.dim,
              marginBottom: 16,
            }}
          >
            Self-Attested · {formatCompletionDate(completedAt)}
          </div>
        )}

        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 24,
            color: C.text,
            marginBottom: 12,
            marginTop: completedAt ? 0 : 12,
          }}
        >
          {mod.title}
        </div>

        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14,
            color: C.muted,
            lineHeight: 1.7,
            marginBottom: 30,
          }}
        >
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
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 24,
          }}
        >
          Module {mod.number} — Not Yet Complete
        </div>

        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 24,
            color: C.text,
            lineHeight: 1.4,
            marginBottom: 16,
          }}
        >
          That&apos;s not failure. That&apos;s data.
        </div>

        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14,
            color: C.muted,
            lineHeight: 1.7,
          }}
        >
          Review your own evidence below. Identify what broke — was it detection, execution, or
          exit? Then run the phase again with that specific focus. The module stays open.
        </div>
      </div>

      {day6Log && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.muted,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ width: 16, height: 1, background: C.muted }} />
            Day 6 — {mod.days[5].title}
          </div>

          <div
            style={{
              background: C.surface2,
              border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${mod.color}`,
              padding: "16px 18px",
              fontFamily: "'Syne', sans-serif",
              fontSize: 13,
              color: "#C8D0E0",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              borderRadius: 8,
            }}
          >
            {day6Log}
          </div>
        </div>
      )}

      {day7Log && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.muted,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ width: 16, height: 1, background: C.muted }} />
            Day 7 — {mod.days[6].title}
          </div>

          <div
            style={{
              background: C.surface2,
              border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${mod.color}`,
              padding: "16px 18px",
              fontFamily: "'Syne', sans-serif",
              fontSize: 13,
              color: "#C8D0E0",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              borderRadius: 8,
            }}
          >
            {day7Log}
          </div>
        </div>
      )}

      <div
        style={{
          background: C.surface2,
          border: `1px solid ${C.border}`,
          borderLeft: `3px solid ${C.gold}`,
          padding: "16px 18px",
          marginBottom: 28,
          borderRadius: 8,
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 8,
          }}
        >
          Diagnostic Question
        </div>

        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            color: "#C8D0E0",
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          Reading your own logs above — where did the breakdown actually happen? Detection (you
          didn&apos;t notice the spike), execution (you noticed but couldn&apos;t run the protocol),
          or exit (you stayed too long or left wrong)?
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
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 24,
          }}
        >
          Confirm Re-Run
        </div>

        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 22,
            color: C.text,
            lineHeight: 1.4,
            marginBottom: 20,
          }}
        >
          This will erase your record of {mod.title}.
        </div>

        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14,
            color: C.muted,
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          Your logs, completion date, and progress for this module will be wiped. The module will
          reopen as a fresh 7-day arc. This is intentional friction — make sure you actually want
          to redo the work, not just review it.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <Btn
            full
            onClick={onConfirm}
            style={{
              background: "transparent",
              border: `1px solid ${C.gold}`,
              color: C.gold,
            }}
          >
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
          <div
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 22,
              color: C.text,
              marginBottom: 16,
            }}
          >
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
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onBack();
        }}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: C.muted,
          cursor: "pointer",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        ← All Modules
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: C.doneDim,
            border: `2px solid ${C.done}`,
            color: C.done,
            fontSize: 18,
          }}
        >
          ✓
        </div>
        <div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: C.done,
            }}
          >
            Marked Installed
          </div>
          {completedAt && (
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: C.dim,
                marginTop: 2,
              }}
            >
              Self-Attested · {formatCompletionDate(completedAt)}
            </div>
          )}
        </div>
      </div>

      <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
        Module {mod.number} · {mod.engine}
      </Tag>

      <div
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 28,
          color: C.text,
          marginTop: 14,
          marginBottom: 8,
          lineHeight: 1.1,
        }}
      >
        {mod.title}
      </div>

      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          color: C.muted,
          lineHeight: 1.7,
          marginBottom: 24,
        }}
      >
        {mod.subtitle}
      </div>

      <div
        style={{
          background: C.surface2,
          border: `1px solid ${C.border}`,
          borderLeft: `3px solid ${C.done}`,
          padding: "14px 16px",
          marginBottom: 28,
          fontFamily: "'Syne', sans-serif",
          fontSize: 13,
          color: "#C8D0E0",
          lineHeight: 1.6,
          borderRadius: 8,
        }}
      >
        You marked this module installed. The arc is now reference material — your record of the
        work you did. Your logs are preserved below.
      </div>

      {mod.phases.map((phase, pi) => (
        <div key={pi} style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.muted,
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
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
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: C.doneDim,
                      border: `1px solid ${C.doneBorder}`,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      color: C.done,
                    }}
                  >
                    ✓
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 14,
                        fontWeight: 500,
                        color: C.text,
                      }}
                    >
                      {dayData.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        color: C.dim,
                        marginTop: 2,
                      }}
                    >
                      Day {dayNum} · Tap to view log
                    </div>
                  </div>

                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                      color: C.muted,
                    }}
                  >
                    {isExpanded ? "−" : "+"}
                  </div>
                </div>

                {isExpanded && log && (
                  <div
                    style={{
                      background: C.surface2,
                      border: `1px solid ${C.border}`,
                      borderTop: "none",
                      borderLeft: `3px solid ${mod.color}`,
                      padding: "16px 18px",
                      borderRadius: "0 0 10px 10px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 12,
                        color: mod.color,
                        marginBottom: 10,
                        fontStyle: "italic",
                      }}
                    >
                      {dayData.logPrompt}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 13,
                        color: "#D0D8E8",
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {log}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div
        style={{
          marginTop: 28,
          paddingTop: 24,
          borderTop: `1px solid ${C.border}`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: C.muted,
            marginBottom: 16,
          }}
        >
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
          <div
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 22,
              color: C.text,
              marginBottom: 16,
            }}
          >
            Module Not Found
          </div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 14,
              color: C.muted,
              marginBottom: 32,
            }}
          >
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
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onBack();
        }}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: C.muted,
          cursor: "pointer",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        ← All Modules
      </div>

      <Tag color={mod.color} bgColor={mod.colorDim} borderColor={mod.colorBorder}>
        Module {mod.number} · {mod.engine}
      </Tag>

      <div
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 28,
          color: C.text,
          marginTop: 14,
          marginBottom: 8,
          lineHeight: 1.1,
        }}
      >
        {mod.title}
      </div>

      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          color: C.muted,
          lineHeight: 1.7,
          marginBottom: 28,
        }}
      >
        {mod.subtitle}
      </div>

      {mod.phases.map((phase, pi) => (
        <div key={pi} style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.muted,
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
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
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isDone ? C.doneDim : C.surface2,
                    border: `1px solid ${isDone ? C.doneBorder : C.border}`,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    color: isDone ? C.done : C.muted,
                  }}
                >
                  {isDone ? "✓" : dayNum}
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      color: isAvailable ? C.text : C.muted,
                    }}
                  >
                    {dayData.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      color: C.dim,
                      marginTop: 2,
                    }}
                  >
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
          style={{
            marginTop: 8,
            background: mod.colorDim,
            border: `1px solid ${mod.colorBorder}`,
            color: mod.color,
          }}
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
