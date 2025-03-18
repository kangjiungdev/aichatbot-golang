const chatForm = document.getElementById("chat-form")
const chatInput = document.getElementById("chat-input")
const chatBox = document.getElementById("chat-box")
const chatEnterButton = document.getElementById("chat-enter-button")
const characterNameInput = document.getElementById("character-name-input")
const infoOfCharacterInput = document.getElementById("character-info-input")
const worldViewInput = document.getElementById("world-view-input")
const myNameInput = document.getElementById("my-name-input") // name input에 * 못넣게 설정해야함
const myInfoInput = document.getElementById("my-info-input")
const textarea = document.querySelectorAll(".chat-form-textarea")

window.addEventListener("load", async() => {
    storageGetItem(myNameInput, "username")
    storageGetItem(myInfoInput, "user_info")
    storageGetItem(characterNameInput, "character_name")
    storageGetItem(infoOfCharacterInput, "character_info")
    storageGetItem(worldViewInput, "world_view")
        const sendNoChatDivReq = await fetch("/loadConversation", {method: "POST"})
        const allChatWithAI = await sendNoChatDivReq.json()
        if (allChatWithAI.all_chat_with_ai !== "None") {
            let allChat = []
            for(let i = 0; i < allChatWithAI.all_chat_with_ai.ChatOfUser.length; i++) {
                allChat.push({user:allChatWithAI.all_chat_with_ai.ChatOfUser[i]})
                allChat.push({ai:allChatWithAI.all_chat_with_ai.ChatOfAI[i]})
            }
            allChat.forEach(chat => {
                if(chat.user) {
                    createChatBlock(chat.user, "User")
                } else {
                    createChatBlock(chat.ai, "AI")
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

    createChatBlock(chatInputValue, "User")

    const chatFormForAI = new FormData(chatForm);
    chatInput.value=""

    try {
        const ResponseOfAI = await fetch("/getResponseAI", {
                method: "POST",
                body: chatFormForAI
            })
        const JsonOfResponse =  await ResponseOfAI.json()
        createChatBlock(JsonOfResponse["conversation"], "AI")
        } catch(e) {
            console.error(e)
        }
})

function createChatBlock(chatContents, who) {
    const chatBlock = document.createElement("div");
    checkAction = actionChat(chatContents)
    checkAction.forEach((object) => {
        const chatSpan = document.createElement("span")
        if(object.word) {
            chatSpan.innerText = object.word
            if (who === "User") {
                chatSpan.classList.add("user-conversation-chat")
            } else {
                chatSpan.classList.add("ai-conversation-chat")
                chatBlock.classList.add("ai-chat-block-div")
            }
        } else {
            chatSpan.innerText = object.act
            if (who === "User") {
                chatSpan.classList.add("user-action-chat")
            } else {
                chatSpan.classList.add("ai-action-chat")
                chatBlock.classList.add("ai-chat-block-div")
            }
        }
        chatSpan.classList.add("chat-span")
        chatBlock.appendChild(chatSpan)
    })
    chatBlock.classList.add("chat-block-div")
    chatBox.appendChild(chatBlock)
    scrollToBottom()
}

function actionChat(chatContents) {
    const regex = /\*([^*]+)\*|([^*]+)/g;

    let txtArray = [];
    let match;
    
    while ((match = regex.exec(chatContents)) !== null) {
      if (match[1]) {
        // *로 감싸인 부분은 act로 저장
        txtArray.push({ act: match[1] });
      } else if (match[2]) {
        // *로 감싸지 않은 부분은 word로 저장
        txtArray.push({ word: match[2] });
      }
    }
    return txtArray
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