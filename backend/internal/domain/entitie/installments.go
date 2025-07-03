package entitie

import (
	"time"

	"gorm.io/gorm"
)

type Installment struct {
	ID             int            `json:"id" gorm:"primaryKey;column:id"`
	UserID         int            `json:"user_id" gorm:"column:user_id"`
	Payment        float64        `json:"payment" gorm:"column:payment"`
	PaymentDate    *time.Time     `json:"payment_date" gorm:"column:payment_date"`
	ExpirationDate *time.Time     `json:"expiration_date" gorm:"column:expiration_date"`
	PaymentStatus  bool           `json:"payment_status" gorm:"column:payment_status"`

	CreatedAt      time.Time      `json:"created_at,omitempty" gorm:"column:created_at;<-:create"`
	UpdatedAt      time.Time      `json:"updated_at,omitempty" gorm:"column:updated_at"`
	DeletedAt      gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index;column:deleted_at"`
}

// IsOverdue retorna true se a parcela está vencida e não foi paga.
func (i *Installment) IsOverdue() bool {
	if i.PaymentStatus {
		return false
	}
	if i.ExpirationDate == nil {
		return false
	}
	return time.Now().After(*i.ExpirationDate)
}
