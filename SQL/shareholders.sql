CREATE TABLE shareholders (
    dp_id VARCHAR(6) NOT NULL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    share_amount DECIMAL(10, 2) NOT NULL
);