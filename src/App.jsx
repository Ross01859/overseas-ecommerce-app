import { useEffect, useRef, useState } from "react";
import {
  products,
  sizes,
  price,
  money,
  filterPrints,
  MAX_QTY,
  cleanCart,
  total,
  shippingFee,
} from "./shop";
import { Icon } from "./Icons";
import { Modal } from "./Modal";

function useStored(key, clean) {
  const [value, setValue] = useState(() => {
    try {
      return clean(JSON.parse(localStorage.getItem(key)));
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Keep the session usable when storage is unavailable. */
    }
  }, [key, value]);
  return [value, setValue];
}
const validSaved = (value) =>
  Array.isArray(value)
    ? [...new Set(value.filter((id) => products.some((p) => p.id === id)))]
    : [];
const imageFor = (p) => "/art/" + p.id + ".jpg";
function Brand() {
  return (
    <span className="brand">
      <Icon name="flower" size={32} />
      Paperform<span className="brand-dot">.</span>
    </span>
  );
}
function PrintCard({ product: p, saved, toggle, open }) {
  return (
    <article className="card">
      <div className="mount" style={{ backgroundColor: p.tone }}>
        <button
          className="artlink"
          onClick={open}
          aria-label={"View " + p.name}
        >
          <img src={imageFor(p)} alt={p.name + " art print"} />
        </button>
        <button
          className={"favorite icon " + (saved ? "on" : "")}
          aria-pressed={saved}
          aria-label={(saved ? "Unsave " : "Save ") + p.name}
          onClick={toggle}
        >
          <Icon name="heart" size={17} filled={saved} />
        </button>
      </div>
      <div className="cardinfo">
        <div>
          <span className="kind">{p.category}</span>
          <h3>
            <button onClick={open}>{p.name}</button>
          </h3>
          <p>
            From <strong>{money(p.base)}</strong>
          </p>
        </div>
        <button
          className="choose icon"
          aria-label={"Choose size for " + p.name}
          onClick={open}
        >
          <Icon name="plus" size={18} />
        </button>
      </div>
    </article>
  );
}
function Detail({ product: p, cart, add, close }) {
  const [size, setSize] = useState(sizes[0].id);
  const quantity = cart.find((r) => r.id === p.id && r.size === size)?.qty || 0;
  return (
    <Modal title={p.name + " print details"} close={close} variant="detail">
      <div className="detail-art" style={{ background: p.tone }}>
        <img src={imageFor(p)} alt={p.name + " artwork"} />
      </div>
      <div className="detail-body">
        <span className="eyebrow">{p.category} print</span>
        <h2>{p.name}</h2>
        <strong className="detail-price">
          {money(price(p, size))} <small>USD</small>
        </strong>
        <p>{p.description}</p>
        <fieldset>
          <legend>Print size</legend>
          <div className="sizegrid">
            {sizes.map((s) => (
              <label key={s.id} className={s.id === size ? "selected" : ""}>
                <input
                  type="radio"
                  name="size"
                  value={s.id}
                  checked={s.id === size}
                  onChange={() => setSize(s.id)}
                />
                <b>{s.label}</b>
                <small>{s.metric}</small>
              </label>
            ))}
          </div>
        </fieldset>
        <p className="printnote">Unframed · 250 gsm matte paper</p>
        <button
          className="primary wide"
          disabled={quantity >= MAX_QTY}
          onClick={() => add(p, size)}
        >
          <Icon name="bag" size={17} />
          {quantity >= MAX_QTY
            ? "Maximum quantity in bag"
            : "Add to bag · " + money(price(p, size))}
        </button>
      </div>
    </Modal>
  );
}
function Bag({ cart, setCart, close }) {
  const subtotal = total(cart);
  function change(row, delta) {
    setCart((old) =>
      old
        .map((r) =>
          r.id === row.id && r.size === row.size
            ? { ...r, qty: Math.min(MAX_QTY, r.qty + delta) }
            : r,
        )
        .filter((r) => r.qty > 0),
    );
  }
  return (
    <Modal title="Shopping bag" close={close} variant="drawer">
      <div className="drawer-head">
        <span className="eyebrow">Paperform print shop</span>
        <h2>
          Your bag <small>({cart.reduce((n, r) => n + r.qty, 0)})</small>
        </h2>
      </div>
      {cart.length === 0 ? (
        <div className="emptybag">
          <Icon name="bag" size={42} />
          <h3>Your bag is empty.</h3>
          <p>Find a print that feels like you.</p>
          <button className="primary" onClick={close}>
            Explore prints
          </button>
        </div>
      ) : (
        <>
          <div className="bagrows">
            {cart.map((r) => {
              const p = products.find((p) => p.id === r.id),
                s = sizes.find((s) => s.id === r.size);
              return (
                <article className="bagrow" key={r.id + r.size}>
                  <div className="thumb" style={{ background: p.tone }}>
                    <img src={imageFor(p)} alt="" />
                  </div>
                  <div className="rowinfo">
                    <h3>{p.name}</h3>
                    <p>{s.label} · Unframed</p>
                    <div className="step">
                      <button
                        aria-label={"Decrease " + p.name + " " + s.label}
                        disabled={r.qty <= 1}
                        onClick={() => change(r, -1)}
                      >
                        <Icon name="minus" size={13} />
                      </button>
                      <output>{r.qty}</output>
                      <button
                        aria-label={"Increase " + p.name + " " + s.label}
                        disabled={r.qty >= MAX_QTY}
                        onClick={() => change(r, 1)}
                      >
                        <Icon name="plus" size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="rowend">
                    <b>{money(price(p, r.size) * r.qty)}</b>
                    <button
                      onClick={() => change(r, -r.qty)}
                      aria-label={"Remove " + p.name + " " + s.label}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="summary">
            <p className="shipline">
              <Icon name="box" size={18} />
              {subtotal >= 7500
                ? "Your bag qualifies for free shipping."
                : money(7500 - subtotal) + " away from free shipping."}
            </p>
            <div className="progress">
              <i style={{ width: Math.min(100, subtotal / 75) + "%" }} />
            </div>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              <div>
                <dt>Standard shipping</dt>
                <dd>
                  {shippingFee(subtotal)
                    ? money(shippingFee(subtotal))
                    : "Free"}
                </dd>
              </div>
              <div className="total">
                <dt>Estimated total</dt>
                <dd>
                  <small>USD </small>
                  {money(subtotal + shippingFee(subtotal))}
                </dd>
              </div>
            </dl>
            <p className="fine">
              Demo estimate. Local taxes and import duties are excluded.
            </p>
            <button className="primary wide" onClick={close}>
              Continue shopping
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
function App() {
  const [cart, setCart] = useStored("paperform.bag.v1", cleanCart);
  const [saved, setSaved] = useStored("paperform.saved.v1", validSaved);
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All prints"),
    [sort, setSort] = useState("featured");
  const [onlySaved, setOnlySaved] = useState(false),
    [panel, setPanel] = useState(null);
  const section = useRef(null),
    input = useRef(null);
  const count = cart.reduce((n, row) => n + row.qty, 0);
  const visible = filterPrints({ category, query, sort, onlySaved, saved });
  function browse(savedOnly = false, focus = false) {
    setOnlySaved(savedOnly);
    setCategory("All prints");
    setQuery("");
    setPanel(null);
    requestAnimationFrame(() => {
      section.current?.scrollIntoView({ block: "start" });
      if (focus) input.current?.focus({ preventScroll: true });
    });
  }
  function add(p, size) {
    setCart((old) => cleanCart([...old, { id: p.id, size, qty: 1 }]));
    setPanel("bag");
  }
  function toggle(id) {
    setSaved((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
    );
  }
  return (
    <>
      <a className="skip" href="#collection">
        Skip to prints
      </a>
      <div className="announcement">
        <Icon name="globe" size={14} /> Worldwide shipping <span>·</span> Free
        on orders $75+
      </div>
      <header>
        <div className="nav wrap">
          <a
            href="#"
            aria-label="Paperform home"
            onClick={(e) => {
              e.preventDefault();
              setOnlySaved(false);
              setQuery("");
              setCategory("All prints");
              window.scrollTo({ top: 0 });
            }}
          >
            <Brand />
          </a>
          <nav aria-label="Main">
            <button
              className={!onlySaved ? "active" : ""}
              onClick={() => browse()}
            >
              Shop prints
            </button>
            <button
              className={onlySaved ? "active" : ""}
              onClick={() => browse(true)}
            >
              Saved{saved.length > 0 ? " (" + saved.length + ")" : ""}
            </button>
            <button onClick={() => setPanel("shipping")}>Shipping</button>
          </nav>
          <div className="nav-actions">
            <button
              className="icon nav-search"
              onClick={() => browse(false, true)}
              aria-label="Search catalog"
            >
              <Icon name="search" />
            </button>
            <button
              className="mobile-saved icon"
              aria-label="View saved prints"
              onClick={() => browse(true)}
            >
              <Icon name="heart" />
            </button>
            <button
              className="bagbutton"
              aria-label={"Open bag, " + count + " items"}
              onClick={() => setPanel("bag")}
            >
              <Icon name="bag" size={18} /> Bag <span>{count}</span>
            </button>
          </div>
        </div>
      </header>
      <main className="wrap">
        <section className="hero" aria-label="Featured collection">
          <div className="hero-copy">
            <p className="eyebrow hero-label">
              <i />
              The color edit
            </p>
            <h1>
              Good art.
              <br />
              <em>Great walls.</em>
            </h1>
            <p className="hero-desc">
              Original art prints for rooms with personality.
            </p>
            <button className="primary" onClick={() => browse()}>
              Shop the collection
            </button>
          </div>
          <div className="hero-art">
            <img
              src="/art/hero.jpg"
              alt="Three overlapping Paperform art prints on a golden studio tabletop"
              fetchpriority="high"
            />
          </div>
        </section>
        <section ref={section} id="collection" className="collection">
          <div className="catalog-heading">
            <div>
              <p className="eyebrow section-kicker">
                <span />
                Print catalog
              </p>
              <h2>
                {onlySaved ? "Saved prints" : "Shop the prints"}
                <small className="count">
                  {visible.length.toString().padStart(2, "0")}
                </small>
              </h2>
            </div>
            <label className="search">
              <Icon name="search" size={18} />
              <input
                ref={input}
                aria-label="Search prints"
                placeholder="Search prints…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    input.current.focus();
                  }}
                >
                  <Icon name="x" size={15} />
                </button>
              )}
            </label>
          </div>
          <div className="toolbar">
            <div className="filters" aria-label="Print categories">
              {["All prints", "Abstract", "Botanical", "Landscape"].map((c) => (
                <button
                  key={c}
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="sort">
              <span>Sort:</span>
              <select
                aria-label="Sort prints"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
              <Icon name="down" size={14} />
            </label>
          </div>
          <div className="sr" aria-live="polite">
            {visible.length} prints found
          </div>
          {visible.length ? (
            <div className="grid">
              {visible.map((p) => (
                <PrintCard
                  key={p.id}
                  product={p}
                  saved={saved.includes(p.id)}
                  toggle={() => toggle(p.id)}
                  open={() => setPanel(p)}
                />
              ))}
            </div>
          ) : (
            <div className="empty">
              <Icon name={onlySaved ? "heart" : "search"} size={30} />
              <h3>
                {onlySaved && !saved.length
                  ? "Your saved collection starts here."
                  : "No prints found."}
              </h3>
              <p>
                {onlySaved && !saved.length
                  ? "Tap the heart on a print to keep it here."
                  : "Try a different search or browse the full collection."}
              </p>
              <button className="primary" onClick={() => browse()}>
                Browse all prints
              </button>
            </div>
          )}
        </section>
      </main>
      <footer>
        <div className="wrap foot">
          <Brand />
          <span>Independent art prints</span>
          <button onClick={() => setPanel("shipping")}>
            Shipping &amp; print details
          </button>
          <span>USD $</span>
        </div>
      </footer>
      {panel === "shipping" && (
        <Modal
          title="Shipping and print details"
          variant="info"
          close={() => setPanel(null)}
        >
          <span className="eyebrow">Shop information</span>
          <h2>Shipping &amp; prints</h2>
          <h3>Worldwide delivery</h3>
          <p>
            Standard shipping is $9 per bag, or free on a merchandise subtotal
            of $75 or more. All prices are in US dollars. Local taxes and import
            duties are excluded.
          </p>
          <h3>Frame-ready sizes</h3>
          <p>
            Each unframed print comes on 250 gsm matte paper. Both inch and
            centimeter measurements are listed with each size.
          </p>
          <p className="fine">
            This is a demonstration shop. No payment is collected and no orders
            are shipped.
          </p>
        </Modal>
      )}
      {panel === "bag" && (
        <Bag cart={cart} setCart={setCart} close={() => setPanel(null)} />
      )}
      {typeof panel === "object" && panel && (
        <Detail
          product={panel}
          cart={cart}
          add={add}
          close={() => setPanel(null)}
        />
      )}
    </>
  );
}
export default App;
