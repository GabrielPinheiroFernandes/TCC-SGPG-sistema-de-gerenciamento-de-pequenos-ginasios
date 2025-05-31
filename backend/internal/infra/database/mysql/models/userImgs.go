package models

type UserImage struct {
	ID      uint   `gorm:"primaryKeyakakkak"`
	Id_user uint   // FK para User.ID
	Img     []byte `gorm:"type:longblob"`
}