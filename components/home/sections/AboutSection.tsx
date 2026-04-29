export default function AboutSection() {
  return (
    <div className="about-profile">
      <section className="about-hero" aria-label="About Alex">
        <div className="about-avatar" role="img" aria-label="Alexander Yoon logo" />
        <div>
          <h3 className="about-name">Hi, I&apos;m Alex</h3>
          <p className="about-role">Software engineering graduate</p>
          <p className="about-role">AI, machine learning, data, and product development</p>
          <p className="about-role">Previous intern at Amazon and CIBC</p>
        </div>
      </section>

      <section className="about-block">
        <h4 className="about-heading">What I Do</h4>
        <p className="section-copy">
          I like building practical software that connects technical systems with interfaces people
          can actually use. Lately, I&apos;ve been especially interested in AI tools, ML workflows,
          data-heavy products, and small interactive web projects.
        </p>
        <ul className="section-list">
          <li>Build web apps and interactive experiences.</li>
          <li>Explore machine learning models, APIs, and data pipelines.</li>
          <li>Turn project ideas into clean, usable demos.</li>
        </ul>
      </section>

      <section className="about-block">
        <h4 className="about-heading">Education</h4>
        <div className="about-callout">
          <p className="about-callout-title">Software Engineering</p>
          <p className="about-callout-copy">Graduate focused on software systems, AI, data, and product-minded development.</p>
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

      <section className="about-block">
        <h4 className="about-heading">Currently Curious About</h4>
        <p className="section-copy">
          Recommendation systems, useful AI assistants, game-like interfaces, and ways to make
          technical work feel more approachable.
        </p>
      </section>
    </div>
  );
}
