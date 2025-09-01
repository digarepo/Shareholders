CREATE TABLE IF NOT EXISTS shareholders (
    fn_id VARCHAR(6) NOT NULL,
    name_amharic VARCHAR(100) NOT NULL,
    name_english VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    subcity VARCHAR(100) NOT NULL,
    PRIMARY KEY (fn_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;