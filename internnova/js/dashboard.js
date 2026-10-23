/* InternNova – dashboard behaviour */
(function(){
var $=function(i){return document.getElementById(i)};
var user=Auth.current();
if(!user){location.replace("index.html");return}
var E=user.email,K={t:"in_tasks_"+E,a:"in_apps_"+E,w:"in_ws_"+E,c:"in_courses_"+E,p:"in_projects_"+E};
var DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
var NAV=[["home","Home"],["projects","Projects"],["students","Students"],["company","Company"]];
var view="home",tab={projects:0,students:0},lastPlan=null;

/* seed schedule on first visit */
if(Store.get(K.t,null)===null){Store.set(K.t,[["Complete onboarding and profile","Mon"],["Watch lesson: Project setup","Tue"],["Submit weekly task 1","Wed"],["Mentor check-in call","Thu"],["Build milestone 1","Fri"],["Submit weekly task 2","Sat"]].map(function(x,i){return {id:i+1,t:x[0],d:x[1],done:false}}))}
function tasks(){return Store.get(K.t,[])}
function pct(){var t=tasks();return t.length?Math.round(t.filter(function(x){return x.done}).length/t.length*100):0}
function apps(){return Store.get(K.a,{})}
function intern(id){return DATA.internships.filter(function(i){return i.id==id})[0]}

/* header / profile */
$("avTop").textContent=$("avBig").textContent=user.name.charAt(0).toUpperCase();
$("nameTop").textContent=user.name.split(" ")[0];$("domTop").textContent=user.domain;$("pName").textContent=user.name;
$("pList").innerHTML=[["Email",user.email],["College",user.college],["Interested domain",user.domain],["Member since",new Date(user.joined).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})]].map(function(r){return "<dt>"+r[0]+"</dt><dd>"+esc(r[1])+"</dd>"}).join("");
function out(){Auth.logout();location.href="index.html"}
$("logoutTop").onclick=$("logoutPanel").onclick=out;
$("profBtn").onclick=function(e){e.stopPropagation();var h=$("profPanel").hidden;$("profPanel").hidden=!h;this.setAttribute("aria-expanded",h)};
document.addEventListener("click",function(e){if(!$("profPanel").hidden&&!e.target.closest(".prof")){$("profPanel").hidden=true;$("profBtn").setAttribute("aria-expanded","false")}});
document.addEventListener("keydown",function(e){if(e.key=="Escape"){$("profPanel").hidden=true;closeModal()}});

/* modal */
function openModal(h){$("mBody").innerHTML=h;$("modal").hidden=false}
function closeModal(){$("modal").hidden=true}
$("mClose").onclick=closeModal;$("modal").addEventListener("click",function(e){if(e.target==this)closeModal()});

/* navigation */
function nav(v){view=v;history.replaceState(null,"","#"+v);
  $("menu").innerHTML=NAV.map(function(n){return '<button data-nav="'+n[0]+'" class="'+(n[0]==v?"on":"")+'">'+n[1]+'</button>'}).join("");
  $("pageTitle").textContent=NAV.filter(function(n){return n[0]==v})[0][1];
  render();}
function render(){
  var p=pct();$("sidePct").textContent=p+"%";$("sideBar").style.width=p+"%";
  $("view").innerHTML=V[view]();}
function tabsHtml(k,names){return '<div class="tabs" role="tablist">'+names.map(function(n,i){return '<button role="tab" data-tab="'+k+':'+i+'" class="'+(tab[k]==i?"on":"")+'">'+n+'</button>'}).join("")+'</div>'}

/* views */
var V={
home:function(){
  var t=tasks(),done=t.filter(function(x){return x.done}).length,p=pct(),a=Object.keys(apps()).length,cs=Store.get(K.c,{}),cn=Object.keys(cs).filter(function(k){return cs[k].length}).length;
  var h='<h2>Hello, '+esc(user.name.split(" ")[0])+'</h2><p class="lead">Here is your plan for this week and a quick look at InternNova.</p>'+
  '<div class="kpis"><div class="kpi big"><div class="ring" style="--p:'+p+'"><div>'+p+'%</div></div><div><b style="font-size:20px">Progress</b><span>'+done+' of '+t.length+' tasks done</span></div></div>'+
  '<div class="kpi"><b>'+a+'</b><span>Internship applications</span></div><div class="kpi"><b>'+cn+'</b><span>Courses started</span></div><div class="kpi"><b>'+Object.keys(Store.get(K.w,{})).length+'</b><span>Workshop seats</span></div></div>'+
  '<div class="cols"><section class="panel" aria-labelledby="sch"><h3 id="sch">Schedule and tasks</h3><p class="sub">Tick tasks as you finish them. Your percentage updates instantly.</p>'+
  (t.length?t.map(function(x){return '<div class="task'+(x.done?" d":"")+'"><input type="checkbox" id="tk'+x.id+'" data-task="'+x.id+'" '+(x.done?"checked":"")+'><label for="tk'+x.id+'">'+esc(x.t)+'</label><em>'+esc(x.d)+'</em><button class="del" data-del="'+x.id+'" aria-label="Delete task">&times;</button></div>'}).join(""):'<p class="empty">No tasks yet. Add your first task below.</p>')+
  '<form class="addT" id="addT"><input id="tT" placeholder="New task, e.g. Read API docs" aria-label="New task" required><select id="tD" aria-label="Day">'+DAYS.map(function(d){return "<option>"+d+"</option>"}).join("")+'</select><button class="btn sm" type="submit">Add task</button></form></section>'+
  '<div class="stack"><section class="panel"><h3>About InternNova</h3><p class="sub">Company overview</p><p style="color:var(--mute)">InternNova is a student-first internship platform. We run guided internships in AI, web, data, cloud, design, security and apps, backed by courses, workshops and mentor reviews.</p><div style="margin-top:12px"><span class="chip">12,000+ students</span><span class="chip m">85+ colleges</span><span class="chip a">40+ mentors</span></div></section>'+
  '<section class="panel"><h3>Your profile</h3><p class="sub">'+esc(user.college)+'</p><p style="color:var(--mute)">Interested in <b style="color:var(--ink)">'+esc(user.domain)+'</b>. Open Projects to apply for an internship.</p><button class="btn sm" style="margin-top:12px" data-nav="projects">Browse internships</button></section></div></div>';
  return h},

projects:function(){
  var h='<h2>Projects</h2><p class="lead">Internships, courses and workshops in one place.</p>'+tabsHtml("projects",["Internships","Courses","Workshops"]),t=tab.projects;
  if(t==0){var a=apps();h+='<div class="grid3">'+DATA.internships.map(function(i){var ap=a[i.id];
    return '<article class="item"><span class="chip m" style="align-self:flex-start">'+esc(i.domain)+'</span><h3>'+esc(i.title)+'</h3><div class="meta">'+i.weeks+' weeks · '+esc(i.mode)+' · '+esc(i.level)+'</div><p>'+esc(i.desc)+'</p><div style="margin-bottom:12px">'+i.skills.map(function(s){return '<span class="chip">'+esc(s)+'</span>'}).join("")+'</div>'+
    (ap?'<span class="status">Applied on '+new Date(ap.at).toLocaleDateString("en-IN",{day:"numeric",month:"short"})+'</span><button class="btn ghost sm" data-withdraw="'+i.id+'">Withdraw</button>':'<button class="btn sm" data-apply="'+i.id+'">Apply now</button>')+'</article>'}).join("")+'</div>'}
  if(t==1){var cs=Store.get(K.c,{});h+='<div class="grid3">'+DATA.courses.map(function(c){var n=(cs[c.id]||[]).length,p=Math.round(n/c.lessons.length*100);
    return '<article class="item"><div class="play" aria-hidden="true">&#9654;</div><h3>'+esc(c.title)+'</h3><div class="meta">'+c.lessons.length+' video lessons · '+c.level+'</div><div class="bar" style="margin:0 0 14px"><i style="width:'+p+'%"></i></div><button class="btn sm" data-course="'+c.id+'">'+(n?(p==100?"Review course":"Continue ("+p+"%)"):"Start course")+'</button></article>'}).join("")+'</div>'}
  if(t==2){var w=Store.get(K.w,{});h+='<div class="grid2">'+DATA.workshops.map(function(x){var d=fmtDate(x.date),r=w[x.id];
    return '<article class="item"><span class="chip a" style="align-self:flex-start">Update</span><h3>'+esc(x.title)+'</h3><div class="meta">'+d.w+', '+d.full+' · '+esc(x.time)+' · '+esc(x.dur)+' · '+esc(x.mode)+'</div><div class="note">'+esc(x.note)+'</div>'+
    (r?'<span class="status">Seat reserved</span><button class="btn ghost sm" data-wcancel="'+x.id+'">Cancel seat</button>':'<button class="btn sm" data-wres="'+x.id+'">Reserve seat</button>')+'</article>'}).join("")+'</div>'}
  return h},

students:function(){
  var h='<h2>Students</h2><p class="lead">Plan your idea, track your projects and earn your certificate.</p>'+tabsHtml("students",["AI Builder","My Projects","Certification"]),t=tab.students;
  if(t==0){h+='<section class="panel"><h3>AI Builder</h3><p class="sub">Describe your idea. Get features, a tech stack and a week-by-week plan.</p><form id="aiF"><label for="aiI">Project idea</label><input id="aiI" placeholder="e.g. Attendance tracker for my college" required>'+
    '<div class="two"><div><label for="aiD">Domain</label><select id="aiD">'+DATA.domains.slice(1).map(function(d){return "<option"+(d==user.domain?" selected":"")+">"+d+"</option>"}).join("")+'</select></div><div><label for="aiW">Duration</label><select id="aiW"><option value="2">2 weeks</option><option value="4" selected>4 weeks</option><option value="6">6 weeks</option></select></div></div>'+
    '<button class="btn mint" style="margin-top:14px" type="submit">Generate plan</button></form><div id="aiOut">'+(lastPlan?planHtml(lastPlan):"")+'</div></section>'}
  if(t==1){var ps=Store.get(K.p,[]);h+='<div class="cols"><section class="panel"><h3>My projects</h3><p class="sub">Keep every project and its status in one place.</p>'+
    (ps.length?ps.map(function(p){return '<div class="task"><div style="flex:1"><b>'+esc(p.t)+'</b><div style="color:var(--mute);font-size:14px">'+esc(p.d||"No description")+(p.l?' · <a href="'+esc(p.l)+'" target="_blank" rel="noopener" style="color:var(--vio)">Link</a>':"")+'</div></div><select data-pst="'+p.id+'" aria-label="Status" style="width:130px;padding:7px">'+["Planned","In progress","Completed"].map(function(s){return "<option"+(s==p.s?" selected":"")+">"+s+"</option>"}).join("")+'</select><button class="del" data-pdel="'+p.id+'" aria-label="Delete project">&times;</button></div>'}).join(""):'<p class="empty">No projects yet. Add your first one on the right, or generate a plan in AI Builder.</p>')+'</section>'+
    '<section class="panel"><h3>Add project</h3><form id="pF"><label for="pT">Title</label><input id="pT" required><label for="pD">Short description</label><input id="pD"><label for="pL">Link (GitHub or demo)</label><input id="pL" type="url" placeholder="https://"><button class="btn" style="margin-top:14px" type="submit">Save project</button></form></section></div>'}
  if(t==2){var p=pct(),n=Object.keys(apps()).length,ok=p==100&&tasks().length>0&&n>0,a=apps(),k=Object.keys(a)[0],dom=k?intern(k).title:user.domain;
    h+='<section class="panel '+(ok?"":"locked")+'"><h3>Internship certificate</h3><p class="sub">'+(ok?"Congratulations! You have completed every requirement.":"Complete the requirements below to unlock it.")+'</p><ul class="chk"><li>'+(n>0?"✓":"○")+' Apply for an internship ('+n+' applied)</li><li>'+(tasks().length>0&&p==100?"✓":"○")+' Complete all scheduled tasks ('+p+'%)</li></ul><div class="bar"><i style="width:'+p+'%"></i></div></section>'+
    (ok?'<div id="certBox" class="cert"><div class="brand"><svg><use href="#logo"/></svg>InternNova</div><p style="margin-top:14px">This certificate is awarded to</p><h2>'+esc(user.name)+'</h2><p>for successfully completing the<br><b>'+esc(dom)+'</b></p><p style="margin-top:14px;color:var(--mute)">Issued on '+new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})+'</p></div><button class="btn" style="margin-top:16px" data-print>Print or save as PDF</button>':"")}
  return h},

company:function(){
  var L=[["about.html","About InternNova","Our story, mission and values."],["faq.html","FAQ","Answers to common questions."],["policy.html","Privacy policy","How we handle your data."],["terms.html","Terms & conditions","Rules for using InternNova."]];
  return '<h2>Company</h2><p class="lead">Learn about InternNova and read our policies.</p><div class="grid2">'+L.map(function(l){return '<a class="item link-card" href="'+l[0]+'?from=dash"><div><h3>'+l[1]+'</h3><p style="margin:0">'+l[2]+'</p></div><span>Open</span></a>'}).join("")+'</div>'}
};

/* AI builder logic */
var STACK={"AI & ML":"Python, Pandas, scikit-learn, Jupyter Notebook","Web Development":"HTML, CSS, JavaScript, Node.js, SQLite","Data Analytics":"Excel, SQL, Power BI","Cloud & DevOps":"Linux, Docker, GitHub Actions","UI/UX Design":"Figma, user interviews, clickable prototype","Cyber Security":"OWASP Top 10, Wireshark, Linux","App Development":"Kotlin, Android Studio, Firebase"};
var PHASES=["Research the problem, list users and sketch the solution","Set up tools and build the first working version","Build the main features","Test with 3 people and fix issues","Polish the design and write documentation","Present to your mentor and publish"];
function makePlan(idea,dom,w){var ph=[];for(var i=0;i<w;i++)ph.push("Week "+(i+1)+": "+PHASES[Math.min(i,PHASES.length-(i==w-1?1:2))]);
  return {idea:idea,dom:dom,stack:STACK[dom],features:["Core feature: "+idea,"Simple sign-in and saved data","Results or dashboard screen","Feedback form and basic testing"],weeks:ph}}
function planHtml(p){return '<div class="plan"><b>Plan for “'+esc(p.idea)+'”</b>\n\n<b>Features</b>\n'+p.features.map(function(f){return "• "+esc(f)}).join("\n")+'\n\n<b>Tech stack</b>\n'+esc(p.stack)+'\n\n<b>Schedule</b>\n'+p.weeks.map(esc).join("\n")+'</div><div class="row2" style="margin-top:12px"><button class="btn sm" data-addplan>Add plan to my schedule</button><button class="btn ghost sm" data-saveproj>Save as project</button></div>'}

/* events */
document.addEventListener("click",function(e){
  var b=e.target.closest("button,a");if(!b)return;var d=b.dataset;
  if(d.nav){nav(d.nav);window.scrollTo(0,0)}
  else if(d.tab){var s=d.tab.split(":");tab[s[0]]=+s[1];render()}
  else if(d.del){Store.set(K.t,tasks().filter(function(x){return x.id!=d.del}));render();toast("Task deleted")}
  else if(d.apply){var a=apps();a[d.apply]={at:new Date().toISOString()};Store.set(K.a,a);render();toast("Applied for "+intern(d.apply).title)}
  else if(d.withdraw){var a2=apps();delete a2[d.withdraw];Store.set(K.a,a2);render();toast("Application withdrawn")}
  else if(d.wres){var w=Store.get(K.w,{});w[d.wres]=1;Store.set(K.w,w);render();toast("Seat reserved")}
  else if(d.wcancel){var w2=Store.get(K.w,{});delete w2[d.wcancel];Store.set(K.w,w2);render();toast("Seat cancelled")}
  else if(d.course){openCourse(d.course)}
  else if(d.pdel){Store.set(K.p,Store.get(K.p,[]).filter(function(x){return x.id!=d.pdel}));render();toast("Project deleted")}
  else if(b.hasAttribute("data-print")){window.print()}
  else if(b.hasAttribute("data-addplan")&&lastPlan){var t=tasks(),id=Date.now();lastPlan.weeks.forEach(function(x,i){t.push({id:id+i,t:x,d:"Plan",done:false})});Store.set(K.t,t);render();toast(lastPlan.weeks.length+" tasks added to your schedule")}
  else if(b.hasAttribute("data-saveproj")&&lastPlan){var ps=Store.get(K.p,[]);ps.push({id:Date.now(),t:lastPlan.idea,d:lastPlan.dom+" project from AI Builder",l:"",s:"Planned"});Store.set(K.p,ps);toast("Saved to My Projects")}
});
document.addEventListener("change",function(e){var t=e.target;
  if(t.dataset.task){var l=tasks();l.forEach(function(x){if(x.id==t.dataset.task)x.done=t.checked});Store.set(K.t,l);render();if(pct()==100)toast("All tasks complete! Check Students → Certification.")}
  else if(t.dataset.pst){var ps=Store.get(K.p,[]);ps.forEach(function(x){if(x.id==t.dataset.pst)x.s=t.value});Store.set(K.p,ps);toast("Status updated")}
  else if(t.dataset.lesson){var c=t.dataset.lesson.split(":"),cs=Store.get(K.c,{}),arr=cs[c[0]]||[],i=+c[1];arr=t.checked?arr.concat(i).filter(function(v,j,a){return a.indexOf(v)==j}):arr.filter(function(v){return v!=i});cs[c[0]]=arr;Store.set(K.c,cs);openCourse(c[0],true);render()}
});
document.addEventListener("submit",function(e){var f=e.target;e.preventDefault();
  if(f.id=="addT"){var t=tasks();t.push({id:Date.now(),t:$("tT").value.trim(),d:$("tD").value,done:false});Store.set(K.t,t);render();toast("Task added")}
  else if(f.id=="aiF"){lastPlan=makePlan($("aiI").value.trim(),$("aiD").value,+$("aiW").value);$("aiOut").innerHTML=planHtml(lastPlan)}
  else if(f.id=="pF"){var ps=Store.get(K.p,[]);ps.push({id:Date.now(),t:$("pT").value.trim(),d:$("pD").value.trim(),l:$("pL").value.trim(),s:"Planned"});Store.set(K.p,ps);render();toast("Project saved")}
});
function openCourse(id,keep){var c=DATA.courses.filter(function(x){return x.id==id})[0],done=(Store.get(K.c,{})[id])||[];
  var scroll=$("mBody").parentNode.scrollTop;
  openModal('<h3 id="mTitle" style="margin-bottom:4px;padding-right:24px">'+esc(c.title)+'</h3><p style="color:var(--mute);margin-bottom:14px">Tick each lesson after you watch it.</p><div class="play" aria-hidden="true">&#9654;</div>'+c.lessons.map(function(l,i){return '<div class="lesson"><input type="checkbox" id="ls'+i+'" data-lesson="'+id+':'+i+'" '+(done.indexOf(i)>-1?"checked":"")+'><label for="ls'+i+'">'+(i+1)+'. '+esc(l)+'</label></div>'}).join("")+'<p style="margin-top:14px;color:var(--mute);font-size:14px">'+done.length+' of '+c.lessons.length+' lessons completed</p>');
  if(keep)$("mBody").parentNode.scrollTop=scroll}

var start=(location.hash||"#home").slice(1);
nav(NAV.some(function(n){return n[0]==start})?start:"home");
})();
