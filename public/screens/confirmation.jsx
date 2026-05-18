// Order confirmation screen
function ConfirmationScreen({ form, onNav }) {
  const vp = useViewport();
  const orderNum = React.useMemo(() => `${Date.now().toString(36).slice(-6).toUpperCase()}-${Math.floor(Math.random()*900+100)}`, []);
  const pkg = PACKAGES.find(p => p.id === form.pkgId) || PACKAGES[1];
  const names = form.names || [];
  const firstNameDisplay = names[0]?.first || "";

  return (
    <section style={{ padding: vp.isMobile ? "40px 18px 60px" : "60px 32px 100px", position: "relative", minHeight: "70vh" }}>
      <FloatingLetters count={vp.isMobile ? 8 : 14} />
      <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", textAlign: "center" }}>
        <div className="fade-up" style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ position: "relative" }}>
            <EyeMark size={vp.isMobile ? 100 : 130} />
            <div style={{
              position: "absolute", inset: -20, borderRadius: "50%",
              border: "1px dashed rgba(201,166,97,.4)",
              animation: "spinSlow 40s linear infinite",
            }}/>
          </div>
        </div>

        <div style={{ fontFamily: "'Miriam Libre', serif", fontSize: 11, letterSpacing: ".3em", color: "var(--gold)", marginBottom: 14 }}>
          ההזמנה אושרה · בס״ד
        </div>

        <h1 style={{
          fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 500,
          fontSize: vp.isMobile ? "40px" : "clamp(40px, 6vw, 64px)",
          color: "var(--cream)", lineHeight: 1.05, marginBottom: 18,
        }}>תודה{firstNameDisplay ? `, ${firstNameDisplay}` : ""}.</h1>

        <p style={{ fontSize: vp.isMobile ? 16 : 18, opacity: .8, maxWidth: 540, margin: "0 auto", lineHeight: 1.65, textWrap: "pretty" }}>
          קיבלנו את ההזמנה לחבילת <strong style={{ color: "var(--gold-2)" }}>{pkg.tier}</strong>. גדולי המקובלים יקבלו את השמות, ילמדו ויבצעו את התיקון לפי המסורת.
        </p>

        {/* Order card */}
        <div style={{
          marginTop: 44, padding: vp.isMobile ? 24 : 36,
          background: "linear-gradient(180deg, rgba(201,166,97,.08), rgba(201,166,97,.02))",
          border: "1px solid var(--gold)", borderRadius: 2,
          textAlign: "right",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            marginBottom: 24, flexWrap: "wrap", gap: 18,
          }}>
            <div>
              <div style={{ fontSize: 12, opacity: .55, marginBottom: 6 }}>מספר הזמנה</div>
              <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: vp.isMobile ? 22 : 26, color: "var(--cream)", letterSpacing: ".1em" }}>{orderNum}</div>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 12, opacity: .55, marginBottom: 6 }}>תאריך</div>
              <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 19, color: "var(--cream)" }}>
                {new Date().toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>

          <Divider width="100%" />

          <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: vp.isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            <ConfRow label="חבילה" value={`חבילת ${pkg.tier}`} />
            <ConfRow label="סכום" value={`₪${pkg.price.toLocaleString()} ${pkg.priceUnit}`} />
            <ConfRow label="טלפון" value={form.phone || "—"} dir="ltr" />
            <ConfRow label="מייל" value={form.email || "—"} dir="ltr" />
          </div>

          {/* Names list */}
          {names.length > 0 && (
            <div style={{
              marginTop: 22, paddingTop: 18,
              borderTop: "1px solid rgba(201,166,97,.15)",
            }}>
              <div style={{ fontSize: 11, opacity: .55, fontFamily: "'Miriam Libre', serif", letterSpacing: ".22em", marginBottom: 10 }}>
                שמות בטיפול ({names.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {names.map((n, i) => (
                  <div key={i} style={{ fontSize: 14.5, color: "var(--cream)" }}>
                    <span style={{ color: "var(--gold-2)", marginInlineEnd: 8 }}>{i + 1}.</span>
                    {n.first} בן/בת {n.mother}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Next steps */}
        <div style={{ marginTop: 50, textAlign: "right" }}>
          <SectionHeading title="מה הלאה?" align="right" />
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["א", "תוך שעות", "השמות נמסרים ישירות לידי המקובל הראשי, בכתב יד."],
              ["ב", "יום-יומיים", "המקובל לומד את השמות, מכין את הסדר ומתפלל."],
              ["ג", "בזמן הנכון", "התיקון מתבצע על פי המסורת — בכוונה, באותיות ובשמות הקדושים."],
            ].map(([l, t, d]) => (
              <div key={l} style={{
                padding: vp.isMobile ? "16px 18px" : "20px 22px",
                background: "rgba(255,255,255,.02)",
                border: "1px solid rgba(201,166,97,.18)",
                borderRadius: 2,
                display: "flex", gap: 16, alignItems: "center",
              }}>
                <div style={{
                  width: 44, height: 44, border: "1px solid var(--gold-deep)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Frank Ruhl Libre', serif", fontSize: 22, color: "var(--gold-2)", flexShrink: 0,
                }}>{l}</div>
                <div>
                  <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 19, color: "var(--cream)" }}>{t}</div>
                  <div style={{ fontSize: 14, opacity: .65, marginTop: 4 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 44, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <GoldButton onClick={() => onNav("home")}>חזרה לדף הבית</GoldButton>
          <GoldButton variant="ghost" onClick={() => window.print && window.print()}>הדפסת אישור</GoldButton>
        </div>

        <div style={{ marginTop: 50, opacity: .55, fontFamily: "'Frank Ruhl Libre', serif", fontSize: 17, fontStyle: "italic" }}>
          ״יברכך ה׳ וישמרך״
        </div>
      </div>
    </section>
  );
}

function ConfRow({ label, value, dir }) {
  return (
    <div>
      <div style={{ fontSize: 11, opacity: .5, marginBottom: 4, fontFamily: "'Miriam Libre', serif", letterSpacing: ".2em" }}>{label}</div>
      <div style={{ fontSize: 15, color: "var(--cream)" }} dir={dir}>{value}</div>
    </div>
  );
}

Object.assign(window, { ConfirmationScreen });
