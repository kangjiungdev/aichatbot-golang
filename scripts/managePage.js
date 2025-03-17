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
        // 현재는 말만 사용, 나중에 행동(묘사)을 사용하게 되면 user-action-chat 클래스로 쓸것.
        chatBlock.classList.add("user-conversation-chat")
    } else {
        // 현재는 캐릭터 말만 사용, 나중에 행동(묘사)을 사용하게 되면 ai-action-chat 클래스로 쓸것.
        chatBlock.classList.add("ai-conversation-chat")
    }
    chatBlock.classList.add("chat-span")
    chatBox.appendChild(chatBlock)
    scrollToBottom()
}

// chatBox의 스크롤을 맨 아래로 이동시키는 함수
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

window.addEventListener('load', scrollToBottom);

chatEnterButton.addEventListener("mouseover", function() {
    if(chatInput.value.trim() === "" || roleInput.value.trim() === "" || infoInput.value.trim() === "") {
        this.style = "cursor: auto;"
    } else {
        this.style="background-color: #ADB5BD; cursor: pointer;"
    }
})

chatEnterButton.addEventListener("mouseout", function() {
    this.style = "background-color: #6C757D;"
})