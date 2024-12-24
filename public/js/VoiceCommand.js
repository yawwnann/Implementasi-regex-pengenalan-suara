let recognition;

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = function (event) {
        let transcript = event.results[event.resultIndex][0].transcript;
        document.getElementById("voiceInput").value = transcript;
    };

    recognition.onerror = function (event) {
        console.error("Terjadi kesalahan dalam perekaman suara: ", event.error);
    };
} else {
    alert("API Pengenalan Suara tidak didukung di browser ini.");
}

function startRecognition() {
    recognition.start();
}

function stopRecognition() {
    recognition.stop();
}

// Fungsi untuk mengaktifkan efek salju
function activateSnowfall() {
    if (!document.body.classList.contains("snow-active")) {
        document.body.classList.add("snow-active");
        document.body.classList.remove("normal");

        const snowEffect = document.createElement("div");
        snowEffect.classList.add("snowflakes");
        document.body.appendChild(snowEffect);

        for (let i = 0; i < 100; i++) {
            const snowflake = document.createElement("div");
            snowflake.classList.add("snowflake");
            const randomX = Math.random() * window.innerWidth;
            const randomDuration = 5 + Math.random() * 10;
            snowflake.style.left = `${randomX}px`;
            snowflake.style.animationDuration = `${randomDuration}s`;
            snowEffect.appendChild(snowflake);
        }
    }
}

// Fungsi untuk menghentikan efek salju
function deactivateSnowfall() {
    const snowEffect = document.querySelector(".snowflakes");
    if (snowEffect) {
        snowEffect.remove();
    }

    document.body.classList.remove("snow-active");
    document.body.classList.add("normal");
}

// Fungsi untuk membuka URL di tab baru
function openUrl(url) {
    window.open(url, "_blank");
}

// Menangani respons dari server dan mengaktifkan efek salju atau membuka URL
function handleCommandResponse(response) {
    alert(response.message);

    if (response.effect === "snowfall") {
        activateSnowfall();
    } else if (response.effect === "stop_snowfall") {
        deactivateSnowfall();
    }

    if (response.url) {
        openUrl(response.url);
    }
}

// Memproses perintah suara dan mengirim ke server
function submitCommand() {
    const command = document.getElementById("voiceInput").value;
    console.log("Command received: " + command);

    fetch("/process-command", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
                .content,
        },
        body: JSON.stringify({ command: command }),
    })
        .then((response) => response.json())
        .then((data) => {
            showMessage(data.message, "success");
            handleBackgroundChange(data.message);

            if (data.effect === "snowfall") {
                activateSnowfall();
            } else if (data.effect === "stop_snowfall") {
                deactivateSnowfall();
            }

            if (data.url) {
                window.open(data.url, "_blank");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            showMessage(
                "Terjadi kesalahan dalam pengolahan perintah!",
                "error"
            );
        });
}

// Menampilkan pesan di card
function showMessage(message, type) {
    const messageCard = document.getElementById("messageCard");
    const cardContent = document.getElementById("cardContent");

    // Mengubah kelas sesuai dengan tipe pesan (sukses atau error)
    if (type === "success") {
        messageCard.classList.remove("error");
        messageCard.classList.add("success");
    } else {
        messageCard.classList.remove("success");
        messageCard.classList.add("error");
    }

    cardContent.textContent = message;
    messageCard.style.display = "block";
}

// Mengubah warna latar belakang berdasarkan perintah yang diterima
function handleBackgroundChange(message) {
    const body = document.body;

    if (message.includes("dinyalakan")) {
        body.style.backgroundColor = "#6a11cb";
    } else if (message.includes("dimatikan")) {
        body.style.backgroundColor = "#2c3e50";
    }
}
