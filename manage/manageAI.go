package manage

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/anthropics/anthropic-sdk-go"
	"github.com/anthropics/anthropic-sdk-go/option"
	"github.com/joho/godotenv"
)

func ManageAI(msg string) string {
	err := godotenv.Load()
	checkErr(err, ".env 파일 로드 오류")
	apiKey := os.Getenv("ANTHROPIC_API_KEY")
	if apiKey == "" {
		log.Fatal("ANTHROPIC_API_KEY 환경 변수가 설정되지 않았습니다.")
	}
	client := anthropic.NewClient(
		option.WithAPIKey(apiKey), // defaults to os.LookupEnv("ANTHROPIC_API_KEY")
	)
	message, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
		Model:     anthropic.F(anthropic.ModelClaude3_7SonnetLatest),
		MaxTokens: anthropic.F(int64(1024)),
		Messages: anthropic.F([]anthropic.MessageParam{
			anthropic.NewUserMessage(anthropic.NewTextBlock(msg)),
		}),
	})
	checkErr(err, "")
	/*
		message.Content가 array고 그 안에 엄청 많은것들 있음.
		그 안에 있는것들 아직은 잘 모르겠는데 행동 같은것들도 있을듯.
		캐릭터가 무슨 행동 할지 이런거. 지금은 텍스트만 사용하는거임.
	*/

	return message.Content[0].Text
}

func checkErr(err error, msg string) {
	if err != nil {
		if msg != "" {
			fmt.Println(msg)
		}
		log.Fatal(err)
	}
}
