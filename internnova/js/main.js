/* InternNova – landing page behaviour */
(function(){
var $=function(i){return document.getElementById(i)};
var user=Auth.current();

/* mobile menu */
var burger=$("burger"),links=$("links");
burger.addEventListener("click",function(){var o=links.classList.toggle("open");burger.setAttribute("aria-expanded",o)});
links.addEventListener("click",function(e){if(e.target.tagName=="A"){links.classList.remove("open");burger.setAttribute("aria-expanded","false")}});

/* active link on scroll */
var secs=[].slice.call(document.querySelectorAll("main section[id]")),ls=[].slice.call(links.querySelectorAll("a"));
function spy(){var y=window.scrollY+120,cur="home";secs.forEach(function(s){if(s.offsetTop<=y)cur=s.id});ls.forEach(function(a){a.classList.toggle("on",a.getAttribute("href")=="#"+cur)})}
window.addEventListener("scroll",spy,{passive:true});spy();

/* auth card */
var domOpts=DATA.domains.slice(1).map(function(d){return "<option>"+d+"</option>"}).join("");
$("rDomain").innerHTML=domOpts;
function show(mode){
  var reg=mode=="register";
  $("regForm").hidden=!reg;$("logForm").hidden=reg;
  $("tabReg").classList.toggle("on",reg);$("tabLog").classList.toggle("on",!reg);
  $("rMsg").textContent=$("lMsg").textContent="";
}
function renderAuth(){
  user=Auth.current();
  $("authIn").hidden=!!user;$("authDone").hidden=!user;
  if(user)$("doneName").textContent="Welcome, "+user.name.split(" ")[0];
  var a=$("navActs");
  var d=a.querySelector("[data-dash]");
  if(user&&!d){var l=document.createElement("a");l.className="btn mint sm";l.href="dashboard.html";l.setAttribute("data-dash","1");l.textContent="Dashboard";a.insertBefore(l,a.firstChild);a.querySelectorAll("[data-auth]").forEach(function(b){b.style.display="none"})}
  if(!user&&d){d.remove();a.querySelectorAll("[data-auth]").forEach(function(b){b.style.display=""})}
}
function goAuth(mode){
  if(user){location.href="dashboard.html";return}
  show(mode);
  $("home").scrollIntoView({behavior:"smooth"});
  setTimeout(function(){(mode=="register"?$("rName"):$("lEmail")).focus({preventScroll:true})},450);
}
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-auth]");if(!b)return;
  e.preventDefault();if(b.dataset.plan)toast(b.dataset.plan+" program selected. Register to continue.");
  goAuth(b.dataset.auth);
});
$("tabReg").onclick=function(){show("register")};$("tabLog").onclick=function(){show("login")};

$("regForm").addEventListener("submit",function(e){
  e.preventDefault();
  var r=Auth.register({name:$("rName").value,email:$("rEmail").value,college:$("rCollege").value,domain:$("rDomain").value,password:$("rPass").value,confirm:$("rConf").value});
  if(r.err){$("rMsg").className="msg";$("rMsg").textContent=r.err;return}
  this.reset();show("login");
  $("lEmail").value=r.email;$("lPass").value="";$("lHint").textContent="Registration complete. Please login to continue.";
  $("lMsg").className="msg ok";$("lMsg").textContent="Account created. Enter your password to login.";
  $("lPass").focus();toast("Registration successful");
});
$("logForm").addEventListener("submit",function(e){
  e.preventDefault();
  var r=Auth.login($("lEmail").value,$("lPass").value);
  if(r.err){$("lMsg").className="msg";$("lMsg").textContent=r.err;return}
  $("lMsg").className="msg ok";$("lMsg").textContent="Login successful. Opening your dashboard…";
  setTimeout(function(){location.href="dashboard.html"},500);
});
$("doneOut").onclick=function(){Auth.logout();renderAuth();show("login");toast("You have been logged out")};
renderAuth();

/* internships */
var fl=$("filters"),grid=$("internGrid"),cur="All";
fl.innerHTML=DATA.domains.map(function(d){return '<button class="'+(d==cur?"on":"")+'" data-d="'+esc(d)+'">'+esc(d)+'</button>'}).join("");
function drawInterns(){
  grid.innerHTML=DATA.internships.filter(function(i){return cur=="All"||i.domain==cur}).map(function(i){
    return '<article class="card intern"><span class="chip m">'+esc(i.domain)+'</span><h3>'+esc(i.title)+'</h3><div class="meta">'+i.weeks+' weeks · '+esc(i.mode)+' · '+esc(i.level)+'</div><p>'+esc(i.desc)+'</p><div class="sk">'+i.skills.map(function(s){return '<span class="chip">'+esc(s)+'</span>'}).join("")+'</div><button class="btn mint sm" data-apply="'+i.id+'">Apply now</button></article>'}).join("");
}
fl.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;cur=b.dataset.d;[].forEach.call(fl.children,function(x){x.classList.toggle("on",x==b)});drawInterns()});
grid.addEventListener("click",function(e){
  var b=e.target.closest("[data-apply]");if(!b)return;
  if(!user){toast("Please register or login to apply");goAuth("register");return}
  var k="in_apps_"+user.email,a=Store.get(k,{});a[b.dataset.apply]={at:new Date().toISOString()};Store.set(k,a);
  toast("Application submitted. Track it in your dashboard.");
});
drawInterns();

/* workshops */
$("wsGrid").innerHTML=DATA.workshops.map(function(w){var d=fmtDate(w.date);
  return '<article class="card ws"><div class="date"><small>'+d.m+'</small><b>'+d.d+'</b></div><h3>'+esc(w.title)+'</h3><p class="m">'+d.w+', '+esc(w.time)+' · '+esc(w.dur)+'<br>'+esc(w.mode)+'</p><button class="btn ghost sm" data-ws="'+w.id+'">Reserve seat</button></article>'}).join("");
$("wsGrid").addEventListener("click",function(e){
  var b=e.target.closest("[data-ws]");if(!b)return;
  if(!user){toast("Please register or login to reserve a seat");goAuth("register");return}
  var k="in_ws_"+user.email,a=Store.get(k,{});a[b.dataset.ws]=1;Store.set(k,a);b.textContent="Seat reserved";b.disabled=true;toast("Seat reserved");
});

/* testimonials */
var T=DATA.testimonials,idx=0,timer;
$("track").innerHTML=T.map(function(t){return '<div class="slide"><figure class="quote"><div class="av">'+esc(t.n.charAt(0))+'</div><p>“'+esc(t.q)+'”</p><figcaption class="who"><b style="color:#fff">'+esc(t.n)+'</b><br>'+esc(t.r)+'</figcaption></figure></div>'}).join("");
$("dots").innerHTML=T.map(function(t,i){return '<button aria-label="Story '+(i+1)+'" data-i="'+i+'"></button>'}).join("");
function go(i){idx=(i+T.length)%T.length;$("track").style.transform="translateX(-"+idx*100+"%)";[].forEach.call($("dots").children,function(d,j){d.classList.toggle("on",j==idx)})}
function auto(){clearInterval(timer);timer=setInterval(function(){go(idx+1)},6000)}
$("prev").onclick=function(){go(idx-1);auto()};$("next").onclick=function(){go(idx+1);auto()};
$("dots").onclick=function(e){var b=e.target.closest("button");if(b){go(+b.dataset.i);auto()}};
go(0);auto();

/* faq */
$("faqList").innerHTML=DATA.faqs.map(function(f,i){return '<div class="q"><button aria-expanded="false" aria-controls="fa'+i+'">'+esc(f[0])+'</button><div class="a" id="fa'+i+'" role="region"><p>'+esc(f[1])+'</p></div></div>'}).join("");
$("faqList").addEventListener("click",function(e){
  var b=e.target.closest("button");if(!b)return;var q=b.parentNode,a=q.querySelector(".a"),o=q.classList.toggle("open");
  b.setAttribute("aria-expanded",o);a.style.maxHeight=o?a.scrollHeight+"px":0;
});

/* newsletter */
$("newsForm").addEventListener("submit",function(e){e.preventDefault();var s=Store.get("in_news",[]);s.push($("newsMail").value);Store.set("in_news",s);this.reset();toast("Subscribed. Thank you!")});

/* scroll reveal + counters */
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}})},{threshold:.12});
document.querySelectorAll(".rv").forEach(function(el,i){el.style.transitionDelay=(i%4)*70+"ms";io.observe(el)});
var co=new IntersectionObserver(function(en){en.forEach(function(x){if(!x.isIntersecting)return;co.unobserve(x.target);
  var el=x.target,n=+el.dataset.n,s=el.dataset.s||"",t0=performance.now();
  (function f(t){var p=Math.min((t-t0)/1400,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3))).toLocaleString("en-IN")+s;if(p<1)requestAnimationFrame(f)})(t0);
})},{threshold:.5});
document.querySelectorAll("[data-n]").forEach(function(el){co.observe(el)});
})();
