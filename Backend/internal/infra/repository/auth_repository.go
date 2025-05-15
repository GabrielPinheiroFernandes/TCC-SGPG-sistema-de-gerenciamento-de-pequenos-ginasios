package repository

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWTService struct {
	accessSecret  []byte
	// refreshSecret []byte
}

func NewJWTService() *JWTService {
	return &JWTService{
		accessSecret:  []byte("access_secret"),
		// refreshSecret: []byte("refresh_secret"),
	}
}

func (s *JWTService) GenerateAccessToken(userID int) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(15 * time.Minute).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.accessSecret)
}

// func (s *JWTService) GenerateRefreshToken(userID int) (string, error) {
// 	claims := jwt.MapClaims{
// 		"user_id": userID,
// 		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
// 	}
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	return token.SignedString(s.refreshSecret)
// }

func (s *JWTService) ValidateAccessToken(tokenStr string) (int, error) {
	return s.validateToken(tokenStr, s.accessSecret)
}

// func (s *JWTService) ValidateRefreshToken(tokenStr string) (int, error) {
// 	return s.validateToken(tokenStr, s.refreshSecret)
// }

func (s *JWTService) validateToken(tokenStr string, secret []byte) (int, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})
	if err != nil || !token.Valid {
		return 0, errors.New("token inválido ou expirado")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, errors.New("erro ao ler claims")
	}

	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		return 0, errors.New("user_id inválido")
	}

	return int(userIDFloat), nil
}
