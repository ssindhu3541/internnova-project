/* InternNova – info pages: smart back link + FAQ accordion */
(function(){
var u=Auth.current(),b=document.getElementById("backLink"),g=document.getElementById("goBtn");
if(u){b.href="dashboard.html#company";b.innerHTML="&larr; Back to dashboard";g.href="dashboard.html";g.textContent="Dashboard"}
var f=document.getElementById("faqPage");
if(f){
  f.innerHTML=DATA.faqs.map(function(q,i){return '<div class="q"><button aria-expanded="false" aria-controls="fa'+i+'">'+esc(q[0])+'</button><div class="a" id="fa'+i+'" role="region"><p>'+esc(q[1])+'</p></div></div>'}).join("");
  f.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;var q=b.parentNode,a=q.querySelector(".a"),o=q.classList.toggle("open");b.setAttribute("aria-expanded",o);a.style.maxHeight=o?a.scrollHeight+"px":0});
}
})();
