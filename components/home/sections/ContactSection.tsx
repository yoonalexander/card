type ContactSectionProps = {
  onCatSecretClick?: () => void;
};

export default function ContactSection({ onCatSecretClick }: ContactSectionProps) {
  return (
    <div className="contact-card">
      <h3>yay mail!</h3>
      <p>
        The easiest way to contact me is through email. Whether it&apos;s projects, work, matcha,
        volleyball, or food recommendations, send it my way.
      </p>
      <button
        className="contact-cat-secret"
        type="button"
        aria-label="Alex with his cat"
        onClick={onCatSecretClick}
      >
        <img
          src="/assets/images/me_with_cat.jpg"
          alt=""
          width={2160}
          height={2880}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          draggable="false"
        />
      </button>
      <p className="contact-cat-note">anyways here&apos;s an image of me with my cat</p>
      <p className="contact-email">
        email me at: <a href="mailto:alexanderyoon02@gmail.com">alexanderyoon02@gmail.com</a>
      </p>
      <a className="contact-mail-button" href="mailto:alexanderyoon02@gmail.com">
        send me an email!
      </a>
    </div>
  );
}
