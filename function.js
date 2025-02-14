document.addEventListener("DOMContentLoaded", function () {
    // Code-Editor
    const codeEditor = document.getElementById("code-input");
    
    // Speichert den Code in LocalStorage
    codeEditor.addEventListener("input", function () {
        localStorage.setItem("savedCode", codeEditor.value);
    });

    // Lädt gespeicherten Code
    if (localStorage.getItem("savedCode")) {
        codeEditor.value = localStorage.getItem("savedCode");
    }

    // Chat-Funktionalität
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");
    const usernameInput = document.getElementById("username-input");
    const confirmUsernameButton = document.getElementById("confirm-username");
    const clearChatButton = document.getElementById("clear-chat");

    let currentUsername = localStorage.getItem("username") || "Gast";

    // ✅ Benutzername bestätigen & speichern
    confirmUsernameButton.addEventListener("click", function () {
        const username = usernameInput.value.trim();
        if (username) {
            currentUsername = username;
            localStorage.setItem("username", username);
            alert("Benutzername gesetzt: " + username);
        }
    });

    // ✅ Vorhandene Nachrichten aus Local Storage laden
    function loadChat() {
        const savedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
        savedMessages.forEach(msg => appendMessage(msg.username, msg.text, msg.timestamp));
    }

    // ✅ Zeitstempel generieren
    function getTimeStamp() {
        const now = new Date();
        return `[${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}]`;
    }

    // ✅ Nachricht in Chat anzeigen
    function appendMessage(username, text, timestamp) {
        const messageDiv = document.createElement("div");
        messageDiv.innerHTML = `<strong>${timestamp} ${username}:</strong> ${text}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ✅ Nachricht senden
    sendButton.addEventListener("click", function () {
        const message = chatInput.value.trim();
        const timestamp = getTimeStamp();

        if (message) {
            appendMessage(currentUsername, message, timestamp);

            // 🔄 Nachricht in Local Storage speichern
            const savedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
            savedMessages.push({ username: currentUsername, text: message, timestamp });
            localStorage.setItem("chatHistory", JSON.stringify(savedMessages));

            chatInput.value = ""; // Eingabefeld leeren
        }
    });

    // ✅ Chat leeren
    clearChatButton.addEventListener("click", function () {
        localStorage.removeItem("chatHistory");
        chatMessages.innerHTML = "";
    });

    // ✅ Chat beim Laden wiederherstellen
    loadChat();
});
