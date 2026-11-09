-- Run once on your Russian-hosted PostgreSQL database, BEFORE enabling orders.
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'new_request',
  product_id text NOT NULL,
  product_name text NOT NULL,
  estimated_price_rub integer NOT NULL,
  design_tier text NOT NULL DEFAULT 'standard',
  design_fee_from_rub integer NOT NULL DEFAULT 0,
  printing_price_from_rub integer,
  preferences text NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  delivery_method text NOT NULL,
  delivery_address text NOT NULL DEFAULT '',
  privacy_accepted_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
-- Restrict access to this table to backend database role only.
-- Implement retention/deletion policy in your production ops.
-- Apply these idempotent additions before deploying the updated order API
-- against an existing database created with the earlier schema.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS design_tier text NOT NULL DEFAULT 'standard';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS design_fee_from_rub integer NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS printing_price_from_rub integer;
-- Prices above are indicative, not an accepted quote, receipt or payment.
