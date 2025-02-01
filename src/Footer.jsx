import React from "react";
import "./index.css";

function Footer() {
  return (
    <section className="footer">
      <hr className="footer-seperator" />
      <section>
        <a href="#/contact">Contact Us</a> | <a href="#/about">Meet The Team</a>
      </section>
      <section className="footer-links">
        <a
          href="https://intuitivecs.ca/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Intuitive CS
        </a>{" "}
        by
        <a href="#/about" rel="noopener noreferrer" target="_blank">
          Parsa Esmkhani, Mahin Sindhwani, Shajan Alam
        </a>{" "}
        is licensed under
        <a
          href="https://creativecommons.org/licenses/by-nc-nd/4.0/?ref=chooser-v1"
          rel="license noopener noreferrer"
          target="_blank"
        >
          CC BY-NC-ND 4.0
        </a>
        .
      </section>
      <section className="footer-copyright">
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
          alt="CC"
          style={{ height: "22px", verticalAlign: "middle" }}
        />
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
          alt="BY"
          style={{ height: "22px", verticalAlign: "middle" }}
        />
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"
          alt="NC"
          style={{ height: "22px", verticalAlign: "middle" }}
        />
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/nd.svg"
          alt="ND"
          style={{ height: "22px", verticalAlign: "middle" }}
        />
      </section>
      <hr className="footer-seperator" />
    </section>
  );
}

export default Footer;
