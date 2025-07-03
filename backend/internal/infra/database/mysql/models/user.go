package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        int            `gorm:"primaryKey;autoIncrement"`
	FirstName string         `gorm:"type:varchar(20);not null"`
	LastName  string         `gorm:"type:varchar(20);not null"`
	Email     string         `gorm:"type:varchar(500);unique;not null"`
	Pass      string         `gorm:"type:varchar(255);not null"`        // Aqui será o hash da senha
	IsAdmin   string         `gorm:"type:char(1);not null;default:'N'"` // 'S' ou 'N'

	// Os campos abaixo agora são opcionais (nullable)
	BirthDate *time.Time     `gorm:"type:date"`             // Nullable
	Height    *string       `gorm:"type:decimal(10,0)"`     // Nullable
	Weight    *string       `gorm:"type:decimal(10,0)"`    // Nullable
	Sex       *string        `gorm:"type:char(1)"`          // 'M' ou 'F', Nullable
	CPF       *string        `gorm:"type:varchar(14);unique"` // Nullable

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"` // Soft delete
}

func (u *User) GetID() int {
	return int(u.ID)
}
