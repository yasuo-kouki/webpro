"use strict";

let number = 0; // 投稿数を追跡する変数
let nameColorMap = {}; // 名前と色の対応を保持するオブジェクト

const bbs = document.querySelector("#bbs");

// 虹色を生成する関数
function getRainbowColor(index) {
    const colors = [
        "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", 
        "#0000FF", "#4B0082", "#8B00FF"
    ];
    return colors[index % colors.length];
}

// 名前が「すだ」「須田」「suda」の場合、虹色を設定
function getNameColor(name) {
    if (["すだ", "須田", "suda"].includes(name)) {
        return "rainbow"; // 特別なマークを返す
    }
    // ランダムな色
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// 特定の条件で自動投稿を実行
function autoPostYasuo() {
    const params = {
        method: "POST",
        body: "name=やすお&message=単位下さい！！",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
    const url = "/post";
    fetch(url, params)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error in auto-post");
            }
            return response.json();
        })
        .then(() => {
            console.log("自動投稿: やすお - 単位下さい！！");
        });
}

// 投稿ボタンを押した時の処理
document.querySelector("#post").addEventListener("click", () => {
    const name = document.querySelector("#name").value;
    const message = document.querySelector("#message").value;

    const params = {
        method: "POST",
        body: "name=" + name + "&message=" + message,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
    const url = "/post";
    fetch(url, params)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error");
            }
            return response.json();
        })
        .then(() => {
            document.querySelector("#message").value = "";

            // 特定の名前の場合に自動投稿を実行
            if (["すだ", "須田", "suda"].includes(name)) {
                autoPostYasuo();
            }
        });
});

// 投稿チェックボタンを押した時の処理
document.querySelector("#check").addEventListener("click", () => {
    const params = {
        method: "POST",
        body: "",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
    const url = "/check";
    fetch(url, params)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error");
            }
            return response.json();
        })
        .then((response) => {
            let value = response.number;

            if (number != value) {
                const params = {
                    method: "POST",
                    body: "start=" + number,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                };
                const url = "/read";
                fetch(url, params)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Error");
                        }
                        return response.json();
                    })
                    .then((response) => {
                        number += response.messages.length;
                        for (let mes of response.messages) {
                            let cover = document.createElement("div");
                            cover.className = "cover";

                            const now = new Date();
                            const hours = String(now.getHours()).padStart(2, "0");
                            const minutes = String(now.getMinutes()).padStart(
                                2,
                                "0"
                            );
                            const seconds = String(now.getSeconds()).padStart(
                                2,
                                "0"
                            );
                            const time = `${hours}:${minutes}:${seconds}`;

                            let time_area = document.createElement("span");
                            time_area.className = "time";
                            time_area.innerText = time;

                            let name_area = document.createElement("span");
                            name_area.className = "name";
                            name_area.innerText = " " + mes.name; // 半角スペースを追加

                            if (!nameColorMap[mes.name]) {
                                nameColorMap[mes.name] = getNameColor(mes.name);
                            }

                            // 虹色の場合
                            if (nameColorMap[mes.name] === "rainbow") {
                                const rainbowColors = [
                                    "#FF0000", "#FF7F00", "#FFFF00",
                                    "#00FF00", "#0000FF", "#4B0082", "#8B00FF"
                                ];
                                name_area.style.backgroundImage = `linear-gradient(90deg, ${rainbowColors.join(",")})`;
                                name_area.style.webkitBackgroundClip = "text";
                                name_area.style.color = "transparent";
                            } else {
                                name_area.style.color = nameColorMap[mes.name];
                            }

                            let mes_area = document.createElement("span");
                            mes_area.className = "mes";
                            mes_area.innerText = mes.message;

                            cover.appendChild(time_area);
                            cover.appendChild(name_area);
                            cover.appendChild(mes_area);

                            bbs.appendChild(cover);
                        }
                    });
            }
        });
});
