// Main App — handles screen routing
const { useState: useStateApp, useEffect: useEffectApp } = React;

// Payment callback page shown inside the popup after Nedarim Plus redirects back
function PaymentSuccessPage() {
  useEffectApp(() => {
    try { window.opener.postMessage({ nedarimPaid: true }, '*'); } catch(e) {}
    setTimeout(() => { try { window.close(); } catch(e) {} }, 1500);
  }, []);
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0c0d1d', color: '#f4ecd8', textAlign: 'center', padding: 32,
      fontFamily: "'Frank Ruhl Libre', serif",
    }}>
      <div style={{ fontSize: 72, color: '#c9a661', marginBottom: 20 }}>✓</div>
      <h1 style={{ fontSize: 32, marginBottom: 12, color: '#c9a661', fontWeight: 400 }}>התשלום בוצע בהצלחה!</h1>
      <p style={{ opacity: 0.65, fontSize: 16 }}>חלון זה ייסגר אוטומטית...</p>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useStateApp("home");
  const [selectedPkg, setSelectedPkg] = useStateApp("shmira");
  const [submittedForm, setSubmittedForm] = useStateApp(null);

  // If this window is the payment popup returning from Nedarim Plus, show success page
  const params = new URLSearchParams(window.location.search);
  if (params.get('paid') === '1' && window.opener) {
    return <PaymentSuccessPage />;
  }

  useEffectApp(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.track) window.track('pageview', { screen });
    if (window.heartbeat) window.heartbeat(screen);
  }, [screen]);

  const onNav = (s) => setScreen(s);
  const goToBooking = (pkgId) => {
    setSelectedPkg(pkgId);
    setScreen("booking");
  };
  const onConfirm = (form) => {
    if (window.submitBooking) window.submitBooking(form);
    setSubmittedForm(form);
    setScreen("confirmation");
  };

  let content;
  if (screen === "home") content = <HomeScreen onNav={onNav} />;
  else if (screen === "about") content = <AboutScreen onNav={onNav} />;
  else if (screen === "quiz") content = <QuizScreen onNav={onNav} />;
  else if (screen === "packages") content = <PackagesScreen onNav={onNav} onSelect={goToBooking} />;
  else if (screen === "booking") content = <BookingScreen selectedPkgId={selectedPkg} onNav={onNav} onConfirm={onConfirm} />;
  else if (screen === "confirmation") content = <ConfirmationScreen form={submittedForm || {}} onNav={onNav} />;

  return (
    <PageShell screenLabel={screen}>
      <NavBar screen={screen} onNav={onNav} />
      <div key={screen} className="fade-in">
        {content}
      </div>
      <Footer onNav={onNav} />
    </PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
