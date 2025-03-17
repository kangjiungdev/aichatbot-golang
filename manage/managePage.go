package manage

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ManagePage() {

	r := gin.Default()
	r.LoadHTMLGlob("pages/*")
	r.Static("/styles", "./styles")
	r.Static("/scripts", "./scripts")
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{})
	})
	r.POST("/getResponseAI", func(c *gin.Context) {
		roleOfAI := c.DefaultPostForm("role-of-ai", "")
		infoOfAI := c.DefaultPostForm("info-of-ai", "")
		roleMessage := fmt.Sprintf("너는 %[1]s(이)다. %[1]s처럼 말해라. ", roleOfAI)
		characterInfo := fmt.Sprintf("너의 정보: %[1]s", infoOfAI)
		userMsg := c.DefaultPostForm("message", "")
		responseOfAI := ManageAI(roleMessage, characterInfo, userMsg)
		c.JSON(http.StatusOK, gin.H{
			"conversation": responseOfAI, // action(캐릭터의 행동)도 따로 처리해야하는줄 알았는데 그냥 AI가 대화에서 **은 행동으로 처리해줌.
		})
	})
	r.Run(":3000")
}
