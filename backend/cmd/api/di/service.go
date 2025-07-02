package di

import (
	"os"

	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/infra/config"
	_ "github.com/joho/godotenv/autoload"
)

func GetEnveronment() config.Container {

	return config.Container{
		MysqlConfig: newMysqlConfig(),
	}
}

func newMysqlConfig() config.MysqlConfig {
	return config.MysqlConfig{
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASSWORD"),
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		Database: os.Getenv("DB_NAME"),
	}
}
