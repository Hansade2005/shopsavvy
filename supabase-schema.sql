-- ShopSavvy E-Commerce Platform Database Schema

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 email TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL,
 first_name TEXT,
 last_name TEXT,
 avatar_url TEXT,
 phone TEXT,
 address JSONB,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 last_login TIMESTAMP WITH TIME ZONE,
 is_active BOOLEAN DEFAULT TRUE,
 is_admin BOOLEAN DEFAULT FALSE,
 CONSTRAINT email_length CHECK (char_length(email) >=3 AND char_length(email) <=255)
);

-- Products table
CREATE TABLE products (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 name TEXT NOT NULL,
 description TEXT,
 price NUMERIC(10,2) NOT NULL,
 category_id UUID REFERENCES categories(id),
 stock_quantity INTEGER NOT NULL DEFAULT0,
 sku TEXT UNIQUE,
 weight NUMERIC(10,2),
 dimensions JSONB,
 images JSONB,
 is_featured BOOLEAN DEFAULT FALSE,
 is_active BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 CONSTRAINT price_positive CHECK (price >=0),
 CONSTRAINT stock_non_negative CHECK (stock_quantity >=0)
);

-- Categories table
CREATE TABLE categories (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 name TEXT NOT NULL UNIQUE,
 description TEXT,
 parent_id UUID REFERENCES categories(id),
 image_url TEXT,
 is_active BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 user_id UUID REFERENCES users(id),
 order_number TEXT UNIQUE,
 status TEXT NOT NULL DEFAULT 'pending',
 total_amount NUMERIC(10,2) NOT NULL,
 shipping_address JSONB NOT NULL,
 billing_address JSONB,
 payment_method TEXT,
 payment_status TEXT DEFAULT 'pending',
 shipping_method TEXT,
 tracking_number TEXT,
 notes TEXT,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 completed_at TIMESTAMP WITH TIME ZONE,
 CONSTRAINT total_positive CHECK (total_amount >=0)
);

-- Order items table
CREATE TABLE order_items (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
 product_id UUID REFERENCES products(id),
 quantity INTEGER NOT NULL,
 unit_price NUMERIC(10,2) NOT NULL,
 discount NUMERIC(10,2) DEFAULT0,
 total_price NUMERIC(10,2) GENERATED ALWAYS AS (quantity * (unit_price - discount)) STORED,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 CONSTRAINT quantity_positive CHECK (quantity >0),
 CONSTRAINT price_positive CHECK (unit_price >=0),
 CONSTRAINT discount_non_negative CHECK (discount >=0)
);

-- Reviews table
CREATE TABLE reviews (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 user_id UUID REFERENCES users(id),
 product_id UUID REFERENCES products(id),
 rating INTEGER NOT NULL,
 title TEXT,
 comment TEXT,
 is_verified_purchase BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 CONSTRAINT rating_valid CHECK (rating >=1 AND rating <=5)
);

-- Wishlists table
CREATE TABLE wishlists (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 description TEXT,
 is_private BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist items table
CREATE TABLE wishlist_items (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
 product_id UUID REFERENCES products(id),
 added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 notes TEXT
);

-- Carts table
CREATE TABLE carts (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 session_id TEXT,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 CONSTRAINT user_or_session_required CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Cart items table
CREATE TABLE cart_items (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
 product_id UUID REFERENCES products(id),
 quantity INTEGER NOT NULL DEFAULT1,
 added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 CONSTRAINT quantity_positive CHECK (quantity >0)
);

-- Promotions table
CREATE TABLE promotions (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 code TEXT UNIQUE NOT NULL,
 description TEXT,
 discount_type TEXT NOT NULL,
 discount_value NUMERIC(10,2) NOT NULL,
 start_date TIMESTAMP WITH TIME ZONE NOT NULL,
 end_date TIMESTAMP WITH TIME ZONE NOT NULL,
 min_order_amount NUMERIC(10,2),
 max_uses INTEGER,
 current_uses INTEGER DEFAULT0,
 is_active BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 CONSTRAINT discount_positive CHECK (discount_value >=0),
 CONSTRAINT dates_valid CHECK (end_date > start_date)
);

-- Coupon redemptions table
CREATE TABLE coupon_redemptions (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 promotion_id UUID REFERENCES promotions(id),
 user_id UUID REFERENCES users(id),
 order_id UUID REFERENCES orders(id),
 redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variants table
CREATE TABLE product_variants (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 product_id UUID REFERENCES products(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 description TEXT,
 price_adjustment NUMERIC(10,2) NOT NULL DEFAULT0,
 sku TEXT UNIQUE,
 stock_quantity INTEGER NOT NULL DEFAULT0,
 images JSONB,
 is_active BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 CONSTRAINT stock_non_negative CHECK (stock_quantity >=0)
);

-- Product attributes table
CREATE TABLE product_attributes (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 product_id UUID REFERENCES products(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 value TEXT NOT NULL,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variant attributes table
CREATE TABLE product_variant_attributes (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
 attribute_id UUID REFERENCES product_attributes(id),
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory transactions table
CREATE TABLE inventory_transactions (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 product_id UUID REFERENCES products(id),
 variant_id UUID REFERENCES product_variants(id),
 quantity_change INTEGER NOT NULL,
 transaction_type TEXT NOT NULL,
 reference_id UUID,
 reference_type TEXT,
 notes TEXT,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 CONSTRAINT quantity_change_non_zero CHECK (quantity_change !=0)
);

-- Create indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_wishlist_items_wishlist ON wishlist_items(wishlist_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_promotions_active ON promotions(is_active, start_date, end_date);
CREATE INDEX idx_coupon_redemptions_user ON coupon_redemptions(user_id);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_attributes_product ON product_attributes(product_id);
CREATE INDEX idx_product_variant_attributes_variant ON product_variant_attributes(variant_id);
CREATE INDEX idx_inventory_transactions_product ON inventory_transactions(product_id);
CREATE INDEX idx_inventory_transactions_variant ON inventory_transactions(variant_id);

-- Create triggers for automatic updates
CREATE OR REPLACE FUNCTION update_product_timestamp()
RETURNS TRIGGER AS $$
BEGIN
 NEW.updated_at = NOW();
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_product_timestamp();

CREATE OR REPLACE FUNCTION update_order_timestamp()
RETURNS TRIGGER AS $$
BEGIN
 NEW.updated_at = NOW();
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_order_timestamp();

CREATE OR REPLACE FUNCTION update_user_timestamp()
RETURNS TRIGGER AS $$
BEGIN
 NEW.updated_at = NOW();
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_user_timestamp();

-- Create a function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
 order_number TEXT;
BEGIN
 LOOP
 order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() *1000000)::TEXT,6, '0');
 EXIT WHEN NOT EXISTS (SELECT1 FROM orders WHERE order_number = order_number);
 END LOOP;
 RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
 IF NEW.quantity_change IS NOT NULL THEN
 UPDATE products
 SET stock_quantity = stock_quantity + NEW.quantity_change
 WHERE id = NEW.product_id;

 IF NEW.variant_id IS NOT NULL THEN
 UPDATE product_variants
 SET stock_quantity = stock_quantity + NEW.quantity_change
 WHERE id = NEW.variant_id;
 END IF;
 END IF;
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inventory transactions
CREATE TRIGGER update_stock_on_inventory_transaction
AFTER INSERT ON inventory_transactions
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();

-- Create a function to calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
DECLARE
 order_total NUMERIC(10,2);
BEGIN
 SELECT COALESCE(SUM(total_price),0) INTO order_total
 FROM order_items
 WHERE order_id = NEW.id;

 NEW.total_amount = order_total;
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order items
CREATE TRIGGER update_order_total
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH STATEMENT
EXECUTE FUNCTION calculate_order_total();

-- Create a function to update promotion usage
CREATE OR REPLACE FUNCTION update_promotion_usage()
RETURNS TRIGGER AS $$
BEGIN
 UPDATE promotions
 SET current_uses = current_uses +1
 WHERE id = NEW.promotion_id;
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for coupon redemptions
CREATE TRIGGER update_promotion_usage_count
AFTER INSERT ON coupon_redemptions
FOR EACH ROW
EXECUTE FUNCTION update_promotion_usage();

-- Create a function to generate product SKUs
CREATE OR REPLACE FUNCTION generate_product_sku()
RETURNS TRIGGER AS $$
DECLARE
 sku TEXT;
BEGIN
 IF NEW.sku IS NULL THEN
 LOOP
 sku := 'SKU-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() *1000000)::TEXT,6, '0');
 EXIT WHEN NOT EXISTS (SELECT1 FROM products WHERE sku = sku);
 END LOOP;
 NEW.sku = sku;
 END IF;
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for products
CREATE TRIGGER generate_product_sku_trigger
BEFORE INSERT ON products
FOR EACH ROW
EXECUTE FUNCTION generate_product_sku();

-- Create a function to generate variant SKUs
CREATE OR REPLACE FUNCTION generate_variant_sku()
RETURNS TRIGGER AS $$
DECLARE
 sku TEXT;
 product_sku TEXT;
BEGIN
 SELECT sku INTO product_sku FROM products WHERE id = NEW.product_id;

 IF NEW.sku IS NULL THEN
 LOOP
 sku := product_sku || '-' || LPAD(FLOOR(RANDOM() *100)::TEXT,3, '0');
 EXIT WHEN NOT EXISTS (SELECT1 FROM product_variants WHERE sku = sku);
 END LOOP;
 NEW.sku = sku;
 END IF;
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for product variants
CREATE TRIGGER generate_variant_sku_trigger
BEFORE INSERT ON product_variants
FOR EACH ROW
EXECUTE FUNCTION generate_variant_sku();

-- Create a function to set order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
 IF NEW.order_number IS NULL THEN
 NEW.order_number = generate_order_number();
 END IF;
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for orders
CREATE TRIGGER set_order_number_trigger
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number();

-- Create a function to update product variant stock
CREATE OR REPLACE FUNCTION update_variant_stock()
RETURNS TRIGGER AS $$
BEGIN
 IF NEW.quantity_change IS NOT NULL AND NEW.variant_id IS NOT NULL THEN
 UPDATE product_variants
 SET stock_quantity = stock_quantity + NEW.quantity_change
 WHERE id = NEW.variant_id;
 END IF;
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inventory transactions on variants
CREATE TRIGGER update_variant_stock_on_inventory_transaction
AFTER INSERT ON inventory_transactions
FOR EACH ROW
EXECUTE FUNCTION update_variant_stock();
