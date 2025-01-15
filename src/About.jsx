// src/About.jsx

import React from "react";
import "./About.css"; // We'll create this CSS file next
import ParsaImage from "./assets/parsa.jpg";
import MahinImage from "./assets/mahin.jpg";
import ShajanImage from "./assets/shajan.jpg";

const teamMembers = [
  {
    name: "Parsa Esmkhani",
    role: "Frontend Developer",
    image: ParsaImage,
    bio: "Parsa is passionate about creating intuitive user interfaces and ensuring seamless user experiences.",
  },
  {
    name: "Mahin Sindhwani",
    role: "Backend Developer",
    image: MahinImage,
    bio: "Mahin specializes in server-side logic, database management, and API integrations.",
  },
  {
    name: "Shajan Alam",
    role: "Full Stack Developer",
    image: ShajanImage,
    bio: "Shajan bridges the gap between frontend and backend, ensuring cohesive and efficient application development.",
  },
];

const About = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <p>
        Welcome to Intuitive CS! We are a team of passionate developers dedicated to creating interactive visualizations that make complex computer science concepts easy to understand.
      </p>
      <h2>Meet the Team</h2>
      <div className="team-members">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <img src={member.image} alt={`${member.name}`} />
            <h3>{member.name}</h3>
            <h4>{member.role}</h4>
            <p>{member.bio}</p>
          </div>
        ))}
      </div>
      <h2>Why We Created This Website</h2>
      <p>
        Our mission is to provide students and educators with interactive tools that enhance learning and teaching experiences. By visualizing functions, predicates, and relations, we aim to bridge the gap between theoretical concepts and practical understanding.
      </p>
    </div>
  );
};

export default About;
