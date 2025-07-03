package entitie

import (
	"strings"
	"time"
)

type User struct {
	ID           int        `json:"id"`
	FirstName    string     `json:"first_name"`
	LastName     string     `json:"last_name"`
	Email        string     `json:"email"`
	Pass         string     `json:"pass"`
	IsAdmin      bool       `json:"is_admin"`
	BirthDate    *time.Time `json:"birth_date"` // Agora é opcional
	Height       *string   `json:"height"`     // Opcional
	Weight       *string   `json:"weight"`     // Opcional
	Sex          *string    `json:"sex"`        // Opcional
	Cpf          *string    `json:"cpf"`        // Opcional
	Token        string     `json:"token,omitempty" gorm:"-"`
	RefreshToken string     `json:"refresh_token,omitempty" gorm:"-"`
	UserImage    string     `json:"user_image,omitempty" gorm:"-"`
	
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
		return false
	}
}
