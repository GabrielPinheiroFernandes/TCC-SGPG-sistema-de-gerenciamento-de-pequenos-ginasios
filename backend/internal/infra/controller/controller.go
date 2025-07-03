package controller

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/domain/entitie"
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/usecase"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
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
		log.Trace().Msg("Ping recebido")
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	authGroup := r.Group("/auth")
	{
		authGroup.POST("/login", func(c *gin.Context) {
			log.Trace().Msg("Iniciando login")
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

		authGroup.POST("/register", func(c *gin.Context) {
			log.Trace().Msg("Iniciando registro de usuário")
			var user entitie.User
			if err := c.ShouldBindJSON(&user); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"message": "JSON inválido", "error": err.Error()})
				return
			}

			userInserted, err := cont.user.Add(user)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao adicionar usuário"})
				return
			}

			token, err := cont.auth.Login(userInserted.ID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao gerar token após registro"})
				return
			}

			userInserted.SetToken(token)

			c.JSON(http.StatusCreated, gin.H{
				"message": "Usuário registrado e logado com sucesso!",
				"user":    userInserted,
			})
		})
	}

	userGroup := r.Group("/user", cont.auth.AuthMiddleware())
	{
		userGroup.GET("/", func(c *gin.Context) {
			log.Trace().Msg("Buscando todos os usuários")
			users, err := cont.user.GetAll()
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao buscar usuários"})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "Sucesso ao pegar todos os usuarios", "data": users})
		})
		userGroup.POST("/upload-photo", func(c *gin.Context) {
			log.Trace().Msg("Inserindo foto do usuário")

			var payload struct {
				UserID      int    `json:"userId"`
				PhotoBase64 string `json:"photoBase64"`
			}

			if err := c.ShouldBindJSON(&payload); err != nil {
				log.Error().Err(err).Msg("JSON inválido no upload de foto")
				c.JSON(http.StatusBadRequest, gin.H{"message": "JSON inválido", "error": err.Error()})
				return
			}

			if payload.UserID == 0 || payload.PhotoBase64 == "" {
				c.JSON(http.StatusBadRequest, gin.H{"message": "Campos userId e photoBase64 são obrigatórios"})
				return
			}

			err := cont.user.InsertUserPhoto(payload.UserID, payload.PhotoBase64)
			if err != nil {
				log.Error().Err(err).Msg("Erro ao salvar foto do usuário")
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao salvar foto do usuário"})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Foto do usuário salva com sucesso"})
		})

		userGroup.GET(":id", func(c *gin.Context) {
			log.Trace().Msg("Buscando usuário por ID")
			id, err := strconv.Atoi(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
				return
			}
			user, err := cont.user.GetUser(id)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar usuário"})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "Sucesso ao pegar usuário", "data": user})
		})

		userGroup.POST("/add", func(c *gin.Context) {
			log.Trace().Msg("Adicionando novo usuário")

			// Lê o body em map para manipular os campos problemáticos
			var userMap map[string]interface{}
			bodyBytes, err := io.ReadAll(c.Request.Body)
			if err != nil {
				log.Error().Err(err).Msg("Erro ao ler body")
				c.AbortWithStatus(http.StatusBadRequest)
				return
			}

			// Log do body recebido
			log.Info().Str("user", string(bodyBytes)).Msg("Body da requisição")

			if err := json.Unmarshal(bodyBytes, &userMap); err != nil {
				log.Error().Err(err).Msg("Erro ao fazer unmarshal do JSON")
				c.JSON(http.StatusBadRequest, gin.H{"message": "JSON inválido", "error": err.Error()})
				return
			}

			// Tratar o campo height
			if val, ok := userMap["height"]; ok {
				switch v := val.(type) {
				case float64:
					str := fmt.Sprintf("%.2f", v)
					userMap["height"] = &str
				case string:
					userMap["height"] = &v
				default:
					userMap["height"] = nil
				}
			} else {
				userMap["height"] = nil
			}

			// Tratar o campo weight
			if val, ok := userMap["weight"]; ok {
				switch v := val.(type) {
				case float64:
					str := fmt.Sprintf("%.0f", v)
					userMap["weight"] = &str
				case string:
					userMap["weight"] = &v
				default:
					userMap["weight"] = nil
				}
			} else {
				userMap["weight"] = nil
			}

			// Converter o map para struct entitie.User
			b, err := json.Marshal(userMap)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao processar dados"})
				return
			}

			var user entitie.User
			if err := json.Unmarshal(b, &user); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"message": "Erro ao converter dados", "error": err.Error()})
				return
			}

			userInserted, err := cont.user.Add(user)
			if err != nil {
				log.Error().Err(err).Msg("Erro ao adicionar usuário")
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao adicionar usuário"})
				return
			}

			log.Info().Interface("user", userInserted).Msg("Usuário adicionado com sucesso")
			c.JSON(http.StatusCreated, gin.H{"message": "Usuário adicionado com sucesso!", "data": userInserted})
		})

		userGroup.PUT(":id", func(c *gin.Context) {
			log.Trace().Msg("Atualizando usuário")

			id, err := strconv.Atoi(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
				return
			}

			// Para evitar erros de unmarshalling em float64 vs string, vamos receber o JSON em map[string]interface{}
			var userMap map[string]interface{}
			if err := c.ShouldBindJSON(&userMap); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"message": "JSON inválido", "error": err.Error()})
				return
			}

			// Parse seguro para height *string
			if val, ok := userMap["height"]; ok {
				switch v := val.(type) {
				case float64:
					str := fmt.Sprintf("%.2f", v)
					userMap["height"] = &str
				case string:
					userMap["height"] = &v
				default:
					userMap["height"] = nil
				}
			} else {
				userMap["height"] = nil
			}

			// Parse seguro para weight *string
			if val, ok := userMap["weight"]; ok {
				switch v := val.(type) {
				case float64:
					str := fmt.Sprintf("%.0f", v)
					userMap["weight"] = &str
				case string:
					userMap["weight"] = &v
				default:
					userMap["weight"] = nil
				}
			} else {
				userMap["weight"] = nil
			}

			// Agora converte map para struct entitie.User
			b, err := json.Marshal(userMap)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao processar dados"})
				return
			}

			var user entitie.User
			if err := json.Unmarshal(b, &user); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"message": "Erro ao converter dados", "error": err.Error()})
				return
			}

			user.ID = id

			updated, err := cont.user.Update(user)
			if err != nil {
				log.Error().Err(err).Msg("Erro ao atualizar usuário")
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao atualizar usuário"})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Usuário atualizado com sucesso", "data": updated})
		})

		userGroup.DELETE("/del/:id", func(c *gin.Context) {
			log.Trace().Msg("Deletando usuário")
			id, err := strconv.Atoi(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
				return
			}
			if err := cont.user.Del(id); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar usuário"})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "Usuário deletado com sucesso"})
		})
	}

	installmentsGroup := r.Group("/installments", cont.auth.AuthMiddleware())
	{
		installmentsGroup.POST("/add", func(c *gin.Context) {
			log.Trace().Msg("Adicionando nova parcela")
			var inst entitie.Installment
			if err := c.ShouldBindJSON(&inst); err != nil {
				log.Warn().Err(err).Interface("payload", inst).Msg("Erro ao parsear JSON recebido")
				c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido", "detail": err.Error(), "payload": inst})
				return
			}

			inserted, err := cont.installments.Add(inst)
			if err != nil {
				log.Error().Err(err).Interface("installment", inst).Msg("Erro ao adicionar parcela")
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao adicionar parcela"})
				return
			}

			log.Info().Interface("inserted", inserted).Msg("Parcela adicionada com sucesso")
			c.JSON(http.StatusCreated, gin.H{"message": "Parcela adicionada com sucesso", "data": inserted})
		})

		installmentsGroup.PUT(":id", func(c *gin.Context) {
			log.Trace().Msg("Atualizando parcela")
			id, err := strconv.Atoi(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
				return
			}

			var inst entitie.Installment
			if err := c.ShouldBindJSON(&inst); err != nil {
				log.Error().Err(err).Msg("Erro ao fazer bind do JSON para atualização")
				c.JSON(http.StatusBadRequest, gin.H{"message": "JSON inválido", "detail": err.Error()})
				return
			}

			inst.ID = id
			updated, err := cont.installments.Update(inst)
			if err != nil {
				log.Error().Err(err).Msg("Erro ao atualizar parcela")
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar parcela"})
				return
			}

			log.Info().Interface("updated", updated).Msg("Parcela atualizada com sucesso")
			c.JSON(http.StatusOK, gin.H{"message": "Parcela atualizada com sucesso", "data": updated})
		})

		installmentsGroup.GET(":id_user", func(c *gin.Context) {
			log.Trace().Msg("Buscando parcelas de usuário")
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

		installmentsGroup.GET(":id_user/:id", func(c *gin.Context) {
			log.Trace().Msg("Buscando parcela específica")
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

		installmentsGroup.DELETE("/del/:id", func(c *gin.Context) {
			log.Trace().Msg("Deletando parcela")
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
