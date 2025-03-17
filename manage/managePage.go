package manage

import (
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
		userMsg := c.DefaultPostForm("message", "")
		responseOfAI := ManageAI(userMsg)
		c.JSON(http.StatusOK, gin.H{
			"conversation": responseOfAI,
			"action":       "", // action(캐릭터의 행동)까지는 아직 사용 안함.
		})
	})
	r.Run(":3000")
}
