// chatBox의 스크롤을 맨 아래로 이동시키는 함수
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

window.addEventListener('load', scrollToBottom);

chatEnterButton.addEventListener("mouseover", function() {
    if(chatInput.value.trim() === "" || characterNameInput.value.trim() === "" || infoOfCharacterInput.value.trim() === "") {
        this.style = "cursor: auto;"
    } else {
        this.style="background-color: #ADB5BD; cursor: pointer;"
    }
})

chatEnterButton.addEventListener("mouseout", function() {
    this.style = "background-color: #6C757D;"
})