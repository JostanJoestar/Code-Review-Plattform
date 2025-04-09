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

    // Benutzername bestätigen & speichern
    confirmUsernameButton.addEventListener("click", function () {
        const username = usernameInput.value.trim();
        if (username) {
            currentUsername = username;
            localStorage.setItem("username", username);
            alert("Benutzername gesetzt: " + username);
        }
    });

    // Chat laden
    function loadChat() {
        const savedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
        savedMessages.forEach(msg => appendMessage(msg.username, msg.text, msg.timestamp));
    }

    // Zeitstempel
    function getTimeStamp() {
        const now = new Date();
        return `[${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}]`;
    }

    // Nachricht anzeigen
    function appendMessage(username, text, timestamp) {
        const messageDiv = document.createElement("div");
        messageDiv.innerHTML = `<strong>${timestamp} ${username}:</strong> ${text}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Nachricht senden
    sendButton.addEventListener("click", function () {
        const message = chatInput.value.trim();
        const timestamp = getTimeStamp();

        if (message) {
            appendMessage(currentUsername, message, timestamp);

            // In Local Storage speichern
            const savedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
            savedMessages.push({ username: currentUsername, text: message, timestamp });
            localStorage.setItem("chatHistory", JSON.stringify(savedMessages));

            chatInput.value = "";
        }
    });

    // Chat leeren
    clearChatButton.addEventListener("click", function () {
        localStorage.removeItem("chatHistory");
        chatMessages.innerHTML = "";
    });

    // Chat beim Laden
    loadChat();
});

document.addEventListener("DOMContentLoaded", function () {
    // ========== CODE EDITOR ==========
    const codeEditor = document.getElementById("code-input");
    const codeOutput = document.getElementById("code-output");
    
    // Wenn der Nutzer tippt, speichern wir es & zeigen es an
    codeEditor.addEventListener("input", function () {
        localStorage.setItem("savedCode", codeEditor.value);
        updateCodeOutput();
    });

    // Falls wir schon Code haben, laden wir ihn
    if (localStorage.getItem("savedCode")) {
        codeEditor.value = localStorage.getItem("savedCode");
        updateCodeOutput();
    }

    function updateCodeOutput() {
        codeOutput.textContent = codeEditor.value;
        Prism.highlightAll(); // Ruft auch das line-numbers-Plugin auf
    }

    // ========== TOGGLE ==========
    const showInputButton = document.getElementById("show-input");
    const showOutputButton = document.getElementById("show-output");
    const inputSection = document.getElementById("code-input-section");
    const outputSection = document.getElementById("code-output-section");

    // Standard: Input ist sichtbar
    inputSection.classList.add("active");

    // Button: Code eingeben
    showInputButton.addEventListener("click", function() {
        inputSection.classList.add("active");
        outputSection.classList.remove("active");
    });

    // Button: Code anzeigen
    showOutputButton.addEventListener("click", function() {
        // Erst Code updaten, dann zeigen
        updateCodeOutput();
        outputSection.classList.add("active");
        inputSection.classList.remove("active");
    });


    // ========== CHAT ==========
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");
    const usernameInput = document.getElementById("username-input");
    const confirmUsernameButton = document.getElementById("confirm-username");
    const clearChatButton = document.getElementById("clear-chat");

    let currentUsername = localStorage.getItem("username") || "Gast";

    confirmUsernameButton.addEventListener("click", function() {
        const username = usernameInput.value.trim();
        if (username) {
            currentUsername = username;
            localStorage.setItem("username", username);
            alert("Benutzername gesetzt: " + username);
        }
    });

    function loadChat() {
        const savedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
        savedMessages.forEach(msg => appendMessage(msg.username, msg.text, msg.timestamp));
    }

    function getTimeStamp() {
        const now = new Date();
        return `[${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}]`;
    }

    function appendMessage(username, text, timestamp) {
        const messageDiv = document.createElement("div");
        messageDiv.innerHTML = `<strong>${timestamp} ${username}:</strong> ${text}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendButton.addEventListener("click", function() {
        const message = chatInput.value.trim();
        const timestamp = getTimeStamp();

        if (message) {
            appendMessage(currentUsername, message, timestamp);

            // Chat speichern
            const savedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
            savedMessages.push({ username: currentUsername, text: message, timestamp });
            localStorage.setItem("chatHistory", JSON.stringify(savedMessages));

            chatInput.value = "";
        }
    });

    clearChatButton.addEventListener("click", function() {
        localStorage.removeItem("chatHistory");
        chatMessages.innerHTML = "";
    });

    loadChat();
});

