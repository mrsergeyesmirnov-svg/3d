import { productById } from '@/lib/catalog';

export type DesignTier = 'standard' | 'adaptation' | 'custom' | 'complex';

export const designTiers: {
  id: DesignTier; title: string; description: string; from: number; label: string
}[] = [
  { id: 'standard', title: 'Готовая модель', description: 'Цвет, имя или дата в пределах шаблона', from: 0, label: 'Бесплатно' },
  { id: 'adaptation', title: 'Изменить шаблон', description: 'Адаптируем форму или размеры', from: 490, label: '490–990 ₽' },
  { id: 'custom', title: 'Моя идея с нуля', description: 'Создание индивидуальной 3D-модели', from: 1490, label: '1 490–3 990 ₽' },
  { id: 'complex', title: 'Сложный проект', description: 'Техническая деталь или конструкция', from: 4990, label: 'от 4 990 ₽' }
];

export function isDesignTier(value: string): value is DesignTier {
  return designTiers.some(t => t.id === value);
}

export function getDesignQuote(productId: string, tier: DesignTier) {
  const isOriginal = productId === 'new-project' || productId === 'studio-proto';
  const product = productById(productId);
  if (productId !== 'new-project' && (!product || !product.orderable)) return null;
  if (isOriginal && tier !== 'custom' && tier !== 'complex') return null;
  const fee = designTiers.find(t => t.id === tier)!.from;
  // New designs and prototypes require slicing and physical verification before
  // a production price can be given. No checkout or payment is performed here.
  const printing = isOriginal ? null : product!.price;
  return {
    productName: productId === 'new-project' ? 'Индивидуальный проект' : product!.name,
    designFeeFrom: fee,
    printingPriceFrom: printing,
    totalFrom: printing === null ? null : fee + printing,
    subjectToQuote: true as const
  };
}
