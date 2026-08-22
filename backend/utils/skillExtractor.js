const skillsList = [
  "Java",
  "Python",
  "C",
  "C++",
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "MySQL",
  "SQL",
  "Git",
  "GitHub",
  "Spring Boot",
  "REST API",
  "Docker",
  "AWS",
  "Azure",
  "Machine Learning",
  "Data Structures",
  "Algorithms"
];

function extractSkills(text) {

  const foundSkills = [];

  const resumeText = text.toLowerCase();

  skillsList.forEach((skill) => {

    let searchSkill = skill.toLowerCase();

    // Handle common variations
    if (skill === "React") {
      if (
        resumeText.includes("react") ||
        resumeText.includes("react.js")
      ) {
        foundSkills.push("React");
      }
    }

    else if (skill === "Node.js") {
      if (
        resumeText.includes("node") ||
        resumeText.includes("node.js") ||
        resumeText.includes("nodejs")
      ) {
        foundSkills.push("Node.js");
      }
    }

    else if (skill === "JavaScript") {
      if (
        resumeText.includes("javascript") ||
        resumeText.includes("java script") ||
        resumeText.includes("js")
      ) {
        foundSkills.push("JavaScript");
      }
    }

    else if (skill === "HTML") {
      if (
        resumeText.includes("html") ||
        resumeText.includes("html5")
      ) {
        foundSkills.push("HTML");
      }
    }

    else if (skill === "CSS") {
      if (
        resumeText.includes("css") ||
        resumeText.includes("css3")
      ) {
        foundSkills.push("CSS");
      }
    }

    else if (skill === "MongoDB") {
      if (
        resumeText.includes("mongodb") ||
        resumeText.includes("mongo db") ||
        resumeText.includes("mongo")
      ) {
        foundSkills.push("MongoDB");
      }
    }

    else if (skill === "C++") {
      if (
        resumeText.includes("c++") ||
        resumeText.includes("cpp")
      ) {
        foundSkills.push("C++");
      }
    }

    else {

      if (resumeText.includes(searchSkill)) {
        foundSkills.push(skill);
      }

    }

  });

  // Remove duplicate skills
  return [...new Set(foundSkills)];
}

module.exports = extractSkills;