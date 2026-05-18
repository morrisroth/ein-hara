// Quick diagnosis quiz — 6 questions and a result screen
const { useState: useStateQuiz } = React;

const QUESTIONS = [
  { q: "האם הרגשתם לאחרונה עייפות שאין לה הסבר?", icon: "ע" },
  { q: "האם דברים שעבדו לכם, פתאום מסתבכים בלי סיבה?", icon: "ב" },
  { q: "האם מישהו החמיא לכם לאחרונה בצורה יוצאת דופן?", icon: "ה" },
  { q: "האם אתם חוששים שמישהו מקנא בכם?", icon: "ק" },
  { q: "האם יש לכם הפרעות שינה, חלומות חוזרים, או חוסר מנוחה?", icon: "ש" },
  { q: "האם הרגשתם תקיעות בעבודה, בזוגיות או בבריאות?", icon: "ת" },
];
const OPTIONS = [
  { label: "ממש לא", value: 0 },
  { label: "מעט", value: 1 },
  { label: "כן, די הרבה", value: 2 },
  { label: "בהחלט, חזק מאוד", value: 3 },
];

function QuizScreen({ onNav }) {
  const vp = useViewport();
  const [step, setStep] = useStateQuiz(-1); // -1 = intro, 0..5 = questions, 6 = result
  const [answers, setAnswers] = useStateQuiz(Array(QUESTIONS.length).fill(null));

  if (step === -1) return <QuizIntro onStart={() => setStep(0)} vp={vp} />;
  if (step >= QUESTIONS.length) return <QuizResult answers={answers} onNav={onNav} vp={vp} onRetry={() => { setAnswers(Array(QUESTIONS.length).fill(null)); setStep(0); }}/>;

  const cur = QUESTIONS[step];
  const handleAnswer = (v) => {
    const next = [...answers];
    next[step] = v;
    setAnswers(next);
    setTimeout(() => setStep(step + 1), 280);
  };

  return (
    <section style={{ padding: vp.isMobile ? "40px 18px 60px" : "60px 32px 100px", position: "relative", minHeight: "70vh" }}>
      <FloatingLetters count={vp.isMobile ? 6 : 10} />
      <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
        {/* Progress */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <button onClick={() => step === 0 ? setStep(-1) : setStep(step - 1)} style={{ color: "var(--cream)", opacity: .6, fontSize: 14 }}>
            ‹ חזרה
          </button>
          <div style={{ fontFamily: "'Miriam Libre', serif", fontSize: 11, letterSpacing: ".3em", color: "var(--gold)" }}>
            שאלה {step + 1} מתוך {QUESTIONS.length}
          </div>
        </div>
        <div style={{ height: 2, background: "rgba(201,166,97,.15)", marginBottom: 60, position: "relative" }}>
          <div style={{
            position: "absolute", insetInlineStart: 0, top: 0, bottom: 0,
            width: `${((step + 1) / QUESTIONS.length) * 100}%`,
            background: "var(--gold)",
            transition: "width .35s ease",
          }} />
        </div>

        <div key={step} className="fade-up" style={{ textAlign: "center" }}>
          <div style={{
            margin: "0 auto 28px",
            width: 92, height: 92,
            borderRadius: "50%",
            border: "1px solid var(--gold-deep)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Frank Ruhl Libre', serif", fontSize: 48, color: "var(--gold-2)",
            position: "relative",
          }}>
            {cur.icon}
            <div style={{
              position: "absolute", inset: -10, borderRadius: "50%",
              border: "1px dashed rgba(201,166,97,.3)",
              animation: "spinSlow 30s linear infinite",
            }} />
          </div>
          <h2 style={{
            fontFamily: "'Frank Ruhl Libre', serif",
            fontWeight: 500, fontSize: "clamp(28px, 4vw, 42px)",
            color: "var(--cream)", marginBottom: 44,
            textWrap: "balance", lineHeight: 1.25,
          }}>{cur.q}</h2>

          <div style={{ display: "grid", gridTemplateColumns: vp.isMobile ? "1fr" : "1fr 1fr", gap: 14, maxWidth: 640, margin: "0 auto" }}>
            {OPTIONS.map((o, i) => {
              const active = answers[step] === o.value;
              return (
                <button key={o.value} onClick={() => handleAnswer(o.value)} style={{
                  padding: "22px 24px",
                  background: active ? "rgba(201,166,97,.14)" : "rgba(255,255,255,.02)",
                  border: active ? "1px solid var(--gold)" : "1px solid rgba(201,166,97,.2)",
                  borderRadius: 2,
                  textAlign: "right",
                  display: "flex", alignItems: "center", gap: 14,
                  transition: "all .2s ease",
                }}
                onMouseEnter={(e)=>{e.currentTarget.style.borderColor="var(--gold)";}}
                onMouseLeave={(e)=>{if(!active)e.currentTarget.style.borderColor="rgba(201,166,97,.2)"}}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    border: "1px solid var(--gold)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: active ? "var(--gold)" : "transparent",
                  }}>
                    {active && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--ink)" }} />}
                  </div>
                  <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 19, color: "var(--cream)" }}>{o.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuizIntro({ onStart, vp = {} }) {
  return (
    <section style={{ padding: vp.isMobile ? "50px 18px 60px" : "80px 32px 100px", position: "relative" }}>
      <FloatingLetters count={vp.isMobile ? 6 : 12} />
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <EyeMark size={vp.isMobile ? 90 : 120} />
        </div>
        <SectionHeading overline="אבחון · 60 שניות" title="האם יש לכם עין הרע?" sub="6 שאלות פשוטות. ללא הרשמה, ללא חיוב. בסיום נדע באיזה רמת כיסוי כדאי לשקול."/>
        <div style={{ marginTop: 36 }}>
          <GoldButton size="lg" onClick={onStart}>התחלת האבחון</GoldButton>
        </div>
        <div style={{ marginTop: 18, fontSize: 13, opacity: .5 }}>
          התשובות שלך לא נשמרות אצלנו עד שתבחר להזמין חבילה.
        </div>
      </div>
    </section>
  );
}

function QuizResult({ answers, onNav, onRetry, vp = {} }) {
  const sum = answers.reduce((a, b) => a + (b || 0), 0);
  const max = QUESTIONS.length * 3;
  const pct = sum / max;
  let level, color, title, sub, rec;
  if (pct < 0.25) {
    level = "נמוכה"; color = "var(--moss)"; title = "אין סימנים מובהקים";
    sub = "התשובות שלכם מצביעות על אנרגיה נקייה יחסית. שמירה מקדימה עדיין מומלצת — מים שקטים מבטיחים שלא יהפכו לסוערים.";
    rec = "סגולה";
  } else if (pct < 0.5) {
    level = "בינונית"; color = "var(--gold-2)"; title = "סימנים קלים";
    sub = "יש מספר סימנים שכדאי לתת עליהם את הדעת. טיפול הסרה ושמירה קצרת מועד תחזיר אתכם לאיזון.";
    rec = "סגולה";
  } else if (pct < 0.75) {
    level = "גבוהה"; color = "var(--wine-2)"; title = "סימנים מובהקים";
    sub = "יש סימנים ברורים לעין הרע. אנו ממליצים בחום על חבילת שמירה — טיפול כפול ומעקב של 30 יום.";
    rec = "שמירה";
  } else {
    level = "חזקה מאוד"; color = "var(--wine)"; title = "כיסוי חזק נדרש";
    sub = "התמונה מצביעה על עין חזקה ומתמשכת. חבילת מגן עולם תיתן לכם את הכיסוי המקיף ביותר, עם מעקב לאורך השנה.";
    rec = "מגן עולם";
  }

  return (
    <section style={{ padding: vp.isMobile ? "40px 18px 60px" : "60px 32px 100px", position: "relative" }}>
      <FloatingLetters count={vp.isMobile ? 6 : 10} />
      <div style={{ maxWidth: 880, margin: "0 auto", position: "relative" }}>
        <div className="fade-up" style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'Miriam Libre', serif", fontSize: 11, letterSpacing: ".3em", color: "var(--gold)", marginBottom: 14 }}>
            תוצאת האבחון
          </div>
          <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 500, fontSize: "clamp(36px, 5vw, 56px)", color: "var(--cream)", marginBottom: 16, lineHeight: 1.1 }}>
            {title}
          </h2>
          <p style={{ maxWidth: 580, margin: "0 auto", fontSize: 17, opacity: .75, lineHeight: 1.7, textWrap: "pretty" }}>
            {sub}
          </p>
        </div>

        {/* Score meter */}
        <div style={{
          padding: "32px",
          background: "rgba(255,255,255,.02)",
          border: "1px solid rgba(201,166,97,.18)",
          borderRadius: 2,
          marginBottom: 32,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 13, opacity: .6, marginBottom: 4 }}>רמת השפעה</div>
              <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 28, color }}>{level}</div>
            </div>
            <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 48, color: "var(--gold-2)" }}>
              {Math.round(pct * 100)}<span style={{ fontSize: 22, opacity: .6 }}>%</span>
            </div>
          </div>
          <div style={{ height: 10, background: "rgba(201,166,97,.1)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: `${pct * 100}%`, background: `linear-gradient(to left, ${color}, var(--gold))`, transition: "width .8s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, opacity: .5, fontFamily: "'Miriam Libre', serif", letterSpacing: ".2em" }}>
            <span>נמוך</span><span>בינוני</span><span>גבוה</span><span>חזק מאוד</span>
          </div>
        </div>

        {/* Recommended package */}
        <div style={{
          padding: 32,
          background: "linear-gradient(135deg, rgba(201,166,97,.12), rgba(201,166,97,.02))",
          border: "1px solid var(--gold)",
          borderRadius: 2,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
          flexWrap: "wrap",
        }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontFamily: "'Miriam Libre', serif", fontSize: 10, letterSpacing: ".3em", color: "var(--gold)", marginBottom: 8 }}>החבילה המומלצת עבורכם</div>
            <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 38, color: "var(--cream)" }}>חבילת {rec}</h3>
            <p style={{ marginTop: 8, opacity: .7, fontSize: 15 }}>בהתבסס על התשובות שלכם, זו ההמלצה שלנו. כמובן שניתן לבחור כל חבילה אחרת.</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <GoldButton size="lg" onClick={() => onNav("packages")}>בחירת חבילה</GoldButton>
            <GoldButton size="lg" variant="ghost" onClick={onRetry}>אבחון מחדש</GoldButton>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { QuizScreen });
