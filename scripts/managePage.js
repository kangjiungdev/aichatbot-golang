const chatForm = document.getElementById("chat-form")
const chatInput = document.getElementById("chat-input")
const chatBox = document.getElementById("chat-box")

chatForm.addEventListener("submit", async(event) => {
    event.preventDefault();

    const inputValue = chatInput.value

    if (inputValue.trim() === "") {
        return
    }

    createChatBlock(`User: ${inputValue}`, "User")

    
    const chatFormForAI = new FormData(chatForm);
    chatInput.value=""

    try {
        const ResponseOfAI = await fetch("/getResponseAI", {
                method: "POST",
                body: chatFormForAI
            })
        const JsonOfResponse =  await ResponseOfAI.json()
        createChatBlock(`AI: ${JsonOfResponse["conversation"]}`, "AI")
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