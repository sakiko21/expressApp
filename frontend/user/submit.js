function submit () {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            },
        body: JSON.stringify({name, email, password}),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error){
                alert(data.error);
            } else {
                alert("登録完了");
                location.href = `/user/account.html?id=${data.id}`;
            }
        })
        .catch((err) => {
            alert("エラーが発生しました");
        }
        );
}
