const chatForm = document.getElementById("chat-form")
const chatInput = document.getElementById("chat-input")
const chatBox = document.getElementById("chat-box")
const chatEnterButton = document.getElementById("chat-enter-button")
const roleInput = document.getElementById("role-input")
const infoInput = document.getElementById("info-input")

chatForm.addEventListener("submit", async(event) => {
    event.preventDefault();

    const roleInputValue = roleInput.value.trim()
    const infoInputValue = infoInput.value.trim()
    const chatInputValue = chatInput.value.trim()

    if (chatInputValue === "" || roleInputValue === "" || infoInputValue === "") {
        return
    }

    roleInput.value = roleInputValue
    infoInput.value = infoInputValue
    chatInput.value = chatInputValue

    createChatBlock(`User: ${chatInputValue}`, "User")

    const chatFormForAI = new FormData(chatForm);
    chatInput.value=""

    try {
        const ResponseOfAI = await fetch("/getResponseAI", {
                method: "POST",
                body: chatFormForAI
            })
        const JsonOfResponse =  await ResponseOfAI.json()
        createChatBlock(`${roleInputValue}(AI): ${JsonOfResponse["conversation"]}`, "AI")
        } catch(e) {
            console.error(e)
        }
})

function createChatBlock(chatContents, who) {
    const chatBlock = document.createElement("span");
    chatBlock.innerText = chatContents
    if (who === "User") {
        chatBlock.classList.add("user-conversation-chat")
    } else {
        chatBlock.classList.add("ai-conversation-chat")
    }
    chatBlock.classList.add("chat-span")
    chatBox.appendChild(chatBlock)
    scrollToBottom()
}

