export const SEMESTER = "2nd Semester - SY 2025-2026";

export const USERS = {
  student:     { id:"student",     password:"123", role:"student",     name:"Melcrist T. Alvarez",  info:"BSCS 3-G - CEAFA", avatar:"M" },
  chairperson: { id:"chairperson", password:"123", role:"chairperson", name:"Dr. Angela R. Vidal",  info:"Program Chair - CEAFA", avatar:"A" },
  hr:          { id:"hr",          password:"123", role:"hr",          name:"Jessa T. Manalo",      info:"HR Officer - Tertiary", avatar:"J" },
  dean:        { id:"dean",        password:"123", role:"dean",        name:"Dr. Ramon C. Fontillas", info:"Department Head / Dean - CEAFA", avatar:"D" },
  faculty:     { id:"faculty",     password:"123", role:"faculty",     name:"Prof. Rowena M. Hingco", info:"Faculty - CEAFA - CC 106", avatar:"R", facultyId:"F001" },
};

// Initial faculty list with mathematically accurate 30/40/30 composite scores
export const facultyList = [
  { id:"F001", name:"Prof. Rowena M. Hingco",       dept:"CEAFA", subject:"Application Development & Emerging Technologies", code:"CC 106 / CC 106.1",   employmentType:"Full-Time", studentScore:4.35, chairScore:4.60, deanScore:4.50, compositeScore:4.50, responses:87, status:"excellent",   chairEvaluated:true,  deanEvaluated:true,  chairScoreBreakdown:{jc:"4.70",jf:"4.50",pq:"4.60"}, deanScoreBreakdown:{jc:"4.60",jf:"4.40",pq:"4.50"} },
  { id:"F002", name:"Prof. Noel A. De Leon",         dept:"CEAFA", subject:"Introduction to Intelligent Systems",           code:"CS Elec 3 / CS Elec 3.1", employmentType:"Full-Time", studentScore:4.08, chairScore:null, deanScore:null, compositeScore:4.08, responses:84, status:"good",        chairEvaluated:false,  deanEvaluated:false, chairScoreBreakdown:null, deanScoreBreakdown:null },
  { id:"F003", name:"Prof. Diana R. Navarro",        dept:"CEAFA", subject:"CS Free Elective 1",                            code:"CS Free Elec 1 / 1.1", employmentType:"Part-Time", studentScore:3.68, chairScore:null, deanScore:null, compositeScore:3.68, responses:82, status:"average",     chairEvaluated:false, deanEvaluated:false, chairScoreBreakdown:null, deanScoreBreakdown:null },
  { id:"F004", name:"Prof. Sofia G. Balasta",        dept:"CEAFA", subject:"Great Books",                                   code:"GE 12-GB",             employmentType:"Full-Time", studentScore:4.52, chairScore:4.75, deanScore:4.65, compositeScore:4.65, responses:91, status:"excellent",   chairEvaluated:true,  deanEvaluated:true,  chairScoreBreakdown:{jc:"4.80",jf:"4.60",pq:"4.90"}, deanScoreBreakdown:{jc:"4.70",jf:"4.50",pq:"4.80"} },
  { id:"F005", name:"Prof. Vicente L. Bertillo",     dept:"CEAFA", subject:"Christian Vision of the Human Society",        code:"IO-RE 3",               employmentType:"Part-Time", studentScore:4.20, chairScore:null, deanScore:null, compositeScore:4.20, responses:88, status:"good",        chairEvaluated:false, deanEvaluated:false, chairScoreBreakdown:null, deanScoreBreakdown:null },
  { id:"F006", name:"Prof. Jose C. Damo",            dept:"CEAFA", subject:"Networks & Communications",                    code:"NC 101 / NC 101.1",     employmentType:"Part-Time", studentScore:3.72, chairScore:null, deanScore:null, compositeScore:3.72, responses:83, status:"average",     chairEvaluated:false, deanEvaluated:false, chairScoreBreakdown:null, deanScoreBreakdown:null },
  { id:"F007", name:"Prof. Sherry Mae R. Llandelar", dept:"CEAFA", subject:"CS Thesis 1",                                  code:"THS 101",              employmentType:"Full-Time", studentScore:4.62, chairScore:4.85, deanScore:4.75, compositeScore:4.75, responses:90, status:"excellent",   chairEvaluated:true,  deanEvaluated:true,  chairScoreBreakdown:{jc:"4.90",jf:"4.80",pq:"4.70"}, deanScoreBreakdown:{jc:"4.80",jf:"4.70",pq:"4.80"} },
];

export const aiFeedbackMap = {
  F001: {
    strengths:[
      "Students consistently praised the practical demonstrations and clear explanations of application development concepts.",
      "Responsiveness to questions and use of real-world code examples received top marks.",
    ],
    improvements:[
      "Grading turnaround for project submissions could be faster; a published rubric was frequently requested.",
      "Additional lab catch-up sessions were suggested for students who fall behind during complex topics.",
    ],
    citations:[
      { id: 34, text: "The way she explains APIs and frameworks is really clear. I never felt lost.", ratings: { "Teaching Effectiveness": 5, "Subject Mastery": 5, "Communication": 5, "Engagement": 4, "Professionalism": 5 } },
      { id: 61, text: "Would appreciate faster feedback on our project drafts. Sometimes we wait a week to know if we are on the right track.", ratings: { "Teaching Effectiveness": 4, "Subject Mastery": 4, "Communication": 3, "Engagement": 4, "Professionalism": 4 } },
      { id: 82, text: "Very approachable during consultation hours. Always willing to debug code with us.", ratings: { "Teaching Effectiveness": 5, "Subject Mastery": 5, "Communication": 5, "Engagement": 5, "Professionalism": 5 } },
      { id: 104, text: "The lesson is great, but the pace gets really fast during the backend database integration part.", ratings: { "Teaching Effectiveness": 4, "Subject Mastery": 5, "Communication": 4, "Engagement": 3, "Professionalism": 5 } }
    ],
    recommendation:"Demonstrates strong pedagogical skills. Publishing project rubrics in advance and scheduling regular lab catch-up sessions are recommended to address minor pacing issues.",
    chairRemarks:"Demonstrates strong classroom management and clear alignment between lessons and course outcomes. Her engagement with student projects shows genuine mentorship beyond required instruction.",
    deanRemarks:"Review of syllabus and research output indicates excellent academic alignment; community involvement meets college targets. Suggest focusing on faster grading turnaround.",
  },
  F007: {
    strengths:[
      "Students praised the structured guidance throughout the thesis process, describing feedback as specific and actionable.",
      "Commitment and availability outside class hours were noted positively by the majority of evaluators.",
    ],
    improvements:[
      "Earlier orientation on thesis formatting standards would reduce revisions later in the semester.",
      "More structured peer-review sessions would help develop critical thinking skills.",
    ],
    citations:[
      { id: 12, text: "Her comments on our drafts are always detailed and helpful. We know exactly what to fix.", ratings: { "Teaching Effectiveness": 5, "Subject Mastery": 5, "Communication": 5, "Engagement": 5, "Professionalism": 5 } },
      { id: 55, text: "Wish we had a formatting guide from day one instead of figuring it out near the deadline.", ratings: { "Teaching Effectiveness": 4, "Subject Mastery": 5, "Communication": 3, "Engagement": 4, "Professionalism": 4 } },
      { id: 68, text: "Very supportive adviser. Even replies to our queries on weekends when deadlines are near.", ratings: { "Teaching Effectiveness": 5, "Subject Mastery": 5, "Communication": 5, "Engagement": 5, "Professionalism": 5 } },
      { id: 91, text: "We need more opportunities to review other groups' papers to learn from their mistakes.", ratings: { "Teaching Effectiveness": 4, "Subject Mastery": 5, "Communication": 4, "Engagement": 3, "Professionalism": 5 } }
    ],
    recommendation:"An exceptional thesis supervisor. Introducing a formatting guide in week one and structured peer-review sessions are advised to streamline the research process.",
    chairRemarks:"An outstanding thesis supervisor. Dedication to student research outcomes is exemplary. I recommend her for departmental research leadership consideration.",
    deanRemarks:"High quality research outputs and consistent student support. Highly recommended for continued thesis advisory roles.",
  },
  F004: {
    strengths:[
      "Ability to relate historical literature to current events keeps students highly engaged.",
      "Open discussions foster a welcoming environment where students feel comfortable sharing diverse opinions.",
    ],
    improvements:[
      "Some students noted that the reading load was occasionally overwhelming without enough time to process.",
      "Providing reading guides prior to complex texts could improve comprehension.",
    ],
    citations:[
      { id: 18, text: "She makes old books feel so relevant to our lives today. The class is never boring.", ratings: { "Teaching Effectiveness": 5, "Subject Mastery": 5, "Communication": 5, "Engagement": 5, "Professionalism": 5 } },
      { id: 42, text: "The reading pace was a bit too fast in the middle of the semester. Hard to keep up with the chapters.", ratings: { "Teaching Effectiveness": 4, "Subject Mastery": 5, "Communication": 4, "Engagement": 4, "Professionalism": 4 } },
      { id: 73, text: "Always encourages us to speak up even if our interpretation of the text is different from hers.", ratings: { "Teaching Effectiveness": 5, "Subject Mastery": 5, "Communication": 5, "Engagement": 5, "Professionalism": 5 } },
      { id: 89, text: "A summary or guide question sheet before reading would really help us focus on the important parts.", ratings: { "Teaching Effectiveness": 4, "Subject Mastery": 5, "Communication": 4, "Engagement": 4, "Professionalism": 5 } }
    ],
    recommendation:"Excels in creating an engaging classroom atmosphere. Integrating brief reading guides for heavier texts is recommended to support student pacing.",
    chairRemarks:"Excellent facilitation of class discussions. Demonstrates deep subject mastery and promotes an open atmosphere.",
    deanRemarks:"Strong manifestation of Thomasian values in teaching. Continues to be a highly effective educator in the General Education department.",
  }
};

export const departmentStats = [
  { dept:"CEAFA", full:"Engineering, Architecture & Fine Arts", faculty:7, avgScore:4.25, responses:605,  evaluated:4 },
  { dept:"CASE",  full:"Arts, Sciences & Education",            faculty:5, avgScore:4.13, responses:1200, evaluated:3 },
  { dept:"CBMA",  full:"Business Management & Accountancy",     faculty:3, avgScore:4.31, responses:420,  evaluated:3 },
  { dept:"CHS",   full:"Health Sciences",                       faculty:4, avgScore:4.44, responses:380,  evaluated:4 },
];

export const evaluationCriteria = [
  { id:"e1", category:"Teaching Effectiveness",  prompt:"The faculty explains lessons in a clear, organized, and understandable manner."  },
  { id:"e2", category:"Subject Matter Mastery",  prompt:"The faculty demonstrates comprehensive and current knowledge of the subject."    },
  { id:"e3", category:"Communication & Clarity", prompt:"The faculty communicates expectations, feedback, and instructions clearly."      },
  { id:"e4", category:"Student Engagement",      prompt:"The faculty encourages participation, questions, and critical thinking."         },
  { id:"e5", category:"Professional Conduct",    prompt:"The faculty demonstrates punctuality, fairness, and professional respect."       },
];

export const studentSubmissions = [
  { facultyId: "F001", facultyName: "Prof. Rowena M. Hingco", subject: "Application Development & Emerging Technologies", submittedAt: "2026-03-10", avg: 4.5 },
  { facultyId: "F004", facultyName: "Prof. Sofia G. Balasta", subject: "Great Books", submittedAt: "2026-03-12", avg: 4.8 }
];

export const auditLogs = [
  {
    timestamp: "2026-04-10 09:15",
    faculty: "Prof. Rowena M. Hingco",
    code: "CC 106",
    inputs: 87,
    hash: "a7d9f2b4e1a...",
    chairHash: "b2x89m91...",
    deanHash: "d9k42n10...",
    status: "success",
    modelVersion: "Llama 3 8B (QLoRA Local Inference)",
    studentHashes: ["s1x9b...", "s2y1c...", "s3z4p..."]
  }
];

export function initStore() {
  if (!localStorage.getItem("facultyData")) {
      localStorage.setItem("facultyData", JSON.stringify(facultyList));
  }
}

export function getFacultyList() {
  const data = localStorage.getItem("facultyData");
  return data ? JSON.parse(data) : facultyList;
}

export function updateFaculty(updatedFaculty) {
  const currentList = getFacultyList();
  const newList = currentList.map(faculty => 
      faculty.id === updatedFaculty.id ? updatedFaculty : faculty
  );
  localStorage.setItem("facultyData", JSON.stringify(newList));
}