const chatForm = document.getElementById("chat-form")
const chatInput = document.getElementById("chat-input")
const chatBox = document.getElementById("chat-box")
const chatEnterButton = document.getElementById("chat-enter-button")
const characterNameInput = document.getElementById("character-name-input")
const infoOfCharacterInput = document.getElementById("character-info-input")
const worldViewInput = document.getElementById("world-view-input")
const myNameInput = document.getElementById("my-name-input")
const myInfoInput = document.getElementById("my-info-input")
const textarea = document.querySelectorAll(".chat-form-textarea")

window.addEventListener("load", async() => {
    storageGetItem(myNameInput, "username")
    storageGetItem(myInfoInput, "user_info")
    storageGetItem(characterNameInput, "character_name")
    storageGetItem(infoOfCharacterInput, "character_info")
    storageGetItem(worldViewInput, "world_view")
        const sendNoSpanReq = await fetch("/loadConversation", {method: "POST"})
        const allChatWithAI = await sendNoSpanReq.json()
        if (allChatWithAI.all_chat_with_ai !== "None") {
            let allChat = []
            for(let i = 0; i < allChatWithAI.all_chat_with_ai.ChatOfUser.length; i++) {
                allChat.push({user:allChatWithAI.all_chat_with_ai.ChatOfUser[i]})
                allChat.push({ai:allChatWithAI.all_chat_with_ai.ChatOfAI[i]})
            }
            allChat.forEach(chat => {
                if(chat.user) {
                    createChatBlock(`${myNameInput.value}(User): ${chat.user}`, "User")
                } else {
                    createChatBlock(`${characterNameInput.value}(AI): ${chat.ai}`, "AI")
                }
            });
        }
})

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

    createChatBlock(`${myNameInputValue}(User): ${chatInputValue}`, "User")

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


textarea.forEach(element => {
    element.addEventListener("keydown", (event) => {
        if(event.key === "Enter") {
            event.preventDefault()
            chatForm.requestSubmit()
        }
    })
})

function storageGetItem(element, key) {
    element.value = localStorage.getItem(key) || ""
}

function storageChangeEvent(element, keyname) {
    element.addEventListener("change", function() {
        localStorage.setItem(keyname, this.value.trim())
    })
}

storageChangeEvent(myNameInput, "username")
storageChangeEvent(myInfoInput, "user_info")
storageChangeEvent(characterNameInput, "character_name")
storageChangeEvent(infoOfCharacterInput, "character_info")
storageChangeEvent(worldViewInput, "world_view")