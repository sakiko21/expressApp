import { register, login, account} from "../api/user/api-user-index.js";
import { userAuthentication } from "../middleware/middleware-index.js";
import path from "path";
import { sakikoDb } from "../sakiko-db.js";
export function userRouter(app) {

//ユーザー情報のAPI
app.post("/user/register", register);
//ログインのAPI
app.post("/user/login", login);
// //マイページのAPI
// app.get("/user/account/:id", userAuthentication, account);
// }
app.get("/user/account", userAuthentication, async (req, res) => {
    try {
        const userId = req.user.id;

        // ユーザーの購入履歴を取得する
        const purchaseHistory = await sakikoDb.getPurchase(userId);

        res.status(200).json({ purchaseHistory });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: '予期せぬエラーが発生しました。' });
    }
});
}
