import './styles.scss';

function Contact() {
  return (
    <section className="form">
      <div className="container">
        <h2 className="form__title">Contact Us Form</h2>
        <form className="form__control">
          <div className="form__group">
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              required
            />
          </div>
          <div className="form__group">
            <input type="text" id="lastName" placeholder="Last Name" required />
          </div>
          <div className="form__group">
            <input type="email" id="email" placeholder="Email" required />
          </div>
          <div className="form__group">
            <input type="tel" id="phone" placeholder="Phone Number" required />
          </div>
          <div className="form__group">
            <textarea id="message" placeholder="Message" rows={6} required />
          </div>
          <button type="submit" className="form__submit">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
