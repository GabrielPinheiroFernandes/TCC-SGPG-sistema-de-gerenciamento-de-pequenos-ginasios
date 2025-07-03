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

func (repo *UserUsecase) Update(user entitie.User) (entitie.User, error) {
	updatedUser, err := repo.userRepository.UpdateUser(user)
	if err != nil {
		return entitie.User{}, err
	}
	return updatedUser, nil
}

func (repo *UserUsecase) Del(id int) error {
	return repo.userRepository.DellUser(id)
}

func (repo *UserUsecase) GetAll() ([]entitie.User, error) {
	users, err := repo.userRepository.GetAllUser()
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (uRepo *UserUsecase) GetUser(id int) (entitie.User, error) {
	userRet, err := uRepo.userRepository.GetUser(id)
	if err != nil {
		return entitie.User{}, err
	}
	return userRet, nil
}

func (repo *UserUsecase) GetAuthUser(u entitie.Auth) (entitie.User, error) {
	user, err := repo.userRepository.GetAuthUser(u)
	if err != nil {
		return entitie.User{}, err
	}
	return user, nil
}

func (repo *UserUsecase) InsertUserPhoto(userID int, base64photo string) error {
	return repo.userRepository.InsertUserPhoto(userID, base64photo)
}
