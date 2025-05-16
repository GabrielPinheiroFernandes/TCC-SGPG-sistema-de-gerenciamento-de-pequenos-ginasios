package entitie

import (
	"strings"
	"time"
)

type User struct {
	ID           int       `json:"id"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Email        string    `json:"email"`
	Pass         string    `json:"pass"`
	IsAdmin      bool      `json:"is_admin"`
	BirthDate    time.Time `json:"birth_date"`
	Height       float64   `json:"height"` // em metros, por exemplo
	Weight       float64   `json:"weight"` // em kg, por exemplo
	Sex          string    `json:"sex"`    // 'M', 'F' ou 'Outro'
	Cpf          string    `json:"cpf"`
	Token        string    `json:"token,omitempty" gorm:"-"`
	RefreshToken string    `json:"refresh_token,omitempty" gorm:"-"`
}

func (u *User) SetToken(token string) {
	u.Token = token
}

func (u *User) SetRefreshToken(refreshToken string) {
	u.RefreshToken = refreshToken
}

func (u *User) AdminFlag(input string) bool {
	switch strings.ToLower(strings.TrimSpace(input)) {
	case "s", "sim":
		return true
	case "n", "nao", "não":
		return false
	default:
		// Pode tratar valor desconhecido como false, ou lançar erro dependendo da regra
		return false
	}
}
