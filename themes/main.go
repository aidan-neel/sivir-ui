package main

import (
	"log"
	"themes/db"
	_ "themes/docs"
	"themes/routes"

	echoSwagger "github.com/swaggo/echo-swagger"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

// @title @aidan-neel/ui Themes API
// @version 1.0
// @description This is the API for publishing themes.
// @host localhost:8080
// @BasePath /
func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	e := echo.New()
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	conn := db.Connect()
	routes.RegisterThemeRoutes(e, conn)

	e.Logger.Fatal(e.Start(":8080"))
}
