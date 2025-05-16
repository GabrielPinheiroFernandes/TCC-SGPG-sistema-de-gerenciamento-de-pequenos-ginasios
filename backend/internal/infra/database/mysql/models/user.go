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
	BirthDate time.Time      `gorm:"type:date;not null"`
	Height    float64        `gorm:"type:decimal(4,2);not null"`
	Weight    float64        `gorm:"type:decimal(4,2);not null"`
	Sex       string         `gorm:"type:char(1);not null"`   // 'M' ou 'F'
	CPF       string        `gorm:"type:varchar(11);unique"` // Opcional (nullable)
	CreatedAt time.Time      // Timestamp de criação
	UpdatedAt time.Time      // Timestamp de atualização
	DeletedAt gorm.DeletedAt `gorm:"index"` // Soft delete (opcional)
}

func (u *User) GetID() int {
	return int(u.ID)
}
