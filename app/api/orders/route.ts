import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { getDesignQuote, isDesignTier } from '@/lib/design-pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let pool: Pool | undefined;
function getPool() {
  if (!pool) pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 20000,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined
  });
  return pool;
}

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL || !process.env.COMPANY_NAME || !process.env.PRIVACY_POLICY_URL || !process.env.SITE_URL) {
    return NextResponse.json({ error: 'Приём заявок пока не подключён. Сайт работает в режиме презентации.' }, { status: 503 });
  }
  // Prevent direct cross-site browser form submissions.
  const origin = req.headers.get('origin');
  const expected = process.env.SITE_URL;
  if (origin && expected) {
    try {
      if (new URL(origin).origin !== new URL(expected).origin) {
        return NextResponse.json({ error: 'Недопустимый источник запроса.' }, { status: 403 });
      }
    } catch { return NextResponse.json({ error: 'Неверный источник запроса.' }, { status: 403 }); }
  }
  if (Number(req.headers.get('content-length') || 0) > 12000)
    return NextResponse.json({ error: 'Слишком большой запрос.' }, { status: 413 });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Неверный формат.' }, { status: 400 });
  }
  const productId = String(body.productId || '');
  const designTier = String(body.designTier || 'standard');
  if (!isDesignTier(designTier)) return NextResponse.json({ error: 'Проверь тип разработки.' }, { status: 400 });
  const quote = getDesignQuote(productId, designTier);
  const name = String(body.name || '').trim();
  const phone = String(body.phone || '').trim();
  const preferences = String(body.preferences || '').trim();
  const delivery = String(body.delivery || '');
  const address = String(body.address || '').trim();
  if (!quote) return NextResponse.json({ error: 'Эту комбинацию изделия и разработки пока нельзя оформить.' }, { status: 400 });
  if (name.length < 2 || name.length > 100 || phone.length < 7 || phone.length > 25 || !/^[+\d\s()\-]+$/.test(phone))
    return NextResponse.json({ error: 'Проверь имя и телефон.' }, { status: 400 });
  if (preferences.length > 1000 || !['courier', 'pickup'].includes(delivery) || address.length > 350 || (delivery === 'courier' && address.length < 8))
    return NextResponse.json({ error: 'Проверь параметры и адрес доставки.' }, { status: 400 });
  if (body.consent !== true) return NextResponse.json({ error: 'Требуется согласие на обработку данных.' }, { status: 400 });
  const id = randomUUID();
  try {
    await getPool().query(
      'INSERT INTO orders(id, product_id, product_name, estimated_price_rub, design_tier, design_fee_from_rub, printing_price_from_rub, preferences, customer_name, phone, delivery_method, delivery_address, privacy_accepted_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,now())',
      [id, productId, quote.productName, quote.totalFrom ?? quote.designFeeFrom, designTier, quote.designFeeFrom, quote.printingPriceFrom, preferences, name, phone, delivery, address]
    );
    return NextResponse.json({ id, status: 'new_request', designFeeFrom: quote.designFeeFrom, printingPriceFrom: quote.printingPriceFrom, estimatedTotalFrom: quote.totalFrom, paymentTaken: false }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Не удалось сохранить заявку. Попробуй позже.' }, { status: 503 });
  }
}