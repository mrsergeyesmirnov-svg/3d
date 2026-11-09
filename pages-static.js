(() => {
  'use strict';

  const products = [
    { id:'flow-case', name:'Flow Case', subtitle:'Чехол с текучей геометрией', description:'Рельефная поверхность, индивидуальный цвет, имя или монограмма. Совместимость с конкретной моделью телефона проверим до печати.', category:'Аксессуары', price:1490, time:'от 2 дней', material:'Гибкий TPU', colors:'Графит · Молочный · Лаванда · Мята', art:'case', tag:'Бестселлер', ready:true },
    { id:'loop-band', name:'Loop Band', subtitle:'Ремешок с воздушной структурой', description:'Гибкий ремешок с выразительным плетением. Крепления и совместимость уточняются перед заказом.', category:'Аксессуары', price:1790, time:'от 2 дней', material:'TPU', colors:'Графит · Белый · Песочный', art:'strap', tag:'Новинка', ready:true },
    { id:'soft-grip', name:'Soft Grip', subtitle:'Мягкая накладка под вашу руку', description:'Персонализированные грипсы и накладки для гаджетов, инструментов и повседневных предметов.', category:'Аксессуары', price:990, time:'от 2 дней', material:'TPU', colors:'Белый · Графит · Голубой', art:'grip', ready:true },
    { id:'orbit-dock', name:'Orbit Dock', subtitle:'Скульптурная подставка', description:'Дизайнерская подставка для телефона, аксессуаров и рабочего стола. Изменим размер под твои задачи.', category:'Для дома', price:1690, time:'от 2 дней', material:'PLA / PETG', colors:'Белый · Серый · Чёрный', art:'desk', ready:true },
    { id:'halo-object', name:'Halo Object', subtitle:'Декоративный световой объект', description:'Дизайнерский корпус-светорассеиватель без электроники. Электрические компоненты подбираются отдельно после проверки.', category:'Для дома', price:2490, time:'от 3 дней', material:'PLA', colors:'Молочный · Дымчатый', art:'lamp', ready:true },
    { id:'mono-sleeve', name:'Mono Sleeve', subtitle:'Футляр для стакана и бутылки', description:'Персонализированная внешняя накладка для готовой ёмкости: без прямого контакта с напитками или едой.', category:'Lifestyle', price:1190, time:'от 2 дней', material:'TPU', colors:'Серый · Кремовый · Лайм', art:'cup', ready:true },
    { id:'signature-tag', name:'Signature Tag', subtitle:'Брелок или персональный знак', description:'Фирменный брелок, бейдж или небольшая серия декоративных деталей с твоим дизайном.', category:'Lifestyle', price:490, time:'от 1 дня', material:'PLA / PETG', colors:'Белый · Графит · Лайм', art:'key', ready:true },
    { id:'studio-prototype', name:'Studio Prototype', subtitle:'Деталь по твоему описанию', description:'Прототип, адаптер или макет нестандартной формы. Рассчитаем цену после обсуждения технического задания.', category:'Для бизнеса', price:1490, time:'после оценки', material:'Под задачу', colors:'Под проект', art:'prototype', tag:'По запросу', ready:true },
    { id:'form-one', name:'FORM / ONE', subtitle:'Обувь нового поколения', description:'Концепт персонализированной обуви. Пока не продаётся: необходимы испытания конструкции и проверка требований.', category:'Концепты', price:6990, time:'в разработке', material:'TPU', colors:'Молочный · Графит', art:'shoe', tag:'Концепт', ready:false }
  ];

  const $ = id => document.getElementById(id);
  const money = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
  const text = (id, value) => { $(id).textContent = value; };
  const overlays = ['menu-overlay','modal-overlay','order-overlay'];
  let selected = products[0];
  let chatMessages = 1;

  function art(product, large=false) {
    const g = product.art;
    const figures = {
      case: '<g transform="rotate(-13 220 165)"><rect x="157" y="31" width="132" height="255" rx="28" fill="url(#metal)" stroke="#f5f6f8" stroke-width="4"/><rect x="164" y="38" width="118" height="241" rx="22" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="2"/><rect x="166" y="45" width="55" height="60" rx="16" fill="#cfd4dd" stroke="#abb1bd"/><circle cx="185" cy="62" r="11" fill="#626c7a" stroke="#f5f6f8" stroke-width="3"/><circle cx="207" cy="85" r="10" fill="#626c7a" stroke="#f5f6f8" stroke-width="3"/><circle cx="206" cy="62" r="4" fill="#fbfcfc"/><path d="M166 151Q218 114 279 151M166 172Q218 135 279 172M166 193Q218 156 279 193M166 214Q218 177 279 214M166 235Q218 198 279 235M166 256Q218 219 279 256" fill="none" stroke="#fff" stroke-width="4" stroke-opacity=".72"/></g>',
      strap: '<g transform="rotate(-22 220 164)"><rect x="185" y="7" width="69" height="117" rx="22" fill="url(#metal)"/><rect x="184" y="204" width="72" height="116" rx="24" fill="url(#metal)"/><path d="M200 27h38M200 45h38M200 63h38M200 81h38M200 99h38M200 225h38M200 245h38M200 265h38M200 285h38" stroke="#f6f8fa" stroke-width="8" stroke-linecap="round"/><rect x="171" y="112" width="98" height="105" rx="27" fill="#49515f" stroke="#eef0f3" stroke-width="6"/><rect x="179" y="121" width="82" height="88" rx="22" fill="#242b35"/><circle cx="220" cy="164" r="28" fill="none" stroke="#dee4e9" stroke-width="2"/><path d="M220 144v22l15 10" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>',
      grip: '<g transform="rotate(-21 220 170)"><rect x="154" y="48" width="132" height="238" rx="57" fill="url(#metal)" stroke="#f6f8fa" stroke-width="4"/><g fill="#f5f6f9" stroke="#aeb6c1" stroke-width="1.5"><ellipse cx="184" cy="93" rx="10" ry="14"/><ellipse cx="218" cy="93" rx="10" ry="14"/><ellipse cx="252" cy="93" rx="10" ry="14"/><ellipse cx="184" cy="133" rx="10" ry="14"/><ellipse cx="218" cy="133" rx="10" ry="14"/><ellipse cx="252" cy="133" rx="10" ry="14"/><ellipse cx="184" cy="173" rx="10" ry="14"/><ellipse cx="218" cy="173" rx="10" ry="14"/><ellipse cx="252" cy="173" rx="10" ry="14"/><ellipse cx="184" cy="213" rx="10" ry="14"/><ellipse cx="218" cy="213" rx="10" ry="14"/><ellipse cx="252" cy="213" rx="10" ry="14"/></g></g>',
      desk: '<g><path d="M121 252 246 105q11-10 23-1l45 40-115 128z" fill="url(#metal)" stroke="#bec4ce" stroke-width="2"/><rect x="122" y="246" width="209" height="30" rx="14" fill="url(#silk)" stroke="#ccd2da"/><g transform="rotate(18 237 129)"><rect x="193" y="44" width="93" height="173" rx="19" fill="#454c58" stroke="#fff" stroke-width="4"/><rect x="203" y="53" width="73" height="154" rx="12" fill="#b5bdc9"/></g></g>',
      lamp: '<g><ellipse cx="220" cy="256" rx="97" ry="22" fill="#a3aab5"/><path d="M132 244Q152 99 220 42Q295 119 307 244Q220 296 132 244Z" fill="url(#silk)" stroke="#eceef0" stroke-width="4"/><path d="M150 247Q153 113 218 50M175 262Q164 118 218 50M204 271Q194 117 218 50M235 271Q242 109 220 48M263 265Q288 134 220 48M287 254Q318 154 220 48" stroke="#fff" stroke-width="4" fill="none" stroke-opacity=".85"/><ellipse cx="220" cy="251" rx="87" ry="17" fill="#edeef2" stroke="#fff" stroke-width="3"/></g>',
      cup: '<g><rect x="169" y="40" width="104" height="25" rx="12" fill="#9aa2af"/><path d="M169 60h105l-12 214q-43 25-80 0z" fill="url(#metal)" stroke="#e8eaed" stroke-width="3"/><path d="M179 137h84l-8 111q-36 18-68 0z" fill="#929ba9"/><path d="M181 156q40-24 80 0M182 176q40-24 78 0M184 196q39-23 74 0M184 216q37-23 72 0M188 236q30-17 66 0" stroke="#f9fafb" stroke-width="4" stroke-opacity=".7" fill="none"/></g>',
      key: '<g transform="rotate(-24 220 170)"><circle cx="220" cy="59" r="28" stroke="#9fa6b3" stroke-width="9" fill="none"/><path d="M220 85v36" stroke="#9fa6b3" stroke-width="8"/><rect x="144" y="117" width="152" height="162" rx="38" fill="url(#metal)" stroke="#fff" stroke-width="4"/><circle cx="220" cy="142" r="10" fill="#dfe4eb" stroke="#a7aeb9" stroke-width="3"/><path d="M186 228v-60h70M186 194h56" stroke="#fafbfc" stroke-width="12" stroke-linecap="round"/></g>',
      prototype: '<g><path d="m221 41 110 60v125l-110 61-111-61V101z" fill="url(#metal)" stroke="#fafafa" stroke-width="4"/><path d="M221 41v125l110 60M221 166l-111 60M221 166l-111-65M221 166l110-65" fill="none" stroke="#fff" stroke-width="3"/><circle cx="221" cy="166" r="19" fill="#f6f7f9" stroke="#a3acb8" stroke-width="3"/></g>',
      shoe: '<g transform="rotate(-9 220 168)"><path d="M70 210q38-11 67-30l43-90q10-18 26-10l65 36 20 52q27 26 74 39 21 6 23 27v18H70q-16-22 0-42Z" fill="url(#silk)" stroke="#bdc3cd" stroke-width="4"/><path d="M70 231q157 16 318-4v27q-171 24-318-1z" fill="#cbd1d9" stroke="#f9fafb" stroke-width="3"/><path d="M139 179q73 21 156 6M154 128q60 18 121 9M149 150q65 19 130 11" stroke="#858e9b" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M157 127l-23 42M176 127l-23 45M198 131l-19 44M217 136l-16 42" stroke="#fafafa" stroke-width="4" fill="none"/></g>'
    };
    const id = 'svg-'+ product.id;
    return '<div class="art-stage art-' + g + (large?' art-large':'') + '"><div class="art-glow"></div><span class="art-orbit art-orbit-one"></span><span class="art-orbit art-orbit-two"></span><svg class="art-drawing" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 330" role="img" aria-label="Иллюстрация '+ product.name +'"><defs><linearGradient id="metal-'+id+'" x1="0%" y1="0%" x2="100%" y2="100%"><stop stop-color="#f9fafb"/><stop offset=".46" stop-color="#bac1cc"/><stop offset="1" stop-color="#8d96a4"/></linearGradient><linearGradient id="silk-'+id+'" x1="0%" y1="0%" x2="100%" y2="100%"><stop stop-color="#fff"/><stop offset="1" stop-color="#b9c0cb"/></linearGradient><filter id="shadow-'+id+'" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="15" stdDeviation="13" flood-color="#59616e" flood-opacity=".23"/></filter></defs><ellipse cx="220" cy="286" rx="115" ry="14" fill="#45505f" opacity=".09"/><g filter="url(#shadow-'+id+')">'+figures[g].replace(/url\(#metal\)/g,'url(#metal-'+id+')').replace(/url\(#silk\)/g,'url(#silk-'+id+')')+'</g></svg></div>';
  }

  function productCard(p) {
    return '<button type="button" class="product-card" data-product="'+p.id+'" aria-label="Подробнее о '+p.name+'"><span class="product-image">'+art(p)+(p.tag?'<span class="product-tag">'+p.tag+'</span>':'')+'<span class="card-arrow">↗</span></span><span class="product-content"><span><small>'+p.category+'</small><h3>'+p.name+'</h3><p>'+p.subtitle+'</p></span><strong>от '+money(p.price)+'</strong></span></button>';
  }

  const categories = ['Все','Аксессуары','Для дома','Lifestyle','Для бизнеса','Концепты'];
  let filter='Все';

  function renderCatalog() {
    $('featured-grid').innerHTML = products.slice(0,3).map(productCard).join('');
    $('category-filters').innerHTML = categories.map(c => '<button type="button" data-filter="'+c+'" class="'+(c===filter?'selected':'')+'" aria-pressed="'+(c===filter)+'">'+c+'</button>').join('');
    $('catalog-grid').innerHTML = products.filter(p => filter==='Все' || p.category===filter).map(productCard).join('');
    $('demo-product').innerHTML = '<option value="new-project">Новая вещь по моей идее</option>' + products.filter(p=>p.ready).map(p=>'<option value="'+p.id+'">'+p.name+' — печать от '+money(p.price)+'</option>').join('');
  }

  function closeOverlays() {
    overlays.forEach(id => $(id).hidden=true);
    $('menu-toggle').setAttribute('aria-expanded','false');
    document.body.classList.remove('overlay-active');
  }

  function setView(view) {
    closeOverlays();
    if (view==='privacy') {
      let privacy=$('privacy-panel');
      if (!privacy) {
        privacy=document.createElement('section');
        privacy.id='privacy-panel';
        privacy.className='editorial-page page-panel';
        privacy.innerHTML='<span class="page-eyebrow">КОНФИДЕНЦИАЛЬНОСТЬ / ДЕМО</span><h1>Твои идеи.<br>Твои данные<span class="editorial-dot">.</span></h1><p class="editorial-intro">Сейчас это демонстрационная версия на GitHub Pages: сообщения обрабатываются исключительно в браузере и никуда не отправляются. Заказы, адреса, платежи и номера телефонов пока не принимаются. Для запуска полноценного сервиса мы опубликуем юридическую политику и настроим серверную инфраструктуру в России.</p><button type="button" class="dark-action" data-view="home">Вернуться к чату ↗</button>';
        document.querySelector('.main').append(privacy);
      }
    }
    document.querySelectorAll('.page-panel').forEach(p=>p.hidden=(p.id!==view+'-panel'));
    window.scrollTo({top:0,behavior:'smooth'});
    if (location.hash!==('#'+view)) history.replaceState(null,'','#'+view);
    if (view==='home') document.title='FORMA — Представь что угодно. Мы создадим.';
    else document.title='FORMA — '+({catalog:'Каталог',how:'Как это работает',about:'О нас',locations:'Доставка',privacy:'Персональные данные'}[view] || 'Студия');
    if (view==='home') setTimeout(()=>$('chat-input').focus({preventScroll:true}),350);
  }

  function openMenu(){
    closeOverlays();
    $('menu-overlay').hidden=false;
    $('menu-toggle').setAttribute('aria-expanded','true');
    document.body.classList.add('overlay-active');
    $('menu-close').focus();
  }

  function openProduct(id) {
    const p=products.find(x=>x.id===id);
    if (!p) return;
    selected=p;
    text('product-category',p.category.toUpperCase()+' / FORMA DESIGN');
    text('product-name',p.name);
    text('product-subtitle',p.subtitle);
    text('product-description',p.description);
    text('product-material',p.material);
    text('product-time',p.time);
    text('product-colors',p.colors);
    text('product-price','от '+money(p.price));
    $('modal-art').innerHTML=art(p,true);
    $('product-order').textContent=p.ready?'Обсудить заказ ↗':'Спросить об идее ↗';
    closeOverlays();
    $('modal-overlay').hidden=false;
    document.body.classList.add('overlay-active');
    $('product-close').focus();
  }

  const designFees={standard:0,adaptation:490,custom:1490,complex:4990};
  function updateOrderPrice(){
    const id=$('demo-product').value;
    const original=id==='new-project'||id==='studio-prototype';
    const selector=$('demo-design-tier');
    for(const option of selector.options) option.disabled=original&&(option.value==='standard'||option.value==='adaptation');
    if(original&&(selector.value==='standard'||selector.value==='adaptation'))selector.value='custom';
    const p=products.find(p=>p.id===id);
    const printing=original?null:(p?p.price:null);
    const design=designFees[selector.value]??1490;
    text('demo-design-fee',design===0?'Бесплатно':'от '+money(design));
    text('demo-print-fee',printing===null?'По расчёту':'от '+money(printing));
    text('demo-price',printing===null?'После оценки':'от '+money(printing+design));
  }

  function openOrder(productId){
    closeOverlays();
    $('order-overlay').hidden=false;
    const id=typeof productId==='string'?productId:(selected.ready?selected.id:products[0].id);
    $('demo-product').value=id;
    $('demo-design-tier').value=id==='new-project'||id==='studio-prototype'?'custom':'standard';
    updateOrderPrice();
    document.body.classList.add('overlay-active');
    $('order-close').focus();
  }

  function appendMessage(role,content){
    const row=document.createElement('div');
    row.className='message-row message-'+role;
    if(role==='assistant'){
      const avatar=document.createElement('div');
      avatar.className='message-avatar';
      avatar.textContent='✳';
      row.append(avatar);
    }
    const bubble=document.createElement('div');
    bubble.className='message-bubble';
    bubble.textContent=content;
    row.append(bubble);
    $('chat-stream').append(row);
    $('chat-stream').scrollTop=$('chat-stream').scrollHeight;
  }

  function demoAnswer(input){
    const m=input.toLocaleLowerCase('ru');
    if (/разработ|моделир|за дизайн|с нуля|платн|за проект|модел[ьи]/.test(m)) return 'Обсуждение идеи бесплатно. Имя или цвет в готовом шаблоне тоже бесплатно. Правки шаблона — 490–990 ₽, новая модель — 1 490–3 990 ₽, сложные проекты — от 4 990 ₽. Изготовление отдельно; финальную цену подтвердит специалист.';
    if (/адрес|номер телефона|паспорт|достав|оплат|оформ|заказ/.test(m)) return 'Можно обсудить изделие и предварительную стоимость. Но приём заявок и адресов пока отключён — сайт работает на GitHub Pages без серверного хранилища. Нажми «Оформить запрос», чтобы посмотреть будущий процесс.';
    if (/ортоп|стельк|плоскостоп|лечени|боль/.test(m)) return 'Для ортопедических изделий нужна консультация специалиста и отдельная проверка требований к производству. Сейчас мы не принимаем медицинские заказы. Хочешь обсудить немедицинскую дизайнерскую обувь?';
    if (/кроссов|ботин|обув|тапоч/.test(m)) return 'У нас есть концепт FORM / ONE — футуристичная 3D-обувь с параметрической структурой. Он пока не доступен к заказу: проверяем конструкцию. Интереснее дизайн подошвы или верх обуви?';
    if (/чехол|телефон|айфон|iphone|кейс/.test(m)) return 'В каталоге есть Flow Case — гибкий чехол с выразительным рельефом, ориентировочно от 1 490 ₽. Можно подобрать цвет, структуру и монограмму. Для какой модели телефона нужен чехол?';
    if (/час|ремеш|apple watch/.test(m)) return 'Loop Band — дизайнерский ремешок с лёгкой сетчатой геометрией, ориентировочно от 1 790 ₽. Для него сначала надо знать модель часов и тип крепления. Какая у тебя модель?';
    if (/круж|стакан|бутыл/.test(m)) return 'Можно создать Mono Sleeve — внешнюю персонализированную накладку для стакана или бутылки, от 1 190 ₽. Печатать пищевую ёмкость из обычного 3D-пластика не предлагаем. Какой объём и форма стакана?';
    if (/дом|ламп|светиль|стол|органайзер|подставк/.test(m)) return 'В коллекции есть Orbit Dock — скульптурная подставка от 1 690 ₽, и Halo Object — декоративный световой корпус от 2 490 ₽. Хочешь минимализм или более смелую форму?';
    if (/цена|стоим|сколько|рубл/.test(m)) return 'Обсуждение бесплатно, правки шаблона от 490 ₽, индивидуальная разработка от 1 490 ₽. Печать — отдельная услуга по расчёту после проверки модели. Что хочешь создать?';
    if (/брелок|логотип|названи|бизнес|корпоратив/.test(m)) return 'Для персональных знаков есть Signature Tag от 490 ₽, а для нестандартных деталей — Studio Prototype. Можно добавить логотип, форму и размер. Сколько изделий нужно?';
    if (/привет|здравств|хай|добрый/.test(m)) return 'Привет! Придумаем что-нибудь необычное? Можем начать с чехла, ремешка, предмета для дома или совершенно новой идеи.';
    return 'Интересная идея! Расскажи, для чего нужна вещь, её примерный размер и желаемый материал — мягкий гибкий или жёсткий пластик. Я помогу подобрать похожий объект из каталога. Пока это демонстрационный помощник, а не подключённая модель Yandex AI.';
  }

  function send(message){
    const content=(message||'').trim();
    if(!content) return;
    if(content.length>3000) return;
    appendMessage('user',content);
    $('chat-input').value='';
    chatMessages++;
    if(chatMessages>2) $('prompts').hidden=true;
    setTimeout(()=>appendMessage('assistant',demoAnswer(content)),250);
  }

  document.addEventListener('click',e=>{
    const target=e.target;
    if (!(target instanceof Element)) return;
    const v=target.closest('[data-view]');
    if(v){ e.preventDefault(); setView(v.getAttribute('data-view')); return; }
    const custom=target.closest('[data-action="custom"]');
    if(custom){openOrder('new-project');return;}
    const p=target.closest('[data-product]');
    if(p){openProduct(p.getAttribute('data-product'));return;}
    const f=target.closest('[data-filter]');
    if(f){filter=f.getAttribute('data-filter');renderCatalog();return;}
    const msg=target.closest('[data-prompt]');
    if(msg){send(msg.getAttribute('data-prompt'));return;}
  });

  $('menu-toggle').addEventListener('click',()=> $('menu-overlay').hidden ? openMenu():closeOverlays());
  $('menu-close').addEventListener('click',closeOverlays);
  $('menu-backdrop').addEventListener('click',closeOverlays);
  $('product-close').addEventListener('click',closeOverlays);
  $('order-close').addEventListener('click',closeOverlays);
  $('order-back').addEventListener('click',()=>{closeOverlays();setView('home');});
  $('order-open').addEventListener('click',()=>openOrder());
  $('demo-product').addEventListener('change',updateOrderPrice);
  $('demo-design-tier').addEventListener('change',updateOrderPrice);
  $('product-order').addEventListener('click',()=>{
    if(selected.ready) openOrder();
    else {closeOverlays();setView('home');send('Расскажи про концепт обуви FORM / ONE.');}
  });
  $('modal-overlay').addEventListener('click',e=>{if(e.target===$('modal-overlay'))closeOverlays();});
  $('order-overlay').addEventListener('click',e=>{if(e.target===$('order-overlay'))closeOverlays();});
  $('chat-form').addEventListener('submit',e=>{e.preventDefault();send($('chat-input').value);});
  $('chat-input').addEventListener('keydown',e=>{
    if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send($('chat-input').value);}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeOverlays();});
  window.addEventListener('hashchange',()=>{
    const v=location.hash.replace('#','');
    if(['home','catalog','how','about','locations','privacy'].includes(v))setView(v);
  });

  renderCatalog();
  const first=location.hash.replace('#','');
  setView(['catalog','how','about','locations','privacy'].includes(first)?first:'home');
})();