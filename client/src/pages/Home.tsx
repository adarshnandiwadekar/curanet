import {
  Accessibility,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  CircleAlert,
  Download,
  ExternalLink,
  Heart,
  Info,
  Mail,
  MapPin,
  Menu,
  Phone,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
  ZoomIn,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { directoryAreas, directoryEntries, directoryTypes, type DirectoryEntry } from "@/data/directory";
import NGOInquiryModal from "@/components/NGOInquiryModal";
import {
  productAvailability,
  productCategories,
  products,
  productConditions,
  type Product,
} from "@/data/products";

type RequestForm = {
  name: string;
  locality: string;
  phone: string;
  email: string;
  urgency: string;
  preferred: "Phone" | "Email" | "Either";
  context: string;
};

const emptyRequest: RequestForm = {
  name: "",
  locality: "",
  phone: "",
  email: "",
  urgency: "Routine planning",
  preferred: "Either",
  context: "",
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function usePersisted<T>(key: string, value: T, setValue: (value: T) => void) {
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The demo remains usable when storage is unavailable.
    }
  }, [key, value, setValue]);
}

function Header({ onRequest }: { onRequest: () => void }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    ["Browse", "/browse"],
    ["How it works", "/#process"],
    ["NGOs & CSR", "/directory"],
  ] as const;

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="CuraNet home" onClick={() => setMenuOpen(false)}>
          <span className="wordmark-mark" aria-hidden="true">+</span>
          <span>CuraNet</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} className={`nav-link ${location === href ? "active" : ""}`} href={href}>
              {label}
            </Link>
          ))}
          <Link className={`nav-link ${location === "/favourites" ? "active" : ""}`} href="/favourites">Saved</Link>
        </nav>
        <div className="header-actions">
          <Link className="button button-primary button-small" href="/request">Request assistance <ArrowRight size={14} /></Link>
          <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} className="nav-link" href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          <Link className="nav-link" href="/favourites" onClick={() => setMenuOpen(false)}>Saved equipment</Link>
          <button className="button button-primary" type="button" onClick={() => { setMenuOpen(false); onRequest(); }}>Start a demo request</button>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <Link className="wordmark" href="/"><span className="wordmark-mark" aria-hidden="true">+</span><span>CuraNet</span></Link>
          <p>A fictional, demo-first resource catalogue for learning how an NGO-mediated equipment review could work across Mumbai and Thane.</p>
        </div>
        <div className="footer-links">
          <Link href="/browse">Browse equipment</Link>
          <Link href="/directory">NGOs & CSR</Link>
          <Link href="/request">Request demo</Link>
        </div>
        <p className="footer-note">CuraNet does not list medicines, provide medical advice, promise equipment allocation, or contact real organisations. Public directory entries are references, not CuraNet partners. Links and services can change; confirm current details directly with each organisation.</p>
      </div>
    </footer>
  );
}

function AppShell({ children, onRequest }: { children: React.ReactNode; onRequest: () => void }) {
  const [textLarge, setTextLarge] = useState(() => readStorage("curanet-text-large", false));
  const [highContrast, setHighContrast] = useState(() => readStorage("curanet-high-contrast", false));
  usePersisted("curanet-text-large", textLarge, setTextLarge);
  usePersisted("curanet-high-contrast", highContrast, setHighContrast);

  useEffect(() => {
    document.body.classList.toggle("text-large", textLarge);
    document.body.classList.toggle("high-contrast", highContrast);
    return () => {
      document.body.classList.remove("text-large", "high-contrast");
    };
  }, [textLarge, highContrast]);

  return (
    <div className="app-shell">
      <Header onRequest={onRequest} />
      <div className="accessibility-bar">
        <div className="accessibility-inner">
          <span><Accessibility size={14} /> Senior-friendly view</span>
          <button type="button" onClick={() => setTextLarge((value) => !value)} aria-pressed={textLarge}>Larger text</button>
          <button type="button" onClick={() => setHighContrast((value) => !value)} aria-pressed={highContrast}>Higher contrast</button>
        </div>
      </div>
      {children}
      <Footer />
    </div>
  );
}

function NoticeStrip() {
  return (
    <div className="notice-strip">
      <CircleAlert size={18} className="notice-icon" aria-hidden="true" />
      <div><strong>Demo data / not actual inventory.</strong> These fictional records help explain an NGO-mediated review process. A request does not reserve equipment, create a live allocation, or contact a real NGO or organisation.</div>
    </div>
  );
}

function ProductCard({ product, favourite, onFavourite }: { product: Product; favourite: boolean; onFavourite: () => void }) {
  const [, setLocation] = useLocation();
  return (
    <article className="product-card">
      <button className="favorite-button" type="button" onClick={onFavourite} aria-label={`${favourite ? "Remove" : "Save"} ${product.name}`} aria-pressed={favourite}>
        <Heart size={16} fill={favourite ? "currentColor" : "none"} />
      </button>
      <img className="product-image" src={product.images[0]} alt={`${product.name} illustrative web reference image; not actual inventory`} loading="lazy" decoding="async" />
      <div className="product-body">
        <div className="product-meta"><span className="badge">{product.category}</span><span className="meta">{product.area}</span></div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <span className="demo-label">Demo data / not actual inventory</span><span className="image-source-note">Illustrative web reference photo</span>
        <div className="card-footer">
          <button className="card-link" type="button" onClick={() => setLocation(`/product/${product.id}`)}>View details <ArrowRight size={13} /></button>
        </div>
      </div>
    </article>
  );
}

function FilterPanel({ search, setSearch, category, setCategory, area, setArea, condition, setCondition, availability, setAvailability, reset }: {
  search: string; setSearch: (value: string) => void; category: string; setCategory: (value: string) => void; area: string; setArea: (value: string) => void; condition: string; setCondition: (value: string) => void; availability: string; setAvailability: (value: string) => void; reset: () => void;
}) {
  return (
    <aside className="filter-panel" aria-label="Catalogue filters">
      <div className="filter-actions"><h3><SlidersHorizontal size={15} /> Refine the catalogue</h3><button className="text-button" type="button" onClick={reset}>Reset</button></div>
      <div className="filter-block"><label className="filter-label" htmlFor="product-search">Keyword</label><div className="search-wrap"><Search size={15} /><input id="product-search" className="filter-control" type="search" placeholder="Search equipment" value={search} onChange={(event) => setSearch(event.target.value)} /></div></div>
      <div className="filter-block"><label className="filter-label" htmlFor="product-category">Group</label><select id="product-category" className="filter-control" value={category} onChange={(event) => setCategory(event.target.value)}><option value="All groups">All groups</option>{productCategories.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="filter-block"><label className="filter-label" htmlFor="product-area">Area</label><select id="product-area" className="filter-control" value={area} onChange={(event) => setArea(event.target.value)}><option value="All areas">All areas</option><option>Mumbai</option><option>Thane</option>{[...new Set(products.map((product) => product.locality))].sort().map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="filter-block"><label className="filter-label" htmlFor="product-condition">Condition</label><select id="product-condition" className="filter-control" value={condition} onChange={(event) => setCondition(event.target.value)}><option value="All conditions">All conditions</option>{productConditions.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="filter-block"><label className="filter-label" htmlFor="product-availability">Availability</label><select id="product-availability" className="filter-control" value={availability} onChange={(event) => setAvailability(event.target.value)}><option value="All availability">All availability</option>{productAvailability.map((item) => <option key={item}>{item}</option>)}</select></div>
    </aside>
  );
}

function Catalogue({ favourites, onFavourite, compact = false }: { favourites: string[]; onFavourite: (id: string) => void; compact?: boolean }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All groups");
  const [area, setArea] = useState("All areas");
  const [condition, setCondition] = useState("All conditions");
  const [availability, setAvailability] = useState("All availability");
  const [sort, setSort] = useState("Newest");
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesTerm = !term || [product.name, product.category, product.locality, product.description, ...product.features].join(" ").toLowerCase().includes(term);
      return matchesTerm && (category === "All groups" || product.category === category) && (area === "All areas" || product.area === area || product.locality === area) && (condition === "All conditions" || product.condition === condition) && (availability === "All availability" || product.availability === availability);
    }).sort((a, b) => sort === "Newest" ? b.listedDate.localeCompare(a.listedDate) : a.listedDate.localeCompare(b.listedDate));
  }, [search, category, area, condition, availability, sort]);
  const visible = compact ? filtered.slice(0, 6) : filtered;
  const reset = () => { setSearch(""); setCategory("All groups"); setArea("All areas"); setCondition("All conditions"); setAvailability("All availability"); setSort("Newest"); };

  return (
    <div className={compact ? "catalogue-layout catalogue-layout-compact" : "catalogue-layout"}>
      {!compact && <FilterPanel search={search} setSearch={setSearch} category={category} setCategory={setCategory} area={area} setArea={setArea} condition={condition} setCondition={setCondition} availability={availability} setAvailability={setAvailability} reset={reset} />}
      <div className={compact ? "catalogue-full" : "catalogue-results"}>
        <div className="results-head"><p aria-live="polite"><strong>{filtered.length}</strong> of 30 fictional records {compact ? "shown" : "match your filters"}</p>{!compact && <select className="filter-control sort-control" aria-label="Sort catalogue" value={sort} onChange={(event) => setSort(event.target.value)}><option>Newest</option><option>Oldest</option></select>}</div>
        {visible.length > 0 ? <div className="product-grid">{visible.map((product) => <ProductCard key={product.id} product={product} favourite={favourites.includes(product.id)} onFavourite={() => onFavourite(product.id)} />)}</div> : <div className="empty-state"><h3>No demo records match</h3><p>Try a broader locality, group, or availability filter. These records are fictional and do not represent live inventory.</p><button className="button button-secondary" type="button" onClick={reset}><RotateCcw size={15} /> Reset filters</button></div>}
        {compact && <div className="hero-actions"><Link className="button button-secondary" href="/browse">Browse all 30 records <ArrowRight size={15} /></Link></div>}
      </div>
    </div>
  );
}

function ProcessSection() {
  return <section className="section" id="process"><div className="section-heading"><div><span className="eyebrow">What happens next</span><h2>A calmer way to understand assistance.</h2></div><p>CuraNet shows the steps a community review could take. It keeps the boundary between an information demo and a real allocation clear.</p></div><div className="process-grid"><div className="process-card"><span className="process-number">01</span><h3>Browse examples</h3><p>Start with fictional equipment records and note the locality, condition, and review status that a future coordinator might need.</p></div><div className="process-card"><span className="process-number">02</span><h3>Share a demo request</h3><p>Provide your own contact details in the client-side demonstration form. It does not store, send, or route a real request.</p></div><div className="process-card"><span className="process-number">03</span><h3>Confirm directly</h3><p>Use the public directory as a research starting point. Visit official websites and confirm current eligibility and availability yourself.</p></div></div></section>;
}

function DirectorySpotlight() {
  return <section className="section"><div className="spotlight"><div><span className="eyebrow">Public reference directory</span><h2>Start with what is documented.</h2><p>Explore public information about NGOs and CSR organisations that publish health, community, or social-impact work. These entries are references, not CuraNet partners, funders, or equipment sources.</p><Link className="button button-primary" href="/directory">Explore NGOs & CSR <ArrowRight size={15} /></Link></div><div className="spotlight-list">{directoryEntries.slice(0, 3).map((entry, index) => <Link className="spotlight-item" key={entry.id} href="/directory"><span>0{index + 1}</span>{entry.name}</Link>)}</div></div></section>;
}

function HomePage({ favourites, onFavourite }: { favourites: string[]; onFavourite: (id: string) => void }) {
  return <main className="page-frame"><section className="hero"><div><span className="eyebrow">A public-service demo for Mumbai & Thane</span><h1>Equipment support, explained with care.</h1><p className="hero-copy">CuraNet is a fictional resource catalogue that helps residents and community partners understand what an NGO-mediated assistance process could involve — before any commitment is made.</p><div className="hero-actions"><Link className="button button-primary" href="/browse">Browse demo equipment <ArrowRight size={15} /></Link><Link className="button button-secondary" href="/directory">View public directory <BookOpen size={15} /></Link></div></div><div className="hero-art"><img src="/medical/clinical-care.svg" alt="Illustration of fictional patient-care equipment" /><div className="hero-note"><strong>Clear boundaries matter.</strong>Every record is labelled demo data. No live inventory or real NGO contact is implied.</div></div></section><NoticeStrip /><section className="section"><div className="stats-row"><div className="stat-card"><strong>30</strong><span>fictional equipment records</span></div><div className="stat-card"><strong>6</strong><span>catalogue groups</span></div><div className="stat-card"><strong>12</strong><span>public reference entries</span></div><div className="stat-card"><strong>0</strong><span>live allocations made here</span></div></div></section><ProcessSection /><section className="section"><div className="section-heading"><div><span className="eyebrow">The catalogue</span><h2>See the kind of detail a review needs.</h2></div><p>Search fictional records by group, locality, condition, or availability. Newest sorting uses actual listed dates.</p></div><Catalogue favourites={favourites} onFavourite={onFavourite} compact /></section><DirectorySpotlight /></main>;
}

function ProductDetail({ product, favourite, onFavourite, onRequest }: { product: Product; favourite: boolean; onFavourite: () => void; onRequest: () => void }) {
  const [, setLocation] = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const similar = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => { if (event.key === "Escape") setZoomOpen(false); };
    window.addEventListener("keydown", dismiss);
    return () => window.removeEventListener("keydown", dismiss);
  }, []);
  return <main className="page-frame"><div className="page-intro"><div className="breadcrumb"><Link href="/browse">Browse</Link><span>/</span><span>{product.name}</span></div></div><div className="detail-layout"><div><button className="gallery-main" type="button" onClick={() => setZoomOpen(true)} aria-label="Zoom product image"><img src={product.images[selectedImage]} alt={`${product.name} illustrative web reference gallery; not actual inventory`} decoding="async" /><span className="zoom-hint"><ZoomIn size={14} /> Zoom image</span></button><div className="thumbnails">{product.images.map((image, index) => <button key={image} className={`thumbnail ${selectedImage === index ? "selected" : ""}`} type="button" onClick={() => setSelectedImage(index)} aria-label={`Show gallery image ${index + 1}`}><img src={image} alt="" loading="lazy" decoding="async" /></button>)}</div></div><div className="detail-copy"><span className="badge">{product.category}</span><h1>{product.name}</h1><span className="demo-label">Demo data / not actual inventory</span><p>{product.description}</p><div className="detail-actions"><button className="button button-primary" type="button" onClick={onRequest}>Request assistance demo <ArrowRight size={15} /></button><button className="button button-secondary" type="button" onClick={onFavourite}><Heart size={15} fill={favourite ? "currentColor" : "none"} /> {favourite ? "Saved" : "Save"}</button></div><div className="detail-block"><h3>Record details</h3><dl className="detail-list"><div><dt>Locality</dt><dd>{product.locality}, {product.area}</dd></div><div><dt>Condition</dt><dd>{product.condition}</dd></div><div><dt>Quantity</dt><dd>{product.quantity} demo unit{product.quantity === 1 ? "" : "s"}</dd></div><div><dt>Model</dt><dd>{product.model}</dd></div><div><dt>Inspection</dt><dd>{product.inspectionStatus}</dd></div><div><dt>Listed date</dt><dd>{product.listedDate}</dd></div><div><dt>Provider ID</dt><dd>{product.providerId}</dd></div><div><dt>Availability</dt><dd>{product.availability}</dd></div></dl></div><div className="detail-block"><h3>Features & specifications</h3><ul>{[...product.features, ...product.specifications].map((item) => <li key={item}>{item}</li>)}</ul></div></div></div><section className="section"><div className="section-heading"><div><span className="eyebrow">Similar examples</span><h2>More in {product.category}.</h2></div><p>Similarity is based on the fictional catalogue group only. It is not an automatic allocation or recommendation.</p></div><div className="product-grid">{similar.map((item) => <ProductCard key={item.id} product={item} favourite={false} onFavourite={() => {}} />)}</div></section>{zoomOpen && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Zoomed product image" onClick={(event) => { if (event.currentTarget === event.target) setZoomOpen(false); }}><div className="modal"><div className="modal-header"><div><span className="eyebrow">Image detail</span><h2>{product.name}</h2></div><button className="close-button" type="button" aria-label="Close image zoom" onClick={() => setZoomOpen(false)}><X size={18} /></button></div><img className="zoom-image" src={product.images[selectedImage]} alt={`${product.name} enlarged illustrative web reference image; not actual inventory`} /></div></div>}{similar.length === 0 && <button type="button" onClick={() => setLocation("/browse")} className="text-button">Return to catalogue</button>}</main>;
}

function DirectoryCard({ entry }: { entry: DirectoryEntry }) {
  return <article className="directory-card"><div className="directory-card-top"><div><span className="badge">{entry.type}</span><h3>{entry.name}</h3></div><span className="directory-card-meta">Verified {entry.lastVerified}</span></div><div className="directory-card-meta"><MapPin size={13} /> {entry.locality}</div><p>{entry.summary}</p><div className="tag-row">{entry.activities.map((activity) => <span className="activity-tag" key={activity}>{activity}</span>)}</div><div className="directory-links"><a className="external-link" href={entry.officialWebsite} target="_blank" rel="noreferrer">Official website <ExternalLink size={13} /></a><a className="external-link" href={entry.sourceUrl} target="_blank" rel="noreferrer">Source <ExternalLink size={13} /></a></div><div className="caution">{entry.caution}</div></article>;
}

function DirectoryPage({ onInquiry }: { onInquiry: () => void }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>(directoryTypes[0]);
  const [area, setArea] = useState<string>(directoryAreas[0]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return directoryEntries.filter((entry) => {
      const matchesTerm = !term || [entry.name, entry.summary, entry.locality, ...entry.activities].join(" ").toLowerCase().includes(term);
      const matchesType = type === "All organisations" || entry.type === type;
      const matchesArea = area === "All areas" || entry.area === area || (area === "Mumbai" && entry.area === "Mumbai Metropolitan Region") || (area === "Thane" && entry.area === "Mumbai Metropolitan Region");
      return matchesTerm && matchesType && matchesArea;
    });
  }, [query, type, area]);
  const reset = () => { setQuery(""); setType("All organisations"); setArea("All areas"); };
  return <main className="page-frame"><section className="page-intro directory-intro"><div><span className="eyebrow">Transparent public references</span><h1>NGOs & CSR</h1><p>Use this directory to find organisations that publicly document health, community, or social-impact work. Read it as a starting point, not as evidence that CuraNet knows, represents, funds, or partners with any entry.</p></div><aside className="directory-caveat"><strong>How to use this directory</strong>Visit the official website. Confirm current eligibility, geography, services, and availability directly. Do not assume an organisation can provide, collect, or arrange a particular product.<button className="button button-primary directory-download" type="button" onClick={onInquiry}>Send an NGO inquiry <ArrowRight size={15} /></button><a className="button button-secondary directory-download" href="/directory.csv" download="curanet-ngo-csr-directory.csv"><Download size={15} /> Download CSV</a></aside></section><NoticeStrip /><section className="section"><div className="directory-tools"><div className="search-field"><label className="filter-label" htmlFor="directory-search">Search name, activity, summary, or locality</label><div className="search-wrap"><Search size={15} /><input id="directory-search" className="filter-control" type="search" placeholder="Try healthcare or Mumbai" value={query} onChange={(event) => setQuery(event.target.value)} /></div></div><div><label className="filter-label" htmlFor="directory-type">Organisation type</label><select id="directory-type" className="filter-control" value={type} onChange={(event) => setType(event.target.value)}>{directoryTypes.map((item) => <option key={item}>{item}</option>)}</select></div><div><label className="filter-label" htmlFor="directory-area">Documented area</label><select id="directory-area" className="filter-control" value={area} onChange={(event) => setArea(event.target.value)}>{directoryAreas.map((item) => <option key={item}>{item}</option>)}</select></div><div className="filter-actions"><span className="directory-card-meta" aria-live="polite"><strong>{filtered.length}</strong> results</span><button className="text-button" type="button" onClick={reset}>Reset filters</button></div></div><p className="status-line"><Info size={14} /> Research checked 9 November 2026. Public pages and programme details can change; CuraNet does not continually monitor these links.</p>{filtered.length > 0 ? <div className="directory-grid">{filtered.map((entry) => <DirectoryCard key={entry.id} entry={entry} />)}</div> : <div className="empty-state"><h3>No public references match</h3><p>Try another organisation type, area, or keyword. The reset control restores all 12 entries.</p><button className="button button-secondary" type="button" onClick={reset}><RotateCcw size={15} /> Reset directory</button></div>}</section></main>;
}

function RequestModal({ open, product, onClose }: { open: boolean; product?: Product; onClose: () => void }) {
  const [form, setForm] = useState<RequestForm>(emptyRequest);
  const [submitted, setSubmitted] = useState(false);
  const setField = <K extends keyof RequestForm>(field: K, value: RequestForm[K]) => setForm((current) => ({ ...current, [field]: value }));
  const phoneValid = /^\+?[0-9 ()-]{7,18}$/.test(form.phone.trim());
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const valid = form.name.trim().length >= 2 && form.locality.trim().length >= 2 && phoneValid && emailValid && form.context.trim().length >= 10;
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", dismiss);
    return () => window.removeEventListener("keydown", dismiss);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="request-title" onClick={(event) => { if (event.currentTarget === event.target) onClose(); }}><div className="modal"><div className="modal-header"><div><span className="eyebrow">Client-side demonstration only</span><h2 id="request-title">Request assistance</h2></div><button className="close-button" type="button" aria-label="Close request form" onClick={onClose}><X size={18} /></button></div>{submitted ? <><div className="success-box"><strong>Demo request captured for this screen only.</strong>We recorded your selected preference as <b>{form.preferred}</b>. No phone number or email address is displayed back, stored, sent, or shared. This demo does not reserve equipment, make an allocation, or contact a real NGO or organisation.</div><div className="hero-actions"><button className="button button-primary" type="button" onClick={onClose}>Close demo</button></div></> : <><p className="modal-copy"><b>Important:</b> submitting this form neither reserves equipment nor contacts a real NGO or organisation. Please do not enter medical records or sensitive health information. Your details stay in this browser flow and are not sent to a backend.</p>{product && <div className="selected-record"><Check size={15} /> Discussing: <strong>{product.name}</strong> <span>({product.id})</span></div>}<form onSubmit={(event) => { event.preventDefault(); if (valid) setSubmitted(true); }}><div className="form-grid"><div className="form-field"><label htmlFor="request-name">Your name <span className="required">*</span></label><input id="request-name" className="form-control" autoComplete="name" autoFocus={open && !submitted} value={form.name} onChange={(event) => setField("name", event.target.value)} required /></div><div className="form-field"><label htmlFor="request-locality">Locality <span className="required">*</span></label><input id="request-locality" className="form-control" autoComplete="address-level2" placeholder="e.g. Thane West" value={form.locality} onChange={(event) => setField("locality", event.target.value)} required /></div><div className="form-field"><label htmlFor="request-phone">Phone number <span className="required">*</span></label><input id="request-phone" className="form-control" type="tel" autoComplete="tel" placeholder="e.g. +91 90000 00000" value={form.phone} onChange={(event) => setField("phone", event.target.value)} required />{form.phone && !phoneValid && <span className="form-error">Enter a valid phone number.</span>}</div><div className="form-field"><label htmlFor="request-email">Email address <span className="required">*</span></label><input id="request-email" className="form-control" type="email" autoComplete="email" placeholder="you@example.org" value={form.email} onChange={(event) => setField("email", event.target.value)} required />{form.email && !emailValid && <span className="form-error">Enter a valid email address.</span>}</div><div className="form-field"><label htmlFor="request-urgency">Planning timeframe</label><select id="request-urgency" className="form-control" value={form.urgency} onChange={(event) => setField("urgency", event.target.value)}><option>Routine planning</option><option>Within a few weeks</option><option>Time-sensitive demo discussion</option></select></div><div className="form-field"><label htmlFor="request-preferred">Preferred contact method</label><select id="request-preferred" className="form-control" value={form.preferred} onChange={(event) => setField("preferred", event.target.value as RequestForm["preferred"])}><option>Either</option><option>Phone</option><option>Email</option></select></div><div className="form-field full"><label htmlFor="request-context">What would you like to understand? <span className="required">*</span></label><textarea id="request-context" className="form-control" rows={4} placeholder="Describe the equipment category or process question. Do not include medical records." value={form.context} onChange={(event) => setField("context", event.target.value)} required /><span className="form-hint">At least 10 characters. This remains a client-side demonstration capture.</span></div></div><div className="form-footer"><span className="form-hint">Required fields keep the demo request clear and usable.</span><button className="button button-primary" type="submit" disabled={!valid}>Submit demo request <ArrowRight size={15} /></button></div></form></>}</div></div>;
}

export default function Home() {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute<{ id: string }>("/product/:id");
  const [favourites, setFavourites] = useState<string[]>(() => readStorage("curanet-favourites", []));
  const [requestOpen, setRequestOpen] = useState(location === "/request");
  const [requestProduct, setRequestProduct] = useState<Product | undefined>();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  usePersisted("curanet-favourites", favourites, setFavourites);
  const product = params?.id ? products.find((item) => item.id === params.id) : undefined;
  const openRequest = (item?: Product) => { setRequestProduct(item); setRequestOpen(true); if (location !== "/request") setLocation("/request"); };
  const closeRequest = () => { setRequestOpen(false); setRequestProduct(undefined); if (location === "/request") setLocation("/"); };
  const toggleFavourite = (id: string) => setFavourites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  useEffect(() => {
    if (location === "/request") setRequestOpen(true);
    window.scrollTo(0, 0);
  }, [location]);

  let content: React.ReactNode;
  if (location === "/directory") content = <DirectoryPage onInquiry={() => setInquiryOpen(true)} />;
  else if (location === "/browse") content = <main className="page-frame"><section className="page-intro"><span className="eyebrow">Fictional equipment catalogue</span><h1>Browse with context.</h1><p>Search 30 demo records across Mumbai and Thane. Every field is illustrative, including locality, quantity, provider ID, and availability.</p></section><NoticeStrip /><section className="section"><Catalogue favourites={favourites} onFavourite={toggleFavourite} /></section></main>;
  else if (location === "/favourites") { const saved = products.filter((item) => favourites.includes(item.id)); content = <main className="page-frame"><section className="page-intro"><span className="eyebrow">Saved in this browser</span><h1>Favourites</h1><p>Your saved demo records are stored locally in this browser only. They do not represent a live request or reservation.</p></section>{saved.length ? <div className="product-grid">{saved.map((item) => <ProductCard key={item.id} product={item} favourite onFavourite={() => toggleFavourite(item.id)} />)}</div> : <div className="empty-state"><h3>No saved equipment yet</h3><p>Save a fictional record while browsing to keep it here for this session.</p><Link className="button button-primary" href="/browse">Browse the catalogue <ArrowRight size={15} /></Link></div>}</main>; }
  else if (product) content = <ProductDetail product={product} favourite={favourites.includes(product.id)} onFavourite={() => toggleFavourite(product.id)} onRequest={() => openRequest(product)} />;
  else content = <HomePage favourites={favourites} onFavourite={toggleFavourite} />;

  return <AppShell onRequest={() => openRequest()}>{content}<RequestModal open={requestOpen} product={requestProduct} onClose={closeRequest} /><NGOInquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} /></AppShell>;
}
