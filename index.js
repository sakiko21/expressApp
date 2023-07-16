//expressをモジュールで読み込む
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import {sakikoDb} from './sakiko-db.js';
sakikoDb.init();//データベースの初期化
import bcrypt from 'bcryptjs';


import{
    userRouter,
    productRouter,
    purchaseRouter
} from './routes/routes-index.js';
import serveStatic from 'serve-static';
import {readFileSync} from 'fs';//ファイルの中身を読み取るモジュール
import { join } from 'path';//パスを結合するモジュール
import cookieParser from 'cookie-parser';

//expressを実行してappに代入
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
userRouter(app);
productRouter(app);
purchaseRouter(app);


//会員登録などはAPIのリクエストを受け取っているので、VIEWファイル出したくない。VIEWファイル出すためのルーティング

const STATIC_PATH = `${process.cwd()}/frontend`;//process.cwdでルートディレクトリへのパスを取得
app.use(serveStatic(STATIC_PATH, {index:["index.html"] }));

app.get("/*", (req, res) => {
    console.log(STATIC_PATH + req.originalUrl + ".html");
    const contentHtml = readFileSync(STATIC_PATH + req.originalUrl + ".html", "utf-8");//Syncがないと非同期処理になる
    res
        .status(200)
        .setHeader("Content-Type", "text/html")
        .send(contentHtml);
});
// //カートページ
// app.get('/cart', (req, res) => {
//     res.send('カートだよ');
//     });


// //マイページ
// app.get('/account', (req, res) => {
//     res.send('マイページだよ');
//     });


app.listen(PORT, () => {
    console.log(`${PORT}番でサーバー起動`);
    });