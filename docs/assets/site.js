/* ================================================================
   Hono 教程 · 共享脚本：侧边栏、目录、代码高亮、主题
   ================================================================ */
(function () {
  'use strict';

  var CHAPTERS = [
    { n: 1,  t: '认识 Hono',            d: '为什么在 2020 年代要重新学一个 Web 框架', part: '第一部分 · 起步' },
    { n: 2,  t: '准备开发环境',          d: '运行时、包管理器与第一个 fetch 服务器' },
    { n: 3,  t: '用 Hono 节省时间',      d: '把云雀旅行网站跑起来' },
    { n: 4,  t: '整理项目',             d: '目录结构、模块、TypeScript 与 Git' },
    { n: 5,  t: '质量保证',             d: 'Vitest、testClient、Playwright 与 CI', part: '第二部分 · 核心机制' },
    { n: 6,  t: 'Context：请求与响应',   d: 'c.req / c.res 与 Web 标准对象' },
    { n: 7,  t: '模板与视图',           d: 'JSX、html 标签函数与布局' },
    { n: 8,  t: '表单处理',             d: 'parseBody、FormData、文件上传与校验' },
    { n: 9,  t: 'Cookie 与会话',        d: '签名 Cookie、Session 与 Flash 消息' },
    { n: 10, t: '中间件',               d: '洋葱模型与内置中间件全景' },
    { n: 11, t: '发送邮件',             d: '边缘环境下用 HTTP API 发信', part: '第三部分 · 真实世界' },
    { n: 12, t: '生产环境考量',          d: '环境变量、扩容、监控与压测' },
    { n: 13, t: '持久化',               d: 'D1、Drizzle、Postgres、KV 与 R2' },
    { n: 14, t: '路由深入',             d: '路由器原理、参数、分组与子域名' },
    { n: 15, t: 'REST API 与 JSON',     d: 'API 设计、错误、CORS、RPC 与 OpenAPI' },
    { n: 16, t: '单页应用',             d: 'React SPA + Hono API 与 HonoX' },
    { n: 17, t: '静态资源',             d: 'serveStatic、CDN 与缓存策略' },
    { n: 18, t: '安全',                 d: 'HTTPS、安全响应头、CSRF、JWT 与 OAuth' },
    { n: 19, t: '集成第三方 API',        d: 'fetch、天气、地理编码与缓存' },
    { n: 20, t: '并发与数据一致性',      d: '本地跑得好好的，一上线就出事', part: '第四部分 · 系统会在哪里出问题' },
    { n: 21, t: '后台任务与队列',        d: '把慢操作移出请求路径' },
    { n: 22, t: '调试',                 d: '定位问题的方法与工具', part: '第五部分 · 上线与维护' },
    { n: 23, t: '上线',                 d: '域名、DNS 与各平台部署' },
    { n: 24, t: '维护',                 d: '让项目活过三年' },
    { n: 25, t: '更多资源',             d: '文档、社区与继续深入的路线' }
  ];

  var cur = parseInt(document.body.dataset.chapter || '0', 10);

  /* ---------- 侧边栏 ---------- */
  var side = document.getElementById('sidebar');
  if (side) {
    var html = '<a class="brand" href="index.html"><span class="flame">&#128293;</span>' +
      '<span>Hono 全栈开发<small>Web 标准时代的服务端框架</small></span></a>';
    CHAPTERS.forEach(function (c) {
      if (c.part) html += '<div class="part">' + c.part + '</div>';
      html += '<a class="ch' + (c.n === cur ? ' active' : '') + '" href="ch' +
        pad(c.n) + '.html"><span class="n">' + c.n + '</span><span>' + c.t + '</span></a>';
    });
    side.innerHTML = html;
    var active = side.querySelector('a.ch.active');
    if (active) setTimeout(function () {
      active.scrollIntoView({ block: 'center' });
    }, 0);
  }

  /* ---------- 移动端菜单 ---------- */
  var btn = document.createElement('button');
  btn.id = 'menu-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', '目录');
  btn.innerHTML = '&#9776;';
  btn.onclick = function () { document.body.classList.toggle('nav-open'); };
  document.body.appendChild(btn);
  document.addEventListener('click', function (e) {
    if (document.body.classList.contains('nav-open') &&
        side && !side.contains(e.target) && e.target !== btn) {
      document.body.classList.remove('nav-open');
    }
  });

  /* ---------- 主题切换 ---------- */
  var tbtn = document.createElement('button');
  tbtn.id = 'theme-btn';
  tbtn.type = 'button';
  tbtn.setAttribute('aria-label', '切换深浅色');
  tbtn.innerHTML = '&#9789;';
  tbtn.onclick = function () {
    var root = document.documentElement;
    var now = root.getAttribute('data-theme');
    var dark = now ? now === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', dark ? 'light' : 'dark');
    try { localStorage.setItem('hono-doc-theme', dark ? 'light' : 'dark'); } catch (e) {}
  };
  document.body.appendChild(tbtn);
  try {
    var saved = localStorage.getItem('hono-doc-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {}

  /* ---------- 箭头 marker（全局一次） ---------- */
  var defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  defs.setAttribute('width', '0'); defs.setAttribute('height', '0');
  defs.setAttribute('style', 'position:absolute');
  // 注意：SVG marker 的内容不会从引用它的元素继承 color，
  // 所以这里直接用 CSS 变量填色，而不是 currentColor。
  defs.innerHTML =
    '<defs>' +
    '<marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M0,0 L10,5 L0,10 z" fill="var(--fg-faint)"/></marker>' +
    '<marker id="ar-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker>' +
    '</defs>';
  document.body.appendChild(defs);

  /* ---------- 章节内目录 ---------- */
  var main = document.querySelector('main');
  var slot = document.getElementById('chapter-toc');
  if (slot && main) {
    var hs = main.querySelectorAll('h2');
    if (hs.length > 2) {
      var t = '<div class="h">本章目录</div><ol>';
      hs.forEach(function (h, i) {
        if (!h.id) h.id = 'sec-' + (i + 1);
        t += '<li><a href="#' + h.id + '">' + h.textContent + '</a></li>';
      });
      slot.className = 'toc';
      slot.innerHTML = t + '</ol>';
    }
  }

  /* ---------- 代码块：语言标签 + 复制 + 高亮 ---------- */
  var KW = ('const|let|var|function|return|if|else|await|async|import|from|export|default|new|class|' +
    'extends|implements|for|while|of|in|do|try|catch|finally|throw|switch|case|break|continue|' +
    'type|interface|enum|as|satisfies|typeof|instanceof|delete|void|yield|public|private|readonly|' +
    'null|undefined|true|false|this|super|static|declare|namespace').split('|');

  var RE_JS = new RegExp(
    '(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)' +                       // 1 注释
    '|(`(?:\\\\[\\s\\S]|[^\\\\`])*`|\'(?:\\\\[\\s\\S]|[^\\\\\'])*\'|"(?:\\\\[\\s\\S]|[^\\\\"])*")' + // 2 字符串
    '|\\b(' + KW.join('|') + ')\\b' +                                 // 3 关键字
    '|\\b([A-Z][A-Za-z0-9_]*)\\b' +                                   // 4 类型/构造器
    '|\\b(\\d+(?:\\.\\d+)?)\\b' +                                     // 5 数字
    '|\\b([a-zA-Z_$][\\w$]*)(?=\\()',                                 // 6 函数调用
    'g');

  var RE_SH = /(#[^\n]*)|('(?:\\[\s\S]|[^\\'])*'|"(?:\\[\s\S]|[^\\"])*")|\b(npm|npx|pnpm|yarn|bun|deno|node|git|cd|mkdir|curl|export|wrangler|vitest|docker)\b/g;

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function paint(src, re, classes) {
    var out = '', last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(src)) !== null) {
      out += esc(src.slice(last, m.index));
      for (var g = 1; g < m.length; g++) {
        if (m[g] !== undefined) { out += '<span class="' + classes[g - 1] + '">' + esc(m[g]) + '</span>'; break; }
      }
      last = m.index + m[0].length;
      if (m[0].length === 0) re.lastIndex++;
    }
    return out + esc(src.slice(last));
  }

  document.querySelectorAll('.code').forEach(function (box) {
    var pre = box.querySelector('pre');
    if (!pre) return;
    var lang = box.dataset.lang || '';
    var file = box.dataset.file || '';
    var bar = document.createElement('div');
    bar.className = 'bar';
    bar.innerHTML = '<span class="tag">' + esc(file || lang || 'code') + '</span>';
    var cp = document.createElement('button');
    cp.className = 'copy'; cp.type = 'button'; cp.textContent = '复制';
    cp.onclick = function () {
      var txt = pre.textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(txt);
      cp.textContent = '已复制'; setTimeout(function () { cp.textContent = '复制'; }, 1400);
    };
    bar.appendChild(cp);
    box.insertBefore(bar, pre);

    var code = pre.textContent.replace(/^\n/, '').replace(/\s+$/, '');
    if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
      pre.innerHTML = paint(code, RE_SH, ['tk-cm', 'tk-st', 'tk-kw']);
    } else if (lang === 'text' || lang === 'json5' || lang === 'toml' || lang === 'http') {
      pre.innerHTML = paint(code, RE_SH, ['tk-cm', 'tk-st', 'tk-kw']);
    } else {
      pre.innerHTML = paint(code, RE_JS, ['tk-cm', 'tk-st', 'tk-kw', 'tk-tp', 'tk-nm', 'tk-fn']);
    }
  });

  /* ---------- 上一章 / 下一章 ---------- */
  var pager = document.getElementById('pager');
  if (pager && cur) {
    var prev = CHAPTERS.find(function (c) { return c.n === cur - 1; });
    var next = CHAPTERS.find(function (c) { return c.n === cur + 1; });
    var h = '';
    h += prev ? '<a class="prev" href="ch' + pad(prev.n) + '.html"><span>&larr; 上一章</span>第 ' + prev.n + ' 章 · ' + prev.t + '</a>'
              : '<a class="prev" href="index.html"><span>&larr; 返回</span>课程首页</a>';
    h += next ? '<a class="next" href="ch' + pad(next.n) + '.html"><span>下一章 &rarr;</span>第 ' + next.n + ' 章 · ' + next.t + '</a>'
              : '<a class="next ph" href="#">.</a>';
    pager.className = 'pager';
    pager.innerHTML = h;
  }

  /* ---------- 首页目录 ---------- */
  var grid = document.getElementById('toc-grid');
  if (grid) {
    var g = '';
    CHAPTERS.forEach(function (c) {
      g += '<a class="toc-card" href="ch' + pad(c.n) + '.html">' +
        '<div class="n">第 ' + c.n + ' 章</div>' +
        '<div class="t">' + c.t + '</div>' +
        '<div class="d">' + c.d + '</div></a>';
    });
    grid.className = 'toc-grid';
    grid.innerHTML = g;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
})();
