// Home / Landing screen
const { useState: useStateHome, useEffect: useEffectHome } = React;

function HomeScreen({ onNav }) {
  const vp = useViewport();
  return (
    <>
      <Hero onNav={onNav} vp={vp} />
      <HowItWorks vp={vp} />
      <PackagePreview onNav={onNav} vp={vp} />
      <Testimonials vp={vp} />
      <FAQPreview />
      <CtaBand onNav={onNav} vp={vp} />
    </>
  );
}

function Hero({ onNav, vp }) {
  return (
    <section style={{
      position: "relative",
      minHeight: vp.isMobile ? "auto" : "calc(100vh - 70px)",
      padding: vp.isMobile ? "40px 20px 60px" : "60px 32px 80px",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
    }}>
      <FloatingLetters count={vp.isMobile ? 8 : 18} />
      {/* Background eye glow */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none",
      }}>
        <div style={{
          width: vp.isMobile ? 500 : 900, height: vp.isMobile ? 500 : 900,
          background: "radial-gradient(circle, rgba(201,166,97,.12) 0%, transparent 55%)",
          borderRadius: "50%",
          animation: "glow 6s ease-in-out infinite",
        }}/>
      </div>

      <div style={{
        maxWidth: 1280, margin: "0 auto", width: "100%",
        display: "grid",
        gridTemplateColumns: vp.isDesktop ? "1.1fr .9fr" : "1fr",
        gap: vp.isMobile ? 30 : 60,
        alignItems: "center",
        position: "relative",
      }}>
        {/* Right column - text */}
        <div className="fade-up" style={{ position: "relative", zIndex: 2 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "6px 14px",
            border: "1px solid rgba(201,166,97,.3)",
            borderRadius: 99,
            marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", animation: "glow 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: "'Miriam Libre', serif", fontSize: 11, letterSpacing: ".3em", color: "var(--gold)" }}>
              מסורת קבלית · מקוון לחלוטין
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Frank Ruhl Libre', serif",
            fontWeight: 500,
            fontSize: vp.isMobile ? "clamp(36px, 9vw, 52px)" : "clamp(56px, 7.5vw, 104px)",
            lineHeight: vp.isMobile ? 1.1 : .95,
            letterSpacing: "-.01em",
            color: "var(--cream)",
            marginBottom: 24,
          }}>
            הסרת <span style={{ fontStyle: "italic", color: "var(--gold-2)" }}>עין הרע</span><br/>
            על ידי גדולי המקובלים.
          </h1>

          <p style={{
            fontSize: vp.isMobile ? 16 : 21, lineHeight: 1.6, color: "var(--cream)", opacity: .78,
            maxWidth: 540, marginBottom: 36, textWrap: "pretty",
          }}>
            בכוח אותיות קדושות, צירופי שמות וסודות תורת הקבלה — מקובלים פותחים שערים נעולים, מסירים את עין הרע, ומאירים את הנשמה. הכל מהבית, בלי לצאת מהדלת.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <GoldButton size={vp.isMobile ? "md" : "lg"} onClick={() => onNav("packages")}>
              הזמנת חבילה
              <span style={{ fontSize: vp.isMobile ? 18 : 22, transform: "translateY(-1px)" }}>‹</span>
            </GoldButton>
            <GoldButton size={vp.isMobile ? "md" : "lg"} variant="ghost" onClick={() => onNav("quiz")}>
              אבחון מהיר — 60 שניות
            </GoldButton>
          </div>
        </div>

        {/* column - giant central eye */}
        <div style={{
          position: "relative",
          display: vp.isMobile ? "none" : "flex",
          alignItems: "center", justifyContent: "center",
          height: vp.isTablet ? 400 : 540,
          order: vp.isDesktop ? 0 : -1,
        }}>
          <BigEye />
        </div>
      </div>

      {/* Scroll cue */}
      {!vp.isMobile && (
        <div style={{
          position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          color: "var(--gold)", opacity: .6, fontSize: 11, letterSpacing: ".3em",
          fontFamily: "'Miriam Libre', serif",
        }}>
          <div>גלילה למטה</div>
          <div style={{ width: 1, height: 30, background: "var(--gold)", animation: "glow 2s ease-in-out infinite" }} />
        </div>
      )}
    </section>
  );
}

// Big decorative eye for the hero (concentric circles, sun-rays, kabbalah letter)
function BigEye() {
  const rays = Array.from({ length: 36 });
  return (
    <div style={{ position: "relative", width: 480, height: 480 }}>
      {/* outer rotating ring with letters */}
      <svg viewBox="-100 -100 200 200" width="100%" height="100%" style={{
        position: "absolute", inset: 0, animation: "spinSlow 80s linear infinite",
      }}>
        <circle r="92" fill="none" stroke="var(--gold-deep)" strokeWidth=".4" strokeDasharray="2 4" />
        {["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ל"].map((l, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(a) * 92;
          const y = Math.sin(a) * 92;
          return (
            <g key={i} transform={`translate(${x},${y}) rotate(${(i/12)*360 + 90})`}>
              <text textAnchor="middle" dominantBaseline="middle" fontFamily="'Frank Ruhl Libre', serif" fontSize="9" fontWeight="700" fill="var(--gold)">{l}</text>
            </g>
          );
        })}
      </svg>

      {/* sunray middle ring */}
      <svg viewBox="-100 -100 200 200" width="100%" height="100%" style={{
        position: "absolute", inset: 0, animation: "spinSlowR 120s linear infinite",
      }}>
        {rays.map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const r1 = 64;
          const r2 = i % 2 === 0 ? 78 : 72;
          return <line key={i} x1={Math.cos(a)*r1} y1={Math.sin(a)*r1} x2={Math.cos(a)*r2} y2={Math.sin(a)*r2} stroke="var(--gold)" strokeWidth=".8" opacity=".7"/>;
        })}
      </svg>

      {/* Central eye */}
      <svg viewBox="-100 -100 200 200" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {/* almond eye outer */}
        <ellipse rx="68" ry="38" fill="none" stroke="var(--gold)" strokeWidth="1.5"/>
        <ellipse rx="60" ry="32" fill="none" stroke="var(--gold-deep)" strokeWidth=".6"/>
        {/* iris */}
        <circle r="26" fill="none" stroke="var(--gold)" strokeWidth="1.2"/>
        <circle r="24" fill="rgba(201,166,97,.06)" />
        {/* iris ridges */}
        {Array.from({length:18}).map((_,i)=>{
          const a = (i/18)*Math.PI*2;
          return <line key={i} x1={Math.cos(a)*8} y1={Math.sin(a)*8} x2={Math.cos(a)*22} y2={Math.sin(a)*22} stroke="var(--gold)" strokeWidth=".5" opacity=".5"/>
        })}
        {/* pupil */}
        <circle r="10" fill="var(--ink)" stroke="var(--gold-2)" strokeWidth=".8"/>
        <circle r="6" fill="var(--gold-2)" />
        <circle cx="-2" cy="-2" r="2" fill="var(--cream)" />
      </svg>

      {/* corner ornaments */}
      <div style={{ position: "absolute", top: -20, right: -20 }}><StarShield size={48}/></div>
      <div style={{ position: "absolute", bottom: -20, left: -20 }}><StarShield size={48}/></div>
    </div>
  );
}

function HowItWorks({ vp }) {
  const steps = [
    { n: "א", title: "אבחון", text: "ענו על 6 שאלות קצרות ונדע לאיזו רמת כיסוי אתם זקוקים. ללא הרשמה, ללא חיוב, ב-60 שניות." },
    { n: "ב", title: "בחירת חבילה", text: "בחרו אחת משלוש החבילות — חד פעמי, חודשי או שנתי. אפשר להחליף או לבטל בכל זמן." },
    { n: "ג", title: "שליחת שמות", text: "השאירו שם פרטי ושם האם — לפי המסורת. לא נדרש שום פרט אישי נוסף." },
    { n: "ד", title: "הטיפול", text: "גדולי המקובלים מבצעים את הסדר מאחורי הקלעים, על פי תורת הקבלה. אתם תקבלו אישור, ברכה וסגולה כתובה במייל." },
  ];
  return (
    <section style={{ padding: vp.isMobile ? "60px 18px" : "100px 32px", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading overline="התהליך · ארבעה שלבים" title="כך זה עובד" sub="ארבעה שלבים שמקובלים מקדמת דנא — מהשאלה הראשונה ועד שהברכה פועלת."/>
        <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: gridCols(vp, { mobile: 1, tablet: 2, desktop: 4 }), gap: 24 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{
              padding: "32px 28px",
              background: "linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,0))",
              border: "1px solid rgba(201,166,97,.18)",
              borderRadius: 2,
              position: "relative",
              transition: "all .25s ease",
              cursor: "default",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--gold)";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.background = "linear-gradient(180deg, rgba(201,166,97,.08), rgba(255,255,255,0))";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(201,166,97,.18)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = "linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,0))";
            }}
            >
              <div style={{
                position: "absolute", top: -22, right: 28,
                width: 44, height: 44, borderRadius: "50%",
                background: "var(--ink)",
                border: "1px solid var(--gold)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Frank Ruhl Libre', serif",
                fontSize: 22, color: "var(--gold-2)", fontWeight: 700,
              }}>{s.n}</div>
              <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 28, color: "var(--cream)", marginBottom: 10, marginTop: 16 }}>
                {s.title}
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, opacity: .65, textWrap: "pretty" }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackagePreview({ onNav, vp }) {
  const pkgs = [
    {
      tier: "סגולה",
      letter: "ס",
      sub: "חד פעמי",
      price: 149,
      priceUnit: "חד פעמי",
      tag: "טיפול בודד",
      bullets: ["טיפול הסרה אחד", "עד 2 שמות בטיפול", "סדר ברכות במייל"],
      color: "var(--cream)",
    },
    {
      tier: "שמירה",
      letter: "ש",
      sub: "פרימיום · ראש חודש",
      price: 129,
      priceUnit: "לחודש",
      tag: "החבילה המומלצת",
      bullets: ["טיפול בכל ראש חודש עברי", "סגולה אישית בשליחה", "שמירה רוחנית מתמשכת"],
      color: "var(--gold-2)",
      featured: true,
    },
    {
      tier: "מגן עולם",
      letter: "מ",
      sub: "שנתי · משפחה ועסק",
      price: 101,
      priceUnit: "לחודש",
      tag: "כיסוי כולל",
      bullets: ["12 טיפולי ראש חודש", "עד 6 נפשות מהמשפחה", "כיסוי לבית ולעסק", "סגולות לכל הבית"],
      color: "var(--cream)",
    },
  ];
  return (
    <section style={{ padding: vp.isMobile ? "40px 18px 60px" : "60px 32px 100px", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading overline="חבילות · שלושה כיסויים" title="בחרו את הכיסוי המתאים" sub="כל החבילות כוללות התייעצות ראשונית ללא תשלום."/>
        <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: gridCols(vp, { mobile: 1, tablet: 1, desktop: 3 }), gap: 20 }}>
          {pkgs.map((p, i) => <PackageCard key={p.tier} {...p} onClick={() => onNav("packages")} />)}
        </div>
      </div>
    </section>
  );
}

function PackageCard({ tier, letter, sub, price, priceUnit, tag, bullets, color, featured, onClick }) {
  return (
    <div onClick={onClick} style={{
      position: "relative",
      padding: featured ? 36 : 32,
      paddingTop: featured ? 42 : 36,
      background: featured
        ? "linear-gradient(180deg, rgba(201,166,97,.14), rgba(201,166,97,.02))"
        : "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0))",
      border: featured ? "1px solid var(--gold)" : "1px solid rgba(201,166,97,.18)",
      borderRadius: 2,
      transform: featured ? "translateY(-12px)" : "none",
      boxShadow: featured ? "0 30px 60px -30px rgba(201,166,97,.4)" : "none",
      cursor: "pointer",
      transition: "all .25s ease",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = "var(--gold)";
      e.currentTarget.style.transform = (featured ? "translateY(-16px)" : "translateY(-4px)");
      e.currentTarget.style.boxShadow = "0 36px 70px -28px rgba(201,166,97,.5)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = featured ? "var(--gold)" : "rgba(201,166,97,.18)";
      e.currentTarget.style.transform = (featured ? "translateY(-12px)" : "none");
      e.currentTarget.style.boxShadow = featured ? "0 30px 60px -30px rgba(201,166,97,.4)" : "none";
    }}
    >
      {featured && (
        <div style={{
          position: "absolute", top: -12, right: 24,
          padding: "5px 14px",
          background: "var(--gold)",
          color: "var(--ink)",
          fontFamily: "'Miriam Libre', serif",
          fontSize: 10, letterSpacing: ".3em",
        }}>הכי נבחר</div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Miriam Libre', serif", fontSize: 10, letterSpacing: ".3em", color: "var(--gold)", marginBottom: 8 }}>{tag}</div>
          <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 36, fontWeight: 500, color, lineHeight: 1 }}>{tier}</h3>
          <div style={{ fontSize: 13, opacity: .55, marginTop: 6 }}>{sub}</div>
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: 2,
          border: "1px solid var(--gold-deep)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Frank Ruhl Libre', serif", fontSize: 32, color: "var(--gold-2)",
        }}>{letter}</div>
      </div>
      <Divider width="100%" />
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "20px 0 20px" }}>
        <span style={{ fontSize: 22, color: "var(--gold)" }}>₪</span>
        <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 56, color: "var(--cream)", lineHeight: 1 }}>{price.toLocaleString()}</span>
        <span style={{ opacity: .55, fontSize: 13 }}>{priceUnit || "/ חבילה"}</span>
      </div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14.5, opacity: .85 }}>
            <span style={{ color: "var(--gold)", fontSize: 14, marginTop: 2 }}>◆</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <GoldButton variant={featured ? "solid" : "ghost"} onClick={onClick} style={{ width: "100%" }}>
        בחירת חבילה
      </GoldButton>
    </div>
  );
}

function Testimonials({ vp }) {
  const items = [
    { name: "מ. כהן", city: "ירושלים", text: "אחרי שנים של עיכובים בעבודה, חבילת שמירה פתחה לי דלתות. ממליצה מכל הלב.", tier: "שמירה" },
    { name: "ר. אזולאי", city: "אשדוד", text: "הסדר של ראש חודש החזיר לי שגרה רוחנית. תוך שלושה חודשים — הרגשתי שינוי.", tier: "שמירה" },
    { name: "י. לוי", city: "תל אביב", text: "הייתי סקפטי. אחרי טיפול לבית ולעסק, חזרו לקוחות שלא ראיתי שנה. לא בא להמליץ — בא להגיד תודה.", tier: "מגן עולם" },
  ];
  return (
    <section style={{
      padding: vp.isMobile ? "60px 18px" : "100px 32px",
      background: "linear-gradient(180deg, transparent, rgba(201,166,97,.03), transparent)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading overline="המלצות · קולות מהשטח" title="מי שעבר, יודע."/>
        <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: gridCols(vp, { mobile: 1, tablet: 1, desktop: 3 }), gap: 24 }}>
          {items.map((t, i) => (
            <figure key={i} style={{
              padding: 32,
              background: "rgba(255,255,255,.02)",
              border: "1px solid rgba(201,166,97,.14)",
              borderRadius: 2,
              position: "relative",
              transition: "all .25s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold-deep)"; e.currentTarget.style.background = "rgba(201,166,97,.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,166,97,.14)"; e.currentTarget.style.background = "rgba(255,255,255,.02)"; }}
            >
              <div style={{
                position: "absolute", top: 16, left: 24,
                fontFamily: "'Frank Ruhl Libre', serif",
                fontSize: 80, lineHeight: .6, color: "var(--gold)", opacity: .25,
              }}>״</div>
              <blockquote style={{
                fontFamily: "'Frank Ruhl Libre', serif",
                fontSize: vp.isMobile ? 17 : 21, lineHeight: 1.5, color: "var(--cream)", marginBottom: 22,
                textWrap: "pretty",
              }}>{t.text}</blockquote>
              <Divider width={60} />
              <figcaption style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, color: "var(--cream)" }}>{t.name}</div>
                  <div style={{ fontSize: 12, opacity: .55 }}>{t.city}</div>
                </div>
                <div style={{
                  padding: "4px 10px",
                  border: "1px solid var(--gold-deep)",
                  fontSize: 11, fontFamily: "'Miriam Libre', serif",
                  letterSpacing: ".2em", color: "var(--gold-2)",
                }}>{t.tier}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQPreview() {
  const [open, setOpen] = useStateHome(0);
  const vp = useViewport();
  const qs = [
    { q: "האם הטיפול עובד למי שלא דתי?", a: "השירות מתאים לכל אדם, ללא תלות בשמירה דתית. רבים מהלקוחות שלנו חילונים גמורים שמחפשים מסורת ושקט נפשי." },
    { q: "מה זה ראש חודש ולמה דווקא אז?", a: "ראש חודש עברי הוא היום שבו מתחדשת הלבנה. במסורת הקבלית זה הזמן החזק ביותר להתחדשות, פתיחת מזל והסרת עיכובים." },
    { q: "איך הטיפול מתבצע בפועל?", a: "המקובלים מבצעים את הסדר מאחורי הקלעים, על פי תורת הקבלה — באמצעות אותיות קדושות, צירופי שמות ותפילה. לא נדרשת מכם השתתפות פעילה. בסיום נשלח אליכם אישור, ברכה וסגולה כתובה במייל." },
    { q: "האם זה דורש מידע אישי?", a: "רק שם פרטי ושם האם — לפי המסורת. אין צורך בתעודת זהות, כתובת או פרטים רגישים." },
  ];
  return (
    <section style={{ padding: vp.isMobile ? "50px 18px 70px" : "60px 32px 100px" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <SectionHeading overline="שאלות נפוצות" title="מה כדאי לדעת לפני שמזמינים"/>
        <div style={{ marginTop: 40 }}>
          {qs.map((it, i) => (
            <div key={i} style={{
              borderTop: "1px solid rgba(201,166,97,.15)",
              borderBottom: i === qs.length - 1 ? "1px solid rgba(201,166,97,.15)" : "none",
            }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{
                width: "100%", padding: "22px 0",
                display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "right",
              }}>
                <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: vp.isMobile ? 17 : 22, color: "var(--cream)", textAlign: "right", flex: 1, paddingLeft: 12 }}>{it.q}</span>
                <span style={{
                  color: "var(--gold)", fontSize: 24,
                  transition: "transform .3s", transform: open === i ? "rotate(45deg)" : "rotate(0)",
                }}>+</span>
              </button>
              {open === i && (
                <div className="fade-up" style={{ paddingBottom: 22, color: "var(--cream)", opacity: .7, fontSize: 16, lineHeight: 1.7, maxWidth: 700 }}>
                  {it.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand({ onNav, vp }) {
  return (
    <section style={{ padding: vp.isMobile ? "20px 18px 60px" : "20px 32px 80px" }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: vp.isMobile ? "40px 26px" : "60px 60px",
        background: "linear-gradient(135deg, var(--ink-3), var(--ink-2))",
        border: "1px solid var(--gold-deep)",
        borderRadius: 2,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, left: -40, opacity: .15 }}>
          <TreeOfLife size={260} />
        </div>
        <div style={{ position: "relative", maxWidth: 640 }}>
          <SectionHeading overline="הצעד הראשון הוא הקל ביותר" title="לא בטוחים אם יש עין הרע?" sub="אבחון מהיר של 60 שניות יגלה לכם איפה אתם עומדים. ללא חיוב, ללא הרשמה." align="right"/>
          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <GoldButton size="lg" onClick={() => onNav("quiz")}>התחלת אבחון</GoldButton>
            <GoldButton size="lg" variant="ghost" onClick={() => onNav("packages")}>ראיית חבילות</GoldButton>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HomeScreen });
