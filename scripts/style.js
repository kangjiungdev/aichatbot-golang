// chatBox의 스크롤을 맨 아래로 이동시키는 함수
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

function updateButtonState() {
    const isActive = chatInput.value.trim() !== "" &&
                     myNameInput.value.trim() !== "" &&
                     characterNameInput.value.trim() !== "" &&
                     infoOfCharacterInput.value.trim() !== "";

    chatEnterButton.classList.toggle("active", isActive);
}

// 이벤트 리스너 등록
[chatInput, myNameInput, characterNameInput, infoOfCharacterInput].forEach(input => {
    input.addEventListener("input", updateButtonState);
});