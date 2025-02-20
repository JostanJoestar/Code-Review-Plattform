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

document.addEventListener("DOMContentLoaded", function () {
    const codeOutput = document.getElementById("code-output");
    const commentsContainer = document.getElementById("comments-container");

    // Objekt: { 1: ["Kommentar1"], 2: ["Kommentar2", "Weiterer Kommentar"], ... }
    let lineComments = JSON.parse(localStorage.getItem("lineComments")) || {};

    // Speichern & Laden
    function saveComments() {
        localStorage.setItem("lineComments", JSON.stringify(lineComments));
    }
    function renderComments() {
        commentsContainer.innerHTML = "";
        for (let lineNum in lineComments) {
            lineComments[lineNum].forEach((commentText, index) => {
                // Für jeden Kommentar in Zeile lineNum ein <div> erstellen
                const commentDiv = document.createElement("div");
                commentDiv.classList.add("comment");
                commentDiv.innerHTML = `
                    <strong>Zeile ${lineNum}:</strong> ${commentText}
                    <button class="edit-comment" data-line="${lineNum}" data-index="${index}">✏️</button>
                    <button class="delete-comment" data-line="${lineNum}" data-index="${index}">🗑</button>
                `;
                commentsContainer.appendChild(commentDiv);
            });
        }
    }

    // Kommentar hinzufügen
    function addComment(lineNumber, text) {
        if (!lineComments[lineNumber]) {
            lineComments[lineNumber] = [];
        }
        lineComments[lineNumber].push(text);
        saveComments();
        renderComments();
    }

    // Kommentar löschen
    function deleteComment(lineNumber, index) {
        lineComments[lineNumber].splice(index, 1);
        if (lineComments[lineNumber].length === 0) {
            delete lineComments[lineNumber];
        }
        saveComments();
        renderComments();
    }

    // Kommentar bearbeiten
    function editComment(lineNumber, index) {
        const currentText = lineComments[lineNumber][index];
        const newText = prompt("Kommentar bearbeiten:", currentText);
        if (newText !== null && newText.trim() !== "") {
            lineComments[lineNumber][index] = newText;
            saveComments();
            renderComments();
        }
    }

    // Klick-Handler auf die Zeilennummern
    // => Du klickst auf <span> in .line-numbers-rows
    codeOutput.parentElement.addEventListener("click", function (e) {
        // Wir suchen <span> in .line-numbers-rows
        if (e.target.parentElement && e.target.parentElement.classList.contains("line-numbers-rows")) {
            // Index der Zeile = Position in der <span>-Liste
            const spans = [...e.target.parentElement.children];
            const lineNumber = spans.indexOf(e.target) + 1;

            // Prompt
            const text = prompt(`Kommentar für Zeile ${lineNumber}:`);
            if (text) {
                addComment(lineNumber, text);
            }
        }
    });

    // Klick im Kommentarbereich (löschen/bearbeiten)
    commentsContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-comment")) {
            const ln = event.target.dataset.line;
            const idx = parseInt(event.target.dataset.index);
            deleteComment(ln, idx);
        }
        if (event.target.classList.contains("edit-comment")) {
            const ln = event.target.dataset.line;
            const idx = parseInt(event.target.dataset.index);
            editComment(ln, idx);
        }
    });

    // Beim Laden Kommentare anzeigen
    renderComments();
    
});
