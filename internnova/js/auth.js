/* InternNova – registration, login, session (demo: data is saved in this browser only) */
var Store={
  ok:function(){try{localStorage.setItem("_t","1");localStorage.removeItem("_t");return true}catch(e){return false}},
  get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
  set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
};
function hashPw(s){var h=5381,i;for(i=0;i<s.length;i++){h=((h<<5)+h+s.charCodeAt(i))|0}return "h"+(h>>>0).toString(36)+s.length}
var Auth={
  users:function(){return Store.get("in_users",{})},
  current:function(){var e=Store.get("in_session",null);if(!e)return null;return this.users()[e]||null},
  register:function(f){
    if(!Store.ok())return {err:"Your browser blocks storage. Please allow site data or open in a normal window."};
    var n=f.name.trim(),e=f.email.trim().toLowerCase(),us=this.users();
    if(n.length<2)return {err:"Please enter your full name."};
    if(!/^\S+@\S+\.\S+$/.test(e))return {err:"Enter a valid email address."};
    if(f.college.trim().length<2)return {err:"Please enter your college name."};
    if(f.password.length<6)return {err:"Password needs at least 6 characters."};
    if(f.password!==f.confirm)return {err:"Passwords do not match."};
    if(us[e])return {err:"This email is already registered. Please login."};
    us[e]={name:n,email:e,college:f.college.trim(),domain:f.domain,pw:hashPw(f.password),joined:new Date().toISOString()};
    Store.set("in_users",us);return {ok:true,email:e};
  },
  login:function(email,pw){
    var e=email.trim().toLowerCase(),u=this.users()[e];
    if(!u)return {err:"No account found for this email. Please register first."};
    if(u.pw!==hashPw(pw))return {err:"Incorrect password. Please try again."};
    Store.set("in_session",e);return {ok:true};
  },
  logout:function(){Store.set("in_session",null)}
};
function toast(m){var t=document.getElementById("toast");if(!t){t=document.createElement("div");t.id="toast";t.className="toast";t.setAttribute("role","status");document.body.appendChild(t)}t.textContent=m;t.classList.add("on");clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove("on")},2800)}
