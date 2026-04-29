export default function ContactSection() {
  return (
    <div className="contact-card">
      <h3>yay mail!</h3>
      <p>
        The easiest way to contact me is through email. Whether it&apos;s projects, work, matcha,
        volleyball, or food recommendations, send it my way.
      </p>
      <img src="/assets/images/me_with_cat.jpg" alt="Alex with his cat" />
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
