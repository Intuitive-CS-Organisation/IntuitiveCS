// src/About.jsx

import React from "react";
import "./About.css"; // We'll create this CSS file next
import ParsaImage from "./assets/parsa.jpg";
import MahinImage from "./assets/mahin.jpg";
import ShajanImage from "./assets/shajan.jpg";

const teamMembers = [
  {
    name: "Parsa Esmkhani",
    role: "The Theory Guy",
    image: ParsaImage,
    bio: (
      <>
        <p>
          Hey, my name is Parsa and I’m super passionate about all things
          theoretical computer science. Stuff like logic, algorithms, complexity
          theory, AI, game theory, fairness theory, graphs and a bunch of other
          nerdy stuff that I love learning.
        </p>
        <p>
          Contribution: I worked on the theoretical explanations behind concepts
          and the math/algorithms required to implement them.
        </p>
        <p>
          Special thanks to Steph McIntyre, Noah Fleming, Antonina Kolokolova,
          Todd Wareham, and Rylo Ashmore for teaching me much of what I know
          about theoretical CS.
        </p>
        <p>
          For any questions/comments/ideas, please reach out to me at{" "}
          <a href="mailto:parsa@intuitivecs.ca">parsa@intuitivecs.ca</a>.
        </p>
      </>
    ),
  },
  {
    name: "Mahin Sindhwani",
    role: "The Coding Guy",
    image: MahinImage,
    bio: (
      <>
        <p>
          Hi! My name is Mahin, and I love trying new things—whether it’s
          experimenting with new tech, exploring software, or tackling real-life
          challenges. I’m passionate about coding, math, and solving problems.
          Basically, if it’s nerdy, I’m into it.
        </p>
        <p>
          I also love games, and my ultimate career goal is to become a game
          developer.
        </p>
        <p>
          Contribution: I worked on the main coding for all the elements and
          features of this website, focusing mainly on implementing React Flow
          and visualizing the concepts.
        </p>
        <p>
          For any questions, comments, or ideas, feel free to reach out to me at{" "}
          <a href="mailto:mahin@intuitivecs.ca">mahin@intuitivecs.ca</a>.
        </p>
      </>
    ),
  },
  {
    name: "Shajan Alam",
    role: "The Content Guy",
    image: ShajanImage,
    bio: (
      <>
        <p>
          Hello! I’m Shajan, the wordsmith behind our project’s content. I focus
          on creating clear, engaging, and informative content that effectively
          communicates our ideas and concepts. My goal is to ensure that our
          website is not only technically sound but also rich in valuable
          information for our users.
        </p>
        <p>
          Contribution: I developed and managed the website’s content, ensuring
          that theoretical concepts explained by Parsa are clearly communicated.
          I also collaborated with Mahin to integrate content seamlessly with
          the implemented features.
        </p>
        <p>
          For any content-related questions or suggestions, feel free to contact
          me at <a href="mailto:shajan@intuitivecs.ca">shajan@intuitivecs.ca</a>
          .
        </p>
      </>
    ),
  },
];

const About = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      {/* <p>
        Welcome to Intuitive CS! We are a team of passionate individuals
        dedicated to creating interactive visualizations that make complex
        computer science concepts easy to understand.
      </p> */}
      <h2>Meet the Team</h2>
      <div className="team-members">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <img
              src={member.image}
              alt={`${member.name}`}
              className="team-member-image"
            />
            <h3>{member.name}</h3>
            <h4>{member.role}</h4>
            <p>{member.bio}</p>
          </div>
        ))}
      </div>
      {/* <h2>Why We Created This Website</h2>
      <p>
        Our mission is to provide students and educators with interactive tools
        that enhance learning and teaching experiences. By visualizing
        functions, predicates, and relations, we aim to bridge the gap between
        theoretical concepts and practical understanding.
      </p> */}
    </div>
  );
};

export default About;
