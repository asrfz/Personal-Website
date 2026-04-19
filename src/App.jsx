import "./App.css";
import { useCallback, useRef, useState } from "react";
import { bulletPoints, img } from "./assets.js";
import { CursorGlow } from "./CursorGlow.jsx";
import { DESIGN_H, DESIGN_W, useViewportScale } from "./useViewportScale.js";

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
  const [hasStarted, setHasStarted] = useState(false);
  const [activeBulletIndex, setActiveBulletIndex] = useState(0);
  const [selectedDetailKey, setSelectedDetailKey] = useState("waterloo");
  /** Which photo tile the pointer is currently over (transient). */
  const [hoverFocusKey, setHoverFocusKey] = useState(null);
  /** Last photo tile "selected" by hover — persists until a different tile is hovered. */
  const [stickyPhotoKey, setStickyPhotoKey] = useState(null);
  const wheelAccumulatorRef = useRef(0);
  const lastStepAtRef = useRef(0);
  const gestureDirectionRef = useRef(0);
  const gestureSteppedRef = useRef(false);
  const lastWheelEventAtRef = useRef(0);
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
  const isBirthdayActive =
    hoverFocusKey === "birthday" ||
    (stickyPhotoKey === "birthday" && hoverFocusKey == null);
  const displayBulletIndex = (() => {
    const transient = hoverFocusKey;
    if (transient === "birthday") return null;
    if (transient != null) {
      return HOVER_PHOTO_TO_BULLET[transient] ?? baseBulletIndex;
    }
    if (stickyPhotoKey === "birthday") return null;
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
  const isInternshipDetail = selectedDetailKey === "wsp" || selectedDetailKey === "womens";
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
    detailsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const onDetailsWheel = useCallback((event) => {
    if (event.deltaY < 0) {
      event.preventDefault();
      heroSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const onViewportWheel = useCallback((event) => {
    if (hoverFocusKey != null || stickyPhotoKey != null) {
      setHoverFocusKey(null);
      setStickyPhotoKey(null);
      wheelAccumulatorRef.current = 0;
      gestureDirectionRef.current = 0;
      gestureSteppedRef.current = false;
      event.preventDefault();
      return;
    }

    const now = performance.now();
    const motionDirection = Math.sign(event.deltaY);
    if (motionDirection === 0) {
      return;
    }

    const idleGapMs = 240;
    if (now - lastWheelEventAtRef.current > idleGapMs) {
      gestureDirectionRef.current = 0;
      gestureSteppedRef.current = false;
      wheelAccumulatorRef.current = 0;
    }
    lastWheelEventAtRef.current = now;

    if (gestureDirectionRef.current === 0) {
      gestureDirectionRef.current = motionDirection;
    } else if (gestureDirectionRef.current !== motionDirection) {
      /* Direction flip = new gesture */
      gestureDirectionRef.current = motionDirection;
      gestureSteppedRef.current = false;
      wheelAccumulatorRef.current = 0;
    }

    if (gestureSteppedRef.current) {
      event.preventDefault();
      return;
    }

    wheelAccumulatorRef.current += event.deltaY;
    const progress = activeBulletIndex / (bulletPoints.length - 1 || 1);
    const deltaThreshold = 150 + progress * 220;
    const stepCooldownMs = 120;

    if (Math.abs(wheelAccumulatorRef.current) < deltaThreshold) {
      return;
    }
    if (now - lastStepAtRef.current < stepCooldownMs) {
      return;
    }

    const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
    wheelAccumulatorRef.current = 0;
    lastStepAtRef.current = now;
    gestureSteppedRef.current = true;

    if (!hasStarted) {
      setHasStarted(true);
      event.preventDefault();
      return;
    }

    setActiveBulletIndex((current) =>
      Math.min(bulletPoints.length - 1, Math.max(0, current + direction)),
    );
    setStickyPhotoKey(null);
    setHoverFocusKey(null);
    event.preventDefault();
  }, [activeBulletIndex, hasStarted, hoverFocusKey, stickyPhotoKey]);

  return (
    <div className="page-shell">
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
        <main
          className="canvas"
          data-node-id="111:88"
          style={{ transform: `scale(${scale})` }}
          onMouseLeave={() => setHoverFocusKey(null)}
        >
        <nav className="socials" aria-label="Links">
          <a className="icon-link" href="#" aria-label="Resume">
            <img src={img.iconResume} alt="" width={24} height={24} />
          </a>
          <a
            className="icon-link"
            href="mailto:asarrafz@uwaterloo.ca"
            aria-label="Email"
          >
            <img src={img.iconEmail} alt="" width={24} height={24} />
          </a>
          <a
            className="icon-link"
            href="https://www.linkedin.com/in/aiden-sarrafzadeh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <img src={img.iconLinkedin} alt="" width={24} height={24} />
          </a>
          <a
            className="icon-link icon-link--github"
            href="https://github.com/asrfz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <span className="github-wrap">
              <img src={img.iconGithub} alt="" width={17} height={18} />
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
          className="photo photo--12"
          onMouseEnter={() => {
            setHoverFocusKey("birthday");
            setStickyPhotoKey("birthday");
          }}
          onClick={() => handleImageClick("birthday")}
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
              {showIntroHint ? (
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
        </main>
      </div>
      <CursorGlow />
      </div>
      <section
        ref={detailsSectionRef}
        className={`details-section${isWaterlooDetail ? " details-section--waterloo" : ""}${isSickkidsDetail ? " details-section--sickkids" : ""}${isInternshipDetail ? " details-section--internship" : ""}`}
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
