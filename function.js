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

document.addEventListener("DOMContentLoaded", function () {
    const showInputButton = document.getElementById("show-input");
    const showOutputButton = document.getElementById("show-output");
    const inputSection = document.getElementById("code-input-section");
    const outputSection = document.getElementById("code-output-section");
    const codeEditor = document.getElementById("code-input");
    const codeOutput = document.getElementById("code-output");

    // Standardmäßig die Textarea-Ansicht anzeigen
    inputSection.classList.add("active");

    // Button: Textarea-Ansicht anzeigen
    showInputButton.addEventListener("click", function () {
        inputSection.classList.add("active");
        outputSection.classList.remove("active");
    });

    // Button: Prism.js-Ansicht anzeigen
    showOutputButton.addEventListener("click", function () {
        outputSection.classList.add("active");
        inputSection.classList.remove("active");

        // Aktualisiere die Prism.js-Ansicht mit dem aktuellen Code
        codeOutput.textContent = codeEditor.value;
        Prism.highlightElement(codeOutput);
    });

    // Live-Update der Prism.js-Ansicht bei Eingabe
    codeEditor.addEventListener("input", function () {
        codeOutput.textContent = codeEditor.value;
        Prism.highlightElement(codeOutput);
    });

    // Gespeicherten Code laden (falls vorhanden)
    if (localStorage.getItem("savedCode")) {
        codeEditor.value = localStorage.getItem("savedCode");
        codeOutput.textContent = codeEditor.value;
        Prism.highlightElement(codeOutput);
    }

    // Code in LocalStorage speichern
    codeEditor.addEventListener("input", function () {
        localStorage.setItem("savedCode", codeEditor.value);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const codeOutput = document.getElementById("code-output");
    const commentsContainer = document.getElementById("comments-container");

    // Funktion zum Hinzufügen von Zeilennummern
    function addLineNumbers() {
        const code = codeOutput.textContent;
        const lines = code.split("\n");

        // Leere das codeOutput-Element
        codeOutput.innerHTML = "";

        // Füge jede Zeile in ein <div> mit data-line-number ein
        lines.forEach((line, index) => {
            const lineDiv = document.createElement("div");
            lineDiv.setAttribute("data-line-number", index + 1);
            lineDiv.textContent = line;
            codeOutput.appendChild(lineDiv);
        });

        // Prism.js erneut anwenden, um das Highlighting zu aktualisieren
        Prism.highlightElement(codeOutput);
    }

    // Füge Zeilennummern hinzu, wenn die Seite geladen wird
    addLineNumbers();

    // Event-Listener für Klicks auf Code-Zeilen
    codeOutput.addEventListener("click", function (event) {
        const clickedElement = event.target;

        // Überprüfen, ob auf ein <div> mit data-line-number geklickt wurde
        if (clickedElement.tagName === "DIV" && clickedElement.dataset.lineNumber) {
            const lineNumber = clickedElement.dataset.lineNumber;

            console.log("Zeile geklickt:", lineNumber); // Debugging

            // Überprüfen, ob bereits ein Kommentar für diese Zeile existiert
            const existingComment = commentsContainer.querySelector(`[data-line="${lineNumber}"]`);
            if (existingComment) return; // Verhindere doppelte Kommentare

            // Eingabefeld für Kommentar erstellen
            const commentInput = document.createElement("textarea");
            commentInput.classList.add("comment-input");
            commentInput.setAttribute("placeholder", "Kommentar eingeben...");

            // Kommentar speichern, wenn der Benutzer die Eingabe beendet
            commentInput.addEventListener("blur", function () {
                if (commentInput.value.trim()) {
                    // Kommentar anzeigen
                    const commentDiv = document.createElement("div");
                    commentDiv.classList.add("comment");
                    commentDiv.textContent = commentInput.value;
                    commentDiv.dataset.line = lineNumber;

                    // Kommentar unter der Zeile einfügen
                    commentsContainer.appendChild(commentDiv);

                    // Kommentar im LocalStorage speichern (optional)
                    saveComment(lineNumber, commentInput.value);
                }

                // Eingabefeld entfernen
                commentInput.remove();
            });

            // Eingabefeld unter der ausgewählten Zeile einfügen
            commentsContainer.appendChild(commentInput);
            commentInput.focus();
        }
    });

    // Funktion zum Speichern von Kommentaren im LocalStorage
    function saveComment(lineNumber, comment) {
        const comments = JSON.parse(localStorage.getItem("codeComments")) || {};
        comments[lineNumber] = comment;
        localStorage.setItem("codeComments", JSON.stringify(comments));
    }

    // Funktion zum Laden von Kommentaren aus dem LocalStorage
    function loadComments() {
        const comments = JSON.parse(localStorage.getItem("codeComments")) || {};
        Object.keys(comments).forEach(lineNumber => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");
            commentDiv.textContent = comments[lineNumber];
            commentDiv.dataset.line = lineNumber;
            commentsContainer.appendChild(commentDiv);
        });
    }

    // Kommentare beim Laden der Seite anzeigen
    loadComments();
});

document.addEventListener("DOMContentLoaded", function () {
    const codeOutput = document.getElementById("code-output");

    // Füge data-line-number-Attribute hinzu
    const lines = codeOutput.querySelectorAll("div");
    lines.forEach((line, index) => {
        line.setAttribute("data-line-number", index + 1);
    });
});