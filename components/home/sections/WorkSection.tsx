export default function WorkSection() {
  return (
    <div className="work-panel">
      <section className="work-note">
        <p>
          <strong>Software engineering graduate</strong> building around AI, machine learning, data,
          Android, and interactive products.
        </p>
      </section>

      <section className="work-skill-grid" aria-label="Technical skills">
        <div>
          <h3 className="work-heading">Development</h3>
          <div className="skill-chips">
            <span>Python</span>
            <span>Java</span>
            <span>Kotlin</span>
            <span>SQL</span>
            <span>C</span>
            <span>C++</span>
            <span>JavaScript</span>
            <span>React</span>
            <span>React Native</span>
            <span>Next.js</span>
            <span>Node.js</span>
            <span>HTML/CSS</span>
          </div>
        </div>

        <div>
          <h3 className="work-heading">Tools & Data</h3>
          <div className="skill-chips">
            <span>Git</span>
            <span>GitHub</span>
            <span>Docker</span>
            <span>AWS</span>
            <span>Azure</span>
            <span>CI/CD</span>
            <span>Databricks</span>
            <span>Pandas</span>
            <span>NumPy</span>
            <span>PyTorch</span>
            <span>TensorFlow</span>
            <span>MongoDB</span>
          </div>
        </div>
      </section>

      <section className="work-experience" aria-label="Internship experience">
        <h3 className="work-heading">Experience</h3>

        <article className="experience-card">
          <img src="/assets/icons/Amazon.png" alt="Amazon logo" />
          <div>
            <div className="experience-header">
              <div>
                <h4>Software Development Engineer Intern - Android</h4>
                <p>Amazon · Vancouver, BC · May 2025 - Aug. 2025</p>
              </div>
            </div>
            <ul>
              <li>Built Overnight Upload for Amazon Photos Android, increasing full backup completion by 15%.</li>
              <li>Developed Kotlin work across Android UI and AWS-backed services to improve upload reliability.</li>
              <li>Designed metrics dashboards and alarms, reducing mean time to detect failures by 30%.</li>
              <li>Owned feature development from design to deployment within a large-scale Android system.</li>
            </ul>
          </div>
        </article>

        <article className="experience-card">
          <img src="/assets/icons/CIBC.png" alt="CIBC logo" />
          <div>
            <div className="experience-header">
              <div>
                <h4>Software Engineer Intern - Salesforce ECRM</h4>
                <p>CIBC · Toronto, ON · Sep. 2024 - Apr. 2025</p>
              </div>
            </div>
            <ul>
              <li>Built Azure Data Factory and Databricks pipelines for scalable ML workflows.</li>
              <li>Developed Python services and REST APIs to automate reporting and data-driven insights.</li>
              <li>Engineered NumPy and Pandas feature pipelines for preprocessing and large-dataset analysis.</li>
              <li>Integrated ML solutions into Salesforce ECRM for production model-driven features.</li>
            </ul>
          </div>
        </article>
      </section>
    </div>
  );
}
