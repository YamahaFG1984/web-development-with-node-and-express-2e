/* ================================================================
   Hono 教程 · 共享脚本：侧边栏、目录、代码高亮、主题
   ================================================================ */
// 保持经典 <script> 而不是 type="module"：模块脚本在 file:// 下会被浏览器拦截，
// 而这些页面经常是直接双击打开的。
(() => {
  'use strict';

  const CHAPTERS = [
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
    { n: 14, t: '搜索',                 d: '为什么 LIKE 撑不住，以及该换成什么' },
    { n: 15, t: '文件与媒体',            d: '上传、存储、访问控制与图片处理' },
    { n: 16, t: '时间与国际化',         d: '存 UTC 显示本地，以及一天不总是 24 小时' },
    { n: 17, t: '路由深入',             d: '路由器原理、参数、分组与子域名' },
    { n: 18, t: 'REST API 与 JSON',     d: 'API 设计、错误、CORS、RPC 与 OpenAPI' },
    { n: 19, t: '单页应用',             d: 'React SPA + Hono API 与 HonoX' },
    { n: 20, t: '静态资源',             d: 'serveStatic、CDN 与缓存策略' },
    { n: 21, t: '安全',                 d: 'HTTPS、安全响应头、CSRF、JWT 与 OAuth' },
    { n: 22, t: '多租户与权限',          d: '把「看不到别人的数据」变成结构性保证' },
    { n: 23, t: '集成第三方 API',        d: 'fetch、天气、地理编码与缓存' },
    { n: 24, t: '并发与数据一致性',      d: '本地跑得好好的，一上线就出事', part: '第四部分 · 系统会在哪里出问题' },
    { n: 25, t: '缓存架构',              d: '穿透、击穿、雪崩与一致性' },
    { n: 26, t: '后台任务与队列',        d: '把慢操作移出请求路径' },
    { n: 27, t: '接收 Webhook',          d: '别人调你，而你控制不了他' },
    { n: 28, t: '实时通信',              d: '轮询、SSE 与 WebSocket' },
    { n: 29, t: '可观测性',              d: '让系统能自己说出哪里不对' },
    { n: 30, t: '支付与订阅',          d: '钱让每一个一致性问题都变得不可原谅' },
    { n: 31, t: '大模型 API 集成',      d: '流式、成本、缓存与提示词注入' },
    { n: 32, t: '调试',                 d: '定位问题的方法与工具', part: '第五部分 · 上线与维护' },
    { n: 33, t: '上线',                 d: '域名、DNS 与各平台部署' },
    { n: 34, t: '维护',                 d: '让项目活过三年' },
    { n: 35, t: '更多资源',             d: '文档、社区与继续深入的路线' }
  ];

  const pad = (n) => String(n).padStart(2, '0');
  const href = (n) => `ch${pad(n)}.html`;

  const cur = Number.parseInt(document.body.dataset.chapter || '0', 10);

  /* ---------- 侧边栏 ---------- */
  const side = document.getElementById('sidebar');
  if (side) {
    const brand = '<a class="brand" href="index.html"><span class="flame">&#128293;</span>' +
      '<span>Hono 全栈开发<small>Web 标准时代的服务端框架</small></span></a>';
    const links = CHAPTERS.map(({ n, t, part }) =>
      (part ? `<div class="part">${part}</div>` : '') +
      `<a class="ch${n === cur ? ' active' : ''}" href="${href(n)}"><span class="n">${n}</span><span>${t}</span></a>`
    );
    side.innerHTML = brand + links.join('');
    const active = side.querySelector('a.ch.active');
    if (active) setTimeout(() => active.scrollIntoView({ block: 'center' }), 0);
  }

  /* ---------- 移动端菜单 ---------- */
  const btn = Object.assign(document.createElement('button'), {
    id: 'menu-btn',
    type: 'button',
    innerHTML: '&#9776;',
    onclick: () => document.body.classList.toggle('nav-open')
  });
  btn.setAttribute('aria-label', '目录');
  document.body.appendChild(btn);
  document.addEventListener('click', (e) => {
    if (document.body.classList.contains('nav-open') &&
        side && !side.contains(e.target) && e.target !== btn) {
      document.body.classList.remove('nav-open');
    }
  });

  /* ---------- 主题切换 ---------- */
  const THEME_KEY = 'hono-doc-theme';
  const tbtn = Object.assign(document.createElement('button'), {
    id: 'theme-btn',
    type: 'button',
    innerHTML: '&#9789;',
    onclick: () => {
      const root = document.documentElement;
      const now = root.getAttribute('data-theme');
      const dark = now ? now === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      const next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch {}
    }
  });
  tbtn.setAttribute('aria-label', '切换深浅色');
  document.body.appendChild(tbtn);
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch {}

  /* ---------- 箭头 marker（全局一次） ---------- */
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  defs.setAttribute('width', '0');
  defs.setAttribute('height', '0');
  defs.setAttribute('style', 'position:absolute');
  // 注意：SVG marker 的内容不会从引用它的元素继承 color，
  // 所以这里直接用 CSS 变量填色，而不是 currentColor。
  const marker = (id, fill) =>
    `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">` +
    `<path d="M0,0 L10,5 L0,10 z" fill="${fill}"/></marker>`;
  defs.innerHTML = `<defs>${marker('ar', 'var(--fg-faint)')}${marker('ar-a', 'var(--accent)')}</defs>`;
  document.body.appendChild(defs);

  /* ---------- 章节内目录 ---------- */
  const main = document.querySelector('main');
  const slot = document.getElementById('chapter-toc');
  if (slot && main) {
    const hs = [...main.querySelectorAll('h2')];
    if (hs.length > 2) {
      const items = hs.map((h, i) => {
        if (!h.id) h.id = `sec-${i + 1}`;
        return `<li><a href="#${h.id}">${h.textContent}</a></li>`;
      });
      slot.className = 'toc';
      slot.innerHTML = `<div class="h">本章目录</div><ol>${items.join('')}</ol>`;
    }
  }

  /* ---------- 代码块：语言标签 + 复制 + 高亮 ---------- */
  const KW = ('const|let|var|function|return|if|else|await|async|import|from|export|default|new|class|' +
    'extends|implements|for|while|of|in|do|try|catch|finally|throw|switch|case|break|continue|' +
    'type|interface|enum|as|satisfies|typeof|instanceof|delete|void|yield|public|private|readonly|' +
    'null|undefined|true|false|this|super|static|declare|namespace').split('|');

  // 每一段用正则字面量写，取 .source 拼起来，省掉字符串里的双重转义
  const RE_JS = new RegExp([
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)/.source,                                           // 1 注释
    /(`(?:\\[\s\S]|[^\\`])*`|'(?:\\[\s\S]|[^\\'])*'|"(?:\\[\s\S]|[^\\"])*")/.source,    // 2 字符串
    String.raw`\b(${KW.join('|')})\b`,                                                // 3 关键字
    /\b([A-Z][A-Za-z0-9_]*)\b/.source,                                                // 4 类型/构造器
    /\b(\d+(?:\.\d+)?)\b/.source,                                                     // 5 数字
    /\b([a-zA-Z_$][\w$]*)(?=\()/.source                                               // 6 函数调用
  ].join('|'), 'g');

  const RE_SH = /(#[^\n]*)|('(?:\\[\s\S]|[^\\'])*'|"(?:\\[\s\S]|[^\\"])*")|\b(npm|npx|pnpm|yarn|bun|deno|node|git|cd|mkdir|curl|export|wrangler|vitest|docker)\b/g;

  const SH_CLASSES = ['tk-cm', 'tk-st', 'tk-kw'];
  const JS_CLASSES = ['tk-cm', 'tk-st', 'tk-kw', 'tk-tp', 'tk-nm', 'tk-fn'];
  // 这些语言没有专门的规则，借用 shell 的注释 / 字符串规则就够了
  const SH_LIKE = new Set(['bash', 'sh', 'shell', 'text', 'json5', 'toml', 'http']);

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function paint(src, re, classes) {
    let out = '';
    let last = 0;
    // 所有分支都至少匹配一个字符，matchAll 不会卡在零宽匹配上
    for (const m of src.matchAll(re)) {
      out += esc(src.slice(last, m.index));
      const g = m.findIndex((v, i) => i > 0 && v !== undefined);
      out += `<span class="${classes[g - 1]}">${esc(m[g])}</span>`;
      last = m.index + m[0].length;
    }
    return out + esc(src.slice(last));
  }

  document.querySelectorAll('.code').forEach((box) => {
    const pre = box.querySelector('pre');
    if (!pre) return;
    const { lang = '', file = '' } = box.dataset;

    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.innerHTML = `<span class="tag">${esc(file || lang || 'code')}</span>`;
    const cp = Object.assign(document.createElement('button'), {
      className: 'copy',
      type: 'button',
      textContent: '复制'
    });
    cp.onclick = () => {
      navigator.clipboard?.writeText(pre.textContent);
      cp.textContent = '已复制';
      setTimeout(() => { cp.textContent = '复制'; }, 1400);
    };
    bar.appendChild(cp);
    box.insertBefore(bar, pre);

    const code = pre.textContent.replace(/^\n/, '').replace(/\s+$/, '');
    pre.innerHTML = SH_LIKE.has(lang)
      ? paint(code, RE_SH, SH_CLASSES)
      : paint(code, RE_JS, JS_CLASSES);
  });

  /* ---------- 上一章 / 下一章 ---------- */
  const pager = document.getElementById('pager');
  if (pager && cur) {
    const prev = CHAPTERS.find((c) => c.n === cur - 1);
    const next = CHAPTERS.find((c) => c.n === cur + 1);
    const prevLink = prev
      ? `<a class="prev" href="${href(prev.n)}"><span>&larr; 上一章</span>第 ${prev.n} 章 · ${prev.t}</a>`
      : '<a class="prev" href="index.html"><span>&larr; 返回</span>课程首页</a>';
    const nextLink = next
      ? `<a class="next" href="${href(next.n)}"><span>下一章 &rarr;</span>第 ${next.n} 章 · ${next.t}</a>`
      : '<a class="next ph" href="#">.</a>';
    pager.className = 'pager';
    pager.innerHTML = prevLink + nextLink;
  }

  /* ---------- 首页目录 ---------- */
  const grid = document.getElementById('toc-grid');
  if (grid) {
    grid.className = 'toc-grid';
    grid.innerHTML = CHAPTERS.map(({ n, t, d }) =>
      `<a class="toc-card" href="${href(n)}">` +
      `<div class="n">第 ${n} 章</div>` +
      `<div class="t">${t}</div>` +
      `<div class="d">${d}</div></a>`
    ).join('');
  }
})();
