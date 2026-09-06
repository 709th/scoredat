import { useEffect, useRef, useState } from "react";

const gameplay = "/assets/cs2-gameplay-loop.mp4";
const poster = "/assets/cs2-gameplay-poster.jpg";

const clips = [
  { key: "a", game: "CS2 · LIVE", start: 0.2, position: "28% 50%" },
  { key: "b", game: "CS2 · ROUND", start: 4.8, position: "52% 50%" },
  { key: "c", game: "CS2 · CLUTCH", start: 9.1, position: "76% 50%" },
  { key: "d", game: "CS2 · FEED", start: 13.7, position: "38% 50%" },
  { key: "e", game: "CS2 · LIVE", start: 18.4, position: "68% 50%" },
  { key: "f", game: "CS2 · ROUND", start: 23.1, position: "42% 50%" },
  { key: "g", game: "CS2 · CLUTCH", start: 27.6, position: "82% 50%" },
  { key: "h", game: "CS2 · FEED", start: 32.2, position: "20% 50%" },
];

const proof = [
  ["Игры", "CS2 + Dota 2", "/assets/icons/crosshair.svg"],
  ["Доставка", "Webhook + REST", "/assets/icons/arrow-right.svg"],
  ["Модель", "Оплата за матч", "/assets/icons/brackets-curly.svg"],
  ["Среда", "Staging + Production", "mark"],
];

function Logo({ className = "" }) {
  return <img className={className} src="/assets/scoredat-logo.svg" alt="ScoreDat" width="164" height="41" />;
}

function LogoMark({ className = "", label = "", style }) {
  return <span className={`logo-mark ${className}`} style={style} role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : "true"}><img src="/assets/scoredat-logo.svg" alt="" /></span>;
}

function VideoClip({ clip, miniature = false }) {
  return (
    <div className={`video-clip video-clip-${clip.key}${miniature ? " video-clip-mini" : ""}`}>
      <video data-start={clip.start} muted loop playsInline autoPlay preload="metadata" poster={poster} style={{ objectPosition: clip.position }} aria-hidden="true">
        <source src={gameplay} type="video/mp4" />
      </video>
      {!miniature && <span>{clip.game}</span>}
    </div>
  );
}

function ProofIcon({ source }) {
  return source === "mark" ? <LogoMark className="proof-mark" /> : <span className="proof-icon" aria-hidden="true"><img src={source} alt="" /></span>;
}

function Header() {
  return (
    <header className="site-header">
      <a href="#top" aria-label="ScoreDat, на главную"><Logo /></a>
      <nav aria-label="Основная навигация">
        <a href="#flow">Как работает</a><a href="#api">Games API</a><a href="#skins">Skins API</a><a href="#environments">Окружения</a><a href="https://client.scoredat.com/docs">Документация</a>
      </nav>
      <a className="header-login" href="https://client.scoredat.com/login">Войти</a>
    </header>
  );
}

function Hero({ mediaPaused, onToggleMedia }) {
  const wallRef = useRef(null);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (event) => {
      const rect = wall.getBoundingClientRect();
      wall.style.setProperty("--mx", `${(event.clientX - rect.left) / rect.width - 0.5}`);
      wall.style.setProperty("--my", `${(event.clientY - rect.top) / rect.height - 0.5}`);
    };
    wall.addEventListener("pointermove", onMove);
    return () => wall.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <Header />
      <div className="hero-inner">
        <div className="hero-copy">
          <h1 id="hero-title">Игровая статистика<br />как API для вашего<br />продукта</h1>
          <p>ScoreDat обработает новые матчи и доставит готовую статистику в ваш продукт через подписанный webhook.</p>
          <div className="hero-actions"><a className="button button-primary" href="https://client.scoredat.com/login">Начать со Staging</a><a className="button button-secondary" href="https://client.scoredat.com/docs">Смотреть API</a></div>
          <small>Бесплатный Staging · до 100 запросов в сутки</small>
        </div>

        <div className="media-wall" ref={wallRef} aria-label="Лента игровых событий CS2">
          <div className="media-wall-fade" aria-hidden="true" />
          {clips.map((clip) => <VideoClip clip={clip} key={clip.key} />)}
          <div className="hero-lidar-agent" aria-hidden="true">
            <img src="/assets/generated/cs2-nzsas-lidar-hero-v2.png" alt="" width="1024" height="1536" />
          </div>
          <div className="hero-network-core" aria-label="ScoreDat собирает игровые события"><LogoMark className="hero-core-mark" /><i className="core-ring core-ring-one" /><i className="core-ring core-ring-two" /></div>
          <div className="hero-data-stream" aria-hidden="true">
            {clips.map((clip, index) => <LogoMark className={`hero-data-packet hero-data-packet-${clip.key}`} key={clip.key} style={{ "--packet-index": index }} />)}
          </div>
          <div className="media-readout media-readout-top"><i />LIVE MATCH FEED</div>
          <div className="media-readout media-readout-bottom"><b>match.completed</b><em>ready for delivery</em></div>
          <button className="media-toggle" type="button" onClick={onToggleMedia} aria-pressed={mediaPaused}>{mediaPaused ? "Запустить видео" : "Пауза видео"}</button>
        </div>
      </div>

      <dl className="proof-rail">
        {proof.map(([label, value, icon]) => (
          <div key={label}><ProofIcon source={icon} /><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </section>
  );
}

function Flow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % 3), 2200);
    return () => window.clearInterval(timer);
  }, []);

  const steps = [
    ["Подписка активна", "Отправляете Steam ID", "Games API начинает отслеживать новые матчи игрока.", "POST /subscriptions"],
    ["Парсер в работе", "Мы собираем матч", "После финала ScoreDat формирует статистику игрока и команды.", "match.processing"],
    ["Доставлено", "Webhook приходит к вам", "Подписанный payload уходит на ваш URL и остаётся доступен через REST.", "match.completed"],
  ];

  return (
    <section className="flow-section section-shell" id="flow" aria-labelledby="flow-title">
      <div className="lidar-stage">
        <img className="lidar-base" src="/assets/generated/dust2-lidar-map-v1.png" alt="Точечная LiDAR-визуализация карты Dust 2" width="1672" height="941" />
        <div className="lidar-vignette" aria-hidden="true" />
        <div className="flow-intro"><h2 id="flow-title">Один путь от игрока<br />до вашего продукта</h2><p>Матч превращается в единый контракт данных. На карте виден весь путь — от игрового события до вашего webhook.</p></div>
        <div className="lidar-scan-field" aria-hidden="true"><img className="lidar-density" src="/assets/generated/dust2-lidar-map-v1.png" alt="" /><i className="lidar-orbit" /></div>
        <span className="map-label map-a">A SITE</span><span className="map-label map-mid">MID</span><span className="map-label map-b">B SITE</span>
        <span className="map-player player-one" aria-hidden="true" /><span className="map-player player-two" aria-hidden="true" /><span className="map-player player-three" aria-hidden="true" />
        <div className="data-hub" aria-label="ScoreDat принимает и обрабатывает данные"><LogoMark className="hub-logo" /><i className="hub-pulse" aria-hidden="true" /></div>
        <div className="map-packets" aria-hidden="true"><i className="map-packet packet-a" /><i className="map-packet packet-b" /><i className="map-packet packet-c" /><i className="map-packet packet-d" /><i className="map-packet packet-e" /><i className="map-packet packet-f" /></div>
        <div className="delivery-status"><i /> match.completed <strong>200 OK</strong></div>
        <div className="flow-steps" data-active={active}>
          <span className="flow-progress" aria-hidden="true"><i /></span>
          {steps.map(([state, title, copy, code], index) => (
            <article className={active === index ? "is-active" : ""} key={state}><div><span>0{index + 1}</span><em>{state}</em></div><h3>{title}</h3><p>{copy}</p><code>{code}</code></article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Api() {
  return (
    <section className="api-section section-shell" id="api" aria-labelledby="api-title">
      <div className="api-stage">
        <div className="api-copy"><span className="section-kicker">GAMES API / 01</span><h2 id="api-title">API показывает результат,<br />а не сложность внутри</h2><p>Раздельные окружения, повторная доставка и единый формат событий помогают быстро собрать интеграцию и безопасно перевести её в бой.</p></div>
        <div className="api-pipeline" aria-hidden="true"><span className="pipeline-source">MATCH<br />FINISHED</span><i className="pipeline-line pipeline-line-in" /><LogoMark className="pipeline-mark" /><i className="pipeline-line pipeline-line-out" /><span className="pipeline-target">WEBHOOK<br /><b>VERIFIED</b></span><i className="pipeline-packet packet-one" /><i className="pipeline-packet packet-two" /></div>
        <div className="code-console" aria-label="Пример webhook события"><div className="console-top"><span>POST /webhooks/scoredat</span><span className="console-status"><i /> verified</span></div><pre><code>{`{
  "eventType": "cs2.player.match.completed",
  "occurredAt": "2026-05-31T08:21:04Z",
  "payload": {
    "map": "de_dust2",
    "player": {
      "kills": 24,
      "deaths": 17,
      "adr": 92.4
    }
  }
}`}</code></pre><div className="console-foot"><span>X-ScoreDat-Signature</span><strong>HMAC SHA-256</strong></div></div>
        <ul className="mechanism-list"><li><strong>HMAC-подпись</strong><span>на каждом webhook-запросе</span></li><li><strong>Идемпотентность</strong><span>повторы не создают дубли</span></li><li><strong>Один контракт</strong><span>для CS2 и Dota 2</span></li><li><strong>Batch-операции</strong><span>для массовых подписок</span></li></ul>
      </div>
    </section>
  );
}

function Skins() {
  return (
    <section className="skins-section section-shell" id="skins" aria-labelledby="skins-title">
      <div className="skins-stage">
        <div className="skins-copy"><span className="section-kicker">SKINS API / 02</span><h2 id="skins-title">Скины внутри<br />вашего продукта</h2><p>Каталог, итоговые цены, покупка, продажа-депозит и доставка через Steam Trade Offer. Один API вместо прямых интеграций с поставщиками.</p><a className="button button-primary" href="https://client.scoredat.com/login">Запросить подключение</a></div>
        <div className="skin-catalog" aria-label="Примеры игровых предметов">
          <div className="skin-network" aria-hidden="true"><LogoMark className="skin-network-mark" /><span>INVENTORY<br /><b>SYNCED</b></span><i className="skin-route route-one" /><i className="skin-route route-two" /><i className="skin-route route-three" /></div>
          <article className="skin-card skin-card-rifle"><div><span>CS2 · Trade offer</span><strong>AK-47</strong><em>READY</em></div><img src="/assets/generated/scoredat-skin-rifle-red-v1.png" alt="Красно-чёрный скин AK-47" /></article>
          <article className="skin-card skin-card-knives"><div><span>CS2 · Deposit</span><strong>Knives</strong><em>VERIFIED</em></div><img src="/assets/generated/scoredat-skin-knives-v1.png" alt="Фиолетовые игровые клинки" /></article>
          <article className="skin-card skin-card-smg"><div><span>Rust · Delivery</span><strong>SMG</strong><em>DELIVERED</em></div><img src="/assets/generated/scoredat-skin-smg-teal-v1.png" alt="Бирюзовый скин SMG" /></article>
        </div>
      </div>
    </section>
  );
}

function Environments() {
  return (
    <section className="environment-section" id="environments" aria-labelledby="environment-title">
      <div className="environment-inner section-shell">
        <div className="staging-story">
          <div className="environment-heading"><span className="section-kicker">ENVIRONMENTS / 03</span><h2 id="environment-title">Сначала проверьте.<br />Потом включайте бой.</h2><p>Одинаковый контракт данных в двух изолированных окружениях.</p></div>
          <div className="staging-copy"><span className="environment-label"><i /> STAGING</span><h3>Соберите интеграцию без риска</h3><p>Полный доступ к подпискам, парсингу и webhook для проверки сценария.</p><a className="button button-primary" href="https://client.scoredat.com/login">Создать Staging</a></div>
          <div className="juggernaut-stage" aria-hidden="true"><span className="scan-axis scan-axis-x" /><span className="scan-axis scan-axis-y" /><img src="/assets/generated/dota2-juggernaut-lidar-v1.png" alt="" width="923" height="1705" /><span className="juggernaut-scan" /><LogoMark className="environment-mark" /><i className="environment-packet environment-packet-a" /><i className="environment-packet environment-packet-b" /><span className="scan-caption caption-top">PLAYER SCAN / 100%</span><span className="scan-caption caption-side">PAYLOAD READY</span></div>
          <div className="staging-proof"><div><span>Лимит</span><strong>100 запросов / сутки</strong></div><div><span>Доставка</span><strong>Свой webhook + API-ключ</strong></div><div><span>Старт</span><strong>Без оплаты и обязательств</strong></div></div>
        </div>
        <div className="production-strip"><span className="production-index">02</span><div><span>PRODUCTION</span><h3>Платите за обработанный матч</h3></div><p>Боевой доступ без абонплаты за простой. Баланс и счёт находятся на уровне организации.</p><div className="production-meter"><span>0 матчей</span><i /><strong>0 списаний</strong></div></div>
      </div>
    </section>
  );
}

function Closing() {
  return <><section className="closing-section section-shell"><div className="closing-copy"><span className="section-kicker">READY / 04</span><h2>Первое событие может<br />прийти уже сегодня</h2><p>Создайте Staging, добавьте webhook и подпишитесь на первого игрока.</p><div className="closing-actions"><a className="button button-primary" href="https://client.scoredat.com/login">Создать интеграцию</a><a className="button button-secondary" href="https://client.scoredat.com/docs">Открыть документацию</a></div></div><div className="closing-network" aria-hidden="true"><span className="closing-event">match.completed<em>PLAYER / 7656119</em></span><i className="closing-route" /><div className="closing-core"><LogoMark className="closing-mark" /><span>ScoreDat</span></div><i className="closing-route closing-route-out" /><span className="closing-receipt">YOUR WEBHOOK<strong>200 OK</strong></span><i className="closing-packet closing-packet-one" /><i className="closing-packet closing-packet-two" /></div></section><footer className="site-footer section-shell"><a href="#top"><Logo /></a><p>Игровые данные для вашего продукта.</p><div><a href="https://client.scoredat.com/docs">API Docs</a><span>© 2026 ScoreDat</span></div></footer></>;
}

export default function App() {
  const [mediaPaused, setMediaPaused] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const videos = [...document.querySelectorAll("video[data-start]")];
    videos.forEach((video) => {
      const seek = () => { if (video.duration) video.currentTime = Number(video.dataset.start || 0) % video.duration; if (!reduced && !mediaPaused) video.play().catch(() => {}); };
      if (video.readyState >= 1) seek(); else video.addEventListener("loadedmetadata", seek, { once: true });
      if (reduced || mediaPaused) video.pause();
    });
    if (reduced || mediaPaused) return;
    const observer = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => { if (target instanceof HTMLVideoElement) isIntersecting ? target.play().catch(() => {}) : target.pause(); }), { threshold: 0.05 });
    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [mediaPaused]);

  const captureMode = new URLSearchParams(window.location.search).get("capture");
  return <div className={captureMode ? `capture capture-${captureMode}` : "app"}><a className="skip-link" href="#content">Перейти к содержанию</a><main id="content"><Hero mediaPaused={mediaPaused} onToggleMedia={() => setMediaPaused((value) => !value)} /><Flow /><Api /><Skins /><Environments /><Closing /></main></div>;
}
