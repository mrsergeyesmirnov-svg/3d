-- Run once on your Russian-hosted PostgreSQL database, BEFORE enabling orders.
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'new_request',
  product_id text NOT NULL,
  product_name text NOT NULL,
  estimated_price_rub integer NOT NULL,
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