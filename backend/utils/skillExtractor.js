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

  if (!text) {
    return [];
  }

  const resumeText = text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  const foundSkills = [];


  // =========================================
  // JAVA
  // =========================================

  if (
    /\bjava\b/i.test(resumeText) ||
    /\bcore\s*java\b/i.test(resumeText)
  ) {
    foundSkills.push("Java");
  }


  // =========================================
  // PYTHON
  // =========================================

  if (/\bpython\b/i.test(resumeText)) {
    foundSkills.push("Python");
  }


  // =========================================
  // C++
  // =========================================

  if (
    resumeText.includes("c++") ||
    resumeText.includes("cpp") ||
    resumeText.includes("c plus plus")
  ) {
    foundSkills.push("C++");
  }


  // =========================================
  // C
  // =========================================

  if (/\bc\b/i.test(resumeText)) {
    foundSkills.push("C");
  }


  // =========================================
  // JAVASCRIPT
  // =========================================

  if (
    resumeText.includes("javascript") ||
    resumeText.includes("java script") ||
    /\bjs\b/i.test(resumeText)
  ) {
    foundSkills.push("JavaScript");
  }


  // =========================================
  // TYPESCRIPT
  // =========================================

  if (
    resumeText.includes("typescript") ||
    /\bts\b/i.test(resumeText)
  ) {
    foundSkills.push("TypeScript");
  }


  // =========================================
  // HTML
  // =========================================

  if (
    resumeText.includes("html") ||
    resumeText.includes("html5")
  ) {
    foundSkills.push("HTML");
  }


  // =========================================
  // CSS
  // =========================================

  if (
    resumeText.includes("css") ||
    resumeText.includes("css3")
  ) {
    foundSkills.push("CSS");
  }


  // =========================================
  // REACT
  // =========================================

  if (
    resumeText.includes("react") ||
    resumeText.includes("react.js") ||
    resumeText.includes("reactjs")
  ) {
    foundSkills.push("React");
  }


  // =========================================
  // NODE.JS
  // =========================================

  if (
    resumeText.includes("node.js") ||
    resumeText.includes("nodejs") ||
    /\bnode\b/i.test(resumeText)
  ) {
    foundSkills.push("Node.js");
  }


  // =========================================
  // EXPRESS
  // =========================================

  if (
    resumeText.includes("express") ||
    resumeText.includes("express.js") ||
    resumeText.includes("expressjs")
  ) {
    foundSkills.push("Express");
  }


  // =========================================
  // MONGODB
  // =========================================

  if (
    resumeText.includes("mongodb") ||
    resumeText.includes("mongo db") ||
    /\bmongo\b/i.test(resumeText)
  ) {
    foundSkills.push("MongoDB");
  }


  // =========================================
  // MYSQL
  // =========================================

  if (resumeText.includes("mysql")) {
    foundSkills.push("MySQL");
  }


  // =========================================
  // SQL
  // =========================================

  if (/\bsql\b/i.test(resumeText)) {
    foundSkills.push("SQL");
  }


  // =========================================
  // GIT
  // =========================================

  if (/\bgit\b/i.test(resumeText)) {
    foundSkills.push("Git");
  }


  // =========================================
  // GITHUB
  // =========================================

  if (
    resumeText.includes("github") ||
    resumeText.includes("git hub")
  ) {
    foundSkills.push("GitHub");
  }


  // =========================================
  // SPRING BOOT
  // =========================================

  if (
    resumeText.includes("spring boot") ||
    resumeText.includes("springboot") ||
    resumeText.includes("spring-boot")
  ) {
    foundSkills.push("Spring Boot");
  }


  // =========================================
  // REST API
  // =========================================

  if (
    resumeText.includes("rest api") ||
    resumeText.includes("restful api") ||
    resumeText.includes("restful")
  ) {
    foundSkills.push("REST API");
  }


  // =========================================
  // DOCKER
  // =========================================

  if (resumeText.includes("docker")) {
    foundSkills.push("Docker");
  }


  // =========================================
  // AWS
  // =========================================

  if (
    resumeText.includes("aws") ||
    resumeText.includes("amazon web services")
  ) {
    foundSkills.push("AWS");
  }


  // =========================================
  // AZURE
  // =========================================

  if (resumeText.includes("azure")) {
    foundSkills.push("Azure");
  }


  // =========================================
  // MACHINE LEARNING
  // =========================================

  if (
    resumeText.includes("machine learning") ||
    resumeText.includes("machine-learning") ||
    /\bml\b/i.test(resumeText)
  ) {
    foundSkills.push("Machine Learning");
  }


  // =========================================
  // DATA STRUCTURES
  // =========================================

  if (
    resumeText.includes("data structures") ||
    resumeText.includes("data structure")
  ) {
    foundSkills.push("Data Structures");
  }


  // =========================================
  // ALGORITHMS
  // =========================================

  if (
    resumeText.includes("algorithms") ||
    resumeText.includes("algorithm")
  ) {
    foundSkills.push("Algorithms");
  }


  // Remove duplicates
  return [...new Set(foundSkills)];
}

module.exports = extractSkills;