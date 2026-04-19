import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { bulletPoints, img } from "./assets.js";
import { CursorGlow } from "./CursorGlow.jsx";
import { IconEmail, IconGithub, IconLinkedin, IconResume } from "./SocialNavIcons.jsx";
import { DESIGN_H, DESIGN_W, useViewportScale } from "./useViewportScale.js";

const DEVPOST_PORTFOLIO_URL =
  "https://devpost.com/asarrafz?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav";

const COOP_LINK_BME =
  "https://uwaterloo.ca/biomedical-engineering/news/bme-student-named-engineerings-2025-co-op-student-year";
const COOP_LINK_RESEARCH =
  "https://uwaterloo.ca/co-operative-education/blog/research-driven-solutions";
const COOP_LINK_ENGINEERING =
  "https://uwaterloo.ca/engineering/news/biomedical-engineering-student-earns-top-co-op-honour";
const COOP_LINK_VIDEO = "https://www.youtube.com/watch?v=VItdp3Ayr1Y";

const FIGMA_DESIGN_FILE_URL =
  "https://www.figma.com/design/pVmwPzL6tI1ZWcKQiLZ56K/AidenSarrafzadeh.com?node-id=0-1&t=G5ItTf6uNyf54wLL-1";

const MOBILE_WARNING_MQ = "(max-width: 896px)";
const MOBILE_WARNING_DISMISS_KEY = "personal-site-mobile-banner-dismiss";

const HOVER_PHOTO_TO_BULLET = {
  waterloo: 0,
  sickkids: 1,
  coop: 2,
  cfes: 3,
  asme: 4,
  cxc: 5,
  wsp: 6,
  womens: 6,
  basketballRight: 7,
  greece: 8,
  physio: 9,
};

export default function App() {
  const scale = useViewportScale();
  const heroSectionRef = useRef(null);
  const detailsSectionRef = useRef(null);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeBulletIndex, setActiveBulletIndex] = useState(0);
  const [selectedDetailKey, setSelectedDetailKey] = useState("waterloo");
  /** Which photo tile the pointer is currently over (transient). */
  const [hoverFocusKey, setHoverFocusKey] = useState(null);
  /** Last photo tile "selected" by hover — persists until a different tile is hovered. */
  const [stickyPhotoKey, setStickyPhotoKey] = useState(null);
  const wheelLatchedRef = useRef(false);
  const wheelReadyForNewInputRef = useRef(true);
  const wheelLastAbsDeltaRef = useRef(0);
  /** Row index in highlightByBullet / bulletGradients; slot 2 is unused (removed WAT.ai). */
  const bulletToHighlightRow = (bulletIdx) =>
    bulletIdx < 2 ? bulletIdx : bulletIdx + 1;
  const highlightByBullet = [
    ["waterloo"],
    ["sickkids"],
    [],
    ["coop"],
    ["cfes"],
    ["asme"],
    ["cxc"],
    ["wsp", "womens"],
    ["basketballRight"],
    ["greece"],
    ["physio"],
  ];
  const bulletGradients = [
    ["#ffffff", "#9dd6ff", "#9af4ff", "#b6a2ff"],
    ["#ffffff", "#7fd8ff", "#6bf0d2", "#8aa4ff"],
    ["#ffffff", "#8fc2ff", "#78a3ff", "#9e8cff"],
    ["#ffffff", "#95d3ff", "#7eb8ff", "#8f96ff"],
    ["#ffffff", "#d7a6ff", "#a3b4ff", "#96f0ff"],
    ["#ffffff", "#ffb8d6", "#c6b1ff", "#8dc2ff"],
    ["#ffffff", "#ffc189", "#ff9ec2", "#9cc2ff"],
    ["#ffffff", "#8be4ff", "#98cfff", "#afb0ff"],
    ["#ffffff", "#86eab7", "#87d9ff", "#b7c0ff"],
    ["#ffffff", "#ffd997", "#a8c9ff", "#87f0ff"],
    ["#ffffff", "#9be5c0", "#9fd8ff", "#b8b8ff"],
  ];
  const baseBulletIndex = hasStarted ? activeBulletIndex : null;
  const isBirthdayActive = hoverFocusKey === "birthday";
  const displayBulletIndex = (() => {
    const transient = hoverFocusKey;
    if (transient === "birthday") return null;
    if (transient != null) {
      return HOVER_PHOTO_TO_BULLET[transient] ?? baseBulletIndex;
    }
    if (stickyPhotoKey != null) {
      return HOVER_PHOTO_TO_BULLET[stickyPhotoKey] ?? baseBulletIndex;
    }
    return baseBulletIndex;
  })();
  const activeHighlights = new Set(
    displayBulletIndex == null
      ? []
      : (highlightByBullet[bulletToHighlightRow(displayBulletIndex)] ?? []),
  );
  const isHighlighted = (key) => activeHighlights.has(key);
  const activeGradientRow =
    displayBulletIndex == null
      ? hasStarted
        ? bulletToHighlightRow(activeBulletIndex)
        : 0
      : bulletToHighlightRow(displayBulletIndex);
  const activeGradient = bulletGradients[activeGradientRow] ?? bulletGradients[0];
  const showIntroHint =
    !hasStarted && hoverFocusKey == null && stickyPhotoKey == null;
  const detailCopyByKey = {
    waterloo: {
      title: "Biomedical Engineering @ Waterloo",
      body: "Coursework, design projects, and systems-level problem solving that shaped my engineering foundation.",
    },
    sickkids: {
      title: "Machine Learning Research @ SickKids",
      body: "Research-focused work applying ML methods to clinically relevant questions in pediatric healthcare.",
    },
    cfes: {
      title: "CFES Corporate Relations",
      body: "Built partnerships and coordinated initiatives connecting students with external organizations.",
    },
    coop: {
      title: "Co-Op Recognition",
      body: "Work and impact recognized through Waterloo Engineering Co-Op Student of the Year.",
    },
    asme: {
      title: "Publishing + Conference Work",
      body: "Technical communication through authored work and conference presentations.",
    },
    cxc: {
      title: "Hackathon / Innovation Projects",
      body: "Fast-moving build cycles, problem framing, and shipping working prototypes under time constraints.",
    },
    wsp: {
      title: "Internship @ WSP",
      body: "Hands-on engineering internship experience across real-world projects and collaborative teams.",
    },
    womens: {
      title: "Internship @ Women's College Hospital",
      body: "Applied technical and operational thinking in a healthcare environment.",
    },
    basketballRight: {
      title: "Athlete",
      body: "Discipline, consistency, and competitive mindset carried into academic and technical work.",
    },
    greece: {
      title: "Polyglot",
      body: "Self-taught language learning across cultures, with a focus on practical communication.",
    },
    physio: {
      title: "Clinical Volunteer & Shadower",
      body: "Direct exposure to patient-centered environments and clinical workflows.",
    },
    birthday: {
      title: "Personal Moments",
      body: "A reminder to stay grounded, celebrate milestones, and enjoy the journey.",
    },
  };
  const selectedDetail = detailCopyByKey[selectedDetailKey] ?? detailCopyByKey.waterloo;
  const isWaterlooDetail = selectedDetailKey === "waterloo";
  const isSickkidsDetail = selectedDetailKey === "sickkids";
  const isHackathonsDetail = selectedDetailKey === "cxc";
  const isInternshipDetail = selectedDetailKey === "wsp" || selectedDetailKey === "womens";
  const isPolyglotDetail = selectedDetailKey === "greece";
  const isVolunteeringDetail = selectedDetailKey === "physio";
  const isPublicationsDetail = selectedDetailKey === "asme";
  const isCfesDetail = selectedDetailKey === "cfes";
  const isAthleteDetail = selectedDetailKey === "basketballRight";
  const isCoopDetail = selectedDetailKey === "coop";
  /** Line breaks match reference layout */
  const wspInternshipLines = [
    "Before entering university, I spent my last summer break working as an intern at WSP.",
    "Here, I wrote a full paper on the implementation of 5G communications into Canadian and global rail networks.",
    "I learned about various 5G optimization techniques, including:",
    "mmWave technology, Edge Computing, Cloud-based virtualization, and Predictive Maintenance.",
    "The paper was published in the 2025 ASME ICEF Rail Symposium Proceedings.",
  ];
  const womensInternshipLines = [
    "During my first official co-op term at the University of Waterloo, I worked as a Research Assistant at WCH.",
    "I worked on quite a few projects. The main one involved evaluating different AI CDS tools for clinical use.",
    "Another was to create an AI tool to bridge the gap between medical research and actual clinical translation.",
    "I learned about clinical knowledge translation, AI CDS development and evaluation, patient-oriented research, etc.",
    "I was awarded Co-Op Student of the Year out of my entire faculty (1/9000 students) after this experience.",
  ];
  const waterlooCoursework = [
    "Circuits + Lab",
    "Systems & Signals",
    "Materials Science",
    "Data Structs & Algorithms",
    "Physiology + Lab",
    "Prototyping & Design",
    "Probability & Stats",
    "Solid Mechanics",
  ];
  const waterlooExtracurriculars = [
    "Engineering Society",
    "CFES",
    "Pre-Medical Society",
    "Venture Group Fellow",
  ];
  const sickkidsSummaryLines = [
    "During my second co-op term, I worked as a Machine Learning Research Assistant at SickKids.",
    "I worked on a project using Boltz-2, MIT's protein-ligand affinity-predicting AI model.",
    "My job was to create a new affinity head for predicting these affinities.",
    "I gained experience creating large datasets (millions of protein-peptide pairs),",
    "creating & training & evaluating ML models, using high-performance computing, and many more.",
  ];
  const hackathonsSummaryLines = [
    "I did my first hackathon in the summer of 2025, and it was so fun that I just kept doing them.",
    "To this day, I've won at three hackathons.",
    "I'm also flying out to Los Angeles for a hackathon this April.",
  ];
  const polyglotSummaryLines = [
    "At age 6 I was trilingual, speaking English, Persian, and French.",
    "At age 9, I realized learning Spanish was my calling. So I taught myself Spanish.",
    "My best tips for learning a language are:",
    "Learn the 1000 most common words first.",
    "The best practice is speaking. If you have nobody to practice with...talk to yourself!",
    "Travel to the countries where you can fully immerse yourself in the language you're learning.",
    "That last tip helped me a lot. I love travelling. Here's a map of the 19 countries (and US states) I've been to:",
  ];
  /** Line breaks match reference slide (three stanzas, eight visual lines). */
  const volunteeringStanzas = [
    `Before Grade 11, I worked as a physiotherapy assistant.
I learned how to perform Ultrasounds and electrotherapy, and learned lots about these devices.

Before Grade 12, I worked as a pharmacy assistant and learned a lot about drugs, which is funny now
that I'm working in research for drug discovery. Full circle moment!`,
    `These 2 experiences made me realize that I really want to work in healthcare
and work towards improving health outcomes.`,
    `During my co-op term at Women's College Hospital, I was able to shadow 2 primary care physicians.
It was a surreal experience, and I learned about the behind-the-scenes of clinical care.`,
  ];
  /** Line breaks match reference slide (seven lines). */
  const publicationsSummaryLines = [
    "After finishing my paper on 5G communications at WSP, my team decided to submit the paper to",
    "present at the 2025 ASME ICE Forward Conference and Rail Symposium in Milwaukee, WI.",
    "We got accepted, and my co-authors and I were able to present our paper at the conference.",
    "I made tons of connections within the American Society of Mechanical Engineers (ASME) and",
    "became an official member of the society as well.",
    "I am currently working on 2 other publications as well:",
    "A scoping review for digital health solutions, and a conference submission discussing AI clinical tools.",
  ];
  /** Paragraph spacing + line break after “potential” match reference slide. */
  const cfesSummaryLines = [
    "In March 2026, I attended my first Canadian Federation of Engineering Students conference.",
    "I enjoyed it so much, that I decided to join the CFES as a commissioner.",
    "In my role as Corporate Relations Commissioner, I am expected to reach out to various sponsors and potential\nfuture sponsors for the CFES to expand engineering students' opportunities in the engineering industry.",
  ];
  const athleteSummaryLines = [
    "Sports are my life.",
    "And not just one sport. In fact, I played 7 varsity sports in high school.",
    "Sports taught me leadership and communication.",
    "I have won several awards for leadership in various different sports (Leadership, MVP, Most Influential Player) and won various regional tournaments as well.",
    "I played high-level rep basketball from age 13 and on.",
    "My other favourite sports are table tennis and tennis. I actually met Karen Khachanov last year.",
  ];
  const sickkidsTools = [
    "Python",
    "PyTorch",
    "Pandas",
    "PyTorch Lightning",
    "Slurm",
    "Linux",
    "Conda",
    "Bash",
    "Git",
    "Matplotlib",
    "RDkit",
    "NumPy",
  ];
  const handleImageClick = useCallback((key) => {
    setSelectedDetailKey(key);
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;
    detailsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: coarse ? "nearest" : "start",
    });
  }, []);
  const onDetailsWheel = useCallback((event) => {
    if (event.deltaY < 0) {
      event.preventDefault();
      heroSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  /** Shared with wheel + ArrowUp/ArrowDown: one index step. */
  const stepHeroBullet = useCallback(
    (direction) => {
      if (direction !== 1 && direction !== -1) return;

      if (hoverFocusKey != null) setHoverFocusKey(null);
      if (stickyPhotoKey != null) setStickyPhotoKey(null);

      if (!hasStarted) {
        setHasStarted(true);
        return;
      }

      setActiveBulletIndex((current) =>
        Math.min(bulletPoints.length - 1, Math.max(0, current + direction)),
      );
    },
    [hasStarted, hoverFocusKey, stickyPhotoKey],
  );

  const onViewportWheel = useCallback((event) => {
    let delta = event.deltaY;
    if (delta === 0) return;

    event.preventDefault();

    if (event.deltaMode === 1) delta *= 16;
    if (event.deltaMode === 2) delta *= window.innerHeight;

    const direction = Math.sign(delta);
    const absDelta = Math.abs(delta);

    const triggerThreshold = 55;
    const settleThreshold = 10;
    const reflickThreshold = 38;

    if (wheelLatchedRef.current) {
      if (absDelta <= settleThreshold) {
        wheelReadyForNewInputRef.current = true;
        wheelLastAbsDeltaRef.current = absDelta;
        return;
      }

      if (
        wheelReadyForNewInputRef.current &&
        absDelta >= reflickThreshold &&
        absDelta > wheelLastAbsDeltaRef.current
      ) {
        wheelLatchedRef.current = false;
        wheelReadyForNewInputRef.current = false;
      } else {
        wheelLastAbsDeltaRef.current = absDelta;
        return;
      }
    }

    if (absDelta >= triggerThreshold) {
      wheelLatchedRef.current = true;
      wheelReadyForNewInputRef.current = false;
      wheelLastAbsDeltaRef.current = absDelta;
      stepHeroBullet(direction);
      return;
    }

    wheelLastAbsDeltaRef.current = absDelta;
  }, [stepHeroBullet]);

  const heroKeyboardNavActiveRef = useRef(true);
  useEffect(() => {
    const root = heroSectionRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        heroKeyboardNavActiveRef.current = Boolean(
          entry?.isIntersecting && (entry.intersectionRatio ?? 0) >= 0.12,
        );
      },
      { threshold: [0, 0.05, 0.1, 0.12, 0.2, 0.35, 0.5, 1] },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      if (!heroKeyboardNavActiveRef.current) return;
      const target = event.target;
      if (target instanceof Element) {
        if (target.closest("input, textarea, select, [contenteditable='true']")) {
          return;
        }
      }
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      stepHeroBullet(direction);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stepHeroBullet]);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_WARNING_MQ);
    const sync = () => {
      if (!mq.matches) {
        setShowMobileWarning(false);
        return;
      }
      if (sessionStorage.getItem(MOBILE_WARNING_DISMISS_KEY) === "1") {
        setShowMobileWarning(false);
        return;
      }
      setShowMobileWarning(true);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const dismissMobileWarning = useCallback(() => {
    try {
      sessionStorage.setItem(MOBILE_WARNING_DISMISS_KEY, "1");
    } catch {
      /* private mode / quota */
    }
    setShowMobileWarning(false);
  }, []);

  return (
    <div className="page-shell">
      {showMobileWarning ? (
        <div
          className="mobile-view-warning"
          role="region"
          aria-label="Screen size notice"
        >
          <p className="mobile-view-warning__text">
            This portfolio is laid out for <strong>larger screens</strong>. You can still
            explore on mobile, but for the intended layout try a desktop or tablet in
            landscape.
          </p>
          <button
            type="button"
            className="mobile-view-warning__dismiss"
            onClick={dismissMobileWarning}
          >
            Dismiss
          </button>
        </div>
      ) : null}
      <div ref={heroSectionRef} className="viewport" onWheel={onViewportWheel}>
      <div
        className="viewport-fill"
        style={{ backgroundImage: `url(${img.gradient})` }}
        aria-hidden="true"
      />
      <div
        className="scale-shell"
        style={{
          width: DESIGN_W * scale,
          height: DESIGN_H * scale,
        }}
      >
        <div className="canvas-hero-nudge">
          <main
            className="canvas"
            data-node-id="111:88"
            style={{ transform: `scale(${scale})` }}
            onMouseLeave={() => setHoverFocusKey(null)}
          >
          <nav className="socials" aria-label="Links">
            <a className="icon-link" href="#" aria-label="Resume">
              <IconResume />
            </a>
            <a
              className="icon-link"
              href="mailto:asarrafz@uwaterloo.ca"
              aria-label="Email"
            >
              <IconEmail />
            </a>
            <a
              className="icon-link"
              href="https://www.linkedin.com/in/aiden-sarrafzadeh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <IconLinkedin />
            </a>
            <a
              className="icon-link icon-link--github"
              href="https://github.com/asrfz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <span className="github-wrap">
                <IconGithub />
              </span>
            </a>
          </nav>

        <figure
          className={`photo photo--5${isHighlighted("wsp") ? " is-highlighted" : ""}`}
          onMouseEnter={() => {
            setHoverFocusKey("wsp");
            setStickyPhotoKey("wsp");
          }}
          onClick={() => handleImageClick("wsp")}
        >
          <img src={img.wsp} alt="WSP" />
        </figure>
        <figure
          className={`photo photo--1${isHighlighted("basketballRight") ? " is-highlighted" : ""}`}
          onMouseEnter={() => {
            setHoverFocusKey("basketballRight");
            setStickyPhotoKey("basketballRight");
          }}
          onClick={() => handleImageClick("basketballRight")}
        >
          <img src={img.mAndR} alt="M&amp;R" />
        </figure>
        <figure
          className={`photo photo--10${isHighlighted("cxc") ? " is-highlighted" : ""}`}
          onMouseEnter={() => {
            setHoverFocusKey("cxc");
            setStickyPhotoKey("cxc");
          }}
          onClick={() => handleImageClick("cxc")}
        >
          <img src={img.cxc} alt="CXC" />
        </figure>
        <figure
          className={`photo photo--8${isHighlighted("physio") ? " is-highlighted" : ""}`}
          onMouseEnter={() => {
            setHoverFocusKey("physio");
            setStickyPhotoKey("physio");
          }}
          onClick={() => handleImageClick("physio")}
        >
          <img src={img.physio} alt="Physio" />
        </figure>
        <figure
          className={`photo photo--11${isHighlighted("womens") ? " is-highlighted" : ""}`}
          onMouseEnter={() => {
            setHoverFocusKey("womens");
            setStickyPhotoKey("womens");
          }}
          onClick={() => handleImageClick("womens")}
        >
          <img src={img.womens} alt="Women's College Hospital" />
        </figure>
        <figure
          className={`photo photo--2${isHighlighted("waterloo") ? " is-highlighted" : ""}`}
          onMouseEnter={() => {
            setHoverFocusKey("waterloo");
            setStickyPhotoKey("waterloo");
          }}
          onClick={() => handleImageClick("waterloo")}
        >
          <img src={img.waterloo} alt="Waterloo Engineering" />
        </figure>
        <figure
          className={`photo photo--sickkids${isHighlighted("sickkids") ? " is-highlighted" : ""}`}
          onMouseEnter={() => {
            setHoverFocusKey("sickkids");
            setStickyPhotoKey("sickkids");
          }}
          onClick={() => handleImageClick("sickkids")}
        >
          <img src={img.sickKids} alt="SickKids" />
        </figure>
        <figure
          className={`photo photo--asme${isHighlighted("asme") ? " is-highlighted" : ""}`}
          onMouseEnter={() => {
            setHoverFocusKey("asme");
            setStickyPhotoKey("asme");
          }}
          onClick={() => handleImageClick("asme")}
        >
          <img src={img.asme} alt="ASME" />
        </figure>
        <figure
          className={`photo photo--9${isHighlighted("coop") ? " is-highlighted" : ""}`}
          onMouseEnter={() => {
            setHoverFocusKey("coop");
            setStickyPhotoKey("coop");
          }}
          onClick={() => handleImageClick("coop")}
        >
          <img src={img.coOp} alt="Co-Op" />
        </figure>
        <figure
          className="photo photo--12 photo--12--hover-only"
          aria-label="Birthday — hover to read message"
          onMouseEnter={() => setHoverFocusKey("birthday")}
          onMouseLeave={() =>
            setHoverFocusKey((h) => (h === "birthday" ? null : h))
          }
        >
          <img src={img.birthdayParty} alt="Birthday party" />
        </figure>
        <figure
          className={`photo photo--13${isHighlighted("cfes") ? " is-highlighted" : ""}`}
          onMouseEnter={() => {
            setHoverFocusKey("cfes");
            setStickyPhotoKey("cfes");
          }}
          onClick={() => handleImageClick("cfes")}
        >
          <img src={img.cfes} alt="CFES" />
        </figure>

        <div className="bullets" data-node-id="113:39">
          <ul>
            <li
              key={
                isBirthdayActive
                  ? "birthday-hover"
                  : displayBulletIndex == null
                    ? "initial-hint"
                    : bulletPoints[displayBulletIndex]
              }
              className="bullet-line"
            >
              {isBirthdayActive ? (
                <span
                  style={{
                    "--bullet-grad-1": activeGradient[0],
                    "--bullet-grad-2": activeGradient[1],
                    "--bullet-grad-3": activeGradient[2],
                    "--bullet-grad-4": activeGradient[3],
                  }}
                >
                  My amazing friends
                </span>
              ) : showIntroHint ? (
                <span className="interaction-hint-text">
                  <span>Scroll to explore</span>
                  <span>Click images for more details</span>
                </span>
              ) : null}
              {!showIntroHint && !isBirthdayActive && displayBulletIndex != null ? (
                <span
                  style={{
                    "--bullet-grad-1": activeGradient[0],
                    "--bullet-grad-2": activeGradient[1],
                    "--bullet-grad-3": activeGradient[2],
                    "--bullet-grad-4": activeGradient[3],
                  }}
                >
                  {bulletPoints[displayBulletIndex]}
                </span>
              ) : null}
            </li>
          </ul>
        </div>

        <figure
          className={`lang-switch${isHighlighted("greece") ? " is-highlighted" : ""}`}
          data-node-id="111:204"
          aria-label="Language photo"
          onMouseEnter={() => {
            setHoverFocusKey("greece");
            setStickyPhotoKey("greece");
          }}
          onClick={() => handleImageClick("greece")}
        >
          <img className="lang-switch__photo" src={img.languagesPhoto} alt="Street in Greece at dusk" />
        </figure>

        <h1 className="name" data-node-id="111:89">
          Aiden Sarrafzadeh
        </h1>
        <a
          className="figma-made-badge"
          href={FIGMA_DESIGN_FILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open full site design in Figma (Made with Figma)"
        >
          <span className="figma-made-badge__label">Made with</span>
          <img src={img.figmaMadeBadge} alt="Figma" width={1000} height={478} decoding="async" />
        </a>
          </main>
        </div>
      </div>
      <CursorGlow />
      </div>
      <section
        ref={detailsSectionRef}
        className={`details-section${isWaterlooDetail ? " details-section--waterloo" : ""}${isSickkidsDetail ? " details-section--sickkids" : ""}${isHackathonsDetail ? " details-section--hackathons" : ""}${isInternshipDetail ? " details-section--internship" : ""}${isPolyglotDetail ? " details-section--polyglot" : ""}${isPublicationsDetail ? " details-section--publications" : ""}${isCfesDetail ? " details-section--cfes" : ""}${isAthleteDetail ? " details-section--athlete" : ""}${isCoopDetail ? " details-section--coop" : ""}${isVolunteeringDetail ? " details-section--volunteering" : ""}`}
        style={{ "--details-bg": `url(${img.gradient})` }}
        onWheel={onDetailsWheel}
      >
        <div className="details-section__inner">
          {isWaterlooDetail ? (
            <div className="education-panel" aria-label="Waterloo education details">
              <h2 className="education-panel__title">Education</h2>
              <p className="education-panel__line">
                University of Waterloo - Bachelor of Applied Science
              </p>
              <p className="education-panel__line education-panel__line--program">
                Biomedical Engineering
              </p>
              <p className="education-panel__year">2024-2029</p>
              <p className="education-panel__line education-panel__line--avg">
                Cumulative Average: 90%
              </p>

              <p className="education-panel__tag">Relevant Coursework</p>
              <div className="education-panel__pill-grid" role="list" aria-label="Relevant coursework">
                {waterlooCoursework.map((course) => (
                  <span key={course} className="education-panel__pill" role="listitem">
                    {course}
                  </span>
                ))}
              </div>

              <p className="education-panel__tag education-panel__tag--secondary">Extracurriculars</p>
              <div className="education-panel__pill-grid" role="list" aria-label="Extracurriculars">
                {waterlooExtracurriculars.map((item) => (
                  <span key={item} className="education-panel__pill" role="listitem">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : isSickkidsDetail ? (
            <div className="sickkids-panel" aria-label="SickKids details">
              <h2 className="sickkids-panel__title">SICKKIDS</h2>
              <div className="sickkids-panel__copy" aria-label="SickKids summary">
                {sickkidsSummaryLines.map((line) => (
                  <p key={line} className="sickkids-panel__line">
                    {line}
                  </p>
                ))}
              </div>
              <p className="sickkids-panel__tag">Stack &amp; Tools</p>
              <div className="sickkids-panel__pill-grid" role="list" aria-label="SickKids stack and tools">
                {sickkidsTools.map((tool) => (
                  <span key={tool} className="sickkids-panel__pill" role="listitem">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ) : isHackathonsDetail ? (
            <div className="hackathons-panel" aria-label="Hackathons">
              <h2 className="hackathons-panel__title">HACKATHONS</h2>
              <div className="hackathons-panel__copy" aria-label="Hackathons summary">
                {hackathonsSummaryLines.map((line, i) => (
                  <p key={`hack-${i}`} className="hackathons-panel__line">
                    {line}
                  </p>
                ))}
              </div>
              <a
                className="hackathons-panel__cta"
                href={DEVPOST_PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="My Hackathon Projects on Devpost (opens in new tab)"
              >
                My Hackathon Projects
              </a>
              <div className="hackathons-panel__photos" aria-label="Hackathon photos">
                <figure className="hackathons-panel__photo hackathons-panel__photo--left">
                  <img src={img.hackathonPhotoLeft} alt="Hackathon team with prizes" />
                </figure>
                <figure className="hackathons-panel__photo hackathons-panel__photo--right">
                  <img src={img.hackathonPhotoRight} alt="At a hackathon workshop" />
                </figure>
              </div>
            </div>
          ) : isInternshipDetail ? (
            <div className="internship-panel" aria-label="WSP and Women's College Hospital">
              <section className="internship-panel__block" aria-labelledby="internship-wsp-heading">
                <h2 id="internship-wsp-heading" className="internship-panel__title">
                  WSP
                </h2>
                <div className="internship-panel__copy" aria-label="WSP summary">
                  {wspInternshipLines.map((line, i) => (
                    <p key={`wsp-${i}`} className="internship-panel__line">
                      {line}
                    </p>
                  ))}
                </div>
              </section>
              <section className="internship-panel__block" aria-labelledby="internship-wch-heading">
                <h2 id="internship-wch-heading" className="internship-panel__title">
                  {"Women's College Hospital"}
                </h2>
                <div className="internship-panel__copy" aria-label="Women's College Hospital summary">
                  {womensInternshipLines.map((line, i) => (
                    <p key={`wch-${i}`} className="internship-panel__line">
                      {line}
                    </p>
                  ))}
                </div>
              </section>
            </div>
          ) : isPolyglotDetail ? (
            <div className="polyglot-panel" aria-label="Polyglot">
              <h2 className="polyglot-panel__title">POLYGLOT</h2>
              <div className="polyglot-panel__copy" aria-label="Polyglot summary">
                {polyglotSummaryLines.map((line, i) => (
                  <p key={`polyglot-${i}`} className="polyglot-panel__line">
                    {line}
                  </p>
                ))}
              </div>
              <figure className="polyglot-panel__map" aria-label="Countries and regions visited">
                <img src={img.polyglotMap} alt="World map highlighting countries and US states visited" />
              </figure>
            </div>
          ) : isPublicationsDetail ? (
            <div className="publications-panel" aria-label="Publications">
              <h2 className="publications-panel__title">PUBLICATIONS</h2>
              <div className="publications-panel__copy" aria-label="Publications summary">
                {publicationsSummaryLines.map((line, i) => (
                  <p key={`pub-${i}`} className="publications-panel__line">
                    {line}
                  </p>
                ))}
              </div>
              <figure className="publications-panel__badge" aria-label="Conference author badge">
                <img
                  src={img.publicationsBadge}
                  alt="ICEF RTS 2025 conference badge with Student and Author ribbons"
                />
              </figure>
            </div>
          ) : isCfesDetail ? (
            <div className="cfes-panel" aria-label="CFES">
              <h2 className="cfes-panel__title">CFES</h2>
              <div className="cfes-panel__copy" aria-label="CFES summary">
                {cfesSummaryLines.map((line, i) => (
                  <p key={`cfes-${i}`} className="cfes-panel__line">
                    {line}
                  </p>
                ))}
              </div>
              <figure className="cfes-panel__photo" aria-label="CFES conference photo">
                <img
                  src={img.cfesPanelPhoto}
                  alt="Three people at a CFES event holding a large ceremonial wrench"
                />
              </figure>
            </div>
          ) : isAthleteDetail ? (
            <div className="athlete-panel" aria-label="Athlete">
              <h2 className="athlete-panel__title">ATHLETE</h2>
              <div className="athlete-panel__copy" aria-label="Athlete summary">
                {athleteSummaryLines.map((line, i) => (
                  <p key={`athlete-${i}`} className="athlete-panel__line">
                    {line}
                  </p>
                ))}
              </div>
              <div className="athlete-panel__photos" aria-label="Tennis and basketball photos">
                <figure className="athlete-panel__photo athlete-panel__photo--left">
                  <img src={img.athletePhotoTennis} alt="On a tennis court with a friend" />
                </figure>
                <figure className="athlete-panel__photo athlete-panel__photo--right">
                  <img src={img.athletePhotoBasketball} alt="Jumping for a rebound in a basketball game" />
                </figure>
              </div>
            </div>
          ) : isCoopDetail ? (
            <div className="coop-panel" aria-label="Co-op Student of the Year">
              <h2 className="coop-panel__title">CO-OP STUDENT OF THE YEAR</h2>
              <p className="coop-panel__intro">
                In March 2026, I was honoured to be named the University of Waterloo&apos;s
                <br />
                Faculty of Engineering Co-Op Student of the year, chosen out of my entire faculty (9000 students).
              </p>
              <div className="coop-panel__grid" aria-label="News and video links">
                <a
                  className="coop-panel__pill coop-panel__pill--bme"
                  href={COOP_LINK_BME}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="BME student named Engineering's 2025 Co-op Student of the Year (opens in new tab)"
                >
                  <img src={img.coopLinkBme} alt="" width={892} height={208} decoding="async" />
                </a>
                <a
                  className="coop-panel__pill coop-panel__pill--research"
                  href={COOP_LINK_RESEARCH}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Turning clinical gaps into research-driven solutions (opens in new tab)"
                >
                  <img src={img.coopLinkResearch} alt="" width={1024} height={89} decoding="async" />
                </a>
                <a
                  className="coop-panel__feature"
                  href={COOP_LINK_VIDEO}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Watch Meet Faculty of Engineering Co-op Student of the Year, Aiden Sarrafzadeh on YouTube (opens in new tab)"
                >
                  <img src={img.coopYoutubeCard} alt="" width={1024} height={457} decoding="async" />
                </a>
                <a
                  className="coop-panel__pill coop-panel__pill--honour"
                  href={COOP_LINK_ENGINEERING}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Biomedical engineering student earns top co-op honour (opens in new tab)"
                >
                  <img src={img.coopLinkHonour} alt="" width={1024} height={86} decoding="async" />
                </a>
              </div>
            </div>
          ) : isVolunteeringDetail ? (
            <div className="volunteering-panel" aria-label="Volunteering">
              <h2 className="volunteering-panel__title">VOLUNTEERING</h2>
              <div className="volunteering-panel__copy" aria-label="Volunteering summary">
                {volunteeringStanzas.map((stanza, i) => (
                  <p key={`volunteering-stanza-${i}`} className="volunteering-panel__stanza">
                    {stanza}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <>
              <p className="details-section__kicker">See More</p>
              <h2>{selectedDetail.title}</h2>
              <p>{selectedDetail.body}</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
