import { sakikoDb } from "../../sakiko-db.js";
import path from "path";

export async function account(req, res) {
    console.log("アカウントページ表示");
    let userIdParam = req.params.id;
    let userId = userIdParam.endsWith(".html") ? userIdParam.slice(0, -5) : userIdParam;
    const user = await sakikoDb.getUserById(userId);
    console.log("userId:", userId);
    console.log("user:", user);
    if (user?.error) {
      console.log("エラー500");
      return res.status(500).send(user.error);
    }
    if (!user) {
      console.log("userId:", userId);
      console.log("user:", user);
      console.log("エラー401");
      return res.status(401).send("ユーザーが見つかりません");
    }
    console.log("エラーではない");
    res.sendFile('account.html', { root: './frontend/user' });
  




    // console.log("アカウントページ表示");
    // console.log("req.params.id", req.params.id)
    // let userId = req.params.id;

    // if (!userId.endsWith(".html")) {
    //     userId += ".html"; // .htmlが含まれていない場合に追加する
    // }
    // // const userId = userId.replace(".html", ""); // .htmlを削除する
    // const user = await sakikoDb.getUserById(userId);
    // console.log("userId:",userId);
    // console.log("user:",user);
    // console.log("req.params.id:",req.params.id);
    // if (user?.error) {
    //     console.log("エラー500");
    //     return res.status(500).send(user.error);
    // } 
    // if(!user){
    //     console.log("userId:",userId);
    //     console.log("user:",user);
    //     console.log("エラー401");
    //     return res.status(401).send("ユーザーが見つかりません");
    // }
    // console.log("エラーではない");
    // res.sendFile(path.join(__dirname, "../../frontend/user/account.html?id=" + userId));
}
