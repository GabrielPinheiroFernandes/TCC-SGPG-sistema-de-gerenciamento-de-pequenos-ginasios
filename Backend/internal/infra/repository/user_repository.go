package repository

import (
	"fmt"
	"strings"

	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/domain/entitie"
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/infra/database"
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/infra/database/mysql/models"
	"github.com/rs/zerolog/log"
)

type UserRepository struct {
	dbCli database.MysqlClient
}

func NweUserRepository(dbCli database.MysqlClient) *UserRepository {
	return &UserRepository{
		dbCli: dbCli,
	}
}

func (uRepo *UserRepository) AddUser(user entitie.User) (entitie.User, error) {
	inserted, err := uRepo.dbCli.Insert(&user)
	if err != nil {
		return entitie.User{}, err
	}

	// Pega o ID já preenchido no mesmo objeto que foi passado
	if insertedUser, ok := inserted.(*entitie.User); ok {
		return *insertedUser, nil
	}

	return entitie.User{}, fmt.Errorf("erro ao converter entidade inserida")
}

func (uRepo *UserRepository) DellUser(id int) error {
	return nil

}

func (uRepo *UserRepository) GetUser(id int) (entitie.User, error) {
	return entitie.User{},nil
}
func (uRepo *UserRepository) GetAuthUser(userAuth entitie.Auth) (entitie.User, error) {
	var users []models.User
	_, err := uRepo.dbCli.GetAll(&users)
	if err != nil {
		log.Error().Err(err).Msg("Erro ao buscar usuários")
		return entitie.User{}, err
	}
	for _, user := range users {
		admin:=parseIsAdmin(user.IsAdmin)
		if userAuth.Email == user.Email && userAuth.Password == user.Pass {
			return entitie.User{
				ID:           user.ID,
				FirstName:    user.FirstName,
				LastName:     user.LastName,
				Email:        user.Email,
				Pass:         user.Pass,
				IsAdmin:      admin,
				BirthDate:    user.BirthDate,
				Height:       user.Height,
				Weight:       user.Weight,
				Sex:          user.Sex,
				Cpf:          user.CPF,
				Token:        "",
				RefreshToken: "",
			}, nil
		}
	}
	return entitie.User{},nil
}
func (uRepo *UserRepository) GetAllUser() ([]entitie.User, error) {
	var users []models.User

	// Recupera os usuários do banco (já funciona certo com seu dbCli)
	_, err := uRepo.dbCli.GetAll(&users)
	if err != nil {
		log.Error().Err(err).Msg("Erro ao buscar usuários")
		return nil, err
	}

	// Converte de models.User para entitie.User
	var listUser []entitie.User
	for _, user := range users {
		admin:=parseIsAdmin(user.IsAdmin)
		listUser = append(listUser, entitie.User{
			ID:           user.ID,
			FirstName:    user.FirstName,
			LastName:     user.LastName,
			Email:        user.Email,
			Pass:         user.Pass,
			IsAdmin:      admin,
			BirthDate:    user.BirthDate,
			Height:       user.Height,
			Weight:       user.Weight,
			Sex:          user.Sex,
			Cpf:          user.CPF,
			Token:        "",
			RefreshToken: "",
		})
	}

	return listUser, nil
}

func parseIsAdmin(flag string) bool {
	switch strings.ToLower(strings.TrimSpace(flag)) {
	case "s", "sim":
		return true
	case "n", "nao", "não":
		return false
	default:
		// Se vier qualquer outra coisa, assume false por segurança
		return false
	}
}
