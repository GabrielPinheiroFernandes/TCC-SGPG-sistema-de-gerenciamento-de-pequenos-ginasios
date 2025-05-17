package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/domain/entitie"
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/usecase"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Controller struct {
	user usecase.UserUsecase
	auth usecase.AuthUsecase
}

func NewController(user usecase.UserUsecase, auth usecase.AuthUsecase) *Controller {
	return &Controller{
		user: user,
		auth: auth,
	}
}

func (cont *Controller) Process() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	authGroup := r.Group("/auth")
	{
		authGroup.POST("/login", func(c *gin.Context) {
			var user entitie.Auth
			if err := c.ShouldBindJSON(&user); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido"})
				return
			}

			userValid, err := cont.user.GetAuthUser(user)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao logar"})
				return
			}
			if userValid.ID == 0 {
				c.JSON(http.StatusUnauthorized, gin.H{"message": "Usuário ou senha inválidos"})
				return
			}

			token, err := cont.auth.Login(int(userValid.ID))
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao logar"})
				return
			}

			userValid.SetToken(token)

			c.JSON(http.StatusOK, gin.H{"message": "Usuário logado com sucesso!", "user": userValid})
		})
	}
	userGroup := r.Group("/user", cont.auth.AuthMiddleware())
	{
		userGroup.GET("/", func(c *gin.Context) {
			a, err := cont.user.GetAll()
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido"})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "Sucesso ao pegar todos os usuarios", "data": a})
		})
		userGroup.GET("/:id", func(c *gin.Context) {
			id, err := strconv.Atoi(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido"})
				return
			}
			a, err := cont.user.GetUser(id)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido"})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "Sucesso ao pegar todos os usuarios", "data": a})
		})
		userGroup.POST("/add", func(c *gin.Context) {
			var user entitie.User

			// Faz o binding do JSON pro struct
			if err := c.ShouldBindJSON(&user); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"message": "JSON inválido", "error": err.Error()})
				return
			}

			// Aqui chama o método do repositório
			userInserted, err := cont.user.Add(user)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao adicionar usuário"})
				return
			}

			fmt.Printf("%+v\n", userInserted)

			c.JSON(http.StatusCreated, gin.H{
				"message": "Usuário adicionado com sucesso!",
				"data":    userInserted,
			})
		})

		userGroup.POST("/del", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Usuário deletado com sucesso"})
		})
	}

	r.Run(":8080")
}
