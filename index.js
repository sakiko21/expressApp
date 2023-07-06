//expressをモジュールで読み込む
import express from 'express';
//expressを実行してappに代入
const app = express();
const PORT = 3000;


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
app.get('/login', (req, res) => {
    res.send('ログインだよ');
    });
//マイページ
app.get('/account', (req, res) => {
    res.send('マイページだよ');
    });