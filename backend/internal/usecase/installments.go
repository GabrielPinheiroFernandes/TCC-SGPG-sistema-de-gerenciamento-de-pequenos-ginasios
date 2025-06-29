package usecase

import (
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/domain/entitie"
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/domain/gateway"
)

type InstallmentUsecase struct {
	installmentRepo gateway.InstallmentClient
}

func NewInstallmentUsecase(installmentRepo gateway.InstallmentClient) *InstallmentUsecase {
	return &InstallmentUsecase{
		installmentRepo: installmentRepo,
	}
}

func (uc *InstallmentUsecase) Add(installment entitie.Installment) (entitie.Installment, error) {
	return uc.installmentRepo.AddInstallment(installment)
}

func (uc *InstallmentUsecase) Del(id int) error {
	return uc.installmentRepo.DellInstallment(id)
}

func (uc *InstallmentUsecase) GetAll(userID int) ([]entitie.Installment, error) {
	return uc.installmentRepo.GetAllInstallment(userID)
}

func (uc *InstallmentUsecase) GetByID(id int, userID int) (entitie.Installment, error) {
	return uc.installmentRepo.GetInstallment(id, userID)
}
