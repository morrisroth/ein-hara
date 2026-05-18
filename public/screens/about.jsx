// About / Mission page
function AboutScreen({ onNav }) {
  const vp = useViewport();
  return (
    <>
      <AboutHero vp={vp} />
      <AboutStory vp={vp} />
      <AboutTeam vp={vp} />
      <AboutPrinciples vp={vp} />
      <CtaBand onNav={onNav} vp={vp} />
    </>
  );
}

function AboutHero({ vp }) {
  return (
    <section style={{ padding: vp.isMobile ? "40px 18px 30px" : "60px 32px 40px", position: "relative" }}>
      <FloatingLetters count={8} />
      <div style={{ maxWidth: 980, margin: "0 auto", position: "relative", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <TreeOfLife size={120} />
        </div>
        <SectionHeading
          overline="על השירות · מאז 2018"
          title="מסורת בת אלפי שנים, בשפה של היום."
          sub="בית עין הוקם מתוך הבנה פשוטה — אנשים שמחפשים שקט רוחני זקוקים לשירות מכבד, נגיש ומקצועי. בלי טשטוש, בלי הבטחות שווא, ובלי מלאכים שעולים אלפי שקלים."
        />
      </div>
    </section>
  );
}

function AboutStory({ vp }) {
  return (
    <section style={{ padding: vp.isMobile ? "40px 18px" : "60px 32px" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: vp.isDesktop ? "1fr 1fr" : "1fr",
        gap: vp.isMobile ? 30 : 60,
        alignItems: "center",
      }}>
        <div>
          <div style={{ fontFamily: "'Miriam Libre', serif", fontSize: 11, letterSpacing: ".3em", color: "var(--gold)", marginBottom: 14 }}>ההיסטוריה</div>
          <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 38, fontWeight: 500, color: "var(--cream)", lineHeight: 1.15, marginBottom: 20 }}>
            למעלה מ-3,000 שנה של עבודה רוחנית.
          </h3>
          <p style={{ fontSize: 16.5, opacity: .8, lineHeight: 1.8, marginBottom: 16 }}>
            עין הרע נזכרת כבר בתנ״ך, במשנה ובתלמוד. חז״ל קבעו ש״תשעים ותשעה מתים בעין הרע ואחד בדרך ארץ״ (בבא מציעא ק״ז) — והקדישו פרקים שלמים לדרכי השמירה וההסרה. אין נושא שתורת הקבלה עוסקת בו יותר.
          </p>
          <p style={{ fontSize: 16.5, opacity: .8, lineHeight: 1.8, marginBottom: 16 }}>
            הזוהר הקדוש, האר״י הקדוש בצפת, רבי חיים ויטאל, הבן איש חי, הבבא סאלי — כולם כתבו, פעלו והעבירו את הסודות מדור לדור. סדרי הברכה, צירופי השמות וסגולות השמירה שאנו משתמשים בהם היום הם בדיוק אלו שהיו בשימוש לפני מאות שנים.
          </p>
          <p style={{ fontSize: 16.5, opacity: .8, lineHeight: 1.8 }}>
            זו לא אמונה תפלה — זו תורה שלמה, מתועדת, חיה ונושמת. אנו רק מנגישים אותה לדור שלנו, באופן שהיה רוצה בו הרב.
          </p>
        </div>
        <div style={{
          position: "relative",
          height: vp.isMobile ? 320 : 460,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle at center, rgba(201,166,97,.15), transparent 65%)",
          }}/>
          <BigEye />
        </div>
      </div>

      {/* Timeline ribbon */}
      <div style={{
        maxWidth: 1100, margin: vp.isMobile ? "40px auto 0" : "60px auto 0",
        padding: vp.isMobile ? "24px 18px" : "30px 24px",
        border: "1px solid rgba(201,166,97,.18)",
        borderRadius: 2,
        display: "grid",
        gridTemplateColumns: gridCols(vp, { mobile: 1, tablet: 2, desktop: 5 }),
        gap: vp.isMobile ? 20 : 8,
        position: "relative",
      }}>
        {[
          { era: "ימי המקרא", text: "אזכורים ראשונים בספרי בראשית, שמואל ומשלי." },
          { era: "תקופת חז״ל", text: "המשנה והתלמוד עוסקים נרחב בעין הרע ובהסרתה." },
          { era: "ימי הביניים", text: "ספר חסידים, רבי יהודה החסיד ורבני ספרד מנסחים סדרים." },
          { era: "תקופת האר״י", text: "צפת של המאה ה-16. עץ החיים, שערי קדושה והקבלה המעשית." },
          { era: "ימינו", text: "גדולי המקובלים בדורנו — כולם כאחד מורים על חשיבות הסרת עין הרע, וממליצים לכל אדם לדאוג לכך באופן קבוע." },
        ].map((it, i) => (
          <div key={i} style={{ textAlign: "center", padding: "0 10px", position: "relative" }}>
            <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 17, color: "var(--gold-2)", marginBottom: 8 }}>{it.era}</div>
            <div style={{ fontSize: 12.5, opacity: .65, lineHeight: 1.55 }}>{it.text}</div>
            {i < 4 && !vp.isMobile && <div style={{
              position: "absolute", top: 12, insetInlineStart: -8, width: 16, height: 1,
              background: "var(--gold-deep)",
            }}/>}
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutTeam({ vp }) {
  const sources = [
    {
      letter: "ז",
      title: "הזוהר הקדוש",
      meta: "רשב״י · מאה 2 לספירה",
      desc: "ספר היסוד של הקבלה. סודות התורה כפי שנמסרו מרבי שמעון בר יוחאי לתלמידיו במערת פקיעין.",
    },
    {
      letter: "ע",
      title: "עץ החיים",
      meta: "האר״י הקדוש · צפת, מאה 16",
      desc: "שיטת הקבלה המודרנית. תורת הספירות, הצמצום והשמות — בה אנו משתמשים בכל סדר.",
    },
    {
      letter: "י",
      title: "ספר יצירה",
      meta: "מקורות עתיקים · מיוחס לאברהם אבינו",
      desc: "ספר היסוד לקבלה מעשית. צירופי אותיות, שמות קדושים וכוחם — הבסיס לעבודת ההסרה."
    },
    {
      letter: "ש",
      title: "שערי קדושה",
      meta: "רבי חיים ויטאל · מאה 17",
      desc: "סדרי הטהרה והשמירה. ההכנה הנפשית והגופנית של המקובל לפני כל פעולה רוחנית."
    },
  ];
  return (
    <section style={{
      padding: vp.isMobile ? "50px 18px" : "80px 32px",
      background: "rgba(201,166,97,.02)",
      borderTop: "1px solid rgba(201,166,97,.08)",
      borderBottom: "1px solid rgba(201,166,97,.08)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading
          overline="המקורות · אלפי שנים של מסורת"
          title="על מה הכל מבוסס"
          sub="לא קסם, לא הבטחות שווא — שיטות מתועדות וספרים שנכתבו לאורך הדורות, מועברים מרב לתלמיד."
        />
        <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: gridCols(vp, { mobile: 1, tablet: 2, desktop: 4 }), gap: 22 }}>
          {sources.map((s, i) => (
            <div key={i} style={{
              padding: 28,
              background: "rgba(255,255,255,.02)",
              border: "1px solid rgba(201,166,97,.18)",
              borderRadius: 2,
              position: "relative",
              minHeight: 280,
              transition: "all .25s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,166,97,.18)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {/* Big letter as decorative background */}
              <div style={{
                position: "absolute", top: 18, left: 20,
                fontFamily: "'Frank Ruhl Libre', serif",
                fontSize: 110, lineHeight: 1, color: "var(--gold)",
                opacity: .08, fontWeight: 700,
              }}>{s.letter}</div>

              <div style={{
                width: 56, height: 56, borderRadius: 2,
                border: "1px solid var(--gold)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Frank Ruhl Libre', serif", fontSize: 32, color: "var(--gold-2)",
                marginBottom: 22,
                position: "relative", zIndex: 1,
              }}>{s.letter}</div>

              <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 24, color: "var(--cream)", lineHeight: 1.15, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontFamily: "'Miriam Libre', serif", fontSize: 10, letterSpacing: ".18em", color: "var(--gold)", marginBottom: 14 }}>{s.meta}</div>
              <Divider width={40} />
              <p style={{ fontSize: 13.5, opacity: .7, lineHeight: 1.7, marginTop: 14, textWrap: "pretty" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPrinciples({ vp }) {
  const stages = [
    {
      l: "א",
      time: "תוך שעות מההזמנה",
      t: "השמות נמסרים",
      d: "השם הפרטי ושם האם עוברים ישירות לידי המקובל הראשי, בפתק כתוב יד. אף אחד נוסף לא רואה אותם.",
    },
    {
      l: "ב",
      time: "יום-יומיים",
      t: "לימוד והכנה",
      d: "המקובל יושב על הספרים — זוהר, עץ החיים, שערי קדושה — ובוחר את הסדר המדויק. צם, טובל, מתפלל.",
    },
    {
      l: "ג",
      time: "ביום שנקבע",
      t: "התפילה והתיקון",
      d: "המקובל מבצע את סדר ההסרה — צירופי שמות, ברכות וכוונות, במקום שמור ובזמן המתאים על פי המסורת.",
    },
    {
      l: "ד",
      time: "בסיום התיקון",
      t: "הברכה פועלת",
      d: "מרגע סיום הסדר, האור והשמירה פועלים על שורש הנשמה. אין צורך לעשות דבר — העבודה כבר נעשתה, והפירות מתגלים בזמנם.",
    },
  ];
  return (
    <section style={{ padding: vp.isMobile ? "50px 18px" : "80px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading
          overline="מה קורה אחרי שמזמינים"
          title="מההזמנה ועד הברכה"
          sub="ההזמנה לא מסתיימת בלחיצת כפתור. ארבעה שלבים שכל אחד מהם נעשה ביד אדם, על ספר, לפי המסורת."
        />
        <div style={{
          marginTop: 50,
          display: "grid",
          gridTemplateColumns: gridCols(vp, { mobile: 1, tablet: 2, desktop: 4 }),
          gap: 18,
        }}>
          {stages.map((s, i) => (
            <div key={i} style={{
              padding: "28px 24px", textAlign: "right",
              border: "1px solid rgba(201,166,97,.18)",
              borderRadius: 2,
              background: "rgba(255,255,255,.015)",
              position: "relative", zIndex: 1,
              minHeight: 280,
              transition: "all .25s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.background = "rgba(201,166,97,.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,166,97,.18)"; e.currentTarget.style.background = "rgba(255,255,255,.015)"; }}
            >
              <div style={{
                fontFamily: "'Miriam Libre', serif", fontSize: 10,
                letterSpacing: ".25em", color: "var(--gold)", marginBottom: 14,
              }}>שלב {i + 1} · {s.time}</div>

              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                border: "1px solid var(--gold)",
                background: "radial-gradient(circle, rgba(201,166,97,.18), transparent 70%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Frank Ruhl Libre', serif", fontSize: 36, color: "var(--gold-2)", fontWeight: 700,
                marginBottom: 18, marginInlineStart: -8,
              }}>{s.l}</div>

              <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 24, color: "var(--cream)", marginBottom: 10, lineHeight: 1.15 }}>{s.t}</div>
              <div style={{ fontSize: 13.5, opacity: .7, lineHeight: 1.7, textWrap: "pretty" }}>{s.d}</div>
            </div>
          ))}
        </div>

        {/* footnote */}
        <div style={{
          marginTop: 40, padding: "20px 28px",
          border: "1px solid rgba(201,166,97,.18)",
          borderRadius: 2,
          textAlign: "center",
          fontFamily: "'Frank Ruhl Libre', serif",
          fontSize: 18, color: "var(--cream)", opacity: .8, fontStyle: "italic",
          maxWidth: 760, marginInline: "auto",
        }}>
          ״כל מי שלומד תורה לשמה — מה שמבקש, נותנים לו״
          <div style={{ fontSize: 12, opacity: .6, marginTop: 8, fontStyle: "normal", fontFamily: "'Miriam Libre', serif", letterSpacing: ".2em" }}>פרקי אבות ו, א</div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { AboutScreen });
