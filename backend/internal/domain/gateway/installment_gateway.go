package gateway

import "github.com/GabrielPinheiroFernandes/Estudos-GO/internal/domain/entitie"


type InstallmentClient interface{
	AddInstallment(Installment entitie.Installment) (entitie.Installment, error)
	DellInstallment(id int) error
	GetAllInstallment(id_user int) ([]entitie.Installment,error)
	GetInstallment(id int, id_user int) (entitie.Installment,error)
	UpdateInstallment(installment entitie.Installment) (entitie.Installment, error)
}

