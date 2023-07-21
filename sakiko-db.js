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
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
                    amount INTEGER NOT NULL,
                    product_ids INTEGER NOT NULL,
                    product_names TEXT NOT NULL,
                    product_prices INTEGER NOT NULL,
                    quantity INTEGER NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );`
            );
        };
        // //purchase_detailテーブルの作成　purchaseテーブルとの関連どのように作れば良いか分からなくなったので諦める
        // const hasPurchaseDetailTable = await client.query(
        //     `SELECT EXISTS (
        //         SELECT 1
        //         FROM information_schema.tables
        //         WHERE table_schema = 'public'
        //         AND table_name = 'purchase_detail'
        //     );`
        // );
        // if (!hasPurchaseDetailTable.rows[0].exists) {
        //     console.log("purchase_detailテーブルを作成");
        //     await client.query(`
        //         CREATE TABLE purchase_detail (
        //             id SERIAL PRIMARY KEY,
        //             purchase_id INTEGER NOT NULL,
        //             FOREIGN KEY (purchase_id) REFERENCES purchase(id) ON DELETE SET NULL,
        //             product_id INTEGER NOT NULL,
        //             FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
        //             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        //         );`
        //     );
        // };

        //cartテーブルの作成
        const hasCartTable = await client.query(
            `SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'cart'
            );`
        );
        if (!hasCartTable.rows[0].exists) {
            console.log("cartテーブルを作成");
            await client.query(`
                CREATE TABLE cart (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
                    amount INTEGER NOT NULL,
                    product_ids INTEGER NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );`
            );
        };
    },
//ユーザーの作成
createUser: async (name, email, password) => {
    try { //エラーハンドリング
        const client = await sakikoDb.connect();
        const user = await sakikoDb.getUser(email);
        if (user) {
            return {error: 'このメールアドレスは既に登録されています。'};
        } else {
            const result = await client.query(
                `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING *;`,
                [name, email, password]
            );
            return result.rows[0];
        }
    } catch (error) {
        console.log(error);
        return {error: '予期せぬエラーが発生しました。'};
    }        
},
//ユーザー情報の取得
getUser: async (email) => {
    try{
    const client = await sakikoDb.connect();
    //console.log(client);
    const result = await client.query(
        `SELECT * FROM users
        WHERE email = $1;`,
        [email]
    );
    return result.rows[0];
    } catch (error) {
        console.log(error);
        return {error: '予期せぬエラーが発生しました。'};
    }
},
//IDでもユーザー取得
getUserById: async (id) => {
    try{
    const client = await sakikoDb.connect();
    //console.log(client);
    const result = await client.query(
        `SELECT * FROM users
        WHERE id = $1;`,
        [id]
    );
    console.log("result.rows[0]:", result.rows[0]);
    return result.rows[0];
    } catch (error) {
        console.log(error);
        return {error: '予期せぬエラーが発生しました。'};
    }
},

//ユーザー情報の更新
updateUser: async (id, name, email, password) => {
    try{
    const client = await sakikoDb.connect();
    const result = await client.query(
        `UPDATE users
        SET name = $2, email = $3, password = $4
        WHERE id = $1
        RETURNING *;`,
        [id, name, email, password]
    );
    return result.rows[0]|| { message: "ユーザーが見つかりません"};
    } catch (error) {
        console.log(error);
        return {error: '予期せぬエラーが発生しました。'};
    }
},
//ユーザー情報の削除
deleteUser: async (id) => {
    try{
    const client = await sakikoDb.connect();
    const result = await client.query(
        `DELETE FROM users
        WHERE id = $1
        RETURNING *;`,
        [id]
    );
    return result.rows[0]|| { message: "ユーザーが見つかりません"};
    } catch (error) {
        console.log(error);
        return {error: '予期せぬエラーが発生しました。'};
    }
},

//商品の作成
createProduct: async (title, description, price, image_path) => {
    try { //エラーハンドリング
        const client = await sakikoDb.connect();
        const result = await client.query(
            `INSERT INTO products (title, description, price, image_path)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`,
            [title, description, price, image_path]
        );
        return result.rows[0];
    } catch (error) {
        console.log(error);
        return {error: '予期せぬエラーが発生しました。'};
    }
},

//商品情報の取得
getProducts: async () => {
    try{
    const client = await sakikoDb.connect();
    const result = await client.query(
        `SELECT * FROM products;`
    );
    return result.rows;
    } catch (error) {
        console.log(error);
        return {error: '予期せぬエラーが発生しました。'};
    }
},

getProduct: async (id) => {
    try{
    const client = await sakikoDb.connect();
    const result = await client.query(
        `SELECT * FROM products WHERE id = $1;`,
        [id]
    );
    return result.rows[0] || {message:'商品が見つかりません'};
    } catch (error) {
        console.log(error);
        return {error: '予期せぬエラーが発生しました。'};
    }
},
//商品情報の削除
deleteProduct: async (id) => {
    try{
    const client = await sakikoDb.connect();
    const result = await client.query(
        `DELETE FROM products
        WHERE id = $1
        RETURNING *;`,
        [id]
    );
    return result.rows[0] || {message:'商品が見つかりません'};
    } catch (error) {
        console.log(error);
        return {error: '予期せぬエラーが発生しました。'};
    }
},
//商品情報の更新

updateProduct: async (id, title, description, price, image_path) => {
    try{
    const client = await sakikoDb.connect();
    const result = await client.query(
        `UPDATE products
        SET title = $2, description = $3, price = $4, image_path = $5
        WHERE id = $1
        RETURNING *;`,
        [id, title, description, price, image_path]
    );
    return result.rows[0] || {message:'商品が見つかりません'};
    } catch (error) {
        console.log(error);
        return {error: '予期せぬエラーが発生しました。'};
    }
},
//購入情報の取得
getPurchase: async (userId) => {
    try{
    const client = await sakikoDb.connect();
    const result = await client.query(
        `SELECT * FROM purchase WHERE user_id = $1;`,
        [userId]
    );
    //return result.rows[0];
    return result.rows;
    } catch (error) {
        console.log(error);
        return {error: '予期せぬエラーが発生しました。'};
    }
},
//購入情報の作成
createPurchase: async (userId, productId, amount, product_names, product_prices, quantity) => {
    try { //エラーハンドリング
        const client = await sakikoDb.connect();
        const result = await client.query(
            `INSERT INTO purchase (user_id, product_ids, amount, product_names, product_prices, quantity)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;`,
            [userId, productId, amount, product_names, product_prices, quantity]
        );
        return result.rows[0];
    } catch (error) {
        console.log(error);
        return {error: '予期せぬエラーが発生しました。'};
        
    }
},
// //カートに追加用のデータベース
// createCart: async (userId, productId, amount) => {
//     try { //エラーハンドリング
//         const client = await sakikoDb.connect();
//         const result = await client.query(
//             `INSERT INTO cart (user_id, product_ids, amount)
//             VALUES ($1, $2, $3)
//             RETURNING *;`,
//             [userId, productId, amount]
//         );
//         return result.rows[0];
//     } catch (error) {
//         console.log(error);
//         return {error: '予期せぬエラーが発生しました。'};
//     }

// }
 }
