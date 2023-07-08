//expressをモジュールで読み込む
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import {sakikoDb} from './sakiko-db.js';
sakikoDb.init();//データベースの初期化

//expressを実行してappに代入
const app = express();
const PORT = 3000;

app.use(express.json());


//ルーティング。トップページ
app.get('/', (req, res) => {
    res.send('Hello World!');
    });

app.listen(PORT, () => {
    console.log(`${PORT}番でサーバー起動`);
    });

//商品一覧ページ
app.get('/products', (req, res) => {
    res.send('商品一覧だよ');
    });
    //商品詳細ページ
    app.get('/products/:id', (req, res) => {
        res.send('商品詳細だよ');
        });

//カートページ
app.get('/cart', (req, res) => {
    res.send('カートだよ');
    });

//ログインページ
app.post('/login', (req, res) => {
    const body = req.body;
    console.log(body);
    res.send(body);
    });
//マイページ
app.get('/account', (req, res) => {
    res.send('マイページだよ');
    });