package models

type UserImage struct {
	ID      uint   `gorm:"primaryKey"`
	Id_user uint
	Img     string `gorm:"type:LONGTEXT"` // ou TEXT, depende do tamanho
}