/* ============================================================
   Data-driven rendering for the talking-head paper showcase
   Data source: window.PAPERS (papers.js) with fetch fallback
   ============================================================ */

(function () {
  "use strict";

  /* Problem framing per paper (drives the evolution timeline) */
  var PROBLEMS = {
    meantalker: {
      problem: "扩散模型迭代采样慢（NFE>50），无法实时部署",
      answer: "Mean Flow 单步生成，双时间课程 + 几何感知轨迹校正"
    },
    pstalker: {
      problem: "头-躯干接缝伪影、音唇错位、姿态不可控",
      answer: "语义点形状统一建模 + 刚柔耦合（LBS）锚定几何先验"
    },
    srptalker: {
      problem: "像素级监督不足导致个性化音唇错位与解耦伪影",
      answer: "语义一致重建先验对齐运动，语义掩码引导修复"
    }
  };

  var BADGE_CLASS = { ECCV: "blue", ICASSP: "green", ICME: "amber" };

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function badgeClass(venueTag) {
    return BADGE_CLASS[venueTag] ? BADGE_CLASS[venueTag] : "blue";
  }

  /* ---------- Renderers ---------- */

  function renderHero(series) {
    document.getElementById("hero-title").textContent = series.title;
    document.getElementById("hero-subtitle").textContent = series.subtitle;
    document.getElementById("hero-desc").textContent = series.description;
    document.getElementById("hero-meta").textContent = series.team;
    var kw = document.getElementById("hero-keywords");
    kw.innerHTML = "";
    series.keywords.forEach(function (k) {
      kw.appendChild(el("span", "keyword", esc(k)));
    });
  }

  function renderEvolution(papers) {
    var wrap = document.getElementById("evolution");
    wrap.innerHTML = "";
    papers.forEach(function (p, i) {
      var info = PROBLEMS[p.id] || {};
      var card = el("div", "evo-card");
      card.appendChild(el("span", "step", "0" + (i + 1) + " · " + esc(p.venueTag)));
      card.querySelector(".step").style.background = "var(--blue-soft)";
      card.querySelector(".step").style.color = "var(--blue)";
      card.appendChild(el("h3", null, esc(p.name)));
      card.appendChild(el("p", "problem", "<b>问题：</b>" + esc(info.problem || "")));
      card.appendChild(el("p", null, "<b style='color:var(--green)'>方案：</b>" + esc(info.answer || "")));
      wrap.appendChild(card);
    });
  }

  function renderPaperCards(papers) {
    var wrap = document.getElementById("paper-cards");
    wrap.innerHTML = "";
    papers.forEach(function (p) {
      var card = el("div", "paper-card");
      var thumb = el("div", "thumb");
      var img = el("img");
      img.src = p.images.teaser;
      img.alt = p.name + " architecture figure";
      img.loading = "lazy";
      thumb.appendChild(img);
      card.appendChild(thumb);

      var body = el("div", "body");
      body.appendChild(el("h3", null, esc(p.name)));
      body.appendChild(el("p", "tagline", esc(p.tagline)));

      var foot = el("div", "foot");
      foot.appendChild(el("span", "badge " + badgeClass(p.venueTag), esc(p.venue)));
      foot.appendChild(el("a", null, "查看详情 →"));
      foot.querySelector("a").href = "#" + p.id;
      body.appendChild(foot);

      card.appendChild(body);
      wrap.appendChild(card);
    });
  }

  function renderTable(comparison) {
    var box = el("div", "table-wrap");
    var table = el("table", "data");
    if (comparison.caption) {
      table.appendChild(el("caption", null, esc(comparison.caption)));
    }
    var thead = el("thead");
    var hr = el("tr");
    comparison.columns.forEach(function (c) { hr.appendChild(el("th", null, esc(c))); });
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = el("tbody");
    comparison.rows.forEach(function (row, ri) {
      var tr = el("tr");
      if (ri === comparison.highlightRow) tr.className = "highlight";
      row.forEach(function (cell) { tr.appendChild(el("td", null, esc(cell))); });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    box.appendChild(table);
    return box;
  }

  function renderPaperDetail(p) {
    var detail = el("div", "paper-detail");
    detail.id = p.id;

    /* Head */
    var head = el("div", "detail-head");
    head.style.borderLeftColor = p.accent;
    head.appendChild(el("span", "badge " + badgeClass(p.venueTag), esc(p.venue)));
    head.appendChild(el("h2", null, esc(p.title)));
    head.appendChild(el("div", "authors", esc(p.authors.join(", "))));
    head.appendChild(el("div", "affil", esc(p.affiliations.join("  ·  "))));
    head.appendChild(el("p", "tagline", esc(p.tagline)));
    detail.appendChild(head);

    var body = el("div", "detail-body");

    /* Abstract */
    body.appendChild(el("h3", null, "摘要 Abstract"));
    body.appendChild(el("div", "abstract", esc(p.abstract)));

    /* Architecture figure */
    body.appendChild(el("h3", null, "总体架构 Architecture"));
    var fig = el("div", "fig-frame");
    var fimg = el("img");
    fimg.src = p.images.architecture;
    fimg.alt = p.name + " framework overview";
    fig.appendChild(fimg);
    body.appendChild(fig);
    body.appendChild(el("div", "fig-caption", "Fig. " + p.name + " framework overview（点击放大）"));

    /* Components */
    body.appendChild(el("h3", null, "核心方法 Key Components"));
    var clist = el("div", "component-list");
    p.components.forEach(function (c) {
      var cnode = el("div", "component");
      cnode.style.borderLeftColor = p.accent;
      cnode.appendChild(el("div", "cname", "<span class='abbr'>" + esc(c.abbr) + "</span>" + esc(c.name)));
      cnode.appendChild(el("p", null, esc(c.desc)));
      clist.appendChild(cnode);
    });
    body.appendChild(clist);

    /* Contributions */
    body.appendChild(el("h3", null, "主要贡献 Contributions"));
    var ul = el("ul", "check");
    p.contributions.forEach(function (c) { ul.appendChild(el("li", null, esc(c))); });
    body.appendChild(ul);

    /* Metrics */
    body.appendChild(el("h3", null, "关键指标 Highlights"));
    var mgrid = el("div", "metric-grid");
    p.metrics.forEach(function (m) {
      var mnode = el("div", "metric");
      mnode.appendChild(el("div", "value", esc(m.value)));
      mnode.appendChild(el("div", "label", esc(m.label)));
      mnode.appendChild(el("div", "note", esc(m.note)));
      mgrid.appendChild(mnode);
    });
    body.appendChild(mgrid);

    /* Comparison table */
    body.appendChild(el("h3", null, "定量对比 Quantitative Comparison"));
    body.appendChild(renderTable(p.comparison));

    /* Dataset */
    body.appendChild(el("h3", null, "数据集 Dataset"));
    var dbox = el("div", "dataset-box");
    var dicon = el("div", "dicon");
    dicon.innerHTML =
      "<svg viewBox='0 0 16 16'><path d='M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v1.2H2V3.5Zm0 2.7h12v6.3A1.5 1.5 0 0 1 12.5 14h-9A1.5 1.5 0 0 1 2 12.5V6.2Zm3 2.05a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z'/></svg>";
    var dtext = el("div");
    dtext.appendChild(el("b", null, esc(p.dataset.name)));
    dtext.appendChild(el("p", null, esc(p.dataset.desc)));
    dbox.appendChild(dicon);
    dbox.appendChild(dtext);
    body.appendChild(dbox);

    /* External links */
    var ext = (p.links || []).filter(function (l) { return l.url; });
    if (ext.length) {
      body.appendChild(el("h3", null, "链接 Links"));
      var links = el("div");
      ext.forEach(function (l) {
        links.appendChild(el("a", null, "🔗 " + esc(l.label) + " (" + esc(l.url) + ")"));
        links.lastChild.href = l.url;
        links.lastChild.target = "_blank";
        links.lastChild.rel = "noopener";
        links.appendChild(el("span", null, "&nbsp;&nbsp;"));
      });
      body.appendChild(links);
    }

    detail.appendChild(body);
    return detail;
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var box = document.getElementById("lightbox");
    var boxImg = box.querySelector("img");
    document.addEventListener("click", function (e) {
      if (e.target.matches(".fig-frame img")) {
        boxImg.src = e.target.src;
        box.classList.add("open");
      }
    });
    box.addEventListener("click", function () {
      box.classList.remove("open");
      boxImg.src = "";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") box.classList.remove("open");
    });
  }

  /* ---------- Bootstrap ---------- */
  function boot(data) {
    renderHero(data.series);
    renderEvolution(data.papers);
    renderPaperCards(data.papers);
    var details = document.getElementById("paper-details");
    data.papers.forEach(function (p) { details.appendChild(renderPaperDetail(p)); });
    initLightbox();
    document.body.classList.add("ready");
  }

  if (window.PAPERS) {
    boot(window.PAPERS);
  } else {
    fetch("assets/data/papers.json")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(boot)
      .catch(function (err) {
        document.getElementById("paper-details").innerHTML =
          "<p style='color:#cf222e;padding:20px'>数据加载失败：" + esc(err.message) +
          "。请通过本地服务器访问，或确认 assets/data/papers.js 已引入。</p>";
      });
  }
})();
