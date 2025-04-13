document.addEventListener("DOMContentLoaded", function () {
    const socket = io();

    const codeEditor = document.getElementById("code-input");
    const codeOutput = document.getElementById("code-output");

    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");
    const usernameInput = document.getElementById("username-input");
    const confirmUsernameButton = document.getElementById("confirm-username");
    const clearChatButton = document.getElementById("clear-chat");

    const showInputButton = document.getElementById("show-input");
    const showOutputButton = document.getElementById("show-output");
    const inputSection = document.getElementById("code-input-section");
    const outputSection = document.getElementById("code-output-section");

    let currentUsername = "Gast";

    // ========== Benutzername ==========
    confirmUsernameButton.addEventListener("click", function () {
        const username = usernameInput.value.trim();
        if (username) {
            currentUsername = username;
            alert("Benutzername gesetzt: " + username);
        }
    });

    // ========== Chat senden ==========
    sendButton.addEventListener("click", function () {
        const message = chatInput.value.trim();
        if (message) {
            const timestamp = getTimeStamp();
            socket.emit("chatMessage", {
                username: currentUsername,
                text: message,
                timestamp
            });
            chatInput.value = "";
        }
    });

    // ========== Chat empfangen ==========
    socket.on("chatMessage", function (data) {
        appendMessage(data.username, data.text, data.timestamp);
    });

    function appendMessage(username, text, timestamp) {
        const messageDiv = document.createElement("div");
        messageDiv.innerHTML = `<strong>${timestamp} ${username}:</strong> ${text}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getTimeStamp() {
        const now = new Date();
        return `[${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}]`;
    }

    // ========== Chat leeren ==========
    clearChatButton.addEventListener("click", function () {
        chatMessages.innerHTML = "";
        socket.emit("clearChat"); // Andere Clients benachrichtigen
    });

    socket.on("clearChat", function () {
        chatMessages.innerHTML = "";
    });

    // ========== Code Editor ==========
    codeEditor.addEventListener("input", function () {
        updateCodeOutput();
        socket.emit("codeUpdate", codeEditor.value);
    });

    socket.on("codeUpdate", function (code) {
        codeEditor.value = code;
        updateCodeOutput();
    });

    function updateCodeOutput() {
        codeOutput.textContent = codeEditor.value;
        Prism.highlightAll();
    }

    // ========== Ansichten umschalten ==========
    showInputButton.addEventListener("click", function () {
        inputSection.classList.add("active");
        outputSection.classList.remove("active");
    });

    showOutputButton.addEventListener("click", function () {
        updateCodeOutput();
        outputSection.classList.add("active");
        inputSection.classList.remove("active");
    });

    // Standard: Eingabe aktiv
    inputSection.classList.add("active");
});
