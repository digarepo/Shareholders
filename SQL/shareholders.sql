CREATE TABLE IF NOT EXISTS shareholders (
    fn_id VARCHAR(6) NOT NULL,
    name_amharic VARCHAR(100) NOT NULL,
    name_english VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    subcity VARCHAR(100) NOT NULL,
    wereda VARCHAR(100) NOT NULL,
    house_number VARCHAR(100) NOT NULL,
    phone_1 VARCHAR(15) NOT NULL,
    phone_2 VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    share_will DOUBLE NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    PRIMARY KEY (fn_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;