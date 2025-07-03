package models

import (
	"time"

	"gorm.io/gorm"
)

type Installment struct {
	ID             int            `gorm:"primaryKey;autoIncrement"`
	UserID         int            `gorm:"not null"`
	Payment        float64        `gorm:"type:decimal(10,2);not null"`
	PaymentDate    *time.Time     `gorm:"type:datetime"` // ponteiro para aceitar null
	ExpirationDate *time.Time     `gorm:"type:datetime"`
	PaymentStatus  bool           `gorm:"not null"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
	DeletedAt      gorm.DeletedAt `gorm:"index"`
}
