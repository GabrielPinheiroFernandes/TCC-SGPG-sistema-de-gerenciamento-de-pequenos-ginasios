package usecase

import (
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/domain/entitie"
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/domain/gateway"
)

type UserUsecase struct {
	userRepository gateway.UserClient
	authRepo       AuthUsecase
}

func NewUserUsecase(userRepo gateway.UserClient, authRepo AuthUsecase) *UserUsecase {
	return &UserUsecase{
		userRepository: userRepo,
		authRepo:       authRepo,
	}
}

func (repo *UserUsecase) Add(user entitie.User) (entitie.User, error) {
	insertedUser, err := repo.userRepository.AddUser(user)
	if err != nil {
		return entitie.User{}, err
	}

	token, err := repo.authRepo.Login(int(insertedUser.ID))
	if err != nil {
		return entitie.User{}, err

	}

	insertedUser.SetToken(token)

	return insertedUser, nil
}
func (repo *UserUsecase) Del() error {
	return nil
}

func (repo *UserUsecase) GetAll() ([]entitie.User, error) {
	users, err := repo.userRepository.GetAllUser()
	if err != nil {
		return nil, err
	}
	return users, nil
}
func (uRepo *UserUsecase) GetUser(id int) (entitie.User, error) {
	userRet,err:=uRepo.userRepository.GetUser(id)
	if err != nil {
		return entitie.User{}, err
	}

	return userRet,nil
}
func (repo *UserUsecase) GetAuthUser(u entitie.Auth) (entitie.User, error) {
	user,err:=repo.userRepository.GetAuthUser(u)
	if err != nil {
		return entitie.User{}, err
	}
	return user, nil
}
