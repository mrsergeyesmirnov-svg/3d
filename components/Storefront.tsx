'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown, ChevronLeft,
  ChevronRight, CircleHelp, Headphones, Layers3, Menu, MessageCircle,
  Package, Plus, Send, ShieldCheck, ShoppingBag, Sparkles, X
} from 'lucide-react';
import ProductArt from '@/components/ProductArt';
import { productById, products, rub, type Product } from '@/lib/catalog';

type View = 'home' | 'catalog' | 'how' | 'about' | 'locations';
type Msg = { role: 'assistant' | 'user'; content: string };
type FormData = {
  productId: string; preferences: string; name: string; phone: string;
  delivery: 'courier' | 'pickup'; address: string; consent: boolean;
};

const initial: Msg[] = [{
  role: 'assistant',
  content: 'Привет! Я FORMA — твой AI-помощник в создании вещей. Расскажи, что хочешь придумать: необычный чехол, предмет для дома или что-то совсем своё?'
}];
const prompts = [
  { emoji: '✳', label: 'Дизайнерский чехол', prompt: 'Хочу необычный дизайнерский чехол для телефона. Помоги выбрать форму и материал.' },
  { emoji: '◌', label: 'Вещь для дома', prompt: 'Хочу создать красивый функциональный предмет для дома. Какие есть идеи?' },
  { emoji: '↗', label: 'Своя идея', prompt: 'У меня своя идея изделия. Помоги превратить её в заказ.' }
];
const nav: { label: string; view: View; num: string }[] = [
  { label: 'Главная', view: 'home', num: '01' },
  { label: 'Каталог', view: 'catalog', num: '02' },
  { label: 'Как это работает', view: 'how', num: '03' },
  { label: 'О нас', view: 'about', num: '04' },
  { label: 'Адреса и доставка', view: 'locations', num: '05' }
];
const filters = ['Все', 'Аксессуары', 'Для дома', 'Lifestyle', 'Для бизнеса', 'Концепты'];
const blankOrder: FormData = {
  productId: 'flow-case', preferences: '', name: '', phone: '',
  delivery: 'courier', address: '', consent: false
};

export default function Storefront() {
  const [view, setView] = useState<View>('home');
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('Все');
  const [picked, setPicked] = useState<Product | null>(null);
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [aiMode, setAiMode] = useState<'demo' | 'yandex'>('demo');
  const [ready, setReady] = useState(false);
  const [ordersReady, setOrdersReady] = useState(false);
  const [policyUrl, setPolicyUrl] = useState('/privacy');
  const [orderOpen, setOrderOpen] = useState(false);
  const [order, setOrder] = useState<FormData>(blankOrder);
  const [orderBusy, setOrderBusy] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/status', { cache: 'no-store' })
      .then(r => r.json())
      .then(s => {
        setAiMode(s.ai ? 'yandex' : 'demo');
        setOrdersReady(Boolean(s.orders));
        if (s.policyUrl) setPolicyUrl(s.policyUrl);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, busy, orderOpen, orderSuccess]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenu(false); setPicked(null); setOrderOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const changeView = (v: View) => {
    setView(v); setMenu(false); setPicked(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendMessage = async (value?: string) => {
    const message = (value ?? draft).trim();
    if (!message || busy || message.length > 3000) return;
    const history: Msg[] = [...messages, { role: 'user', content: message }];
    setMessages(history); setDraft(''); setBusy(true); setOrderOpen(false);
    setView('home'); setMenu(false); setPicked(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка связи');
      setAiMode(data.mode === 'yandex' ? 'yandex' : 'demo');
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err instanceof Error ? err.message : 'Не удалось получить ответ. Повтори запрос.'
      }]);
    } finally { setBusy(false); }
  };

  const openOrder = (product?: Product) => {
    if (product) setOrder(prev => ({ ...prev, productId: product.id }));
    setOrderError(''); setOrderSuccess('');
    setOrderOpen(true); setView('home'); setPicked(null); setMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeOrder = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setOrder(prev => ({ ...prev, [key]: value }));
  };

  const submitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setOrderError(''); setOrderSuccess('');
    if (!ordersReady) {
      setOrderError('Сейчас приём заказов ещё не подключён. Мы откроем его после настройки российского сервера, базы и юридических документов.');
      return;
    }
    setOrderBusy(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...order, address: order.address.trim(), name: order.name.trim(),
          phone: order.phone.trim(), preferences: order.preferences.trim()
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка оформления');
      setOrderSuccess(data.id);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Заявка № ' + data.id.slice(0, 8).toUpperCase() +
          ' принята. Мы проверим параметры, свяжемся с тобой и согласуем финальную цену до производства.'
      }]);
      setOrder(prev => ({ ...blankOrder, productId: prev.productId }));
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Не удалось отправить заявку.');
    } finally { setOrderBusy(false); }
  };

  const orderProduct = productById(order.productId) || products[0];
  const filtered = filter === 'Все' ? products : products.filter(p => p.category === filter);

  return (
    <div className="site">
      <div className="ambient ambient-one"/><div className="ambient ambient-two"/><div className="ambient ambient-three"/>
      <header className="header">
        <button className="brand" onClick={() => changeView('home')} aria-label="FORMA — на главную">
          <span className="brand-mark">f<span className="brand-dot">.</span></span>
          <span className="brand-word">forma<span>.</span></span>
          <span className="brand-divider"/>
          <span className="brand-caption">imagination made real</span>
        </button>
        <div className="header-right">
          <span className="header-label">3D DESIGN STUDIO <span className="header-star">✳</span> 2026</span>
          <button className={'menu-button' + (menu ? ' active' : '')} onClick={() => setMenu(!menu)} aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menu}>
            <span className="menu-button-label">Меню</span>
            {menu ? <X size={20} strokeWidth={1.8}/> : <Menu size={20} strokeWidth={1.8}/>}
          </button>
        </div>
      </header>

      <main className="main">
        {view === 'home' && <section className="home">
          <div className="hero-copy reveal">
            <span className="eyebrow"><span className="tiny-light"/> МЫСЛЬ → ОБЪЕКТ</span>
            <h1>Представь что угодно.<br/><span>Мы создадим.</span></h1>
            <p>Твоя идея, наш AI и технологии 3D-печати.<br className="desktop-break"/> Вещи, которых больше ни у кого нет.</p>
          </div>

          <section className="chat-window reveal" ref={chatRef} aria-label="Диалог с AI-консультантом">
            <div className="chat-topbar">
              <div className="assistant-identity">
                <div className="ai-avatar"><Sparkles size={20} strokeWidth={1.65}/></div>
                <div><strong>FORMA AI</strong><span>Твой персональный дизайнер</span></div>
              </div>
              <div className={'ai-state ' + (aiMode === 'demo' ? 'is-demo' : '')}>
                <i/>{!ready ? 'Подключение...' : aiMode === 'yandex' ? 'Yandex AI' : 'Демо-режим'}
              </div>
            </div>
            <div className="chat-stream" aria-live="polite">
              <div className="chat-timestamp">НОВЫЙ ДИАЛОГ</div>
              {messages.map((msg, idx) => <div key={idx} className={'message-row ' + (msg.role === 'user' ? 'message-user' : 'message-assistant')}>
                {msg.role === 'assistant' && <div className="message-avatar"><Sparkles size={15}/></div>}
                <div className="message-bubble">{msg.content}</div>
              </div>)}
              {busy && <div className="message-row message-assistant"><div className="message-avatar"><Sparkles size={15}/></div><div className="typing"><span/><span/><span/></div></div>}
              {orderSuccess && <div className="order-done"><CheckCircle2 size={20}/> Заявка создана. Сохрани номер: {orderSuccess.slice(0, 8).toUpperCase()}</div>}
              <div ref={bottomRef}/>
            </div>

            {orderOpen && <div className="inline-order">
              <div className="inline-order-head">
                <div><span className="overline">НОВЫЙ ЗАПРОС</span><h3>Согласуем твою вещь</h3></div>
                <button onClick={() => setOrderOpen(false)} className="icon-button" aria-label="Закрыть форму"><X size={18}/></button>
              </div>
              <form onSubmit={submitOrder} className="order-form">
                <label>Что создаём?<select value={order.productId} onChange={e => changeOrder('productId',e.target.value)}>
                  {products.filter(p => p.orderable).map(p => <option key={p.id} value={p.id}>{p.name} — от {rub(p.price)}</option>)}
                </select></label>
                <label>Детали и пожелания<textarea rows={2} placeholder="Размер, цвет, стиль, надпись..." value={order.preferences} onChange={e => changeOrder('preferences',e.target.value)} maxLength={1000}/></label>
                <div className="form-two">
                  <label>Как к тебе обращаться<input required value={order.name} onChange={e => changeOrder('name',e.target.value)} placeholder="Имя" minLength={2} maxLength={100}/></label>
                  <label>Телефон<input required type="tel" value={order.phone} onChange={e => changeOrder('phone',e.target.value)} placeholder="+7 999 000-00-00" minLength={7}/></label>
                </div>
                <label>Получение<select value={order.delivery} onChange={e => changeOrder('delivery',e.target.value as FormData['delivery'])}>
                  <option value="courier">Доставка курьером</option><option value="pickup">Самовывоз (согласуем точку)</option>
                </select></label>
                {order.delivery === 'courier' && <label>Адрес доставки<input required minLength={8} maxLength={350} value={order.address} onChange={e => changeOrder('address',e.target.value)} placeholder="Город, улица, дом, квартира"/></label>}
                <div className="order-price"><span>Предварительно, от</span><strong>{rub(orderProduct.price)}</strong></div>
                <label className="checkbox-label"><input type="checkbox" required checked={order.consent} onChange={e => changeOrder('consent',e.target.checked)}/><span>Согласен на обработку данных для оформления заявки. <a href={policyUrl} target="_blank" rel="noreferrer">Информация о данных</a></span></label>
                {orderError && <div className="form-error" role="alert">{orderError}</div>}
                {!ordersReady && <p className="form-note">Это предварительная демонстрация. Реальный приём заявок откроется после подключения базы и публикации документов.</p>}
                <button type="submit" disabled={orderBusy || !ordersReady} className="primary-submit">
                  {orderBusy ? 'Отправляем...' : ordersReady ? 'Отправить заявку' : 'Приём заявок скоро'} <ArrowUpRight size={18}/>
                </button>
                <p className="form-fine">Цена и сроки подтверждаются человеком до начала изготовления. Оплата сейчас не списывается.</p>
              </form>
            </div>}

            {!orderOpen && <div className="chat-composer-wrap">
              {messages.length < 3 && <div className="prompts">
                {prompts.map(p => <button key={p.label} disabled={busy} onClick={() => sendMessage(p.prompt)} className="prompt">
                  <span>{p.emoji}</span>{p.label}<ArrowUpRight size={14}/>
                </button>)}
              </div>}
              <div className="chat-composer">
                <textarea ref={inputRef} rows={1} maxLength={3000} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Опиши вещь, которую хочешь создать..." aria-label="Сообщение для AI" onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}/>
                <button className="send-button" disabled={busy || !draft.trim()} onClick={() => sendMessage()} aria-label="Отправить сообщение"><ArrowUpRight size={21} strokeWidth={1.85}/></button>
              </div>
              <div className="chat-bottom">
                <span><ShieldCheck size={13}/> Не отправляй личные данные в чат</span>
                <button onClick={() => openOrder()}><ShoppingBag size={14}/> Оформить запрос <ArrowRight size={13}/></button>
              </div>
            </div>}
          </section>
          <div className="hero-foot reveal">
            <div><span className="foot-symbol">↗</span><span>От идеи до реальной вещи</span></div>
            <div><span className="foot-symbol">✳</span><span>Дизайн под тебя</span></div>
            <button onClick={() => changeView('catalog')}>Смотреть каталог <ArrowUpRight size={18}/></button>
          </div>
          <section className="teaser">
            <div className="section-titlebar"><span className="overline">01 / ИЗ КАТАЛОГА</span><button onClick={() => changeView('catalog')}>Все товары <ArrowUpRight size={16}/></button></div>
            <h2>Начни с формы.<br/><em>Продолжи фантазией.</em></h2>
            <div className="product-grid featured-grid">
              {products.slice(0,3).map(p => <ProductCard key={p.id} product={p} onClick={()=>setPicked(p)}/>)}
            </div>
          </section>
        </section>}

        {view === 'catalog' && <section className="collection-page page-enter">
          <div className="page-eyebrow">МАГАЗИН / КОЛЛЕКЦИЯ 001</div>
          <div className="collection-heading"><div><h1>Обычные вещи.<br/><span>Необычный взгляд.</span></h1><p>Дизайнерские объекты, которые можно сделать своими.</p></div><span className="collection-count">{products.length} ОБЪЕКТОВ</span></div>
          <div className="category-filters">{filters.map(f => <button key={f} className={filter === f ? 'selected' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div>
          <div className="product-grid">{filtered.map(p => <ProductCard key={p.id} product={p} onClick={() => setPicked(p)} />)}</div>
          <div className="catalog-footer"><Sparkles size={24}/><div><h3>Нет нужной вещи?</h3><p>Расскажи о своей идее — создадим проект вместе.</p></div><button className="dark-action" onClick={() => { changeView('home'); setTimeout(()=>inputRef.current?.focus(),400); }}>Обсудить с AI <ArrowUpRight size={17}/></button></div>
        </section>}

        {view === 'how' && <section className="editorial-page page-enter">
          <span className="page-eyebrow">ПРОЦЕСС / 03 ШАГА</span>
          <h1>От мысли<br/>до предмета<span className="editorial-dot">.</span></h1>
          <p className="editorial-intro">Никаких сложных редакторов. Просто диалог, понятный проект и реальное производство.</p>
          <div className="steps">{[
            ['01','Расскажи идею','Объясни AI, что хочешь создать, или выбери готовый предмет в каталоге.',MessageCircle],
            ['02','Согласуй детали','Выбираем материал, размер, цвет и готовим техническое задание. Специалист подтверждает стоимость.',Layers3],
            ['03','Получи свою вещь','После подтверждения и изготовления заказ можно будет получить доставкой или самовывозом.',Package]
          ].map(([n,title,txt,Icon]) => <div className="step" key={n as string}><span>{n as string}</span><div><h3>{title as string}</h3><p>{txt as string}</p></div><Icon size={26} strokeWidth={1.25}/></div>)}</div>
          <button className="dark-action" onClick={() => changeView('home')}>Придумать что-нибудь <ArrowUpRight size={18}/></button>
        </section>}

        {view === 'about' && <section className="editorial-page page-enter">
          <span className="page-eyebrow">О НАС / FORMA STUDIO</span>
          <h1>Форму<br/>задаёшь ты<span className="editorial-dot">.</span></h1>
          <p className="editorial-intro">FORMA — проект новой студии предметного дизайна и 3D-производства. Мы хотим сделать создание уникальных вещей таким же простым, как переписка с другом.</p>
          <div className="values-grid"><div><Sparkles size={24}/><h3>Индивидуальность</h3><p>Не ограничиваем тебя выбором готового цвета. Ищем вещь, которая подходит именно тебе.</p></div><div><Layers3 size={24}/><h3>Новые технологии</h3><p>Параметрические модели, гибкие материалы и профессиональная проверка перед производством.</p></div><div><ShieldCheck size={24}/><h3>Без лишних обещаний</h3><p>Сначала подтверждаем возможность изготовления, реальную стоимость и срок. Потом запускаем печать.</p></div></div>
          <div className="about-banner"><span>THE FUTURE IS PERSONAL</span><strong>Made for you.</strong><button onClick={()=>changeView('home')}>Создать свою вещь <ArrowUpRight size={17}/></button></div>
        </section>}

        {view === 'locations' && <section className="editorial-page page-enter">
          <span className="page-eyebrow">ЛОКАЦИИ / ДОСТАВКА</span>
          <h1>Создавай здесь.<br/>Забирай где удобно<span className="editorial-dot">.</span></h1>
          <p className="editorial-intro">Мы готовим сеть партнёрских точек выдачи и возможность доставки. Адреса появятся после запуска — пока мы не публикуем неподтверждённые точки.</p>
          <div className="location-panel"><div className="location-illustration"><span>FORMA.</span><div className="location-circle"/><div className="location-ring"/></div><div><span className="overline">СКОРО</span><h3>Санкт-Петербург</h3><p>Планируем первые точки выдачи и партнёрства с копицентрами.</p><div className="location-status"><span/> Площадки подбираются</div></div></div>
          <button className="dark-action" onClick={() => changeView('home')}>Вернуться к AI <ArrowUpRight size={18}/></button>
        </section>}
      </main>

      <footer className="footer"><div><span className="footer-logo">forma.</span><span>Things, made personal.</span></div><div><span>© 2026 FORMA — концепт студии</span><a href="/privacy">Персональные данные</a></div></footer>

      {menu && <div className="menu-overlay">
        <button className="menu-backdrop" aria-label="Закрыть меню" onClick={() => setMenu(false)}/>
        <aside className="menu-drawer" aria-label="Навигация">
          <div className="drawer-caption">НАВИГАЦИЯ <span>FORMA / 2026</span></div>
          <nav>{nav.map(item => <button key={item.view} onClick={() => changeView(item.view)} className={view === item.view ? 'current' : ''}><span className="drawer-num">{item.num}</span><span>{item.label}</span><ArrowUpRight size={22} strokeWidth={1.4}/></button>)}</nav>
          <div className="drawer-bottom"><span>Есть идея, которой нет в каталоге?</span><button onClick={() => changeView('home')}>Спроси у FORMA AI <ArrowUpRight size={16}/></button></div>
        </aside>
      </div>}

      {picked && <div className="modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) setPicked(null); }}>
        <article className="product-modal" role="dialog" aria-modal="true" aria-label={picked.name}>
          <button className="modal-close" onClick={() => setPicked(null)} aria-label="Закрыть"><X size={22}/></button>
          <div className="modal-art"><ProductArt product={picked} large/></div>
          <div className="modal-info">
            <div className="overline">{picked.category.toUpperCase()} / FORMA DESIGN</div>
            <h2>{picked.name}</h2>
            <p className="modal-subtitle">{picked.subtitle}</p>
            <p className="modal-description">{picked.description}</p>
            <div className="spec-row"><span>Материал</span><strong>{picked.material}</strong></div>
            <div className="spec-row"><span>Изготовление</span><strong>{picked.time}</strong></div>
            <div className="spec-row"><span>Цвета</span><strong>{picked.colors.join(' · ')}</strong></div>
            <div className="modal-bottom"><div><span>Предварительная цена</span><strong>от {rub(picked.price)}</strong></div>
              {picked.orderable ?
                <button className="dark-action" onClick={() => openOrder(picked)}>Обсудить заказ <ArrowUpRight size={18}/></button> :
                <button className="dark-action" onClick={() => { setPicked(null); sendMessage('Расскажи о концепте FORM / ONE и похожих изделиях, которые уже можно сделать.'); }}>Спросить у AI <ArrowUpRight size={18}/></button>}
            </div>
            <p className="modal-disclaimer">3D-иллюстрация — концепт. Окончательный вид и цена согласуются перед изготовлением.</p>
          </div>
        </article>
      </div>}
    </div>
  );
}

function ProductCard({product,onClick}:{product:Product;onClick:()=>void}) {
  return <button className="product-card" onClick={onClick} aria-label={'Подробнее о ' + product.name}>
    <div className="product-image"><ProductArt product={product}/>{product.tag && <span className="product-tag">{product.tag}</span>}<span className="card-arrow"><ArrowUpRight size={19}/></span></div>
    <div className="product-content"><div><span>{product.category}</span><h3>{product.name}</h3><p>{product.subtitle}</p></div><strong>от {rub(product.price)}</strong></div>
  </button>;
}