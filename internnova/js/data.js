/* InternNova – shared content (edit here to change names, dates, courses) */
var DATA = {
  domains: ["All","AI & ML","Web Development","Data Analytics","Cloud & DevOps","UI/UX Design","Cyber Security","App Development"],
  internships: [
    {id:"ai-ml",  title:"AI & Machine Learning Intern",      domain:"AI & ML",         weeks:8, mode:"Remote", level:"Beginner to Intermediate", skills:["Python","Pandas","scikit-learn"], desc:"Train and evaluate a prediction model on a real dataset and present your results."},
    {id:"web-fs", title:"Full-Stack Web Development Intern", domain:"Web Development", weeks:12,mode:"Remote", level:"Intermediate",            skills:["HTML/CSS","JavaScript","Node.js"], desc:"Build and deploy a complete web app with login, database and dashboard."},
    {id:"web-fe", title:"Frontend Development Intern",       domain:"Web Development", weeks:6, mode:"Remote", level:"Beginner",                skills:["HTML","CSS","JavaScript"],       desc:"Create responsive, accessible pages from real design files."},
    {id:"data",   title:"Data Analytics Intern",             domain:"Data Analytics",  weeks:6, mode:"Remote", level:"Beginner",                skills:["Excel","SQL","Power BI"],        desc:"Clean data, find insights and build a business dashboard."},
    {id:"cloud",  title:"Cloud & DevOps Intern",             domain:"Cloud & DevOps",  weeks:8, mode:"Remote", level:"Intermediate",            skills:["Linux","Docker","CI/CD"],        desc:"Containerise an app and set up an automatic build and deploy pipeline."},
    {id:"uiux",   title:"UI/UX Design Intern",               domain:"UI/UX Design",    weeks:4, mode:"Remote", level:"Beginner",                skills:["Figma","Research","Prototyping"],desc:"Research users, design screens and test a clickable prototype."},
    {id:"cyber",  title:"Cyber Security Intern",             domain:"Cyber Security",  weeks:8, mode:"Remote", level:"Intermediate",            skills:["Networking","OWASP","Linux"],    desc:"Learn common web vulnerabilities and secure a practice application."},
    {id:"app",    title:"Android App Development Intern",    domain:"App Development", weeks:10,mode:"Remote", level:"Intermediate",            skills:["Kotlin","Android Studio","Firebase"], desc:"Design, build and publish a small mobile app."}
  ],
  courses: [
    {id:"c-py",  title:"Python for Beginners",       level:"Beginner",     lessons:["Setup & first program","Variables and data types","Conditions and loops","Functions","Lists and dictionaries","Mini project: quiz game"]},
    {id:"c-web", title:"HTML, CSS & JavaScript",     level:"Beginner",     lessons:["HTML structure","CSS layout with Flexbox","Responsive design","JavaScript basics","DOM and events","Mini project: to-do app"]},
    {id:"c-ml",  title:"Machine Learning Basics",    level:"Intermediate", lessons:["What is machine learning","Preparing data","Regression","Classification","Model evaluation"]},
    {id:"c-git", title:"Git & GitHub for Teams",     level:"Beginner",     lessons:["Why version control","Commits and branches","Pull requests","Resolving conflicts"]},
    {id:"c-sql", title:"SQL for Data Analysis",      level:"Beginner",     lessons:["SELECT and WHERE","Joins","Group by and aggregates","Subqueries","Practice dashboard"]},
    {id:"c-fig", title:"Figma for UI Design",        level:"Beginner",     lessons:["Frames and shapes","Typography and colour","Components","Prototype and share"]}
  ],
  workshops: [
    {id:"w1", title:"Build an AI Chatbot",           date:"2026-10-24", time:"10:00 AM", dur:"2 hours",    mode:"Live online",  note:"Update: starter code is shared 1 day before."},
    {id:"w2", title:"Git & GitHub for Teams",        date:"2026-10-29", time:"5:00 PM",  dur:"90 minutes", mode:"Live online",  note:"Beginner friendly. Bring a GitHub account."},
    {id:"w3", title:"Resume & Interview Clinic",     date:"2026-11-07", time:"11:00 AM", dur:"2 hours",    mode:"Live online",  note:"New: mock interview round added."},
    {id:"w4", title:"Deploy Your First Website",     date:"2026-11-14", time:"3:00 PM",  dur:"90 minutes", mode:"Live online",  note:"Registration open."}
  ],
  testimonials: [
    {n:"Ananya R.", r:"Web Development Intern",  q:"I shipped my first real app in 8 weeks, and it got me my first interview call."},
    {n:"Karthik S.",r:"AI & ML Intern",          q:"Weekly mentor reviews made me better faster than any tutorial I had watched."},
    {n:"Divya M.",  r:"Data Analytics Intern",   q:"The task schedule kept me on track, and the certificate helped during placements."},
    {n:"Rahul T.",  r:"Cloud & DevOps Intern",   q:"I finally understood deployment by doing it. The workshops were practical and clear."}
  ],
  faqs: [
    ["Who can join InternNova?","Any college student or recent graduate can join. Programs are available for beginners and for students with some experience."],
    ["Is registration free?","Yes. Creating an account, browsing internships and the learning library are free."],
    ["How long are the internships?","From 4 to 12 weeks, depending on the domain. Each internship page shows its exact duration."],
    ["How is my progress calculated?","Your dashboard shows the percentage of weekly tasks you have completed. Reach 100% to unlock your certificate."],
    ["Will I get a certificate?","Yes. After you apply for an internship and complete all your scheduled tasks, your certificate unlocks in the Students section."],
    ["Do I need a laptop?","A basic laptop or desktop with internet is enough for most domains. Android internships also need a phone or emulator."]
  ]
};
function fmtDate(s){var d=new Date(s+"T00:00:00");return {d:d.getDate(),m:d.toLocaleString("en-IN",{month:"short"}).toUpperCase(),w:d.toLocaleString("en-IN",{weekday:"long"}),full:d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
