/**
 * mockData.js — UST-Legazpi Faculty Performance Evaluation System
 * All tertiary department data. CASE / CEAFA / CBMA / CHS faculty.
 */

export const SEMESTER = "1st Semester, AY 2025–2026";

export const USERS = {
  student:     { id:"student",     password:"123", role:"student",     name:"Maria S. Cruz",      info:"BSCS 3-G · CASE",                   avatar:"M" },
  chairperson: { id:"chairperson", password:"123", role:"chairperson", name:"Dr. Angela R. Vidal", info:"Program Chair · Computer Science",  avatar:"A" },
  hr:          { id:"hr",          password:"123", role:"hr",          name:"Jessa T. Manalo",     info:"HR Officer · Tertiary Department",  avatar:"J" },
};

export const facultyList = [
  // CASE — Computer Science / IT
  { id:"F001", name:"Prof. Sarah M. Domingo",        dept:"CASE", program:"Computer Science",       subject:"Data Structures & Algorithms",    code:"CS 313", studentScore:4.45, chairScore:4.70, compositeScore:4.53, responses:312, status:"excellent",   chairEvaluated:true  },
  { id:"F002", name:"Prof. Kevin R. Belarmino",      dept:"CASE", program:"Information Technology",  subject:"Web Systems & Technologies",      code:"IT 321", studentScore:4.08, chairScore:4.30, compositeScore:4.14, responses:278, status:"good",        chairEvaluated:true  },
  { id:"F003", name:"Prof. Liza Ann C. Torres",      dept:"CASE", program:"Computer Science",       subject:"Database Management Systems",     code:"CS 322", studentScore:3.68, chairScore:3.95, compositeScore:3.76, responses:254, status:"average",     chairEvaluated:false },
  { id:"F004", name:"Prof. Jerome P. Alcazar",       dept:"CASE", program:"Computer Science",       subject:"Object-Oriented Programming",     code:"CS 211", studentScore:4.62, chairScore:4.85, compositeScore:4.70, responses:301, status:"excellent",   chairEvaluated:true  },
  { id:"F005", name:"Prof. Maricel A. Flores",       dept:"CASE", program:"Computer Science",       subject:"Software Engineering",            code:"CS 411", studentScore:3.42, chairScore:3.80, compositeScore:3.54, responses:231, status:"needsSupport",chairEvaluated:false },
  // CEAFA — Engineering / Architecture / Fine Arts
  { id:"F006", name:"Engr. Ramon L. Buenaventura",  dept:"CEAFA",program:"Civil Engineering",       subject:"Structural Analysis",             code:"CE 311", studentScore:4.35, chairScore:4.60, compositeScore:4.43, responses:287, status:"excellent",   chairEvaluated:true  },
  { id:"F007", name:"Arch. Celeste M. Fuentes",     dept:"CEAFA",program:"Architecture",            subject:"Architectural Design V",          code:"ARCH 501",studentScore:4.12,chairScore:4.45, compositeScore:4.22, responses:134, status:"good",        chairEvaluated:true  },
  { id:"F008", name:"Engr. Dennis T. Quiambao",     dept:"CEAFA",program:"Electrical Engineering",  subject:"Power Systems Engineering",       code:"EE 402", studentScore:3.72, chairScore:4.10, compositeScore:3.85, responses:198, status:"average",     chairEvaluated:false },
  { id:"F009", name:"Prof. Marites G. Cabrera",     dept:"CEAFA",program:"Fine Arts",               subject:"Visual Arts Studio IV",           code:"FA 401", studentScore:4.58, chairScore:4.82, compositeScore:4.66, responses:89,  status:"excellent",   chairEvaluated:true  },
  // CBMA — Business
  { id:"F010", name:"Prof. Renato C. Delos Santos", dept:"CBMA", program:"Business Administration", subject:"Business Ethics & Governance",    code:"BA 302", studentScore:4.22, chairScore:4.50, compositeScore:4.31, responses:189, status:"good",        chairEvaluated:true  },
  // CHS — Health Sciences
  { id:"F011", name:"RN. Patricia M. Villanueva",   dept:"CHS",  program:"Nursing",                 subject:"Medical-Surgical Nursing II",     code:"NUR 312",studentScore:4.50, chairScore:4.75, compositeScore:4.58, responses:167, status:"excellent",   chairEvaluated:true  },
];

export const aiFeedbackMap = {
  F001: {
    strengths:[
      "Students consistently praised Prof. Domingo's ability to break down complex algorithmic concepts using relatable analogies, leading to high comprehension ratings.",
      "Classroom engagement scored among the highest in the department, with structured pair-programming exercises cited as particularly effective.",
    ],
    improvements:[
      "Grading timelines for programming assignments were flagged as unpredictable; a published rubric would help manage expectations.",
      "A subset of responses indicated that structured pre-exam review sessions would benefit students with varying mathematical backgrounds.",
    ],
    citations:[
      "\"Prof. Domingo explains algorithms in a way that actually makes sense.\" — Response #88",
      "\"The coding exercises are great, but I wish we got feedback on our code faster.\" — Response #204",
    ],
    recommendation:"Prof. Domingo demonstrates outstanding teaching effectiveness. Publishing grading rubrics and scheduling structured pre-exam reviews are recommended to further strengthen the student experience.",
  },
  F006: {
    strengths:[
      "Students expressed high confidence in Engr. Buenaventura's command of structural theory, noting lectures as detailed and well-organized.",
      "Professional conduct and punctuality received near-unanimous positive responses.",
    ],
    improvements:[
      "Derivations in structural analysis move at a pace that some students found challenging; supplementary worked examples could address this.",
      "Limited question time during lectures was a recurring concern across multiple sections.",
    ],
    citations:[
      "\"He knows the subject extremely well, but the pace sometimes makes it hard to follow.\" — Response #114",
      "\"Very professional. Always comes to class prepared.\" — Response #79",
    ],
    recommendation:"Engr. Buenaventura demonstrates exemplary subject mastery. Incorporating structured review pauses and dedicated question windows is advised.",
  },
};

export const evaluationCriteria = [
  { id:"e1", category:"Teaching Effectiveness",   prompt:"The faculty member explains lessons in a clear, organized, and understandable manner." },
  { id:"e2", category:"Subject Matter Mastery",   prompt:"The faculty member demonstrates comprehensive and current knowledge of the subject." },
  { id:"e3", category:"Communication & Clarity",  prompt:"The faculty member communicates expectations, feedback, and instructions clearly." },
  { id:"e4", category:"Student Engagement",       prompt:"The faculty member encourages participation, questions, and critical thinking." },
  { id:"e5", category:"Professional Conduct",     prompt:"The faculty member demonstrates punctuality, fairness, and professional respect." },
];

export const studentSubmissions = [
  { facultyId:"F001", facultyName:"Prof. Sarah M. Domingo",   subject:"CS 313", submittedAt:"Jan 14, 2026", avg:4.6 },
  { facultyId:"F002", facultyName:"Prof. Kevin R. Belarmino", subject:"IT 321", submittedAt:"Jan 14, 2026", avg:4.0 },
];

export const auditLogs = [
  { timestamp:"2026-01-16 08:42", faculty:"Prof. Sarah M. Domingo",       code:"CS 313",   inputs:312, hash:"a3f8c2d91e4b...", status:"success" },
  { timestamp:"2026-01-16 08:38", faculty:"Engr. Ramon L. Buenaventura",  code:"CE 311",   inputs:287, hash:"b7e1a4c02f9d...", status:"success" },
  { timestamp:"2026-01-16 08:35", faculty:"Prof. Jerome P. Alcazar",      code:"CS 211",   inputs:301, hash:"d2f9b3e41a7c...", status:"success" },
  { timestamp:"2026-01-16 08:30", faculty:"Prof. Kevin R. Belarmino",     code:"IT 321",   inputs:278, hash:"e5c2d7f83b1a...", status:"success" },
  { timestamp:"2026-01-16 08:25", faculty:"Prof. Maricel A. Flores",      code:"CS 411",   inputs:231, hash:"f1a6b4e92c3d...", status:"success" },
];

export const departmentStats = [
  { dept:"CASE",  full:"Arts, Sciences & Education",          faculty:5, avgScore:4.13, responses:1376, evaluated:3 },
  { dept:"CEAFA", full:"Engineering, Architecture & Fine Arts",faculty:4, avgScore:4.29, responses: 708, evaluated:3 },
  { dept:"CBMA",  full:"Business Management & Accountancy",   faculty:1, avgScore:4.31, responses: 189, evaluated:1 },
  { dept:"CHS",   full:"Health Sciences",                     faculty:1, avgScore:4.58, responses: 167, evaluated:1 },
];
