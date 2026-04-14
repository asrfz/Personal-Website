import "./App.css";
import { useCallback, useRef, useState } from "react";
import { bulletPoints, img } from "./assets.js";
import { CursorGlow } from "./CursorGlow.jsx";
import { DESIGN_H, DESIGN_W, useViewportScale } from "./useViewportScale.js";

const HOVER_PHOTO_TO_BULLET = {
  waterloo: 0,
  sickkids: 1,
  watai: 2,
  cfes: 3,
  coop: 4,
  asme: 5,
  cxc: 6,
  wsp: 7,
  womens: 7,
  basketballRight: 8,
  greece: 9,
  physio: 10,
};

export default function App() {
  const scale = useViewportScale();
  const [activeBulletIndex, setActiveBulletIndex] = useState(0);
  const [hoveredPhotoKey, setHoveredPhotoKey] = useState(null);
  const wheelAccumulatorRef = useRef(0);
  const lastStepAtRef = useRef(0);
  const gestureDirectionRef = useRef(0);
  const gestureSteppedRef = useRef(false);
  const lastWheelEventAtRef = useRef(0);
  const highlightByBullet = [
    ["waterloo"],
    ["sickkids"],
    ["watai"],
    ["cfes"],
    ["coop"],
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
    ["#ffffff", "#d7a6ff", "#a3b4ff", "#96f0ff"],
    ["#ffffff", "#95d3ff", "#7eb8ff", "#8f96ff"],
    ["#ffffff", "#ffb8d6", "#c6b1ff", "#8dc2ff"],
    ["#ffffff", "#ffc189", "#ff9ec2", "#9cc2ff"],
    ["#ffffff", "#8be4ff", "#98cfff", "#afb0ff"],
    ["#ffffff", "#86eab7", "#87d9ff", "#b7c0ff"],
    ["#ffffff", "#ffd997", "#a8c9ff", "#87f0ff"],
    ["#ffffff", "#9be5c0", "#9fd8ff", "#b8b8ff"],
  ];
  const isBirthdayHover = hoveredPhotoKey === "birthday";
  const displayBulletIndex = (() => {
    if (hoveredPhotoKey == null) return activeBulletIndex;
    if (isBirthdayHover) return null;
    return HOVER_PHOTO_TO_BULLET[hoveredPhotoKey] ?? activeBulletIndex;
  })();
  const activeHighlights = new Set(
    displayBulletIndex == null
      ? []
      : (highlightByBullet[displayBulletIndex] ?? []),
  );
  const isHighlighted = (key) => activeHighlights.has(key);
  const activeGradient =
    displayBulletIndex == null
      ? bulletGradients[activeBulletIndex]
      : (bulletGradients[displayBulletIndex] ?? bulletGradients[0]);

  const onViewportWheel = useCallback((event) => {
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

    setActiveBulletIndex((current) =>
      Math.min(bulletPoints.length - 1, Math.max(0, current + direction)),
    );
    event.preventDefault();
  }, [activeBulletIndex]);

  return (
    <div className="viewport" onWheel={onViewportWheel}>
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
          onMouseEnter={() => setHoveredPhotoKey("wsp")}
          onMouseLeave={() => setHoveredPhotoKey(null)}
        >
          <img src={img.wsp} alt="WSP" />
        </figure>
        <figure
          className={`photo photo--1${isHighlighted("basketballRight") ? " is-highlighted" : ""}`}
          onMouseEnter={() => setHoveredPhotoKey("basketballRight")}
          onMouseLeave={() => setHoveredPhotoKey(null)}
        >
          <img src={img.mAndR} alt="M&amp;R" />
        </figure>
        <figure
          className={`photo photo--10${isHighlighted("cxc") ? " is-highlighted" : ""}`}
          onMouseEnter={() => setHoveredPhotoKey("cxc")}
          onMouseLeave={() => setHoveredPhotoKey(null)}
        >
          <img src={img.cxc} alt="CXC" />
        </figure>
        <figure
          className={`photo photo--8${isHighlighted("physio") ? " is-highlighted" : ""}`}
          onMouseEnter={() => setHoveredPhotoKey("physio")}
          onMouseLeave={() => setHoveredPhotoKey(null)}
        >
          <img src={img.physio} alt="Physio" />
        </figure>
        <figure
          className={`photo photo--11${isHighlighted("womens") ? " is-highlighted" : ""}`}
          onMouseEnter={() => setHoveredPhotoKey("womens")}
          onMouseLeave={() => setHoveredPhotoKey(null)}
        >
          <img src={img.womens} alt="Women's College Hospital" />
        </figure>
        <figure
          className={`photo photo--2${isHighlighted("waterloo") ? " is-highlighted" : ""}`}
          onMouseEnter={() => setHoveredPhotoKey("waterloo")}
          onMouseLeave={() => setHoveredPhotoKey(null)}
        >
          <img src={img.waterloo} alt="Waterloo Engineering" />
        </figure>
        <figure
          className={`photo photo--sickkids${isHighlighted("sickkids") ? " is-highlighted" : ""}`}
          onMouseEnter={() => setHoveredPhotoKey("sickkids")}
          onMouseLeave={() => setHoveredPhotoKey(null)}
        >
          <img src={img.sickKids} alt="SickKids" />
        </figure>
        <figure
          className={`photo photo--watai${isHighlighted("watai") ? " is-highlighted" : ""}`}
          onMouseEnter={() => setHoveredPhotoKey("watai")}
          onMouseLeave={() => setHoveredPhotoKey(null)}
        >
          <img src={img.watAi} alt="WAT.ai" />
        </figure>
        <figure
          className={`photo photo--3${isHighlighted("asme") ? " is-highlighted" : ""}`}
          onMouseEnter={() => setHoveredPhotoKey("asme")}
          onMouseLeave={() => setHoveredPhotoKey(null)}
        >
          <img src={img.asme} alt="ASME" />
        </figure>
        <figure
          className={`photo photo--9${isHighlighted("coop") ? " is-highlighted" : ""}`}
          onMouseEnter={() => setHoveredPhotoKey("coop")}
          onMouseLeave={() => setHoveredPhotoKey(null)}
        >
          <img src={img.coOp} alt="Co-Op" />
        </figure>
        <figure
          className="photo photo--12"
          onMouseEnter={() => setHoveredPhotoKey("birthday")}
          onMouseLeave={() => setHoveredPhotoKey(null)}
        >
          <img src={img.birthdayParty} alt="Birthday party" />
        </figure>
        <figure
          className={`photo photo--13${isHighlighted("cfes") ? " is-highlighted" : ""}`}
          onMouseEnter={() => setHoveredPhotoKey("cfes")}
          onMouseLeave={() => setHoveredPhotoKey(null)}
        >
          <img src={img.cfes} alt="CFES" />
        </figure>

        <div className="bullets" data-node-id="113:39">
          <ul>
            <li
              key={
                isBirthdayHover
                  ? "birthday-hover"
                  : bulletPoints[displayBulletIndex ?? 0]
              }
              className="bullet-line"
            >
              {!isBirthdayHover && displayBulletIndex != null ? (
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
          onMouseEnter={() => setHoveredPhotoKey("greece")}
          onMouseLeave={() => setHoveredPhotoKey(null)}
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
  );
}
