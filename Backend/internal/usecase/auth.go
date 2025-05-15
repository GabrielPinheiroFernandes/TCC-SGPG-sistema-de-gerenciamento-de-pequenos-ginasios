package usecase

import (
	"net/http"

	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/domain/gateway"
	"github.com/gin-gonic/gin"
)

type AuthUsecase struct {
	authRepo gateway.AuthRepository
}

func NewAuthUsecase(repo gateway.AuthRepository) *AuthUsecase {
	return &AuthUsecase{
		authRepo: repo,
	}
}
func (uc *AuthUsecase) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token de autenticação obrigatório"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func (uc *AuthUsecase) Login(userID int) (string, error) {
	accessToken, err := uc.authRepo.GenerateAccessToken(userID)
	if err != nil {
		return "", err
	}

	// refreshToken, err := uc.authRepo.GenerateRefreshToken(userID)
	// if err != nil {
	// 	return "", "", err
	// }

	return accessToken, nil
}

func (uc *AuthUsecase) Refresh(refreshToken string,userID int) (string, error) {

	newAccessToken, err := uc.authRepo.GenerateAccessToken(userID)
	if err != nil {
		return "", err
	}

	return newAccessToken, nil
}
