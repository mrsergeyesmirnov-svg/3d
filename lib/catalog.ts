export type Category = 'Аксессуары' | 'Для дома' | 'Lifestyle' | 'Для бизнеса' | 'Концепты';

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: Category;
  price: number;
  time: string;
  material: string;
  colors: string[];
  visual: 'case' | 'strap' | 'shoe' | 'cup' | 'desk' | 'grip' | 'lamp' | 'key' | 'prototype';
  orderable: boolean;
  tag?: string;
};

export const products: Product[] = [
  {
    id: 'flow-case',
    name: 'Flow Case',
    subtitle: 'Чехол с текучей геометрией',
    description: 'Рельефная поверхность, индивидуальный цвет, имя или монограмма. Совместимость с конкретной моделью проверяется до печати.',
    category: 'Аксессуары', price: 1490, time: 'от 2 дней', material: 'Гибкий TPU',
    colors: ['Графит', 'Молочный', 'Лаванда', 'Мята'], visual: 'case', orderable: true, tag: 'Бестселлер'
  },
  {
    id: 'loop-band',
    name: 'Loop Band',
    subtitle: 'Ремешок с воздушной структурой',
    description: 'Параметрический ремешок с выразительным плетением. Крепления и совместимость согласуются отдельно.',
    category: 'Аксессуары', price: 1790, time: 'от 2 дней', material: 'TPU',
    colors: ['Графит', 'Белый', 'Песочный'], visual: 'strap', orderable: true, tag: 'Новинка'
  },
  {
    id: 'soft-grip',
    name: 'Soft Grip',
    subtitle: 'Мягкая накладка под вашу руку',
    description: 'Персонализированные накладки и грипсы для гаджетов и повседневных предметов.',
    category: 'Аксессуары', price: 990, time: 'от 2 дней', material: 'TPU',
    colors: ['Белый', 'Графит', 'Голубой'], visual: 'grip', orderable: true
  },
  {
    id: 'orbit-dock',
    name: 'Orbit Dock',
    subtitle: 'Скульптурная подставка',
    description: 'Подставка для телефона, аксессуаров и рабочего стола. Меняем размеры под ваше пространство.',
    category: 'Для дома', price: 1690, time: 'от 2 дней', material: 'PLA / PETG',
    colors: ['Белый', 'Серый', 'Чёрный'], visual: 'desk', orderable: true
  },
  {
    id: 'halo-lamp',
    name: 'Halo Object',
    subtitle: 'Декоративный световой объект',
    description: 'Дизайнерский корпус-светорассеиватель без электроники. Электрику подбирают отдельно после проверки безопасности.',
    category: 'Для дома', price: 2490, time: 'от 3 дней', material: 'PLA',
    colors: ['Молочный', 'Дымчатый'], visual: 'lamp', orderable: true
  },
  {
    id: 'mono-sleeve',
    name: 'Mono Sleeve',
    subtitle: 'Футляр для стакана и бутылки',
    description: 'Персонализированная внешняя накладка для готового сосуда — не ёмкость для прямого контакта с пищей.',
    category: 'Lifestyle', price: 1190, time: 'от 2 дней', material: 'TPU',
    colors: ['Серый', 'Кремовый', 'Лайм'], visual: 'cup', orderable: true
  },
  {
    id: 'signature-tag',
    name: 'Signature Tag',
    subtitle: 'Брелок или персональный знак',
    description: 'Фирменный брелок, бейдж или небольшая серия деталей с вашим дизайном.',
    category: 'Lifestyle', price: 490, time: 'от 1 дня', material: 'PLA / PETG',
    colors: ['Белый', 'Графит', 'Лайм'], visual: 'key', orderable: true
  },
  {
    id: 'studio-proto',
    name: 'Studio Prototype',
    subtitle: 'Деталь по вашему описанию',
    description: 'Нестандартный адаптер, макет или прототип: после изучения ТЗ рассчитываем изготовление индивидуально.',
    category: 'Для бизнеса', price: 1490, time: 'после оценки', material: 'Под задачу',
    colors: ['Под проект'], visual: 'prototype', orderable: true, tag: 'По запросу'
  },
  {
    id: 'form-one',
    name: 'FORM / ONE',
    subtitle: 'Обувь нового поколения',
    description: 'Концепт индивидуально напечатанной обуви. Пока не продаётся: необходимы испытания конструкции и оценка требований.',
    category: 'Концепты', price: 6990, time: 'в разработке', material: 'TPU',
    colors: ['Молочный', 'Графит'], visual: 'shoe', orderable: false, tag: 'Концепт'
  }
];

export const productById = (id: string) => products.find(p => p.id === id);

export const rub = (price: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);

export const catalogForPrompt = products.map(p =>
  [p.name, p.id, p.category, 'от ' + p.price + ' ₽', p.material,
   p.orderable ? 'доступно для заявки' : 'только концепт'].join(' | ')
).join('\n');