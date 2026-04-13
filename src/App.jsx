import "./App.css";
import { useCallback, useRef, useState } from "react";
import { bulletPoints, img } from "./assets.js";
import { CursorGlow } from "./CursorGlow.jsx";
import { DESIGN_H, DESIGN_W, useViewportScale } from "./useViewportScale.js";

export default function App() {
  const scale = useViewportScale();
  const [activeBulletIndex, setActiveBulletIndex] = useState(0);
  const wheelAccumulatorRef = useRef(0);
  const lastStepAtRef = useRef(0);
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
  const activeHighlights = new Set(highlightByBullet[activeBulletIndex] ?? []);
  const isHighlighted = (key) => activeHighlights.has(key);

  const onViewportWheel = useCallback((event) => {
    wheelAccumulatorRef.current += event.deltaY;
    const now = performance.now();
    const progress = activeBulletIndex / (bulletPoints.length - 1 || 1);
    const deltaThreshold = 150 + progress * 220;
    const stepCooldownMs = 170 + progress * 90;

    if (Math.abs(wheelAccumulatorRef.current) < deltaThreshold) {
      return;
    }
    if (now - lastStepAtRef.current < stepCooldownMs) {
      return;
    }

    const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
    wheelAccumulatorRef.current = 0;
    lastStepAtRef.current = now;

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
          <a className="icon-link" href="mailto:" aria-label="Email">
            <img src={img.iconEmail} alt="" width={24} height={24} />
          </a>
          <a
            className="icon-link"
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <img src={img.iconLinkedin} alt="" width={24} height={24} />
          </a>
          <a
            className="icon-link icon-link--github"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <span className="github-wrap">
              <img src={img.iconGithub} alt="" width={17} height={18} />
            </span>
          </a>
        </nav>

        <figure className={`photo photo--5${isHighlighted("wsp") ? " is-highlighted" : ""}`}>
          <img src={img.wsp} alt="WSP" />
        </figure>
        <figure className={`photo photo--1${isHighlighted("basketballRight") ? " is-highlighted" : ""}`}>
          <img src={img.mAndR} alt="M&amp;R" />
        </figure>
        <figure className={`photo photo--10${isHighlighted("cxc") ? " is-highlighted" : ""}`}>
          <img src={img.cxc} alt="CXC" />
        </figure>
        <figure className={`photo photo--8${isHighlighted("physio") ? " is-highlighted" : ""}`}>
          <img src={img.physio} alt="Physio" />
        </figure>
        <figure className={`photo photo--11${isHighlighted("womens") ? " is-highlighted" : ""}`}>
          <img src={img.womens} alt="Women's College Hospital" />
        </figure>
        <figure className={`photo photo--2${isHighlighted("waterloo") ? " is-highlighted" : ""}`}>
          <img src={img.waterloo} alt="Waterloo Engineering" />
        </figure>
        <figure className={`photo photo--sickkids${isHighlighted("sickkids") ? " is-highlighted" : ""}`}>
          <img src={img.sickKids} alt="SickKids" />
        </figure>
        <figure className={`photo photo--watai${isHighlighted("watai") ? " is-highlighted" : ""}`}>
          <img src={img.watAi} alt="WAT.ai" />
        </figure>
        <figure className={`photo photo--3${isHighlighted("asme") ? " is-highlighted" : ""}`}>
          <img src={img.asme} alt="ASME" />
        </figure>
        <figure className={`photo photo--9${isHighlighted("coop") ? " is-highlighted" : ""}`}>
          <img src={img.coOp} alt="Co-Op" />
        </figure>
        <figure className="photo photo--12">
          <img src={img.birthdayParty} alt="Birthday party" />
        </figure>
        <figure className={`photo photo--13${isHighlighted("cfes") ? " is-highlighted" : ""}`}>
          <img src={img.cfes} alt="CFES" />
        </figure>

        <div className="bullets" data-node-id="113:39">
          <ul>
            <li key={bulletPoints[activeBulletIndex]} className="bullet-line">
              {bulletPoints[activeBulletIndex]}
            </li>
          </ul>
        </div>

        <figure
          className={`lang-switch${isHighlighted("greece") ? " is-highlighted" : ""}`}
          data-node-id="111:204"
          aria-label="Language photo"
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
