-- Create a keyspace
CREATE KEYSPACE IF NOT EXISTS e_commerce WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' };

-- Create a category type
CREATE TYPE IF NOT EXISTS e_commerce.category (
    id bigint,
    name text,
    is_leaf boolean
);

-- Create a image type for product
CREATE TYPE IF NOT EXISTS e_commerce.image (
    base_url text,
    is_gallery boolean,
    label text,
    large_url text,
    medium_url text,
    position text,
    small_url text,
    thumbnail_url text
);

-- Create a product's metadata type
CREATE TYPE IF NOT EXISTS e_commerce.product (
    id bigint,
    sku bigint,
    short_description text,
    price bigint,
    list_price bigint,
    discount bigint,
    discount_rate tinyint,
    review_count bigint,
    inventory_status text,
    product_name text,
    brand_id bigint,
    brand_name text,
    categories frozen<category>,
    rating_average float,
    images list<frozen<image>>,
    thumbnail_url text,
    quantity_sold bigint
);

-- Create a table
CREATE TABLE IF NOT EXISTS e_commerce.recommendations (
    user_id text,
    recommend_products list<frozen<product>>,
    created_time timestamp,
    PRIMARY KEY (user_id, created_time)
);