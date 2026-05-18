// Main App — handles screen routing
const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  const [screen, setScreen] = useStateApp("home");
  const [selectedPkg, setSelectedPkg] = useStateApp("shmira");
  const [submittedForm, setSubmittedForm] = useStateApp(null);

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
