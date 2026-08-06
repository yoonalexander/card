type AboutSectionProps = {
  onLogoSecretClick?: () => void;
  isSecretFlowerVisible?: boolean;
};

export default function AboutSection({
  onLogoSecretClick,
  isSecretFlowerVisible = false,
}: AboutSectionProps) {
  return (
    <div className="about-profile">
      <section className="about-hero" aria-label="About Alex">
        <button
          className="about-avatar"
          type="button"
          aria-label="Alexander Yoon logo"
          onClick={onLogoSecretClick}
        />
        <div>
          <h3 className="about-name">Hi, I&apos;m Alex</h3>
          <p className="about-role">Software engineering graduate</p>
          <p className="about-role">
            <span className="about-highlight">AI</span>, <span className="about-highlight">machine learning</span>,{" "}
            <span className="about-highlight">data</span>, and{" "}
            <span className="about-highlight">product development</span>
          </p>
          <p className="about-role">
            Previous intern at{" "}
            <a
              className="about-link"
              href="https://www.amazon.com/b?ie=UTF8&node=16384500011"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon
            </a>{" "}
            and{" "}
            <a
              className="about-link"
              href="https://www.cibc.com/en/personal-banking.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              CIBC
            </a>
          </p>
        </div>
      </section>

      {isSecretFlowerVisible ? <SecretLily /> : null}

      <section className="about-block">
        <h4 className="about-heading">What I Do</h4>
        <p className="section-copy">
          I like building practical software that connects technical systems with interfaces people
          can actually use. Lately, I&apos;ve been especially interested in{" "}
          <span className="about-highlight">AI tools</span>, <span className="about-highlight">ML workflows</span>,{" "}
          <span className="about-highlight">data-heavy products</span>, and small{" "}
          <span className="about-highlight">interactive web projects</span>.
        </p>
        <ul className="section-list">
          <li>Build web apps and interactive experiences.</li>
          <li>
            Explore <span className="about-highlight">machine learning models</span>, APIs, and{" "}
            <span className="about-highlight">data pipelines</span>.
          </li>
          <li>Turn project ideas into clean, usable demos.</li>
        </ul>
      </section>

      <section className="about-block">
        <h4 className="about-heading">Education</h4>
        <div className="about-callout">
          <p className="about-callout-title">Bachelor&apos;s of Software Engineering</p>
          <p className="about-callout-copy">Mcmaster University, Graduated 2026.</p>
        </div>
      </section>

      <section className="about-block">
        <h4 className="about-heading">Other Interests</h4>
        <ul className="section-list">
          <li>Playing volleyball.</li>
          <li>Reading manga.</li>
          <li>Finding great food spots.</li>
          <li>Thrifting and hunting for small treasures.</li>
        </ul>
      </section>
    </div>
  );
}

function SecretLily() {
  return (
    <a className="secret-lily" href="/bunny" aria-label="Follow the lily">
      <span className="secret-lily-sparkles" aria-hidden="true">
        ✦ · ✦
      </span>
      <svg viewBox="-34 -38 68 100" aria-hidden="true">
        <path className="secret-lily-stem" d="M0 17 C-3 31 2 46-2 61" />
        <path className="secret-lily-leaf" d="M-1 43 C-20 30-25 48-3 52Z" />
        <g className="secret-lily-head">
          {Array.from({ length: 6 }, (_, index) => (
            <ellipse
              key={index}
              cx="0"
              cy="-11"
              rx="7"
              ry="16"
              transform={`rotate(${index * 60})`}
            />
          ))}
          <circle cx="0" cy="0" r="6.5" />
        </g>
      </svg>
    </a>
  );
}
