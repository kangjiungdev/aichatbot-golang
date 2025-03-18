const chatForm = document.getElementById("chat-form")
const chatInput = document.getElementById("chat-input")
const chatBox = document.getElementById("chat-box")
const chatEnterButton = document.getElementById("chat-enter-button")
const characterNameInput = document.getElementById("character-name-input")
const infoOfCharacterInput = document.getElementById("character-info-input")
const worldViewInput = document.getElementById("world-view-input")
const myNameInput = document.getElementById("my-name-input")
const myInfoInput = document.getElementById("my-info-input")

chatForm.addEventListener("submit", async(event) => {
    event.preventDefault();

    const characterNameInputValue = characterNameInput.value.trim()
    const infoOfCharacterInputValue = infoOfCharacterInput.value.trim()
    const chatInputValue = chatInput.value.trim()
    const worldViewValue = worldViewInput.value.trim()
    const myNameInputValue = myNameInput.value.trim()
    const myInfoInputValue = myInfoInput.value.trim()

    if (chatInputValue === "" || characterNameInputValue === "" || infoOfCharacterInputValue === "" || myNameInputValue === "") {
        return
    }

    characterNameInput.value = characterNameInputValue
    infoOfCharacterInput.value = infoOfCharacterInputValue
    chatInput.value = chatInputValue
    worldViewInput.value = worldViewValue
    myNameInput.value = myNameInputValue
    myInfoInput.value = myInfoInputValue

    createChatBlock(`User: ${chatInputValue}`, "User")

    const chatFormForAI = new FormData(chatForm);
    chatInput.value=""

    try {
        const ResponseOfAI = await fetch("/getResponseAI", {
                method: "POST",
                body: chatFormForAI
            })
        const JsonOfResponse =  await ResponseOfAI.json()
        createChatBlock(`${characterNameInputValue}(AI): ${JsonOfResponse["conversation"]}`, "AI")
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

