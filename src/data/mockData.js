export const SEMESTER = "2nd Semester · SY 2025–2026";

export const USERS = {
  student: { id: "student", password: "123", role: "student", name: "Melcrist T. Alvarez", info: "BSCS 3-G · CEAFA", avatar: "M" },
  chairperson: { id: "chairperson", password: "123", role: "chairperson", name: "Dr. Angela R. Vidal", info: "Program Chair · CASE", avatar: "A" },
  hr: { id: "hr", password: "123", role: "hr", name: "Jessa T. Manalo", info: "HR Officer · Tertiary", avatar: "J" },
  dean: { id: "dean", password: "123", role: "dean", name: "Monkey D. Garp", info: "Dean · CASE", avatar: "M" },
};

export const facultyList = [
  { id: "F001", name: "Prof. Rowena M. Hingco", dept: "CEAFA", subject: "Application Development & Emerging Technologies", code: "CC 106 / CC 106.1", studentScore: 4.35, chairScore: 4.60, compositeScore: 4.43, responses: 87, status: "good", chairEvaluated: true, chairScoreBreakdown: { co: "4.7", re: "4.5", ce: "4.4", pf: "4.6" } },
  { id: "F002", name: "Prof. Noel A. De Leon", dept: "CEAFA", subject: "Introduction to Intelligent Systems", code: "CS Elec 3 / CS Elec 3.1", studentScore: 4.08, chairScore: 4.30, compositeScore: 4.14, responses: 84, status: "good", chairEvaluated: true, chairScoreBreakdown: { co: "4.3", re: "4.2", ce: "4.4", pf: "4.3" } },
  { id: "F003", name: "Prof. Diana R. Navarro", dept: "CEAFA", subject: "CS Free Elective 1", code: "CS Free Elec 1 / 1.1", studentScore: 3.68, chairScore: 3.95, compositeScore: 3.76, responses: 82, status: "average", chairEvaluated: false, chairScoreBreakdown: null },
  { id: "F004", name: "Prof. Sofia G. Balasta", dept: "CEAFA", subject: "Great Books", code: "GE 12-GB", studentScore: 4.52, chairScore: 4.75, compositeScore: 4.60, responses: 91, status: "excellent", chairEvaluated: true, chairScoreBreakdown: { co: "4.8", re: "4.6", ce: "4.9", pf: "4.7" } },
  { id: "F005", name: "Prof. Vicente L. Bertillo", dept: "CEAFA", subject: "Christian Vision of the Human Society", code: "IO-RE 3", studentScore: 4.20, chairScore: 4.45, compositeScore: 4.28, responses: 88, status: "good", chairEvaluated: false, chairScoreBreakdown: null },
  { id: "F006", name: "Prof. Jose C. Damo", dept: "CEAFA", subject: "Networks & Communications", code: "NC 101 / NC 101.1", studentScore: 3.72, chairScore: 4.10, compositeScore: 3.85, responses: 83, status: "average", chairEvaluated: false, chairScoreBreakdown: null },
  { id: "F007", name: "Prof. Sherry Mae R. Llandelar", dept: "CEAFA", subject: "CS Thesis 1", code: "THS 101", studentScore: 4.62, chairScore: 4.85, compositeScore: 4.70, responses: 90, status: "excellent", chairEvaluated: true, chairScoreBreakdown: { co: "4.9", re: "4.8", ce: "4.7", pf: "4.9" } },
];

export const aiFeedbackMap = {
  F001: {
    strengths: [
      "Students consistently praised Prof. Hingco's practical demonstrations and clear explanations of application development concepts.",
      "Her responsiveness to questions and use of real-world code examples received top marks.",
    ],
    improvements: [
      "Grading turnaround for project submissions could be faster; a published rubric was frequently requested.",
      "Additional lab catch-up sessions were suggested for students who fall behind during complex topics.",
    ],
    citations: [
      '"The way she explains APIs and frameworks is really clear — I never felt lost." — Response #34',
      '"Would appreciate faster feedback on our project drafts." — Response #61',
    ],
    recommendation: "Prof. Hingco demonstrates strong pedagogical skills. Publishing project rubrics in advance and scheduling regular lab catch-up sessions are recommended.",
    chairRemarks: "Prof. Hingco demonstrates strong classroom management and clear alignment between lessons and course outcomes. Her engagement with student projects shows genuine mentorship beyond required instruction.",
  },
  F007: {
    strengths: [
      "Students praised Prof. Llandelar's structured guidance throughout the thesis process, describing feedback as specific and actionable.",
      "Her commitment and availability outside class hours were noted positively by the majority of evaluators.",
    ],
    improvements: [
      "Earlier orientation on thesis formatting standards would reduce revisions later in the semester.",
      "More structured peer-review sessions would help develop critical thinking skills.",
    ],
    citations: [
      '"Her comments on our drafts are always detailed and helpful." — Response #12',
      '"Wish we had a formatting guide from day one." — Response #55',
    ],
    recommendation: "Prof. Llandelar is an exceptional thesis supervisor. Introducing a formatting guide in week one and structured peer-review sessions are advised.",
    chairRemarks: "An outstanding thesis supervisor. Prof. Llandelar's dedication to student research outcomes is exemplary. I recommend her for departmental research leadership consideration.",
  },
};

export const evaluationCriteria = [
  { id: "e1", category: "Teaching Effectiveness", prompt: "The faculty explains lessons in a clear, organized, and understandable manner." },
  { id: "e2", category: "Subject Matter Mastery", prompt: "The faculty demonstrates comprehensive and current knowledge of the subject." },
  { id: "e3", category: "Communication & Clarity", prompt: "The faculty communicates expectations, feedback, and instructions clearly." },
  { id: "e4", category: "Student Engagement", prompt: "The faculty encourages participation, questions, and critical thinking." },
  { id: "e5", category: "Professional Conduct", prompt: "The faculty demonstrates punctuality, fairness, and professional respect." },
];

export const studentSubmissions = [];

export const departmentStats = [
  { dept: "CEAFA", full: "Engineering, Architecture & Fine Arts", faculty: 7, avgScore: 4.25, responses: 605, evaluated: 4 },
  { dept: "CASE", full: "Arts, Sciences & Education", faculty: 5, avgScore: 4.13, responses: 1200, evaluated: 3 },
  { dept: "CBMA", full: "Business Management & Accountancy", faculty: 3, avgScore: 4.31, responses: 420, evaluated: 3 },
  { dept: "CHS", full: "Health Sciences", faculty: 4, avgScore: 4.44, responses: 380, evaluated: 4 },
];

// Audit log entries with hashed inputs (SHA-256 simulation)
export const auditLogs = [
  {
    timestamp: "2026-01-16 08:42",
    faculty: "Prof. Rowena M. Hingco",
    chairRemarks: "Prof. Hingco demonstrates strong classroom management and clear alignment between lessons and course outcomes. Her engagement with student projects shows genuine mentorship beyond required instruction.",
    code: "CC 106",
    inputs: 87,
    hash: "a3f8c2d91e4b7f...",
    chairHash: "e9a2b4c17f83d1...",
    status: "success",
    studentHashes: [
      "5f4dcc3b5aa765d61d8327deb882cf99a3f8c2d9...",
      "6b86b273ff34fce19d6b804eff5a3f92c3c1c0bc...",
      "d41d8cd98f00b204e9800998ecf8427ea3f8c2d9...",
      "3295c76acbf4cffef7d9f1b5c1b7f4c6a3f8c2d9...",
      "a87ff679a2f3e71d9181a67b7542122c2d9a3f8c...",
    ],
  },
  {
    timestamp: "2026-01-16 08:38",
    faculty: "Prof. Sherry Mae R. Llandelar",
    chairRemarks: "An outstanding thesis supervisor. Prof. Llandelar's dedication to student research outcomes is exemplary. I recommend her for departmental research leadership consideration.",
    code: "THS 101",
    inputs: 90,
    hash: "b7e1a4c02f9d3e...",
    chairHash: "f1c3b5a97e42d8...",
    status: "success",
    studentHashes: [
      "7b774effe4a349c6dd82ad4f4f21d34c7b774eff...",
      "1c7d9b6a2f4e8c3b5a97e42d8f1c3b5a97e42d8...",
      "9d3e2f8a4c1b7f5e3a92c3c1c0bc6b86b273ff34...",
      "2a4f8c1b7f5e3a92c3c1c0bc6b86b273ff34fce1...",
      "c4ca4238a0b923820dcc509a6f75849bc4ca4238...",
    ],
  },
  {
    timestamp: "2026-01-16 08:35",
    faculty: "Prof. Sofia G. Balasta",
    chairRemarks: "Prof. Balasta brings exceptional energy to General Education subjects. Students respond very positively to her Socratic approach and the depth of her subject integration.",
    code: "GE 12-GB",
    inputs: 91,
    hash: "d2f9b3e41a7c6f...",
    chairHash: "c8e4a9b2f7d1e3...",
    status: "success",
    studentHashes: [
      "eccbc87e4b5ce2fe28308fd9f2a7baf3eccbc87e...",
      "c4ca4238a0b923820dcc509a6f75849bc4ca4238...",
      "4a8a08f09d37b73795649038408b5f33eccbc87e...",
      "8277e0910d750195b448797616e091ad4a8a08f0...",
      "e4da3b7fbbce2345d7772b0674a318d54a8a08f0...",
    ],
  },
  {
    timestamp: "2026-01-16 08:30",
    faculty: "Prof. Noel A. De Leon",
    chairRemarks: "Prof. De Leon maintains strong theoretical foundations in his courses. Recommend additional focus on applied problem-solving exercises to complement his research background.",
    code: "CS Elec 3",
    inputs: 84,
    hash: "e5c2d7f83b1a4e...",
    chairHash: "a7b4c2d9e1f8b3...",
    status: "success",
    studentHashes: [
      "1679091c5a880faf6fb5e6087eb1b2dc1679091c...",
      "8f14e45fceea167a5a36dedd4bea2543a0b923820...",
      "c9f0f895fb98ab9159f51fd0297e236d8f14e45f...",
      "45c48cce2e2d7fbdea1afc51c7c6ad26c9f0f895...",
      "d3d9446802a44259755d38e6d163e820c9f0f895...",
    ],
  },
];