package entitie

import "time"

type Installment struct {
	ID             int       `json:"id"`
	UserID         int       `json:"user_id"`
	Payment        float64   `json:"payment"`
	PaymentDate    time.Time `json:"payment_date"`
	ExpirationDate time.Time `json:"expiration_date"`
	PaymentStatus  bool      `json:"payment_status"`
}

func (i *Installment) IsOverdue() bool {
	return !i.PaymentStatus && time.Now().After(i.ExpirationDate)
}
