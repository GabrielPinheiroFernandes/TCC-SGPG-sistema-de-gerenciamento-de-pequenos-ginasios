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

// Corrigido nome do construtor: NweUserRepository -> NewUserRepository
func NewUserRepository(dbCli database.MysqlClient) *UserRepository {
	return &UserRepository{
		dbCli: dbCli,
	}
}

func (uRepo *UserRepository) AddUser(user entitie.User) (entitie.User, error) {
	modelUser := models.User{
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
		Pass:      user.Pass,
		IsAdmin:   "N",
		BirthDate: user.BirthDate,
		Height:    user.Height,
		Weight:    user.Weight,
		Sex:       user.Sex,
		CPF:       user.Cpf,
	}

	if user.IsAdmin {
		modelUser.IsAdmin = "S"
	}

	inserted, err := uRepo.dbCli.Insert(&modelUser)
	if err != nil {
		return entitie.User{}, err
	}

	if ins, ok := inserted.(*models.User); ok {
		return entitie.User{
			ID:        ins.ID,
			FirstName: ins.FirstName,
			LastName:  ins.LastName,
			Email:     ins.Email,
			Pass:      ins.Pass,
			IsAdmin:   ins.IsAdmin == "S",
			BirthDate: ins.BirthDate,
			Height:    ins.Height,
			Weight:    ins.Weight,
			Sex:       ins.Sex,
			Cpf:       ins.CPF,
		}, nil
	}

	return entitie.User{}, fmt.Errorf("erro ao converter entidade inserida")
}

func (uRepo *UserRepository) UpdateUser(user entitie.User) (entitie.User, error) {
	// Procura usuário existente
	var existing models.User
	_, err := uRepo.dbCli.FindByID(uint(user.ID), &existing)
	if err != nil {
		log.Error().Err(err).Msg("Usuário não encontrado para atualização")
		return entitie.User{}, err
	}

	// Atualiza campos obrigatórios
	existing.FirstName = user.FirstName
	existing.LastName = user.LastName
	existing.Email = user.Email
	existing.Pass = user.Pass

	// Salva "S" ou "N" no banco
	existing.IsAdmin = "N"
	if user.IsAdmin {
		existing.IsAdmin = "S"
	}

	// Campos opcionais (agora *string)
	existing.BirthDate = user.BirthDate
	existing.Height = user.Height
	existing.Weight = user.Weight
	existing.Sex = user.Sex
	existing.CPF = user.Cpf

	// Atualiza no banco
	err = uRepo.dbCli.Update(&existing)
	if err != nil {
		log.Error().Err(err).Msg("Erro ao atualizar usuário")
		return entitie.User{}, err
	}

	// Retorna struct convertido
	return entitie.User{
		ID:        existing.ID,
		FirstName: existing.FirstName,
		LastName:  existing.LastName,
		Email:     existing.Email,
		Pass:      existing.Pass,
		IsAdmin:   existing.IsAdmin == "S",
		BirthDate: existing.BirthDate,
		Height:    existing.Height,
		Weight:    existing.Weight,
		Sex:       existing.Sex,
		Cpf:       existing.CPF,
	}, nil
}

func (uRepo *UserRepository) DellUser(id int) error {
	return uRepo.dbCli.DeleteByID(uint(id), &models.User{})
}

func (uRepo *UserRepository) GetUser(id int) (entitie.User, error) {
	var users []models.User
	_, err := uRepo.dbCli.GetAll(&users)
	if err != nil {
		log.Error().Err(err).Msg("Erro ao buscar usuários")
		return entitie.User{}, err
	}
	for _, user := range users {
		admin := parseIsAdmin(user.IsAdmin)
		if user.ID == id {
			imageUser := uRepo.getUserImg(int(user.ID))
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
				UserImage:    string(imageUser),
			}, nil
		}
	}
	return entitie.User{}, fmt.Errorf("usuário não encontrado")
}

func (uRepo *UserRepository) GetAuthUser(userAuth entitie.Auth) (entitie.User, error) {
	var users []models.User
	_, err := uRepo.dbCli.GetAll(&users)
	if err != nil {
		log.Error().Err(err).Msg("Erro ao buscar usuários")
		return entitie.User{}, err
	}
	for _, user := range users {
		admin := parseIsAdmin(user.IsAdmin)
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
	return entitie.User{}, fmt.Errorf("credenciais inválidas")
}

func (uRepo *UserRepository) GetAllUser() ([]entitie.User, error) {
	var users []models.User

	_, err := uRepo.dbCli.GetAll(&users)
	if err != nil {
		log.Error().Err(err).Msg("Erro ao buscar usuários")
		return nil, err
	}

	var listUser []entitie.User
	for _, user := range users {
		admin := parseIsAdmin(user.IsAdmin)
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
	default:
		return false
	}
}

func (uRepo *UserRepository) getUserImg(userID int) []byte {
	var photo models.UserImage
	res, err := uRepo.dbCli.FindImageByID(uint(userID), &photo)
	if err != nil {
		log.Warn().Err(err).Msg("Erro ao buscar imagem do usuário")
		return nil
	}
	if foundPhoto, ok := res.(*models.UserImage); ok {
		return foundPhoto.Img
	}
	return nil
}
