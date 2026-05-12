export const SEMESTER = "2nd Semester - SY 2025-2026";

export const USERS = {
  student:     { id:"student",     password:"123", role:"student",     name:"Melcrist T. Alvarez",  info:"BSCS 3-G - CEAFA", avatar:"M" },
  chairperson: { id:"chairperson", password:"123", role:"chairperson", name:"Dr. Angela R. Vidal",  info:"Program Chair - CASE", avatar:"A" },
  hr:          { id:"hr",          password:"123", role:"hr",          name:"Jessa T. Manalo",      info:"HR Officer - Tertiary", avatar:"J" },
  dean:        { id:"dean",        password:"123", role:"dean",        name:"Dr. Ramon C. Fontillas", info:"Dean - CEAFA", avatar:"D" },
  faculty:     { id:"faculty",     password:"123", role:"faculty",     name:"Prof. Rowena M. Hingco", info:"Faculty - CEAFA - CC 106", avatar:"R", facultyId:"F001" },
};

export const facultyList = [
  // Evaluated Full-Time
  { id:"F001", name:"Prof. Rowena M. Hingco",       dept:"CEAFA", subject:"Application Development & Emerging Technologies", code:"CC 106 / CC 106.1",   employmentType:"Full-Time", studentScore:4.35, chairScore:4.60, deanScore:4.50, compositeScore:4.43, responses:87, status:"good",        chairEvaluated:true,  deanEvaluated:true,  chairScoreBreakdown:{jc:"4.7",jf:"4.5",pq:"4.6"}, deanScoreBreakdown:{jc:"4.6",jf:"4.4",pq:"4.5"} },
  
  // PENDING Full-Time (Click this one to see the long rubric with Research & Community)
  { id:"F002", name:"Prof. Noel A. De Leon",         dept:"CEAFA", subject:"Introduction to Intelligent Systems",           code:"CS Elec 3 / CS Elec 3.1", employmentType:"Full-Time", studentScore:4.08, chairScore:null, deanScore:null, compositeScore:4.14, responses:84, status:"good",        chairEvaluated:false,  deanEvaluated:false, chairScoreBreakdown:null, deanScoreBreakdown:null },
  
  // PENDING Part-Time (Click this one to see the short rubric)
  { id:"F003", name:"Prof. Diana R. Navarro",        dept:"CEAFA", subject:"CS Free Elective 1",                            code:"CS Free Elec 1 / 1.1", employmentType:"Part-Time", studentScore:3.68, chairScore:null, deanScore:null, compositeScore:3.76, responses:82, status:"average",     chairEvaluated:false, deanEvaluated:false, chairScoreBreakdown:null, deanScoreBreakdown:null },
  
  // Evaluated Full-Time
  { id:"F004", name:"Prof. Sofia G. Balasta",        dept:"CEAFA", subject:"Great Books",                                   code:"GE 12-GB",             employmentType:"Full-Time", studentScore:4.52, chairScore:4.75, deanScore:4.65, compositeScore:4.60, responses:91, status:"excellent",   chairEvaluated:true,  deanEvaluated:true,  chairScoreBreakdown:{jc:"4.8",jf:"4.6",pq:"4.9"}, deanScoreBreakdown:{jc:"4.7",jf:"4.5",pq:"4.8"} },
  
  // PENDING Part-Time
  { id:"F005", name:"Prof. Vicente L. Bertillo",     dept:"CEAFA", subject:"Christian Vision of the Human Society",        code:"IO-RE 3",               employmentType:"Part-Time", studentScore:4.20, chairScore:null, deanScore:null, compositeScore:4.28, responses:88, status:"good",        chairEvaluated:false, deanEvaluated:false, chairScoreBreakdown:null, deanScoreBreakdown:null },
  
  // PENDING Part-Time
  { id:"F006", name:"Prof. Jose C. Damo",            dept:"CEAFA", subject:"Networks & Communications",                    code:"NC 101 / NC 101.1",     employmentType:"Part-Time", studentScore:3.72, chairScore:null, deanScore:null, compositeScore:3.85, responses:83, status:"average",     chairEvaluated:false, deanEvaluated:false, chairScoreBreakdown:null, deanScoreBreakdown:null },
  
  // Evaluated Full-Time
  { id:"F007", name:"Prof. Sherry Mae R. Llandelar", dept:"CEAFA", subject:"CS Thesis 1",                                  code:"THS 101",              employmentType:"Full-Time", studentScore:4.62, chairScore:4.85, deanScore:4.75, compositeScore:4.70, responses:90, status:"excellent",   chairEvaluated:true,  deanEvaluated:true,  chairScoreBreakdown:{jc:"4.9",jf:"4.8",pq:"4.7"}, deanScoreBreakdown:{jc:"4.8",jf:"4.7",pq:"4.8"} },
];

export const aiFeedbackMap = {
  F001: {
    strengths:[
      "Students consistently praised Prof. Hingco's practical demonstrations and clear explanations of application development concepts.",
      "Her responsiveness to questions and use of real-world code examples received top marks.",
    ],
    improvements:[
      "Grading turnaround for project submissions could be faster; a published rubric was frequently requested.",
      "Additional lab catch-up sessions were suggested for students who fall behind during complex topics.",
    ],
    citations:[
      '"The way she explains APIs and frameworks is really clear - I never felt lost." - Response #34',
      '"Would appreciate faster feedback on our project drafts." - Response #61',
    ],
    recommendation:"Prof. Hingco demonstrates strong pedagogical skills. Publishing project rubrics in advance and scheduling regular lab catch-up sessions are recommended.",
    chairRemarks:"Prof. Hingco demonstrates strong classroom management and clear alignment between lessons and course outcomes. Her engagement with student projects shows genuine mentorship beyond required instruction.",
    deanRemarks:"Review of syllabus and research output indicates excellent academic alignment; community involvement meets college targets. Suggest focusing on faster grading turnaround.",
  },
  F007: {
    strengths:[
      "Students praised Prof. Llandelar's structured guidance throughout the thesis process, describing feedback as specific and actionable.",
      "Her commitment and availability outside class hours were noted positively by the majority of evaluators.",
    ],
    improvements:[
      "Earlier orientation on thesis formatting standards would reduce revisions later in the semester.",
      "More structured peer-review sessions would help develop critical thinking skills.",
    ],
    citations:[
      '"Her comments on our drafts are always detailed and helpful." - Response #12',
      '"Wish we had a formatting guide from day one." - Response #55',
    ],
    recommendation:"Prof. Llandelar is an exceptional thesis supervisor. Introducing a formatting guide in week one and structured peer-review sessions are advised.",
    chairRemarks:"An outstanding thesis supervisor. Prof. Llandelar's dedication to student research outcomes is exemplary. I recommend her for departmental research leadership consideration.",
    deanRemarks:"High quality research outputs and consistent student support. Highly recommended for continued thesis advisory roles.",
  },
  F004: {
    strengths:[
      "Prof. Balasta's ability to relate historical literature to current events keeps students highly engaged.",
      "Her open discussions foster a welcoming environment where students feel comfortable sharing diverse opinions.",
    ],
    improvements:[
      "Some students noted that the reading load was occasionally overwhelming without enough time to process.",
      "Providing reading guides prior to complex texts could improve comprehension.",
    ],
    citations:[
      '"She makes old books feel so relevant to our lives today." - Response #18',
      '"The reading pace was a bit too fast in the middle of the semester." - Response #42',
    ],
    recommendation:"Prof. Balasta excels in creating an engaging classroom atmosphere. Integrating brief reading guides for heavier texts is recommended to support student pacing.",
    chairRemarks:"Excellent facilitation of class discussions. Demonstrates deep subject mastery and promotes an open atmosphere.",
    deanRemarks:"Strong manifestation of Thomasian values in teaching. Continues to be a highly effective educator in the General Education department.",
  }
};

export const evaluationCriteria = [
  { id:"e1", category:"Teaching Effectiveness",  prompt:"The faculty explains lessons in a clear, organized, and understandable manner."  },
  { id:"e2", category:"Subject Matter Mastery",  prompt:"The faculty demonstrates comprehensive and current knowledge of the subject."    },
  { id:"e3", category:"Communication & Clarity", prompt:"The faculty communicates expectations, feedback, and instructions clearly."      },
  { id:"e4", category:"Student Engagement",      prompt:"The faculty encourages participation, questions, and critical thinking."         },
  { id:"e5", category:"Professional Conduct",    prompt:"The faculty demonstrates punctuality, fairness, and professional respect."       },
];

export const studentSubmissions = [];

export const departmentStats = [
  { dept:"CEAFA", full:"Engineering, Architecture & Fine Arts", faculty:7, avgScore:4.25, responses:605,  evaluated:4 },
  { dept:"CASE",  full:"Arts, Sciences & Education",            faculty:5, avgScore:4.13, responses:1200, evaluated:3 },
  { dept:"CBMA",  full:"Business Management & Accountancy",     faculty:3, avgScore:4.31, responses:420,  evaluated:3 },
  { dept:"CHS",   full:"Health Sciences",                       faculty:4, avgScore:4.44, responses:380,  evaluated:4 },
];

export const auditLogs = [];