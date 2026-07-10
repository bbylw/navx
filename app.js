/**
 * WebNav Hub — render catalog from window.NAV_DATA (data.js)
 */
(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var data = window.NAV_DATA;
  if (!data || !data.length) {
    console.error("NAV_DATA missing — check data.js");
    return;
  }

  var rail = document.getElementById("rail");
  var chips = document.getElementById("chips");
  var catalog = document.getElementById("catalog");
  var heroJumps = document.getElementById("hero-jumps");
  var heroClock = document.getElementById("hero-clock");
  var heroDate = document.getElementById("hero-date");
  var search = document.getElementById("search");
  var clearBtn = document.getElementById("clear");
  var empty = document.getElementById("empty");
  var toTop = document.getElementById("to-top");
  var logo = document.getElementById("logo");

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function hostOf(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (e) {
      return String(url).replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
    }
  }

  function tickClock() {
    var now = new Date();
    if (heroClock) {
      var hh = now.getHours();
      var mm = now.getMinutes();
      heroClock.textContent =
        (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm;
    }
    if (heroDate) {
      var m = now.getMonth() + 1;
      var d = now.getDate();
      var week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()];
      heroDate.textContent =
        week +
        " · " +
        (m < 10 ? "0" : "") +
        m +
        "/" +
        (d < 10 ? "0" : "") +
        d;
    }
  }

  function render() {
    var railHtml = ['<div class="rail-head"><span>Index</span></div>'];
    var chipHtml = [];
    var jumpHtml = [];
    var catHtml = [];

    data.forEach(function (cat) {
      railHtml.push(
        '<a class="rail-link" href="#' +
          esc(cat.id) +
          '" data-section="' +
          esc(cat.id) +
          '">' +
          '<span class="rail-icon"><i class="' +
          esc(cat.icon) +
          '"></i></span>' +
          '<span class="rail-text">' +
          '<span class="rail-label">' +
          esc(cat.label) +
          "</span>" +
          '<span class="rail-sub">' +
          esc(cat.sub) +
          "</span>" +
          "</span>" +
          "</a>"
      );

      chipHtml.push(
        '<a class="chip" href="#' +
          esc(cat.id) +
          '" data-section="' +
          esc(cat.id) +
          '"><i class="' +
          esc(cat.icon) +
          '"></i>' +
          esc(cat.label) +
          "</a>"
      );

      jumpHtml.push(
        '<a class="hero-jump" href="#' +
          esc(cat.id) +
          '" data-section="' +
          esc(cat.id) +
          '" title="' +
          esc(cat.label) +
          '" aria-label="' +
          esc(cat.label) +
          '"><i class="' +
          esc(cat.icon) +
          '"></i></a>'
      );

      var sitesHtml = (cat.sites || [])
        .map(function (site) {
          var host = hostOf(site.url);
          return (
            '<a class="site" href="' +
            esc(site.url) +
            '" target="_blank" rel="noopener noreferrer" data-name="' +
            esc(site.name) +
            '" data-host="' +
            esc(host) +
            '">' +
            '<span class="site-ico" aria-hidden="true"><i class="' +
            esc(site.icon) +
            '"></i></span>' +
            '<span class="site-meta">' +
            '<span class="site-name" title="' +
            esc(site.name) +
            '">' +
            esc(site.name) +
            "</span>" +
            "</span>" +
            "</a>"
          );
        })
        .join("");

      catHtml.push(
        '<section class="cat" id="' +
          esc(cat.id) +
          '" data-section="' +
          esc(cat.id) +
          '">' +
          '<header class="cat-head">' +
          '<div class="cat-left">' +
          '<span class="cat-icon"><i class="' +
          esc(cat.icon) +
          '"></i></span>' +
          "<div>" +
          '<h2 class="cat-title">' +
          esc(cat.label) +
          "</h2>" +
          '<p class="cat-desc">' +
          esc(cat.sub) +
          "</p>" +
          "</div>" +
          "</div>" +
          "</header>" +
          '<div class="site-grid">' +
          sitesHtml +
          "</div>" +
          "</section>"
      );
    });

    // rail already has head in template; replace whole content
    rail.innerHTML = railHtml.join("");
    chips.innerHTML = chipHtml.join("");
    if (heroJumps) heroJumps.innerHTML = jumpHtml.join("");
    catalog.innerHTML = catHtml.join("");
  }

  render();
  tickClock();
  setInterval(tickClock, 30000);

  var railLinks = [].slice.call(document.querySelectorAll(".rail-link"));
  var chipLinks = [].slice.call(document.querySelectorAll(".chip"));
  var jumpLinks = [].slice.call(document.querySelectorAll(".hero-jump"));
  var sections = [].slice.call(document.querySelectorAll(".cat"));
  var sites = [].slice.call(document.querySelectorAll(".site"));

  function setActive(id) {
    railLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-section") === id);
    });
    chipLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-section") === id);
    });
  }

  function go(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", "#" + id);
    setActive(id);
  }

  function bindNav(nodes) {
    nodes.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (search.value) {
          search.value = "";
          filter("");
        }
        go(a.getAttribute("data-section"));
      });
    });
  }

  bindNav(railLinks);
  bindNav(chipLinks);
  bindNav(jumpLinks);

  if (logo) {
    logo.addEventListener("click", function (e) {
      e.preventDefault();
      if (search.value) {
        search.value = "";
        filter("");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.pushState(null, "", location.pathname);
    });
  }

  if (location.hash) {
    var hid = location.hash.slice(1);
    if (document.getElementById(hid)) {
      setTimeout(function () {
        go(hid);
      }, 40);
    }
  }

  var spy = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) setActive(en.target.id);
      });
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
  );
  sections.forEach(function (s) {
    spy.observe(s);
  });

  function filter(q) {
    q = (q || "").trim().toLowerCase();
    clearBtn.classList.toggle("on", !!q);
    var shown = 0;

    sites.forEach(function (card) {
      var name = (card.getAttribute("data-name") || "").toLowerCase();
      var host = (card.getAttribute("data-host") || "").toLowerCase();
      var ok = !q || name.indexOf(q) > -1 || host.indexOf(q) > -1;
      card.classList.toggle("hidden", !ok);
      if (ok) shown++;
    });

    sections.forEach(function (sec) {
      var n = sec.querySelectorAll(".site:not(.hidden)").length;
      sec.classList.toggle("hidden", n === 0);
    });

    empty.classList.toggle("on", shown === 0);
  }

  search.addEventListener("input", function () {
    filter(search.value);
  });
  clearBtn.addEventListener("click", function () {
    search.value = "";
    filter("");
    search.focus();
  });

  document.addEventListener("keydown", function (e) {
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
      e.preventDefault();
      search.focus();
      search.select();
    }
    if (e.key === "Escape" && document.activeElement === search) {
      search.value = "";
      filter("");
      search.blur();
    }
  });

  window.addEventListener(
    "scroll",
    function () {
      toTop.classList.toggle("on", window.scrollY > 420);
    },
    { passive: true }
  );
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
