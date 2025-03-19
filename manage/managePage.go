package manage

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type contentForAI struct {
	MyName        string
	MyInfo        string
	CharacterName string
	CharacterInfo string
	WorldView     string
	UserMsg       string
}

func ManagePage() {

	r := gin.Default()
	r.LoadHTMLGlob("pages/*")
	r.Static("/styles", "./styles")
	r.Static("/scripts", "./scripts")
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{})
	})
	r.POST("/getResponseAI", func(c *gin.Context) {
		messageInformation := contentForAI{
			MyName:        fmt.Sprintf("나의 이름은 '%[1]s'(이)다.", c.DefaultPostForm("my-name", "")),
			MyInfo:        fmt.Sprintf("나의 객관적인 정보: %[1]s", c.DefaultPostForm("my-info", "")),
			CharacterName: fmt.Sprintf("너의 이름은 '%[1]s'(이)다.", c.DefaultPostForm("name-of-ai", "")),
			CharacterInfo: fmt.Sprintf("너의 객관적인 정보: %[1]s", c.DefaultPostForm("info-of-ai", "")),
			WorldView:     fmt.Sprintf("세계관: %[1]s", c.DefaultPostForm("world-view", "")),
			UserMsg:       c.DefaultPostForm("message", ""),
		}
		responseOfAI := ManageAI(messageInformation)
		c.JSON(http.StatusOK, gin.H{
			"conversation": responseOfAI, // action(캐릭터의 행동)도 따로 처리해야하는줄 알았는데 그냥 AI가 대화에서 **은 행동으로 처리해줌.
		})
	})
	r.POST("/loadConversation", func(c *gin.Context) {
		if len(allChatWithAI.ChatOfUser) != 0 { // allChatWithAI struct의 ChatOfUser Slice 길이가 0이 아니면
			c.JSON(http.StatusOK, gin.H{
				"all_chat_with_ai": allChatWithAI,
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"all_chat_with_ai": "None",
			})
		}
	})
	r.POST("/deleteChat", func(c *gin.Context) {
		allChatWithAI.ChatOfUser = allChatWithAI.ChatOfUser[:len(allChatWithAI.ChatOfUser)-1]
		allChatWithAI.ChatOfAI = allChatWithAI.ChatOfAI[:len(allChatWithAI.ChatOfAI)-1]
	})
	r.Run(":3000")
}
