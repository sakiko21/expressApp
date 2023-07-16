import { sakikoDb } from "../../sakiko-db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function login (req,res) {
    const { email, password } = req.body;
    console.log({email, password});
    const user = await sakikoDb.getUser(email);
    if (user?.error) {
        return res.status(500).send(user.error);
    } 
    if(!user){
        return res.status(401).send("ユーザーが見つかりません");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send("パスワードが一致しません");
    }
//TODO:パスワードの検証や、JWTの発行を行う
    delete user.password;
    const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: "1d"}); //トークンの有効期限1日
    res.cookie("user_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24,
    });
    
    return res.status(200).json(user);
    }