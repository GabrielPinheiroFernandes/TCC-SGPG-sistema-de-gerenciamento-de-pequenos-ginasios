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
	user         usecase.UserUsecase
	auth         usecase.AuthUsecase
	installments usecase.InstallmentUsecase
}

func NewController(user usecase.UserUsecase, auth usecase.AuthUsecase, installments usecase.InstallmentUsecase) *Controller {
	return &Controller{
		user:         user,
		auth:         auth,
		installments: installments,
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

		userGroup.DELETE("/del/:id", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Usuário deletado com sucesso"})
		})
	}
	installmentsGroup := r.Group("/installments", cont.auth.AuthMiddleware()) // proteger se desejar
	{
		// Adiciona uma nova parcela
		installmentsGroup.POST("/add", func(c *gin.Context) {
			var inst entitie.Installment
			if err := c.ShouldBindJSON(&inst); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido", "detalhe": err.Error()})
				return
			}
			inserted, err := cont.installments.Add(inst)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao adicionar parcela"})
				return
			}
			c.JSON(http.StatusCreated, gin.H{"message": "Parcela adicionada com sucesso", "data": inserted})
		})

		// Busca todas as parcelas de um usuário
		installmentsGroup.GET("/:id_user", func(c *gin.Context) {
			id, err := strconv.Atoi(c.Param("id_user"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
				return
			}
			all, err := cont.installments.GetAll(id)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar parcelas"})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "Parcelas recuperadas com sucesso", "data": all})
		})

		// Busca uma parcela específica por ID e ID do usuário
		installmentsGroup.GET("/:id_user/:id", func(c *gin.Context) {
			idUser, err1 := strconv.Atoi(c.Param("id_user"))
			id, err2 := strconv.Atoi(c.Param("id"))
			if err1 != nil || err2 != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Parâmetros inválidos"})
				return
			}
			inst, err := cont.installments.GetByID(id, idUser)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar parcela"})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "Parcela recuperada com sucesso", "data": inst})
		})

		// Deleta uma parcela por ID
		installmentsGroup.DELETE("/del/:id", func(c *gin.Context) {
			id, err := strconv.Atoi(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
				return
			}
			if err := cont.installments.Del(id); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar parcela"})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "Parcela deletada com sucesso"})
		})
	}

	r.Run(":8080")
}
