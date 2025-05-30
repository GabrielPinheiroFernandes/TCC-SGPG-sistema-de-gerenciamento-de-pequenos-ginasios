package gateway

import "github.com/GabrielPinheiroFernandes/Estudos-GO/internal/domain/entitie"


type UserClient interface{
	AddUser(user entitie.User) (entitie.User, error)
	DellUser(id int) error
	GetAllUser() ([]entitie.User,error)
	GetUser(id int) (entitie.User,error)
	GetAuthUser(entitie.Auth) (entitie.User, error)
}

