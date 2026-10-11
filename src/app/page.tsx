import { listRecords } from '@/lib/rv-store';
import { ventures } from '@/lib/ventures';

export const dynamic = 'force-dynamic';
const Arrow = () => <span aria-hidden="true">↗</span>;
async function getLiveContent() {
  try {
    const [rows, productRows] = await Promise.all([listRecords('content', 300), listRecords('product', 500)]);
    const allowed = new Set(['heroTitle','heroIntro','ceoName','ceoTitle','announcement','accentColor','showAnnouncement']);
    const result: Record<string, unknown> = {};
    for (const row of [...rows].reverse()) if (row.key && allowed.has(row.key)) result[row.key] = row.payload.value;
    const latestProducts = new Map<string, Record<string, unknown>>();
    for (const row of [...productRows].reverse()) {
      const sku = typeof row.payload.sku === 'string' ? row.payload.sku : row.key;
      if (sku && row.payload.public === true) latestProducts.set(sku, { sku, name: row.payload.name, stock: row.payload.stock, price: row.payload.price, status: row.payload.status });
    }
    result.publicProducts = [...latestProducts.values()];
    return result;
  } catch { return {}; }
}
const safeText = (v: unknown, fallback: string) => typeof v === 'string' && v.trim() ? v : fallback;

export default async function HomePage() {
  const live = await getLiveContent();
  const heroTitle = safeText(live.heroTitle, 'We build what comes next.');
  const heroIntro = safeText(live.heroIntro, 'Razzaq Ventures is a growing ecosystem of brands and technology initiatives—built with intent, shaped by curiosity, and designed to create lasting value.');
  const ceoName = safeText(live.ceoName, 'Leadership information coming soon');
  const ceoTitle = safeText(live.ceoTitle, 'Founder & CEO');
  const announcement = safeText(live.announcement, '');
  const accentColor = typeof live.accentColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(live.accentColor) ? live.accentColor : '#d6f36a';
  const showAnnouncement = live.showAnnouncement !== false && Boolean(announcement);
  const publicProducts = Array.isArray(live.publicProducts) ? live.publicProducts as Array<Record<string, unknown>> : [];
  return <main style={{ ['--acid' as string]: accentColor } as React.CSSProperties}>
    <header className="topbar wrap">
      <a className="brand" href="#home" aria-label="Razzaq Ventures home"><span className="brand-mark">RV</span><span>RAZZAQ <b>VENTURES</b></span></a>
      <nav aria-label="Main navigation"><a href="#ventures">Ventures</a><a href="#approach">Approach</a><a href="#leadership">Leadership</a><a href="#connect">Connect</a></nav>
      <a className="top-cta" href="https://wa.me/6283193905842" target="_blank" rel="noreferrer">Start a conversation <Arrow /></a>
    </header>

    {showAnnouncement && <div className="wrap" style={{paddingTop:18}}><p style={{borderLeft:`3px solid ${accentColor}`,padding:'12px 16px',background:'#fffefa',fontSize:13,margin:0}}>{announcement}</p></div>}
    <section className="hero wrap" id="home">
      <div className="hero-copy"><p className="kicker"><span className="live-dot" /> INDEPENDENT VENTURE STUDIO · INDONESIA</p>
        <h1>{heroTitle === 'We build what comes next.' ? <>We build what<br /><em>comes next.</em></> : heroTitle}</h1>
        <p className="hero-intro">{heroIntro}</p>
        <div className="hero-actions"><a className="button button-dark" href="#ventures">Explore our ventures <Arrow /></a><a className="text-link" href="#approach">How we think <span>↓</span></a></div>
        <div className="hero-meta"><span>01 / VISION</span><span>Ideas into independent ventures</span></div>
      </div>
      <div className="hero-art" aria-label="Abstract orbital artwork representing a connected venture ecosystem" role="img"><div className="orb orb-one"/><div className="orb orb-two"/><div className="orb orb-three"/><div className="orb-core">RV<span>+</span></div><span className="art-label label-top">IDEAS / 01</span><span className="art-label label-bottom">SYSTEMS / FUTURE</span><span className="art-cross cross-a">+</span><span className="art-cross cross-b">+</span></div>
      <div className="hero-bottom"><span>INDEPENDENT BY DESIGN</span><span>CONNECTED BY POSSIBILITY</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <section className="manifesto" id="approach"><div className="wrap manifesto-grid"><p className="kicker">OUR POINT OF VIEW <span>— 02</span></p><div><h2>Not just a collection of products.<br /><em>A system for building possibilities.</em></h2><p className="manifesto-text">We bring consumer experiences, emerging technology, and practical experimentation under one long-term vision. Each venture has its own identity—while sharing a common foundation of thoughtful design, responsible execution, and continuous learning.</p></div></div></section>

    <section className="ventures wrap" id="ventures"><div className="section-head"><div><p className="kicker">THE ECOSYSTEM <span>— 03</span></p><h2>Different worlds.<br /><em>One direction.</em></h2></div><p className="section-note">A portfolio in motion. Explore what exists today and what we are actively developing for tomorrow.</p></div>
      <div className="venture-grid">{ventures.map((v, i) => <article className={`venture-card venture-${v.slug}`} key={v.slug}><div className="card-top"><span>0{i + 1} / VENTURE</span><span className="card-arrow"><Arrow /></span></div><div className="card-symbol" aria-hidden="true">{v.slug === 'lumora' ? 'L.' : v.slug === 'nexora' ? 'N×' : 'R+'}</div><p className="card-category">{v.category}</p><h3>{v.name}</h3><p className="card-eyebrow">{v.eyebrow}</p><p className="card-description">{v.description}</p><div className="card-products"><span>IN FOCUS</span>{v.products.map(p => <p key={p}>{p}</p>)}</div><span className="status">{v.status === 'active-brand' ? 'BRAND' : v.status === 'prototype' ? 'IN DEVELOPMENT' : 'RESEARCH STAGE'}</span></article>)}</div>
    </section>

    {publicProducts.length > 0 && <section className="ventures wrap" id="live-products"><div className="section-head"><div><p className="kicker">LIVE PRODUCT UPDATES <span>— 03B</span></p><h2>Available to explore.<br /><em>Updated by the team.</em></h2></div><p className="section-note">Only products explicitly marked public by an authorized owner are shown here.</p></div><div className="venture-grid">{publicProducts.map((p) => <article className="venture-card" key={String(p.sku)}><div className="card-top"><span>{String(p.sku)}</span><span className="card-arrow"><Arrow /></span></div><div className="card-symbol" aria-hidden="true">RV</div><h3>{String(p.name || 'Product')}</h3><p className="card-description">{String(p.status || 'Product information updated by the owner.')}</p><div className="card-products"><span>PRODUCT INFORMATION</span>{typeof p.price === 'number' && <p>Price: Rp{p.price.toLocaleString('id-ID')}</p>}{typeof p.stock === 'number' && <p>Availability: {p.stock > 0 ? 'In stock' : 'Currently unavailable'}</p>}</div></article>)}</div></section>}

    <section className="platform-band" id="leadership"><div className="wrap platform-inner"><div><p className="kicker">LEADERSHIP <span>— 04</span></p><h2>Clear direction.<br /><em>Built to evolve.</em></h2></div><div className="platform-copy"><p style={{fontSize:19,color:'#f6f6ee',marginBottom:8}}>{ceoName}</p><p>{ceoTitle}</p><p>Razzaq Ventures connects consumer brands, emerging technology, and practical experimentation through one evolving platform. Public company information can be updated by authorized operators without restarting the website.</p><div className="capabilities"><span>API-FIRST</span><span>MODULAR PLUGINS</span><span>OWNER CONTROL</span><span>LIVE CONTENT</span></div></div></div></section>

    <section className="contact wrap" id="connect"><div className="contact-orbit" aria-hidden="true"><span>RV</span></div><div className="contact-copy"><p className="kicker">THE NEXT CHAPTER <span>— 05</span></p><h2>Have a good idea?<br /><em>Let’s build it.</em></h2><p>For partnerships, product inquiries, or technology collaborations, start a conversation with Razzaq Ventures.</p><div className="contact-links"><a href="https://wa.me/6283193905842" target="_blank" rel="noreferrer">WhatsApp <Arrow /></a><a href="https://instagram.com/razzaqventures" target="_blank" rel="noreferrer">Instagram <Arrow /></a><a href="https://shopee.co.id/search?keyword=razzaqventures" target="_blank" rel="noreferrer">Find on Shopee <Arrow /></a><a href="https://www.tokopedia.com/search?st=product&q=razzaqventures" target="_blank" rel="noreferrer">Find on Tokopedia <Arrow /></a></div></div></section>
    <footer className="footer"><div className="wrap footer-inner"><a className="brand footer-brand" href="#home"><span className="brand-mark">RV</span><span>RAZZAQ <b>VENTURES</b></span></a><span>INDEPENDENT BY DESIGN. CONNECTED BY POSSIBILITY.</span><span>© {new Date().getFullYear()} RAZZAQ VENTURES</span></div></footer>
  </main>;
}
