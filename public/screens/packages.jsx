// Packages screen — full detailed pricing
const { useState: useStatePkg } = React;

const PACKAGES = [
  {
    id: "segula",
    tier: "סגולה",
    letter: "ס",
    sub: "טיפול חד פעמי · עד 2 שמות",
    price: 149,
    priceUnit: "חד פעמי",
    priceFull: 280,
    duration: "טיפול בודד",
    short: "טיפול ההסרה הקלאסי. לבד, או עם בן/בת הזוג.",
    maxNames: 2,
    bullets: [
      ["טיפול הסרה חד פעמי", "פגישה מקוונת של 30 דקות, ביום ובשעה שבחרתם"],
      ["עד 2 שמות בטיפול", "אתם לבד, או יחד עם בן/בת זוג, הורה, ילד או חבר"],
      ["סדר ברכות מסורתי", "סדר תפילות שיגיע אליכם בדואר אלקטרוני מיד אחרי ההזמנה"],
      ["אישור והכנה", "הוראות הכנה קצרות במייל לפני הטיפול"],
    ],
    not: ["טיפולי המשך", "סגולה פיזית", "טיפול לבית או לעסק"],
  },
  {
    id: "shmira",
    tier: "שמירה",
    letter: "ש",
    sub: "פרימיום · 2 טיפולי ראש חודש",
    price: 129,
    priceUnit: "× 2 חודשים",
    priceFull: 179,
    duration: "2 תשלומים · ₪258 סה״כ",
    short: "2 טיפולי ראש חודש עברי. שמירה לשני חודשים, בלי לחשוב על זה.",
    featured: true,
    maxNames: 1,
    bullets: [
      ["טיפול בכל ראש חודש", "טיפול אחד בכל ראש חודש עברי, 12 בשנה — הזמן הקבלי החזק ביותר לחידוש"],
      ["סגולה אישית בשליחה", "תכשיט שמירה אישי (חמסה או עין) שמגיע בדואר עם הטיפול הראשון"],
      ["שמירה רוחנית מתמשכת", "תפילה שבועית בשמכם בקבר רבי מאיר בעל הנס בטבריה"],
      ["סדר ברכות חודשי", "סדר ברכות מותאם לחודש העברי שנשלח אליכם במייל"],
      ["ביטול אונליין בכל זמן", "ללא התחייבות. לוחצים כפתור — ההרשמה נפסקת מיידית"],
    ],
    not: ["טיפול לבית או לעסק", "כיסוי לכל המשפחה"],
  },
  {
    id: "magen",
    tier: "מגן עולם",
    letter: "מ",
    sub: "שנתי · עד 6 נפשות · בית ועסק",
    price: 101,
    priceUnit: "לחודש",
    priceNote: "× 12 חודשים · חיוב שנתי חד פעמי",
    duration: "12 חודשים · חיוב חד פעמי",
    short: "כל מה שיש ב״שמירה״, מורחב למשפחה ולמקום העבודה.",
    maxNames: 6,
    bullets: [
      ["טיפול חודשי בראש חודש × 12", "12 טיפולי הסרה ושמירה לכל אורך השנה, בכל ראש חודש עברי"],
      ["עד 6 נפשות מהמשפחה", "טיפול אישי לכל בן משפחה — לבד, יחד, או בשילובים"],
      ["טיפול לבית וגם לעסק", "סדר ברכה והגנה לדירה, לבית הפרטי או למקום העבודה"],
      ["4 טיפולי חיזוק רבעוניים", "טיפול עומק נוסף כל 3 חודשים, מעבר לראשי החודשים"],
      ["סגולות לכל הבית", "מזוזות מהודרות, חמסות לכל חדר, מים מקודשים — בשליחה אליכם"],
      ["מחיר נעול לשנה שלמה", "חיוב אחד בלבד. אין הפתעות, אין חידוש אוטומטי"],
    ],
    not: [],
  },
];

function PackagesScreen({ onNav, onSelect }) {
  const vp = useViewport();
  return (
    <section style={{ padding: vp.isMobile ? "40px 18px 60px" : "60px 32px 100px", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        <SectionHeading
          overline="חבילות · שלושה כיסויים"
          title="כיסוי לפי המידה."
          sub="כל החבילות כוללות החזר כספי מלא תוך 14 יום וייעוץ ראשוני ללא עלות."
        />

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: gridCols(vp, { mobile: 1, tablet: 1, desktop: 3 }), gap: vp.isMobile ? 18 : 24, alignItems: "stretch", marginTop: vp.isMobile ? 0 : 24 }}>
          {PACKAGES.map(p => <BigPackageCard key={p.id} pkg={p} onSelect={() => onSelect(p.id)} vp={vp} />)}
        </div>

        {/* Compare table */}
        <div style={{ marginTop: vp.isMobile ? 70 : 100 }}>
          <SectionHeading overline="השוואה · טבלה מלאה" title="כל ההבדלים, במבט אחד"/>
          <CompareTable onSelect={onSelect} vp={vp} />
        </div>

        {/* Guarantees row */}
        <div style={{ marginTop: vp.isMobile ? 50 : 80, display: "grid", gridTemplateColumns: gridCols(vp, { mobile: 1, tablet: 2, desktop: 4 }), gap: 18 }}>
          {[
            ["ך", "החזר כספי תוך 14 יום"],
            ["ם", "מטפלים מוסמכים בלבד"],
            ["ן", "סודיות מוחלטת"],
            ["ץ", "תשלום מאובטח"],
          ].map(([l, t]) => (
            <div key={l} style={{
              padding: "24px 22px",
              border: "1px solid rgba(201,166,97,.18)",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{
                width: 44, height: 44, border: "1px solid var(--gold-deep)", borderRadius: 2,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Frank Ruhl Libre', serif", fontSize: 24, color: "var(--gold-2)",
              }}>{l}</div>
              <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 17, color: "var(--cream)" }}>{t}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <PackagesFAQ />
      </div>
    </section>
  );
}

function BigPackageCard({ pkg, vp = {}, onSelect }) {
  const { tier, letter, sub, price, priceUnit, priceFull, priceNote, duration, short, bullets, not, featured } = pkg;
  return (
    <div onClick={onSelect} style={{
      position: "relative",
      padding: featured ? 36 : 32,
      paddingTop: featured ? 46 : 36,
      background: featured
        ? "linear-gradient(180deg, rgba(201,166,97,.14), rgba(201,166,97,.02))"
        : "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0))",
      border: featured ? "1px solid var(--gold)" : "1px solid rgba(201,166,97,.18)",
      borderRadius: 2,
      transform: featured ? "translateY(-16px)" : "none",
      boxShadow: featured ? "0 30px 60px -30px rgba(201,166,97,.4)" : "none",
      display: "flex", flexDirection: "column",
      cursor: "pointer",
      transition: "all .25s ease",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = "var(--gold)";
      e.currentTarget.style.transform = featured ? "translateY(-20px)" : "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 38px 70px -28px rgba(201,166,97,.5)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = featured ? "var(--gold)" : "rgba(201,166,97,.18)";
      e.currentTarget.style.transform = featured ? "translateY(-16px)" : "none";
      e.currentTarget.style.boxShadow = featured ? "0 30px 60px -30px rgba(201,166,97,.4)" : "none";
    }}
    >
      {featured && (
        <div style={{
          position: "absolute", top: -12, right: 24,
          padding: "5px 14px", background: "var(--gold)", color: "var(--ink)",
          fontFamily: "'Miriam Libre', serif", fontSize: 10, letterSpacing: ".3em",
        }}>הכי נבחר</div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "'Miriam Libre', serif", fontSize: 10, letterSpacing: ".25em", color: "var(--gold)", marginBottom: 6 }}>{duration}</div>
          <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 500, fontSize: 40, color: "var(--cream)", lineHeight: 1 }}>{tier}</h3>
          <div style={{ fontSize: 13, opacity: .55, marginTop: 6 }}>{sub}</div>
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: 2,
          border: "1px solid var(--gold-deep)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Frank Ruhl Libre', serif", fontSize: 32, color: "var(--gold-2)",
        }}>{letter}</div>
      </div>
      <p style={{ fontSize: 14, opacity: .7, lineHeight: 1.6, marginBottom: 18 }}>{short}</p>
      <Divider width="100%" />
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "18px 0", flexWrap: "wrap" }}>
        <span style={{ fontSize: 18, color: "var(--gold)" }}>₪</span>
        <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 56, color: "var(--cream)", lineHeight: 1 }}>{price.toLocaleString()}</span>
        <span style={{ opacity: .6, fontSize: 14, marginInlineStart: 2 }}>{priceUnit}</span>
        {priceFull && (
          <span style={{ fontSize: 15, color: "var(--cream)", opacity: .35, textDecoration: "line-through", marginInlineStart: 6 }}>
            ₪{priceFull.toLocaleString()}
          </span>
        )}
      </div>
      {priceNote && <div style={{ fontSize: 11.5, opacity: .55, marginTop: -10, marginBottom: 8, fontFamily: "'Miriam Libre', serif", letterSpacing: ".15em" }}>{priceNote}</div>}
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14, marginBottom: 24, flex: 1 }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, lineHeight: 1.45 }}>
            <span style={{ color: "var(--gold)", fontSize: 14, marginTop: 2 }}>◆</span>
            <div>
              <div style={{ color: "var(--cream)" }}>{b[0]}</div>
              <div style={{ opacity: .55, fontSize: 12.5, marginTop: 2 }}>{b[1]}</div>
            </div>
          </li>
        ))}
        {not.map((n, i) => (
          <li key={"n"+i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, opacity: .35, textDecoration: "line-through" }}>
            <span>—</span><span>{n}</span>
          </li>
        ))}
      </ul>
      <GoldButton variant={featured ? "solid" : "ghost"} onClick={onSelect} style={{ width: "100%" }}>
        בחירת חבילת {tier}
      </GoldButton>
    </div>
  );
}

function CompareTable({ onSelect, vp = {} }) {
  const rows = [
    ["טיפולי הסרה", "1 (חד פעמי)", "1 כל ראש חודש", "12 בשנה + 4 חיזוקים"],
    ["מספר שמות בטיפול", "עד 2 שמות", "ללא הגבלה (הנפש)", "עד 6 נפשות"],
    ["שמירה רוחנית מתמשכת", "—", "✓ שבועית", "✓ שבועית"],
    ["סגולה פיזית בדואר", "—", "✓ חמסה / עין", "מזוזות + חמסות + מים"],
    ["טיפול לבית", "—", "—", "✓"],
    ["טיפול לעסק", "—", "—", "✓"],
    ["טיפולי חיזוק רבעוניים", "—", "—", "4 בשנה"],
    ["חיוב", "חד פעמי", "חודשי · ביטול בכל זמן", "שנתי · חד פעמי"],
    ["החזר כספי", "מלא 14 יום", "מלא 14 יום", "מלא 14 יום"],
  ];
  const headers = ["", "סגולה", "שמירה", "מגן עולם"];
  return (
    <div style={{ marginTop: 36, border: "1px solid rgba(201,166,97,.18)", borderRadius: 2, overflowX: "auto", overflowY: "visible", width: "100%", WebkitOverflowScrolling: "touch" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: vp.isMobile ? 480 : 0 }}>
        <thead>
          <tr style={{ background: "rgba(201,166,97,.06)" }}>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: "20px 24px", textAlign: i === 0 ? "right" : "center",
                fontFamily: "'Frank Ruhl Libre', serif", fontSize: i === 0 ? 13 : 22, fontWeight: 500,
                color: i === 2 ? "var(--gold-2)" : "var(--cream)",
                borderBottom: "1px solid rgba(201,166,97,.18)",
                position: "relative",
              }}>{h}
                {i === 2 && <div style={{ fontFamily: "'Miriam Libre', serif", fontSize: 9, letterSpacing: ".3em", color: "var(--gold)", marginTop: 4 }}>הכי נבחר</div>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: "1px solid rgba(201,166,97,.08)" }}>
              {r.map((c, j) => (
                <td key={j} style={{
                  padding: "16px 24px",
                  textAlign: j === 0 ? "right" : "center",
                  fontSize: 14.5,
                  color: j === 0 ? "var(--cream)" : (c === "—" ? "rgba(244,236,216,.3)" : "var(--cream)"),
                  background: j === 2 ? "rgba(201,166,97,.04)" : "transparent",
                  fontFamily: j === 0 ? "'Heebo', sans-serif" : "'Frank Ruhl Libre', serif",
                }}>{c}</td>
              ))}
            </tr>
          ))}
          <tr>
            <td style={{ padding: "22px 24px" }}></td>
            {PACKAGES.map((p) => (
              <td key={p.id} style={{ padding: "22px 24px", textAlign: "center" }}>
                <GoldButton size="sm" variant={p.featured ? "solid" : "ghost"} onClick={() => onSelect(p.id)}>הזמנה</GoldButton>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PackagesFAQ() {
  const [open, setOpen] = useStatePkg(-1);
  const qs = [
    { q: "האם אפשר לשדרג חבילה אחר כך?", a: "כן. בכל זמן ניתן לשדרג ולשלם רק את ההפרש. הסבר מלא בעת ההזמנה." },
    { q: "האם החבילה מתחדשת אוטומטית?", a: "לא. כל חבילה היא חד-פעמית. אם תרצו להמשיך — נשלח לכם תזכורת לפני סוף התקופה." },
    { q: "מה הזמן הצפוי בין הזמנה לטיפול ראשון?", a: "תוך 48 שעות מהתשלום נחזור אליכם לתיאום. הטיפול עצמו בדרך כלל בתוך השבוע." },
    { q: "האם אפשר לתת חבילה כמתנה?", a: "בהחלט. בעת ההזמנה ניתן לסמן 'מתנה' ולהוסיף ברכה אישית. נשלח אישור יפה בדואר אלקטרוני." },
  ];
  return (
    <div style={{ marginTop: 80, maxWidth: 880, marginInline: "auto" }}>
      <SectionHeading title="שאלות על החבילות"/>
      <div style={{ marginTop: 40 }}>
        {qs.map((it, i) => (
          <div key={i} style={{
            borderTop: "1px solid rgba(201,166,97,.15)",
            borderBottom: i === qs.length - 1 ? "1px solid rgba(201,166,97,.15)" : "none",
          }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} style={{
              width: "100%", padding: "20px 0",
              display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "right",
            }}>
              <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 20, color: "var(--cream)" }}>{it.q}</span>
              <span style={{ color: "var(--gold)", fontSize: 22, transition: "transform .3s", transform: open === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
            </button>
            {open === i && (
              <div className="fade-up" style={{ paddingBottom: 20, color: "var(--cream)", opacity: .7, fontSize: 15.5, lineHeight: 1.7, maxWidth: 700 }}>
                {it.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { PackagesScreen, PACKAGES });
