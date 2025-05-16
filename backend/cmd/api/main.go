package main

import (
	"github.com/GabrielPinheiroFernandes/Estudos-GO/cmd/api/di"
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/infra/controller"
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/infra/database/mysql"
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/infra/repository"
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/usecase"
	"github.com/rs/zerolog/log"
)

func main() {
	config := di.GetEnveronment()

	conn, err := mysql.ConnectDB(config.MysqlConfig)
	if err != nil {
		log.Fatal().Msgf("erro ao conectar ao banco: %v", err)
	}
	db := mysql.NewMysqlClient(conn)

	db.Init()

	//usecase
	gatewayUser := repository.NweUserRepository(db)

	//Auth
	authRepo:=repository.NewJWTService()
	authGateway:=usecase.NewAuthUsecase(authRepo)
	
	usecase := usecase.NewUserUsecase(gatewayUser,*authGateway)

	controller := controller.NewController(*usecase, *authGateway)
	controller.Process()
}
