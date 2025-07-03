package repository

import (
	"fmt"

	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/domain/entitie"
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/infra/database"
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/infra/database/mysql/models"
	"github.com/rs/zerolog/log"
)

type InstallmentRepository struct {
	dbCli database.MysqlClient
}

func NewInstallmentRepository(dbCli database.MysqlClient) *InstallmentRepository {
	return &InstallmentRepository{
		dbCli: dbCli,
	}
}

func (iRepo *InstallmentRepository) AddInstallment(inst entitie.Installment) (entitie.Installment, error) {
	model := models.Installment{
		UserID:         inst.UserID,
		Payment:        inst.Payment,
		PaymentDate:    inst.PaymentDate,
		ExpirationDate: inst.ExpirationDate,
		PaymentStatus:  inst.PaymentStatus,
	}

	inserted, err := iRepo.dbCli.Insert(&model)
	if err != nil {
		log.Error().Err(err).Msg("Erro ao adicionar parcela")
		return entitie.Installment{}, err
	}

	if saved, ok := inserted.(*models.Installment); ok {
		return entitie.Installment{
			ID:             saved.ID,
			UserID:         saved.UserID,
			Payment:        saved.Payment,
			PaymentDate:    saved.PaymentDate,
			ExpirationDate: saved.ExpirationDate,
			PaymentStatus:  saved.PaymentStatus,
		}, nil
	}

	return entitie.Installment{}, fmt.Errorf("erro ao salvar parcela")
}

func (iRepo *InstallmentRepository) UpdateInstallment(inst entitie.Installment) (entitie.Installment, error) {
	model := models.Installment{
		ID:             inst.ID,
		UserID:         inst.UserID,
		Payment:        inst.Payment,
		PaymentDate:    inst.PaymentDate,
		ExpirationDate: inst.ExpirationDate,
		PaymentStatus:  inst.PaymentStatus,
		CreatedAt:      inst.CreatedAt,
		UpdatedAt:      inst.UpdatedAt,
		DeletedAt:      inst.DeletedAt,
	}

	err := iRepo.dbCli.Update(&model)
	if err != nil {
		log.Error().Err(err).Interface("installment", inst).Msg("Erro ao atualizar parcela")
		return entitie.Installment{}, err
	}

	return inst, nil
}

func (iRepo *InstallmentRepository) DellInstallment(id int) error {
	return iRepo.dbCli.DeleteByID(uint(id), &models.Installment{})
}

func (iRepo *InstallmentRepository) GetAllInstallment(idUser int) ([]entitie.Installment, error) {
	var modelsList []models.Installment
	_, err := iRepo.dbCli.FindByField("user_id", idUser, &modelsList)
	if err != nil {
		log.Error().Err(err).Msg("Erro ao buscar parcelas")
		return nil, err
	}

	var result []entitie.Installment
	for _, item := range modelsList {
		result = append(result, entitie.Installment{
			ID:             item.ID,
			UserID:         item.UserID,
			Payment:        item.Payment,
			PaymentDate:    item.PaymentDate,
			ExpirationDate: item.ExpirationDate,
			PaymentStatus:  item.PaymentStatus,
			CreatedAt:      item.CreatedAt,
			UpdatedAt:      item.UpdatedAt,
			DeletedAt:      item.DeletedAt,
			
		})
	}

	return result, nil
}

func (iRepo *InstallmentRepository) GetInstallment(id int, idUser int) (entitie.Installment, error) {
	var inst models.Installment
	_, err := iRepo.dbCli.FindByTwoFields("id", id, "user_id", idUser, &inst)
	if err != nil {
		log.Error().Err(err).Msg("Erro ao buscar parcela específica")
		return entitie.Installment{}, err
	}

	return entitie.Installment{
		ID:             inst.ID,
		UserID:         inst.UserID,
		Payment:        inst.Payment,
		PaymentDate:    inst.PaymentDate,
		ExpirationDate: inst.ExpirationDate,
		PaymentStatus:  inst.PaymentStatus,
	}, nil
}
