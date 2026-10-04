import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  ChatCircleDots,
  Check,
  DownloadSimple,
  Microphone,
  Sparkle,
  SpeakerHigh,
  Star,
  TrendUp,
  Waveform,
} from "@phosphor-icons/react";
import "@fontsource-variable/manrope";

const asset = (filename) => `${import.meta.env.BASE_URL}assets/${filename}`;

const features = [
  {
    id: "conversation",
    eyebrow: "01 · Speak",
    title: "Real-Life Conversations",
    copy: "Practice natural dialogues that build real confidence.",
    icon: ChatCircleDots,
  },
  {
    id: "pronunciation",
    eyebrow: "02 · Refine",
    title: "Pronunciation",
    copy: "Get clear feedback to speak more naturally.",
    icon: Waveform,
  },
  {
    id: "progress",
    eyebrow: "03 · Grow",
    title: "Progress",
    copy: "Follow a path that adapts to your level.",
    icon: TrendUp,
  },
  {
    id: "tutor",
    eyebrow: "04 · Connect",
    title: "AI Tutor",
    copy: "A friendly partner, ready whenever you are.",
    icon: Sparkle,
  },
];

const phoneScreens = {
  conversation: asset("phone-ai-tutor.webp"),
  pronunciation: asset("phone-pronunciation.webp"),
  progress: asset("phone-progress.webp"),
  tutor: asset("phone-ai-tutor.webp"),
};

const audioClips = {
  travel: asset("conversation-travel.wav"),
  cafe: asset("conversation-cafe.wav"),
  practico: asset("pronunciation-practico.wav"),
};

const tutors = [
  { name: "Leo", language: "English", personality: "Encouraging & clear", x: "32%", y: "43%" },
  { name: "Yuna", language: "Korean", personality: "Patient & thoughtful", x: "22%", y: "52%" },
  { name: "Sofia", language: "Spanish", personality: "Playful, lively, warm", x: "50%", y: "40%" },
  { name: "Maya", language: "French", personality: "Curious & expressive", x: "68%", y: "48%" },
  { name: "Hana", language: "Japanese", personality: "Calm & precise", x: "79%", y: "55%" },
];

function ActionButton({ className = "", children, magnetic = false, ...props }) {
  const ref = useRef(null);

  const onPointerMove = (event) => {
    if (!magnetic || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = ref.current.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width / 2) * 0.14;
    const y = (event.clientY - box.top - box.height / 2) * 0.14;
    ref.current.style.setProperty("--magnet-x", `${x}px`);
    ref.current.style.setProperty("--magnet-y", `${y}px`);
  };

  const onPointerLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--magnet-x", "0px");
    ref.current.style.setProperty("--magnet-y", "0px");
  };

  return (
    <a
      ref={ref}
      className={`action-button ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...props}
    >
      {children}
    </a>
  );
}

function FeatureCard({ feature, index, onSelect }) {
  const Icon = feature.icon;
  return (
    <button
      className={`feature-card feature-card-${index + 1}`}
      type="button"
      onClick={() => onSelect(feature.id)}
      aria-label={`Explore ${feature.title}`}
    >
      <span className="feature-icon" aria-hidden="true"><Icon weight="duotone" /></span>
      <span className="feature-eyebrow">{feature.eyebrow}</span>
      <strong>{feature.title}</strong>
      <span>{feature.copy}</span>
      <ArrowRight className="feature-arrow" weight="bold" aria-hidden="true" />
    </button>
  );
}

function StoryPhone({ active }) {
  return (
    <div className={`story-phone story-phone-${active}`} aria-live="polite">
      {Object.entries(phoneScreens).map(([id, src]) => (
        <img
          key={id}
          className={`story-phone-screen ${active === id ? "is-active" : ""}`}
          src={src}
          alt={active === id ? `${features.find((feature) => feature.id === id)?.title} screen in LinguaStar` : ""}
          aria-hidden={active !== id}
        />
      ))}
    </div>
  );
}

function AdaptiveTutorField({ mobile = false }) {
  return (
    <div className={`adaptive-tutor-field ${mobile ? "is-mobile" : ""}`} aria-hidden="true">
      <div className="ai-signal-core">
        <Waveform weight="duotone" />
        <span>Live response</span>
      </div>

      <div className="ai-adaptive-card ai-card-listen">
        <span className="ai-card-icon"><Microphone weight="duotone" /></span>
        <small>Listening for</small>
        <strong>Your pace + confidence</strong>
        <em>Signal understood</em>
      </div>

      <div className="ai-adaptive-card ai-card-reply">
        <span className="ai-card-icon"><ChatCircleDots weight="duotone" /></span>
        <small>Next reply</small>
        <strong>¡Vamos paso a paso!</strong>
        <em>Matched to your level</em>
      </div>

      <div className="ai-adaptive-card ai-card-tone">
        <span className="ai-card-icon"><Sparkle weight="fill" /></span>
        <small>Tutor mode</small>
        <strong>Warm · patient · playful</strong>
      </div>

      <span className="ai-language-chip ai-chip-language">ES ↔ EN</span>
      <span className="ai-language-chip ai-chip-level">A2 · travel</span>
      <span className="ai-language-chip ai-chip-support">Ready when you are</span>

      <div className="ai-star-cluster">
        <img src={asset("star-spark.webp")} alt="" />
        <img src={asset("star-spark.webp")} alt="" />
        <img src={asset("star-spark.webp")} alt="" />
      </div>

      <div className="ai-editorial-mantra">
        <span>LISTEN</span>
        <span>ADAPT</span>
        <span>RESPOND</span>
      </div>
    </div>
  );
}

function App() {
  const heroRef = useRef(null);
  const audioRef = useRef(null);
  const [activeStory, setActiveStory] = useState("conversation");
  const [selectedTutor, setSelectedTutor] = useState(2);
  const [speakingKey, setSpeakingKey] = useState(null);

  useEffect(() => () => audioRef.current?.pause(), []);

  const speak = (key) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.src = audioClips[key];
    setSpeakingKey(key);
    audio.play().catch(() => setSpeakingKey(null));
  };

  useEffect(() => {
    const markers = [...document.querySelectorAll("[data-story-marker]")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveStory(visible.target.dataset.storyMarker);
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    markers.forEach((marker) => observer.observe(marker));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const updateScrollArt = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--page-progress", max > 0 ? window.scrollY / max : 0);

      const hero = heroRef.current;
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const progress = clamp(-rect.top / Math.max(rect.height - window.innerHeight, 1));
        hero.style.setProperty("--hero-copy-y", `${progress * -118}px`);
        hero.style.setProperty("--hero-phone-y", `${progress * 230}px`);
        hero.style.setProperty("--hero-phone-turn", `${-6 + progress * 13}deg`);
        hero.style.setProperty("--hero-object-drift", `${progress * -86}px`);
        hero.style.setProperty("--hero-fade", `${1 - clamp(progress * 1.45)}`);
      }

      const featureSection = document.querySelector(".feature-transition");
      if (featureSection) {
        const rect = featureSection.getBoundingClientRect();
        const progress = clamp(-rect.top / Math.max(rect.height - window.innerHeight, 1));
        featureSection.style.setProperty("--feature-title-x", `${progress * -9}vw`);
        featureSection.style.setProperty("--feature-title-y", `${progress * -12}vh`);
        const paths = [
          [-59, -28, -3],
          [-42, -16, -1],
          [-25, -3, 2],
          [-8, 11, 4],
        ];
        featureSection.querySelectorAll(".feature-card").forEach((card, index) => {
          const [x, y, turn] = paths[index];
          card.style.setProperty("--card-x", `${progress * x}vw`);
          card.style.setProperty("--card-y", `${progress * y}vh`);
          card.style.setProperty("--card-turn", `${progress * turn}deg`);
        });
      }

      const tutorSection = document.querySelector(".avatar-parade");
      if (tutorSection) {
        const rect = tutorSection.getBoundingClientRect();
        const enter = clamp((window.innerHeight - rect.top) / Math.max(window.innerHeight * 0.9, 1));
        tutorSection.style.setProperty("--tutor-stage-y", `${(1 - enter) * 190}px`);
        tutorSection.style.setProperty("--tutor-stage-turn", `${(1 - enter) * 5 - 1.4}deg`);
        tutorSection.style.setProperty("--tutor-heading-x", `${(1 - enter) * -120}px`);
        tutorSection.style.setProperty("--tutor-reveal", `${enter}`);
        tutorSection.style.setProperty("--tutor-marquee-x", `${-18 + enter * 12}%`);
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollArt);
    };
    updateScrollArt();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const handleHeroPointer = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = heroRef.current.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    heroRef.current.style.setProperty("--pointer-x", x.toFixed(3));
    heroRef.current.style.setProperty("--pointer-y", y.toFixed(3));
  };

  const resetHeroPointer = () => {
    heroRef.current?.style.setProperty("--pointer-x", 0);
    heroRef.current?.style.setProperty("--pointer-y", 0);
  };

  const goToStory = (id) => {
    document.querySelector(`[data-story-marker="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const tutor = tutors[selectedTutor];
  const activeStoryNumber = String(features.findIndex((feature) => feature.id === activeStory) + 1).padStart(2, "0");

  return (
    <main className="site-shell">
      <div className="scroll-progress" aria-hidden="true" />
      <audio ref={audioRef} preload="none" hidden aria-hidden="true" onEnded={() => setSpeakingKey(null)} onError={() => setSpeakingKey(null)} />

      <header className="site-header">
        <a href="#top" className="brand" aria-label="LinguaStar home">
          <img src={asset("linguastar-logo.webp")} alt="LinguaStar" />
        </a>
        <nav aria-label="Primary navigation">
          <a href="#experience">Experience</a>
          <a href="#tutors">Tutors</a>
        </nav>
        <ActionButton className="header-download" href="https://linguastar.ai/2/" target="_blank" rel="noreferrer">
          <DownloadSimple weight="bold" aria-hidden="true" /> Download
        </ActionButton>
      </header>

      <section
        className="hero"
        id="top"
        ref={heroRef}
        onPointerMove={handleHeroPointer}
        onPointerLeave={resetHeroPointer}
      >
        <div className="hero-copy">
          <p className="kicker"><Sparkle weight="fill" /> Your language learning partner</p>
          <h1>
            <span>Discover a</span>
            <span>new way to</span>
            <span>master speaking</span>
            <span>confidently</span>
          </h1>
        </div>

        <div className="hero-editorial-rail" aria-hidden="true">
          <span>LinguaStar · Speaking practice reimagined</span>
          <strong>01 / 05</strong>
        </div>

        <img className="hero-phone" src={asset("phone-ai-tutor.webp")} alt="LinguaStar AI conversation on a phone" />

        <div className="hero-bubble hero-bubble-left" aria-hidden="true">
          <span>Hola, ¿qué tal?</span>
          <small>What would you like to talk about today?</small>
        </div>
        <div className="hero-score" aria-hidden="true"><strong>90%</strong><Waveform weight="bold" /></div>
        <div className="hero-progress-card" aria-hidden="true">
          <span>B1</span>
          <strong>You’re making stellar progress</strong>
          <div><BookOpen weight="duotone" /><ChatCircleDots weight="duotone" /><Star weight="duotone" /></div>
        </div>
        <img className="hero-star hero-star-one" src={asset("star-spark.webp")} alt="" />
        <img className="hero-star hero-star-two" src={asset("star-spark.webp")} alt="" />

        <div className="hero-actions">
          <ActionButton magnetic href="https://linguastar.ai/2/" target="_blank" rel="noreferrer">
            <DownloadSimple weight="bold" aria-hidden="true" /> Download LinguaStar
          </ActionButton>
          <button className="watch-story" type="button" onClick={() => goToStory("conversation")}>
            <span><ArrowDown weight="bold" /></span> See how it works
          </button>
        </div>
      </section>

      <section className="feature-transition" id="experience" aria-labelledby="feature-title">
        <div className="feature-stage">
          <div className="transition-intro">
            <p className="kicker">Built for real speaking</p>
            <h2 id="feature-title"><span>One learning</span><span>journey.</span><span>Four moments.</span></h2>
          </div>
          <div className="feature-counter" aria-hidden="true"><span>01</span><i /><span>04</span></div>
          <div className="feature-deck">
            {features.map((feature, index) => (
              <FeatureCard feature={feature} index={index} key={feature.id} onSelect={goToStory} />
            ))}
          </div>
        </div>
      </section>

      <section className="story" aria-label="LinguaStar product story">
        <div className="story-sticky" data-active-story={activeStory}>
          <div className="story-scene story-scene-conversation" aria-hidden={activeStory !== "conversation"}>
            <div className="story-label story-label-left">
              <span>01</span>
              <h2>Real-Life<br />Conversations</h2>
              <p>Practice speaking freely, ask anything, and improve at your own pace.</p>
            </div>
            <button className={`dialogue dialogue-left sound-trigger ${speakingKey === "travel" ? "is-playing" : ""}`} type="button" onClick={() => speak("travel")} disabled={activeStory !== "conversation"} aria-label="Hear the travel plans phrase in Spanish"><small>Travel plans <SpeakerHigh weight="duotone" /></small>¿Qué planes tienes para el fin de semana?</button>
            <button className={`dialogue dialogue-right sound-trigger ${speakingKey === "cafe" ? "is-playing" : ""}`} type="button" onClick={() => speak("cafe")} disabled={activeStory !== "conversation"} aria-label="Hear the café phrase in Spanish"><small>At a café <SpeakerHigh weight="duotone" /></small>Me gustaría un café con leche, por favor.</button>
          </div>

          <div className="story-scene story-scene-pronunciation" aria-hidden={activeStory !== "pronunciation"}>
            <div className="story-label story-label-left">
              <span>02</span>
              <h2>Pronunciation<br />that feels natural</h2>
              <p>See, hear, and fix each sound with clear feedback.</p>
            </div>
            <div className="pronunciation-word" aria-hidden="true">CONFIDENTLY</div>
            <div className="pronunciation-score"><strong>90%</strong><span>Great clarity</span></div>
            <button className={`sound-tip sound-trigger ${speakingKey === "practico" ? "is-playing" : ""}`} type="button" onClick={() => speak("practico")} disabled={activeStory !== "pronunciation"} aria-label="Hear Practico pronounced in Spanish"><SpeakerHigh weight="duotone" /><span>Practico</span><small>/pɾakˈtiko/</small></button>
          </div>

          <div className="story-scene story-scene-progress" aria-hidden={activeStory !== "progress"}>
            <div className="story-label story-label-left">
              <span>03</span>
              <h2>Progress<br />that motivates</h2>
              <p>Lessons guide you forward, one meaningful step at a time.</p>
            </div>
            <div className="milestone milestone-a1">A1 <Check weight="bold" /></div>
            <div className="milestone milestone-a2">A2 <Check weight="bold" /></div>
            <div className="milestone milestone-b1">B1 <Star weight="fill" /></div>
            <div className="milestone milestone-b2">B2 <span>Next</span></div>
          </div>

          <div className="story-scene story-scene-tutor" aria-hidden={activeStory !== "tutor"}>
            <div className="story-label story-label-left">
              <span>04</span>
              <h2>An AI Tutor<br />that gets you</h2>
              <p>It listens for how you learn, then reshapes the conversation around you.</p>
            </div>
            <AdaptiveTutorField />
          </div>

          <StoryPhone active={activeStory} />
          <div className="story-running-index" aria-hidden="true">
            <strong>{activeStoryNumber}</strong><span>/ 04</span>
          </div>
          <div className="story-state-indicator" aria-label={`Showing ${features.find((item) => item.id === activeStory)?.title}`}>
            {features.map((feature) => (
              <button
                key={feature.id}
                type="button"
                className={activeStory === feature.id ? "is-active" : ""}
                onClick={() => goToStory(feature.id)}
                aria-label={`Go to ${feature.title}`}
              />
            ))}
          </div>
        </div>

        {features.map((feature) => (
          <div className="story-marker" data-story-marker={feature.id} key={feature.id} aria-hidden="true">
            {feature.id === "tutor" && <AdaptiveTutorField mobile />}
          </div>
        ))}
      </section>

      <section className="avatar-parade" id="tutors" aria-labelledby="tutor-heading">
        <div className="avatar-heading">
          <p className="kicker">Choose your connection</p>
          <h2 id="tutor-heading">Meet a tutor who<br />speaks your language.</h2>
          <p>Hover or tap a tutor to meet them.</p>
        </div>
        <div className="avatar-stage">
          <img src={asset("tutor-parade.png")} alt="A diverse group of friendly LinguaStar AI tutors" />
          {tutors.map((item, index) => (
            <button
              key={item.name}
              className={`tutor-hotspot ${selectedTutor === index ? "is-selected" : ""}`}
              style={{ "--hotspot-x": item.x, "--hotspot-y": item.y }}
              type="button"
              onPointerEnter={() => setSelectedTutor(index)}
              onFocus={() => setSelectedTutor(index)}
              onClick={() => setSelectedTutor(index)}
              aria-label={`Meet ${item.name}, ${item.language} tutor`}
            />
          ))}
          <div className="tutor-profile" key={tutor.name}>
            <span className="online-dot" />
            <div>
              <strong>{tutor.name}</strong>
              <span>{tutor.language} tutor</span>
            </div>
            <p>“Hi! I’m {tutor.name}. Ready to practice?”</p>
            <small>{tutor.personality}</small>
          </div>
        </div>
        <div className="tutor-marquee" aria-hidden="true">
          LEO · YUNA · SOFIA · MAYA · HANA · LEO · YUNA · SOFIA · MAYA · HANA
        </div>
      </section>

      <section className="final-cta" aria-labelledby="cta-heading">
        <img src={asset("app-icon.webp")} alt="" className="cta-icon" />
        <p className="kicker">Stop memorizing. Start speaking.</p>
        <h2 id="cta-heading">Start speaking<br />confidently.</h2>
        <p>Every conversation brings you closer to fluency.</p>
        <ActionButton magnetic href="https://linguastar.ai/2/" target="_blank" rel="noreferrer">
          <DownloadSimple weight="bold" aria-hidden="true" /> Download LinguaStar
        </ActionButton>
      </section>

      <footer>
        <img src={asset("linguastar-logo.webp")} alt="LinguaStar" />
        <p>Discover a new way to master speaking confidently.</p>
        <div>
          <a href="https://linguastar.ai/privacypolicy/" target="_blank" rel="noreferrer">Privacy</a>
          <a href="https://linguastar.ai/termsandconditions/" target="_blank" rel="noreferrer">Terms</a>
        </div>
      </footer>
    </main>
  );
}

export { App };
