import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({
    ai: Boolean(process.env.YANDEX_AI_API_KEY && process.env.YANDEX_FOLDER_ID),
    orders: Boolean(process.env.DATABASE_URL && process.env.COMPANY_NAME && process.env.PRIVACY_POLICY_URL && process.env.SITE_URL),
    policyUrl: process.env.PRIVACY_POLICY_URL || null
  }, { headers: { 'Cache-Control': 'no-store' } });
}