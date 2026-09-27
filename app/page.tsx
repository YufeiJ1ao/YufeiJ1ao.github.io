/* eslint-disable @next/next/no-img-element */

/*import CRTStudio from "./CRTStudio";*/
import AirportBoard from "./AirportBoard";
const projects = [
  {
    index: "01",
    title: "YUI Motion Lab",
    discipline: "Computer vision · Blender · OAK-D",
    description:
      "A real-time markerless motion-capture pipeline translating body, hand, head and facial movement into a responsive Blender avatar.",
    href: "https://github.com/YufeiJ1ao/yui-motionlab",
    image:
      "https://raw.githubusercontent.com/YufeiJ1ao/yui-motionlab/main/Assets/yuidrinktea.png",
  },
  {
    index: "02",
    title: "NeoPlant",
    discipline: "Machine learning · IoT · Unreal Engine 5",
    description:
      "A team-built plant-care network connecting AI classification, live sensor data and pixel plant avatars. Role — ML Engineer and UI Designer.",
    href: "https://github.com/EvieMerrifield/Plant-App-Project",
    image:
      "https://github.com/user-attachments/assets/b2e2fd2d-7bf3-496d-afed-6744a5109230",
  },
  {
    index: "03",
    title: "The Rise of Anti-Heroes",
    discipline: "Social data · NLP · Interactive visualisation",
    description:
      "A collaborative study of audience attitudes towards anti-heroes across social platforms, combining sentiment analysis with an interactive 3D Sentiment DNA visualisation. Critical Data Group 1 · 2025.",
    href: "https://github.com/YufeiJ1ao/antiheroSocialDataAnalysis",
    image: "/antihero-sentiment-dna.png",
    embed: "https://group1-antihero.netlify.app/",
  },
  {
    index: "04",
    title: "Florasync",
    discipline: "Physical computing · Urban nature",
    description:
      "A responsive ambient flower that turns plant hydration into light and motion, opening a quiet conversation between people and urban nature.",
    href: "https://github.com/YufeiJ1ao/Ambient-flower-Florasync",
    image:
      "https://github.com/YufeiJ1ao/Ambient-flower-Florasync/assets/93790647/bead4b65-8e3c-4f4c-ba81-ddd05d35593f",
  },
  {
    index: "05",
    title: "Emotion Detector",
    discipline: "Machine learning · Arduino · NLP",
    description:
      "An emotion-recognition experiment that reads language through a machine-learning model and gives it physical colour through an LED interface.",
    href: "https://github.com/YufeiJ1ao/BigDataEmotionDetector",
    image:
      "https://github.com/user-attachments/assets/986f2c37-c74d-40ac-925f-d36628645ec4",
  },
  {
    index: "06",
    title: "Climate as Form",
    discipline: "Data art · TouchDesigner · Rhino",
    description:
      "Visual research translating London climate data into colour, spatial diagrams and sculptural forms that make environmental change tangible.",
    href: "https://github.com/YufeiJ1ao/VisualAndSensing",
    image: null,
  },
];

const capabilities = [
  "Creative coding",
  "Realtime interaction",
  "Computer vision",
  "Physical computing",
  "3D & motion",
  "Data visualisation",
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Yufei Jiao, back to top">
          Yufei Jiao<span>°</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a
          className="header-link"
          href="https://www.youtube.com/@feiyu3451"
          target="_blank"
          rel="noreferrer"
        >
          YouTube ↗
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-status">
          <span>Creative Technologist</span>
          <span>London · UK</span>
          <span>Available for collaboration</span>
        </div>
        <div className="hero-stage">
          <div className="hero-copy">
            <p className="hero-kicker">Code · bodies · living systems</p>
            <h1 className="sr-only">
            Yufei Jiao — Creative Technologist
            </h1>

            <p className="hero-statement">
             make things <em>moving.</em>
            </p>
            <p className="hero-intro">
              I work across code, bodies and physical space — creating realtime
              experiences, intelligent avatars and responsive objects.
            </p>
          </div>
          {/* <CRTStudio /> */}
          <AirportBoard />
        </div>
        <div className="hero-bottom">
          <p>Interactive channel / selected moving image</p>
          <a href="#work" className="scroll-link" aria-label="View selected work">
            Selected work <b>↓</b>
          </a>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading">
          <p>Selected work</p>
          <p>2022 — 2026</p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project-entry" key={project.title}>
            <a
              className="project-card"
              href={project.href}
              target="_blank"
              rel="noreferrer"
            >
              <span className="project-index">{project.index}</span>
              <div className={`project-visual ${project.image ? "has-image" : "data-visual"}`}>
                {project.image ? (
                  <img src={project.image} alt="" />
                ) : (
                  <div className="data-bars" aria-hidden="true">
                    {[35, 72, 48, 90, 63, 40, 78, 54, 88, 66].map((height, i) => (
                      <span key={i} style={{ height: `${height}%` }} />
                    ))}
                  </div>
                )}
              </div>
              <div className="project-copy">
                <p>{project.discipline}</p>
                <h2>{project.title}</h2>
                <div className="project-description">{project.description}</div>
              </div>
              <span className="project-arrow" aria-hidden="true">↗</span>
            </a>
            {project.embed && (
              <section className="project-embed" aria-label="Anti-Hero Sentiment DNA live visualisation">
                <div className="project-embed-heading">
                  <p>Explore the Sentiment DNA</p>
                  <a href={project.embed} target="_blank" rel="noreferrer">
                    Open full screen ↗
                  </a>
                </div>
                <iframe
                  src={project.embed}
                  title="Anti-Hero Sentiment DNA — interactive 3D visualisation"
                  loading="lazy"
                  allow="fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                <p className="project-embed-caption">
                  Drag to rotate, zoom to explore, and click a node to read an opinion.
                  If the visualisation does not load, open it using the link above.
                </p>
              </section>
            )}
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-title">
          <p className="section-label">About</p>
          <h2>Technology as a material for human expression.</h2>
        </div>
        <div className="about-copy">
          <p>
            My practice moves between software, spatial design and interactive
            art. I’m interested in the moment a technical system stops feeling
            mechanical and starts feeling intuitive and human.
          </p>
          <p>
            I prototype with sensors, machine learning, realtime graphics and
            3D tools — turning research into experiences people can see, hear
            and move with.
          </p>
        </div>
        <div className="capability-grid">
          {capabilities.map((capability, index) => (
            <div key={capability}>
              <span>0{index + 1}</span>
              <p>{capability}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <p className="section-label">Contact</p>
          <h2>Let’s build<br />what’s next.</h2>
        </div>
        <div className="contact-links">
          <a href="https://github.com/YufeiJ1ao" target="_blank" rel="noreferrer">
            GitHub <span>↗</span>
          </a>
          <a href="https://www.youtube.com/@feiyu3451" target="_blank" rel="noreferrer">
            YouTube <span>↗</span>
          </a>
          <a href="mailto:jiaoyufei1103@gmail.com">
            Email <span>↗</span>
          </a>
        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} Yufei Jiao</p>
        <p>Creative technology · London</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
