function login () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("リクエスト内容");
    console.log("email: " , email);
    console.log("パスワード: " , password);
    fetch("/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
            },
        body: JSON.stringify({email, password}),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("レスポンス内容", data);
            if (data.error){
                alert(data.error);
            } else {
                alert("ログイン完了");
                location.href = "/user/account.html";
            }
        })
        .catch((err) => {
            console.log(err);
        }
        );
}
