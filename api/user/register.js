import { sakikoDb } from "../../sakiko-db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register (req, res) { //データの登録は非同期通信。会員登録が終わってからレスポンスを返す。(無名関数をasyncで非同期関数にする)
    //const body = req.body;//受け取ったリクエストのbodyをbody変数に代入
    const {name, email, password} = req.body;//bodyの中身を分割代入
    console.log({name, email, password});
    const hashedPassword = await bcrypt.hash(password, 10);//パスワードをハッシュ化
    //const user = await sakikoDb.createUser(body.name,body.email,body.password);//awaitで非同期処理が終わるまで待つ
    const user = await sakikoDb.createUser(name, email, hashedPassword);
    console.log({user}); 
    if (user.error) {
        return res.status(500).send(user.error);
    } 
    delete user.password;
    const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: "1d"}); //トークンの有効期限1日
    
    res.cookie('user_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24,
    });
    //return res.status(200).send(user);
    return res.status(200).json(token);
    }