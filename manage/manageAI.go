package manage

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/anthropics/anthropic-sdk-go"
	"github.com/anthropics/anthropic-sdk-go/option"
	"github.com/joho/godotenv"
)

type MessageJson struct {
	PreviousConversation SaveChat `json:"previous_conversation"`
	MyName               string   `json:"my_name"`
	MyInfo               string   `json:"my_info"`
	CharacterName        string   `json:"character_name"`
	CharacterInfo        string   `json:"character_info"`
	Message              string   `json:"message"`
	WorldView            string   `json:"world_view"`
}

type SaveChat struct {
	ChatOfUser []string
	ChatOfAI   []string
}

var allChatWithAI = SaveChat{ChatOfUser: []string{}, ChatOfAI: []string{}}

func ManageAI(msgInfo contentForAI) string {
	err := godotenv.Load()
	checkErr(err, ".env 파일 로드 오류")
	apiKey := os.Getenv("ANTHROPIC_API_KEY")
	if apiKey == "" {
		log.Fatal("ANTHROPIC_API_KEY 환경 변수가 설정되지 않았습니다.")
	}
	client := anthropic.NewClient(
		option.WithAPIKey(apiKey),
	)
	msgJson := MessageJson{
		PreviousConversation: allChatWithAI,
		MyName:               msgInfo.MyName,
		MyInfo:               msgInfo.MyInfo,
		CharacterName:        msgInfo.CharacterName,
		CharacterInfo:        msgInfo.CharacterInfo,
		Message:              msgInfo.UserMsg,
		WorldView:            msgInfo.WorldView,
	}
	jsonValue, _ := json.Marshal(msgJson)
	message, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
		Model:     anthropic.F(anthropic.ModelClaude3_7SonnetLatest),
		MaxTokens: anthropic.F(int64(1024)),
		Messages: anthropic.F([]anthropic.MessageParam{
			anthropic.NewUserMessage(anthropic.NewTextBlock(string(jsonValue))),
		}),
	})
	allChatWithAI.ChatOfUser = append(allChatWithAI.ChatOfUser, msgInfo.UserMsg)
	allChatWithAI.ChatOfAI = append(allChatWithAI.ChatOfAI, message.Content[0].Text)
	checkErr(err, "")
	/*
		현재 ai api 전부 다 구려서 역할같은거 설정이나 전 대화 내용 기억을 못함.
		하나하나 json에 넣어서 같이 보내야됨. 대화 내용까지 전부 다 ㅋㅋㅋ
		ㅈㄴ 비효율적
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
