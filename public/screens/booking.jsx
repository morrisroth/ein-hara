// Multi-step booking — package confirmation, personal details, payment
const { useState: useStateBook, useEffect: useEffectBook } = React;

function BookingScreen({ selectedPkgId, onNav, onConfirm }) {
  const vp = useViewport();
  const [step, setStep] = useStateBook(0);
  const [form, setForm] = useStateBook({
    pkgId: selectedPkgId || "shmira",
    names: [{ first: "", mother: "" }],
    phone: "", email: "",
    concerns: "",
    asGift: false, payment: "card",
  });

  const pkg = PACKAGES.find(p => p.id === form.pkgId) || PACKAGES[1];
  const setF = (patch) => setForm({ ...form, ...patch });

  // When switching package, trim names list if it exceeds the new maxNames
  React.useEffect(() => {
    const max = pkg.maxNames || 1;
    if (form.names.length > max) {
      setForm({ ...form, names: form.names.slice(0, max) });
    }
  }, [form.pkgId]);

  const steps = ["החבילה", "שמות לטיפול", "תשלום ואישור"];
  const validNames = form.names.every(n => n.first.trim().length > 1 && n.mother.trim().length > 1);
  const valid = {
    0: !!form.pkgId,
    1: validNames && /^[0-9\-+ ]{8,}$/.test(form.phone) && /.+@.+/.test(form.email),
    2: true,
  };

  return (
    <section style={{ padding: vp.isMobile ? "30px 18px 60px" : "50px 32px 100px", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* Stepper */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <button onClick={() => step === 0 ? onNav("packages") : setStep(step - 1)} style={{ color: "var(--cream)", opacity: .6, fontSize: 14 }}>
            ‹ {step === 0 ? "חזרה לחבילות" : "שלב קודם"}
          </button>
          <div style={{ fontFamily: "'Miriam Libre', serif", fontSize: 11, letterSpacing: ".3em", color: "var(--gold)" }}>
            שלב {step + 1} מתוך {steps.length}
          </div>
        </div>

        <div style={{ display: "flex", gap: 0, marginBottom: vp.isMobile ? 30 : 50, alignItems: "center", flexWrap: "wrap" }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: i <= step ? "1px solid var(--gold)" : "1px solid rgba(201,166,97,.25)",
                  background: i < step ? "var(--gold)" : (i === step ? "rgba(201,166,97,.18)" : "transparent"),
                  color: i < step ? "var(--ink)" : "var(--gold-2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Frank Ruhl Libre', serif", fontSize: 15,
                  transition: "all .3s",
                  flexShrink: 0,
                }}>{i < step ? "✓" : (i + 1)}</div>
                {(!vp.isMobile || i === step) && (
                  <div style={{
                    fontFamily: "'Frank Ruhl Libre', serif", fontSize: 15,
                    color: i <= step ? "var(--cream)" : "rgba(244,236,216,.4)",
                    whiteSpace: "nowrap",
                  }}>{s}</div>
                )}
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, minWidth: 16, height: 1, background: i < step ? "var(--gold)" : "rgba(201,166,97,.2)", margin: vp.isMobile ? "0 8px" : "0 18px", transition: "all .3s" }}/>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step content + summary */}
        <div style={{
          display: "grid",
          gridTemplateColumns: vp.isDesktop ? "1.6fr .9fr" : "1fr",
          gap: vp.isMobile ? 28 : 36,
          alignItems: "flex-start",
        }}>
          <div className="fade-up" key={step}>
            {step === 0 && <StepPackage form={form} setF={setF} vp={vp} />}
            {step === 1 && <StepDetails form={form} setF={setF} pkg={pkg} vp={vp} />}
            {step === 2 && <StepPayment form={form} setF={setF} pkg={pkg} vp={vp} />}
            <div style={{ marginTop: 36, display: "flex", justifyContent: "space-between", gap: 12 }}>
              <GoldButton variant="ghost" onClick={() => step === 0 ? onNav("packages") : setStep(step - 1)}>
                ‹ {step === 0 ? "ביטול" : "שלב קודם"}
              </GoldButton>
              {step < steps.length - 1 ? (
                <GoldButton onClick={() => valid[step] && setStep(step + 1)} style={{ opacity: valid[step] ? 1 : .35, cursor: valid[step] ? "pointer" : "not-allowed" }}>
                  המשך לשלב הבא ›
                </GoldButton>
              ) : (
                <GoldButton onClick={() => onConfirm(form)}>
                  סיום הזמנה ›
                </GoldButton>
              )}
            </div>
          </div>
          <OrderSummary pkg={pkg} form={form} vp={vp} />
        </div>
      </div>
    </section>
  );
}

// --- Step 1: package picker ---
function StepPackage({ form, setF, vp = {} }) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 500, fontSize: vp.isMobile ? 28 : 36, color: "var(--cream)", marginBottom: 12 }}>בחירת חבילה</h2>
      <p style={{ opacity: .65, marginBottom: 28, fontSize: 15 }}>אפשר לעבור בין החבילות בכל זמן עד לאישור הסופי.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {PACKAGES.map(p => {
          const active = form.pkgId === p.id;
          return (
            <button key={p.id} onClick={() => setF({ pkgId: p.id })} style={{
              padding: "22px 24px", textAlign: "right",
              background: active ? "rgba(201,166,97,.14)" : "rgba(255,255,255,.02)",
              border: active ? "1px solid var(--gold)" : "1px solid rgba(201,166,97,.18)",
              borderRadius: 2,
              display: "flex", alignItems: "center", gap: 18,
              transition: "all .2s",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                border: "1px solid var(--gold)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {active && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--gold)" }} />}
              </div>
              <div style={{
                width: 52, height: 52, border: "1px solid var(--gold-deep)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Frank Ruhl Libre', serif", fontSize: 28, color: "var(--gold-2)",
              }}>{p.letter}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 22, color: "var(--cream)" }}>חבילת {p.tier}</div>
                <div style={{ fontSize: 13, opacity: .6, marginTop: 2 }}>{p.short}</div>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 28, color: "var(--cream)" }}>₪{p.price}</div>
                <div style={{ fontSize: 11, opacity: .5 }}>{p.duration}</div>
              </div>
            </button>
          );
        })}
      </div>
      <label style={{
        marginTop: 24, display: "flex", alignItems: "center", gap: 12,
        padding: "16px 18px", border: "1px dashed rgba(201,166,97,.25)", borderRadius: 2,
        cursor: "pointer",
      }}>
        <input type="checkbox" checked={form.asGift} onChange={(e) => setF({ asGift: e.target.checked })} style={{ width: 18, height: 18, accentColor: "var(--gold)" }} />
        <div>
          <div style={{ color: "var(--cream)", fontSize: 15 }}>זאת מתנה למישהו</div>
          <div style={{ fontSize: 12.5, opacity: .55 }}>נשלח אישור מעוצב במייל עם ברכה אישית, ללא חיוב נוסף.</div>
        </div>
      </label>
    </div>
  );
}

// --- Step 2: names + contact details ---
function StepDetails({ form, setF, pkg, vp = {} }) {
  const maxNames = pkg.maxNames || 1;
  const canAddMore = form.names.length < maxNames;

  const updateName = (i, key, value) => {
    const next = form.names.map((n, idx) => idx === i ? { ...n, [key]: value } : n);
    setF({ names: next });
  };
  const addName = () => {
    if (!canAddMore) return;
    setF({ names: [...form.names, { first: "", mother: "" }] });
  };
  const removeName = (i) => {
    if (form.names.length === 1) return;
    setF({ names: form.names.filter((_, idx) => idx !== i) });
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 500, fontSize: vp.isMobile ? 28 : 36, color: "var(--cream)", marginBottom: 12 }}>שמות לטיפול</h2>
      <p style={{ opacity: .65, marginBottom: 24, fontSize: 15, lineHeight: 1.6 }}>
        לפי המסורת, התיקון נעשה על השם הפרטי ושם האם בלבד. {maxNames > 1
          ? <>אפשר להוסיף עד <strong style={{ color: "var(--gold-2)" }}>{maxNames} שמות</strong> בחבילה זו.</>
          : <>בחבילה זו ניתן להזין שם אחד.</>}
      </p>

      {/* Names list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: maxNames > 1 ? 14 : 28 }}>
        {form.names.map((n, i) => (
          <div key={i} style={{
            padding: vp.isMobile ? "18px 16px" : "20px 22px",
            background: "rgba(255,255,255,.02)",
            border: "1px solid rgba(201,166,97,.22)",
            borderRadius: 2,
            position: "relative",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 12,
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  border: "1px solid var(--gold)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Frank Ruhl Libre', serif", fontSize: 16, color: "var(--gold-2)",
                }}>{i + 1}</div>
                <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 17, color: "var(--cream)" }}>
                  {i === 0 ? "שם ראשון" : `שם נוסף ${i}`}
                </div>
              </div>
              {form.names.length > 1 && (
                <button onClick={() => removeName(i)} aria-label="הסר שם" style={{
                  width: 30, height: 30, borderRadius: 2,
                  border: "1px solid rgba(201,166,97,.3)",
                  color: "var(--cream)", opacity: .65,
                  fontFamily: "'Frank Ruhl Libre', serif", fontSize: 18,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--wine-2)"; e.currentTarget.style.color = "var(--wine-2)"; e.currentTarget.style.opacity = 1; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,166,97,.3)"; e.currentTarget.style.color = "var(--cream)"; e.currentTarget.style.opacity = .65; }}
                >×</button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: vp.isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              <Field label="שם פרטי" required>
                <Input value={n.first} onChange={e => updateName(i, "first", e.target.value)} placeholder="לדוגמה: דוד" />
              </Field>
              <Field label="שם האם" required hint="לפי המסורת">
                <Input value={n.mother} onChange={e => updateName(i, "mother", e.target.value)} placeholder="לדוגמה: שרה" />
              </Field>
            </div>
          </div>
        ))}
      </div>

      {/* Add name button */}
      {maxNames > 1 && (
        <div style={{ marginBottom: 28 }}>
          {canAddMore ? (
            <button onClick={addName} style={{
              width: "100%",
              padding: "16px 20px",
              background: "transparent",
              border: "1px dashed rgba(201,166,97,.35)",
              borderRadius: 2,
              color: "var(--gold-2)",
              fontFamily: "'Frank Ruhl Libre', serif", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.background = "rgba(201,166,97,.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,166,97,.35)"; e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>
              הוספת שם ({form.names.length} מתוך {maxNames})
            </button>
          ) : (
            <div style={{
              padding: "14px 20px",
              background: "rgba(201,166,97,.06)",
              border: "1px solid rgba(201,166,97,.25)",
              borderRadius: 2,
              fontFamily: "'Frank Ruhl Libre', serif", fontSize: 14,
              color: "var(--gold-2)", textAlign: "center",
            }}>
              הגעת למקסימום השמות בחבילה זו ({maxNames}). לתוספת — שדרגו לחבילת מגן עולם.
            </div>
          )}
        </div>
      )}

      {/* Contact details */}
      <div style={{
        marginTop: 12, paddingTop: 28,
        borderTop: "1px solid rgba(201,166,97,.15)",
      }}>
        <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 20, color: "var(--gold-2)", marginBottom: 16 }}>פרטי קשר</div>
        <div style={{ display: "grid", gridTemplateColumns: vp.isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          <Field label="טלפון נייד" required>
            <Input value={form.phone} onChange={e => setF({ phone: e.target.value })} placeholder="052-000-0000" dir="ltr"/>
          </Field>
          <Field label="כתובת מייל" required>
            <Input value={form.email} onChange={e => setF({ email: e.target.value })} placeholder="name@example.com" dir="ltr"/>
          </Field>
        </div>
        <Field label="מה תרצו לטפל בו? (לא חובה)" style={{ marginTop: 16 }}>
          <textarea value={form.concerns} onChange={e => setF({ concerns: e.target.value })}
            placeholder="למשל: עיכובים בעבודה, מתח במשפחה, חיפוש זוגיות..."
            style={{
              width: "100%", minHeight: 100, resize: "vertical",
              background: "rgba(255,255,255,.02)",
              border: "1px solid rgba(201,166,97,.25)",
              color: "var(--cream)", padding: 14, fontSize: 15, fontFamily: "inherit",
              borderRadius: 2, lineHeight: 1.6, outline: "none",
            }}
            onFocus={e => e.target.style.borderColor = "var(--gold)"}
            onBlur={e => e.target.style.borderColor = "rgba(201,166,97,.25)"}
          />
        </Field>
      </div>
    </div>
  );
}

// --- Step 3: payment via Nedarim Plus ---
function StepPayment({ form, pkg, vp = {} }) {
  const [paid, setPaid] = useStateBook(false);

  const BASE = 'https://www.matara.pro/nedarimplus/online/?mosad=7018027';
  const REDIRECT = '&Redirect=' + encodeURIComponent('http://213.199.53.73:3001');
  const PKG_URLS = {
    segula:  BASE + '&OnlyNormal=1&Amount=149&AmountLock=1&Payment=1&PaymentLock=1' + REDIRECT,
    shmira:  BASE + '&OnlyHok=1&Amount=129&AmountLock=1' + REDIRECT,
    magen:   BASE + '&OnlyNormal=1&Amount=101&AmountLock=1&Payment=12&PaymentLock=1' + REDIRECT,
  };
  const payUrl = PKG_URLS[pkg.id] || PKG_URLS.segula;

  const PKG_LABELS = {
    segula: { top: '₪149', sub: 'חיוב חד פעמי' },
    shmira: { top: '₪129 לחודש', sub: 'הוראת קבע חודשית · ביטול בכל זמן' },
    magen:  { top: '12 × ₪101', sub: 'סה״כ ₪1,212 · חיוב שנתי חד פעמי ב-12 תשלומים' },
  };
  const label = PKG_LABELS[pkg.id] || PKG_LABELS.segula;

  const handlePayClick = () => {
    window.open(payUrl, '_blank', 'noopener');
    setTimeout(() => setPaid(true), 1500);
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 500, fontSize: vp.isMobile ? 28 : 36, color: "var(--cream)", marginBottom: 10 }}>תשלום מאובטח</h2>
      <p style={{ opacity: .65, marginBottom: 28, fontSize: 15, lineHeight: 1.6 }}>
        לחצו על כפתור התשלום — תועברו לדף נדרים פלוס המאובטח. לאחר התשלום חזרו לכאן ולחצו <strong style={{ color: "var(--gold-2)" }}>סיום הזמנה</strong>.
      </p>

      {/* Summary box */}
      <div style={{
        padding: "28px 26px",
        background: "linear-gradient(135deg, rgba(201,166,97,.1), rgba(201,166,97,.02))",
        border: "1px solid rgba(201,166,97,.3)",
        borderRadius: 2,
        marginBottom: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ fontFamily: "'Miriam Libre', serif", fontSize: 10, letterSpacing: ".3em", color: "var(--gold)", marginBottom: 6 }}>לתשלום</div>
          <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 38, color: "var(--cream)", lineHeight: 1 }}>
            {label.top}
          </div>
          <div style={{ fontSize: 13, opacity: .55, marginTop: 8 }}>{label.sub}</div>
        </div>
        <button onClick={handlePayClick} style={{
          padding: "18px 36px",
          background: "linear-gradient(180deg, #e3c98a, #c9a661)",
          color: "#0c0d1d",
          fontFamily: "'Frank Ruhl Libre', serif",
          fontSize: 20, fontWeight: 700,
          border: "1px solid #8a6a2a",
          borderRadius: 2,
          cursor: "pointer",
          boxShadow: "0 8px 24px -8px rgba(201,166,97,.6)",
          transition: "all .2s",
          display: "flex", alignItems: "center", gap: 10,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 30px -8px rgba(201,166,97,.7)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 24px -8px rgba(201,166,97,.6)"; }}
        >
          🔒 לתשלום בנדרים פלוס
        </button>
      </div>

      {/* Status */}
      {paid ? (
        <div style={{
          padding: "16px 20px",
          background: "rgba(82,183,136,.1)",
          border: "1px solid rgba(82,183,136,.4)",
          borderRadius: 2,
          display: "flex", alignItems: "center", gap: 12,
          color: "#52b788", fontSize: 15,
        }}>
          <span style={{ fontSize: 20 }}>✓</span>
          <span>השלמתם את התשלום? לחצו על <strong>סיום הזמנה</strong> למטה.</span>
        </div>
      ) : (
        <div style={{
          padding: "14px 18px",
          background: "rgba(255,255,255,.02)",
          border: "1px solid rgba(201,166,97,.15)",
          borderRadius: 2,
          fontSize: 13, opacity: .65, lineHeight: 1.65,
          display: "flex", gap: 10, alignItems: "center",
        }}>
          <span>🔒</span>
          <span>תשלום מאובטח דרך נדרים פלוס. הכסף עובר ישירות לחשבון שלכם.</span>
        </div>
      )}
    </div>
  );
}

// --- Reusable form pieces ---
function Field({ label, required, hint, children, style }) {
  return (
    <div style={style}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <label style={{ fontSize: 13, color: "var(--cream)", opacity: .8 }}>
          {label} {required && <span style={{ color: "var(--gold)" }}>*</span>}
        </label>
        {hint && <span style={{ fontSize: 11, opacity: .5 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}
function Input({ style, ...rest }) {
  return (
    <input {...rest} style={{
      width: "100%",
      background: "rgba(255,255,255,.02)",
      border: "1px solid rgba(201,166,97,.25)",
      color: "var(--cream)",
      padding: "13px 14px",
      fontSize: 15, fontFamily: "inherit",
      borderRadius: 2, outline: "none",
      transition: "border-color .2s",
      ...style,
    }}
    onFocus={e => { e.target.style.borderColor = "var(--gold)"; rest.onFocus && rest.onFocus(e); }}
    onBlur={e => { e.target.style.borderColor = "rgba(201,166,97,.25)"; rest.onBlur && rest.onBlur(e); }}
    />
  );
}

// --- Sticky summary ---
function OrderSummary({ pkg, form, vp = {} }) {
  const subtotal = pkg.price;
  const discount = form.asGift ? 0 : 0;
  const total = subtotal - discount;
  return (
    <div style={{
      position: vp.isDesktop ? "sticky" : "static",
      top: 90,
      padding: vp.isMobile ? 22 : 28,
      background: "linear-gradient(180deg, rgba(201,166,97,.08), rgba(201,166,97,.02))",
      border: "1px solid rgba(201,166,97,.25)", borderRadius: 2,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "'Miriam Libre', serif", fontSize: 10, letterSpacing: ".3em", color: "var(--gold)", marginBottom: 6 }}>סיכום הזמנה</div>
          <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 26, color: "var(--cream)" }}>חבילת {pkg.tier}</div>
          <div style={{ fontSize: 12.5, opacity: .55, marginTop: 4 }}>{pkg.duration}</div>
        </div>
        <div style={{
          width: 48, height: 48, border: "1px solid var(--gold-deep)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Frank Ruhl Libre', serif", fontSize: 26, color: "var(--gold-2)",
        }}>{pkg.letter}</div>
      </div>

      <Divider width="100%" />

      <div style={{ margin: "18px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 11.5, opacity: .55, fontFamily: "'Miriam Libre', serif", letterSpacing: ".2em" }}>
          שמות בטיפול ({form.names.filter(n => n.first).length || 0} מתוך {pkg.maxNames})
        </div>
        {form.names.map((n, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            fontSize: 13.5,
            padding: "8px 12px",
            background: "rgba(255,255,255,.02)",
            border: "1px solid rgba(201,166,97,.12)",
            borderRadius: 2,
          }}>
            <span style={{ color: "var(--cream)" }}>
              {n.first ? `${n.first} בן/בת ${n.mother || "—"}` : <span style={{ opacity: .35 }}>שם {i + 1} — לא הוזן</span>}
            </span>
          </div>
        ))}
        {form.asGift && <SummaryRow label="זאת מתנה" value="✓" />}
      </div>

      <Divider width="100%" />

      <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(201,166,97,.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: pkg.priceNote ? 6 : 0 }}>
          <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 20, color: "var(--cream)" }}>סך הכל</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 36, color: "var(--gold-2)" }}>₪{pkg.price.toLocaleString()}</span>
            <span style={{ fontSize: 13, opacity: .65 }}>{pkg.priceUnit}</span>
          </div>
        </div>
        {pkg.priceNote && (
          <div style={{ textAlign: "left", fontSize: 11.5, opacity: .55, fontFamily: "'Miriam Libre', serif", letterSpacing: ".12em" }}>
            {pkg.priceNote}
          </div>
        )}
      </div>

      <div style={{
        marginTop: 18, padding: "10px 12px",
        background: "rgba(201,166,97,.1)", borderRadius: 2,
        fontSize: 11.5, opacity: .85, textAlign: "center",
        fontFamily: "'Miriam Libre', serif", letterSpacing: ".15em",
      }}>
        סודיות מוחלטת · תשלום מאובטח
      </div>
    </div>
  );
}
function SummaryRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
      <span style={{ opacity: .6 }}>{label}</span>
      <span style={{ color: "var(--cream)", maxWidth: "60%", textAlign: "left" }}>{value}</span>
    </div>
  );
}

Object.assign(window, { BookingScreen });
