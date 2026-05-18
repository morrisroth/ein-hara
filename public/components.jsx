// Shared components, decorative SVGs, and helpers
// All scoped to globals via Object.assign(window,...) at the bottom.

const { useState, useEffect, useRef, useMemo, useLayoutEffect } = React;

// Viewport hook — exposed globally for all components to use
function useViewport() {
  const [vp, setVp] = useState(() => {
    if (typeof window === "undefined") return { width: 1280, isMobile: false, isTablet: false, isDesktop: true };
    const w = window.innerWidth;
    return { width: w, isMobile: w < 720, isTablet: w >= 720 && w < 1024, isDesktop: w >= 1024 };
  });
  useEffect(() => {
    let raf = 0;
    const handle = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = window.innerWidth;
        setVp({ width: w, isMobile: w < 720, isTablet: w >= 720 && w < 1024, isDesktop: w >= 1024 });
      });
    };
    window.addEventListener("resize", handle);
    return () => { window.removeEventListener("resize", handle); cancelAnimationFrame(raf); };
  }, []);
  return vp;
}

function gridCols(vp, cols = {}) {
  const { mobile = 1, tablet = 2, desktop = 3 } = cols;
  const n = vp.isMobile ? mobile : vp.isTablet ? tablet : desktop;
  return `repeat(${n}, minmax(0, 1fr))`;
}

// ----- Decorative SVG marks -----

function EyeMark({ size = 120, animate = true, color = "var(--gold)" }) {
  const rays = Array.from({ length: 24 });
  return (
    <svg width={size} height={size} viewBox="-60 -60 120 120" style={{ display: "block" }}>
      <g style={animate ? { animation: "spinSlow 60s linear infinite", transformOrigin: "0 0" } : {}}>
        {rays.map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const x1 = Math.cos(a) * 44;
          const y1 = Math.sin(a) * 44;
          const x2 = Math.cos(a) * (i % 2 === 0 ? 54 : 50);
          const y2 = Math.sin(a) * (i % 2 === 0 ? 54 : 50);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth=".7" opacity=".7" />;
        })}
      </g>
      <circle r="42" fill="none" stroke={color} strokeWidth=".8" opacity=".5" />
      <circle r="34" fill="none" stroke={color} strokeWidth=".6" opacity=".35" />
      <ellipse rx="32" ry="18" fill="none" stroke={color} strokeWidth="1.4" />
      <circle r="14" fill={color} opacity=".18" />
      <circle r="10" fill="none" stroke={color} strokeWidth="1.2" />
      <circle r="4" fill={color} />
      <circle cx="-1.5" cy="-1.5" r="1.2" fill="var(--cream)" />
    </svg>
  );
}

function StarShield({ size = 60, color = "var(--gold)" }) {
  return (
    <svg width={size} height={size} viewBox="-30 -30 60 60">
      <polygon points="0,-26 22.5,13 -22.5,13" fill="none" stroke={color} strokeWidth="1.2" />
      <polygon points="0,26 22.5,-13 -22.5,-13" fill="none" stroke={color} strokeWidth="1.2" />
      <circle r="5" fill="none" stroke={color} strokeWidth=".8" />
    </svg>
  );
}

function TreeOfLife({ size = 160, color = "var(--gold)" }) {
  const nodes = [
    [0, -60],[−22, -38],[22, -38],[−26, -10],[26, -10],[0, 0],
    [−22, 22],[22, 22],[0, 38],[0, 60],
  ];
  const edges = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],[1,5],[2,5],
    [5,6],[5,7],[6,7],[3,6],[4,7],[6,8],[7,8],[5,8],[8,9],[6,9],[7,9]
  ];
  return (
    <svg width={size} height={size} viewBox="-70 -70 140 140">
      {edges.map((e,i)=>(
        <line key={i} x1={nodes[e[0]][0]} y1={nodes[e[0]][1]} x2={nodes[e[1]][0]} y2={nodes[e[1]][1]} stroke={color} strokeWidth=".6" opacity=".4"/>
      ))}
      {nodes.map((n,i)=>(
        <g key={i}>
          <circle cx={n[0]} cy={n[1]} r="6" fill="var(--ink)" stroke={color} strokeWidth="1"/>
          <circle cx={n[0]} cy={n[1]} r="2" fill={color} opacity=".6"/>
        </g>
      ))}
    </svg>
  );
}

function FloatingLetters({ letters = ["א","ה","ש","ם","י","ב","ק","ן"], count = 14 }) {
  const items = useMemo(() => {
    const arr = [];
    let seed = 7;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < count; i++) {
      arr.push({
        letter: letters[i % letters.length],
        x: rand() * 100, y: rand() * 100,
        size: 40 + rand() * 80,
        opacity: 0.04 + rand() * 0.06,
        rot: (rand() - 0.5) * 20,
        delay: rand() * 6,
      });
    }
    return arr;
  }, [count]);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {items.map((it, i) => (
        <div key={i} style={{
          position: "absolute", left: `${it.x}%`, top: `${it.y}%`,
          fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 900,
          color: "var(--gold)", opacity: it.opacity, fontSize: `${it.size}px`,
          transform: `rotate(${it.rot}deg)`,
          animation: `drift 9s ease-in-out ${it.delay}s infinite`,
          userSelect: "none",
        }}>{it.letter}</div>
      ))}
    </div>
  );
}

function Divider({ width = 200 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", width }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, var(--gold-deep), transparent)" }} />
      <svg width="10" height="10" viewBox="-5 -5 10 10"><polygon points="0,-4 4,0 0,4 -4,0" fill="var(--gold)" /></svg>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, var(--gold-deep), transparent)" }} />
    </div>
  );
}

function GoldButton({ children, onClick, variant = "solid", size = "md", style = {}, ...rest }) {
  const base = {
    fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 500, letterSpacing: ".02em",
    borderRadius: 2, transition: "all .2s ease",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
  };
  const sizes = {
    sm: { padding: "8px 18px", fontSize: 15 },
    md: { padding: "14px 28px", fontSize: 17 },
    lg: { padding: "18px 38px", fontSize: 20 },
  };
  const variants = {
    solid: {
      background: "linear-gradient(180deg, var(--gold-2), var(--gold))",
      color: "var(--ink)", border: "1px solid var(--gold-deep)",
      boxShadow: "0 1px 0 rgba(255,255,255,.3) inset, 0 8px 24px -8px rgba(201,166,97,.5)",
    },
    ghost: { background: "transparent", color: "var(--gold-2)", border: "1px solid var(--gold-deep)" },
    wine: {
      background: "linear-gradient(180deg, #a8324f, var(--wine))",
      color: "var(--cream)", border: "1px solid #5b1227",
    },
  };

  const handleClick = (e) => {
    if (window.track && children) {
      const label = typeof children === 'string' ? children : (children[0] || '');
      window.track('click', { element: String(label).trim().slice(0, 60) });
    }
    if (onClick) onClick(e);
  };

  return (
    <button onClick={handleClick} {...rest}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
      {children}
    </button>
  );
}

function PageShell({ children, screenLabel }) {
  return (
    <div data-screen-label={screenLabel} style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% -20%, #1d2042 0%, var(--ink) 60%)",
      position: "relative",
    }}>
      {children}
    </div>
  );
}

function NavBar({ screen, onNav }) {
  const vp = useViewport();
  const [menuOpen, setMenuOpen] = useState(false);
  const items = [
    { id: "home", label: "בית" },
    { id: "about", label: "על השירות" },
    { id: "quiz", label: "אבחון" },
    { id: "packages", label: "חבילות" },
  ];

  const handleNav = (id) => { setMenuOpen(false); onNav(id); };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(14px)",
      background: "rgba(12,13,29,.85)",
      borderBottom: "1px solid rgba(201,166,97,.18)",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: vp.isMobile ? "12px 18px" : "14px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <button onClick={() => handleNav("home")} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <EyeMark size={vp.isMobile ? 30 : 36} animate={true} />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: vp.isMobile ? 17 : 20, fontWeight: 700, color: "var(--cream)", lineHeight: 1 }}>בית עין</div>
            <div style={{ fontFamily: "'Miriam Libre', serif", fontSize: vp.isMobile ? 8.5 : 10, color: "var(--gold)", letterSpacing: ".24em", marginTop: 4 }}>הסרה · שמירה · ברכה</div>
          </div>
        </button>
        {vp.isMobile ? (
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="תפריט" style={{
            width: 40, height: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
            border: "1px solid var(--gold-deep)", borderRadius: 2,
          }}>
            <span style={{ width: 18, height: 1.5, background: "var(--gold-2)", transition: "transform .3s", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <span style={{ width: 18, height: 1.5, background: "var(--gold-2)", transition: "opacity .2s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 18, height: 1.5, background: "var(--gold-2)", transition: "transform .3s", transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {items.map((it) => (
              <button key={it.id} onClick={() => handleNav(it.id)}
                style={{
                  padding: "8px 16px", fontFamily: "'Frank Ruhl Libre', serif", fontSize: 16,
                  color: screen === it.id ? "var(--gold-2)" : "var(--cream)",
                  opacity: screen === it.id ? 1 : .75, position: "relative",
                }}>
                {it.label}
                {screen === it.id && <div style={{
                  position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)",
                  width: 4, height: 4, borderRadius: "50%", background: "var(--gold)",
                }} />}
              </button>
            ))}
            <GoldButton size="sm" onClick={() => handleNav("packages")} style={{ marginRight: 8 }}>
              הזמנת חבילה
            </GoldButton>
          </div>
        )}
      </div>

      {vp.isMobile && menuOpen && (
        <div style={{
          borderTop: "1px solid rgba(201,166,97,.18)", background: "rgba(12,13,29,.96)",
          padding: "18px 18px 24px", display: "flex", flexDirection: "column", gap: 4,
        }}>
          {items.map((it) => (
            <button key={it.id} onClick={() => handleNav(it.id)}
              style={{
                padding: "16px 18px", fontFamily: "'Frank Ruhl Libre', serif", fontSize: 20, textAlign: "right",
                color: screen === it.id ? "var(--gold-2)" : "var(--cream)",
                background: screen === it.id ? "rgba(201,166,97,.08)" : "transparent",
                border: "1px solid", borderColor: screen === it.id ? "var(--gold-deep)" : "transparent", borderRadius: 2,
              }}>
              {it.label}
            </button>
          ))}
          <div style={{ marginTop: 14 }}>
            <GoldButton onClick={() => handleNav("packages")} style={{ width: "100%" }}>הזמנת חבילה</GoldButton>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer({ onNav }) {
  const vp = useViewport();
  return (
    <footer style={{
      borderTop: "1px solid rgba(201,166,97,.18)", marginTop: 80,
      padding: vp.isMobile ? "50px 22px 30px" : "60px 32px 40px",
      background: "var(--ink-2)", position: "relative",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: vp.isMobile ? "1fr" : vp.isTablet ? "1fr 1fr" : "1.8fr 1fr 1fr",
        gap: vp.isMobile ? 32 : 40,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <EyeMark size={42} />
            <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 24, color: "var(--cream)" }}>בית עין</div>
          </div>
          <p style={{ color: "var(--cream)", opacity: .65, fontSize: 14, maxWidth: 360, lineHeight: 1.7 }}>
            סודות הקבלה, בידי גדולי המקובלים. הסרת עין הרע, פתיחת שערים ושמירה רוחנית — מהבית, ללא יציאה מהדלת.
          </p>
        </div>
        <FooterCol title="ניווט" items={[
          ["בית", () => onNav("home")],
          ["על השירות", () => onNav("about")],
          ["אבחון", () => onNav("quiz")],
          ["חבילות", () => onNav("packages")],
        ]}/>
        <FooterCol title="מידע" items={[
          ["שאלות נפוצות", () => {}],
          ["המלצות", () => {}],
          ["תנאי שימוש", () => {}],
          ["מדיניות פרטיות", () => {}],
        ]}/>
      </div>
      <div style={{
        maxWidth: 1280, margin: "40px auto 0", paddingTop: 24,
        borderTop: "1px solid rgba(201,166,97,.1)",
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
        color: "var(--cream)", opacity: .4, fontSize: 12,
      }}>
        <div>© תשפ״ו / 2026 בית עין. כל הזכויות שמורות.</div>
        <div style={{ fontFamily: "'Miriam Libre', serif", letterSpacing: ".2em" }}>בס״ד</div>
      </div>
    </footer>
  );
}
function FooterCol({ title, items }) {
  return (
    <div>
      <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: 17, color: "var(--gold-2)", marginBottom: 14 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map(([label, fn], i) => (
          <button key={i} onClick={fn} style={{ textAlign: "right", color: "var(--cream)", opacity: .7, fontSize: 14 }}>{label}</button>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({ overline, title, sub, align = "center", invert = false }) {
  return (
    <div style={{ textAlign: align, color: invert ? "var(--ink)" : "var(--cream)" }}>
      {overline && <div style={{
        fontFamily: "'Miriam Libre', serif", fontSize: 11, letterSpacing: ".3em",
        color: invert ? "var(--wine)" : "var(--gold)", marginBottom: 14,
      }}>{overline}</div>}
      <h2 style={{
        fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 500,
        fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: 1.1, textWrap: "balance",
        marginBottom: sub ? 18 : 0,
      }}>{title}</h2>
      {sub && <p style={{
        fontSize: 17, opacity: .7, maxWidth: 640, margin: align === "center" ? "0 auto" : "0",
        textWrap: "pretty", lineHeight: 1.7,
      }}>{sub}</p>}
    </div>
  );
}

Object.assign(window, {
  EyeMark, StarShield, TreeOfLife, FloatingLetters, Divider, GoldButton,
  PageShell, NavBar, Footer, SectionHeading,
  useViewport, gridCols,
});
