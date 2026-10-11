import { ventures } from '@/lib/ventures';

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function HomePage() {
  return <main>
    <header className="topbar wrap">
      <a className="brand" href="#home" aria-label="Razzaq Ventures home"><span className="brand-mark">RV</span><span>RAZZAQ <b>VENTURES</b></span></a>
      <nav aria-label="Main navigation"><a href="#ventures">Ventures</a><a href="#approach">Approach</a><a href="#connect">Connect</a></nav>
      <a className="top-cta" href="https://wa.me/6283193905842" target="_blank" rel="noreferrer">Start a conversation <Arrow /></a>
    </header>

    <section className="hero wrap" id="home">
      <div className="hero-copy"><p className="kicker"><span className="live-dot" /> INDEPENDENT VENTURE STUDIO · INDONESIA</p>
        <h1>We build what<br /><em>comes next.</em></h1>
        <p className="hero-intro">Razzaq Ventures is a growing ecosystem of brands and technology initiatives—built with intent, shaped by curiosity, and designed to create lasting value.</p>
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

    <section className="platform-band"><div className="wrap platform-inner"><div><p className="kicker">BEYOND THE FRONT END <span>— 04</span></p><h2>One ecosystem.<br /><em>Many connected systems.</em></h2></div><div className="platform-copy"><p>Our digital foundation is being designed for future connections between the website, internal tools, messaging bots, and other platforms—through documented APIs, explicit permissions, and secure server-side integrations.</p><div className="capabilities"><span>API-FIRST</span><span>MODULAR CODE</span><span>SECURITY BY DESIGN</span><span>BUILT TO EXTEND</span></div></div></div></section>

    <section className="contact wrap" id="connect"><div className="contact-orbit" aria-hidden="true"><span>RV</span></div><div className="contact-copy"><p className="kicker">THE NEXT CHAPTER <span>— 05</span></p><h2>Have a good idea?<br /><em>Let’s build it.</em></h2><p>For partnerships, product inquiries, or technology collaborations, start a conversation with Razzaq Ventures.</p><div className="contact-links"><a href="https://wa.me/6283193905842" target="_blank" rel="noreferrer">WhatsApp <Arrow /></a><a href="https://instagram.com/razzaqventures" target="_blank" rel="noreferrer">Instagram <Arrow /></a><a href="https://shopee.co.id/search?keyword=razzaqventures" target="_blank" rel="noreferrer">Find on Shopee <Arrow /></a><a href="https://www.tokopedia.com/search?st=product&q=razzaqventures" target="_blank" rel="noreferrer">Find on Tokopedia <Arrow /></a></div></div></section>
    <footer className="footer"><div className="wrap footer-inner"><a className="brand footer-brand" href="#home"><span className="brand-mark">RV</span><span>RAZZAQ <b>VENTURES</b></span></a><span>INDEPENDENT BY DESIGN. CONNECTED BY POSSIBILITY.</span><span>© {new Date().getFullYear()} RAZZAQ VENTURES</span></div></footer>
  </main>;
}
