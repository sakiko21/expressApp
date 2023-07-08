import pg from 'pg';

export const sakikoDb = {
    connect: async () => {
        const client = new pg.Client({
            connectionString: process.env.DATABASE_URL,
            ssl: false
        });
        await client.connect();
        return client;
    },
    init:async() => {
        const client = await sakikoDb.connect();
        //usersテーブルの作成
        const hasUsersTable = await client.query(
            `SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'users'
            );`
        );
        
        if (!hasUsersTable.rows[0].exists) {
            console.log("usersテーブルを作成");
            await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255)NOT NULL,
                    email VARCHAR(255)NOT NULL,
                    password VARCHAR(255)NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );`
            );
        };
        //productsテーブルの作成
        const hasProductsTable = await client.query(
            `SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'products'
            );`
        );
        if (!hasProductsTable.rows[0].exists) {
            console.log("productsテーブルを作成");
            await client.query(`
                CREATE TABLE products (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description text,
                    price INTEGER NOT NULL,
                    image_path VARCHAR(255),
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );`
            );
        };
        //purchaseテーブルの作成
        const hasPurchaseTable = await client.query(
            `SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'purchase'
            );`
        );
        if (!hasPurchaseTable.rows[0].exists) {
            console.log("purchaseテーブルを作成");
            await client.query(`
                CREATE TABLE purchase (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    amount INTEGER NOT NULL,
                    product_ids INTEGER NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );`
            );
        };
    },
//ユーザーの作成
createUser: async (name, email, password) => {
    const client = await sakikoDb.connect();
    const result = await client.query(
        `INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING *;`,
        [name, email, password]
    );
    return result.rows[0];          
},
//ユーザー情報の取得
getUser: async (email) => {
    const client = await sakikoDb.connect();
    const result = await client.query(
        `SELECT * FROM users
        WHERE email = $1;`,
        [email]
    );
    return result.rows[0];
},
//商品情報の取得
getProductById: async (id) => {
    const client = await sakikoDb.connect();
    const result = await client.query(
        `SELECT * FROM products WHERE id = $1;`,
        [id]
    );
    return result.rows[0];
},
//購入情報の取得
getPurchase: async (userId) => {
    const client = await sakikoDb.connect();
    const result = await client.query(
        `SELECT * FROM purchase WHERE user_id = $1;`,
        [userId]
    );
    return result.rows[0];
},
//購入情報の更新
updateProduct: async (userId, productId, amount, productIds) => {
    const client = await sakikoDb.connect();
    const result = await client.query(
        `INSERT INTO purchase (user_id, product_id, amount, product_ids)
        VALUES ($1, $2, $3, $4)
        RETURNING *;`,
        [userId, productId, amount, productIds]
    );
    return result.rows[0];
}
}