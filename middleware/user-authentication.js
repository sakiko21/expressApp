import jwt from "jsonwebtoken";

export async function userAuthentication(req, res, next){
    const token = req.cookies.user_token;
    if (!token) {
        return res.status(401).send("トークンがありません");
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);//トークンの検証
        console.log({user});
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

