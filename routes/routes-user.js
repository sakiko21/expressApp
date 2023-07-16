import { register, login, account} from "../api/user/api-user-index.js";
import { userAuthentication } from "../middleware/middleware-index.js";
import path from "path";

export function userRouter(app) {

//ユーザー情報のAPI
app.post("/user/register", register);
//ログインのAPI
app.post("/user/login", login);

app.get("/user/account", userAuthentication, account);

// //静的なHTMLファイルを返す。ログアウトしていても一瞬表示されてしまうため
// app.get("user/account.html", function(req, res) {
//     const token = req.cookies.user_token;
//     if(!token || token ==="" ){
//         res.redirect("/user/login.html");
//     } else {
//     res.sendFile(path.resolve("/user/account.html"));
//     }
// });
}
