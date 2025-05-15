package di

import (
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/infra/config"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
)

func GetEnveronment() config.Container {
	env, err := godotenv.Read()
	if err != nil {
		log.Fatal().Msg("❌ Erro ao carregar o arquivo .env")
	}

	return config.Container{
		MysqlConfig: newMysqlConfig(env),
	}
}

func newMysqlConfig(env map[string]string) config.MysqlConfig {
	return config.MysqlConfig{
		User:     env["DB_USER"],
		Password: env["DB_PASSWORD"],
		Host:     env["DB_HOST"],
		Port:     env["DB_PORT"],
		Database: env["DB_NAME"],
	}
}
