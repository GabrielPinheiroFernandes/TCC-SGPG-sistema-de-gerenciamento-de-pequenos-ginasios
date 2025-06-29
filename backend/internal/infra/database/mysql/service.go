package mysql

import (
	"fmt"
	"time"

	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/infra/config"
	"github.com/GabrielPinheiroFernandes/Estudos-GO/internal/infra/database/mysql/models"
	"github.com/rs/zerolog/log"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// ConnectDB retorna a conexão com o banco usando GORM
func ConnectDB(config config.MysqlConfig) (*gorm.DB, error) {

	if config.Port == "" {
		config.Port = "3306" // fallback padrão
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.User, config.Password, config.Host, config.Port, config.Database)

	var db *gorm.DB
	var err error
	log.Debug().Msgf("🔌 DSN: %s", dsn)

	// Tentativas de conexão com retry
	for i := 0; i < 10; i++ {
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err == nil {
			log.Info().Msg("✅ Banco Mysql Iniciado com sucesso")
			return db, nil
		}

		log.Warn().Msgf("Tentativa %d: erro ao conectar ao banco: %v", i+1, err)
		time.Sleep(3 * time.Second)
	}

	return nil, fmt.Errorf("erro ao conectar ao banco após múltiplas tentativas: %v", err)
}

// Implementação concreta do DatabaseClient
type MysqlClient struct {
	db *gorm.DB
}

// NewMysqlClient retorna uma nova instância de MysqlClient
func NewMysqlClient(db *gorm.DB) *MysqlClient {
	return &MysqlClient{db: db}
}

// Init roda as migrações para criar as tabelas no banco
func (m *MysqlClient) Init() {
	err := m.db.AutoMigrate(
		&models.User{}, // Adicione mais models aqui conforme necessário
		&models.UserImage{},
		&models.Installment{}, // <-- aqui
	)
	if err != nil {
		log.Fatal().Msgf("❌ Erro ao rodar as migrações: %v", err)
	}

	log.Info().Msg("✅ Migrações executadas com sucesso!")

	// Verifica se o usuário admin já existe
	var existing models.User
	result := m.db.Where("email = ?", "admin@admin.com").First(&existing)
	if result.Error == nil {
		log.Info().Msg("👤 Usuário admin já existe. Pulando criação.")
		return
	}

	if result.Error != nil && result.Error != gorm.ErrRecordNotFound {
		log.Fatal().Err(result.Error).Msg("Erro ao verificar existência do admin")
	}

	// Cria o usuário admin com a senha hash
	admin := models.User{
		FirstName: "admin",
		LastName:  "admin",
		Email:     "admin@admin.com",
		Pass:      "admin",
		IsAdmin:   "S",
		Height:  1.70,
		Weight: 100,
		Sex: "M",
		CPF: "000.000.000-00",

		BirthDate: time.Date(2003, 4, 10, 0, 0, 0, 0, time.UTC), // Corrigindo a data

		
	}
	

	// Salva o usuário admin no banco de dados
	if err := m.db.Create(&admin).Error; err != nil {
		log.Fatal().Err(err).Msg("❌ Erro ao criar usuário admin")
	}
	log.Info().Msg("✅ Usuário admin criado com sucesso!")
	
	adminImage:= models.UserImage{
		Id_user: 1,
		Img: []byte(ImageAdmin),
	}
	if err := m.db.Create(&adminImage).Error; err != nil {
		log.Fatal().Err(err).Msg("❌ Erro ao criar imagem do admin")
	}
	log.Info().Msg("✅ Usuário admin criado com sucesso! e com foto")
}

// Métodos CRUD

func (m *MysqlClient) Insert(entity interface{}) (interface{}, error) {
	err := m.db.Create(entity).Error
	if err != nil {
		return nil, err
	}

	return entity, nil
}

func (m *MysqlClient) DeleteByID(id uint, model interface{}) error {
	return m.db.Delete(model, id).Error
}

func (m *MysqlClient) Update(entity interface{}) error {
	return m.db.Save(entity).Error
}

func (m *MysqlClient) FindByID(id uint, model interface{}) (interface{}, error) {
	err := m.db.First(model, id).Error
	if err != nil {
		return nil, err
	}
	return model, nil
}
func (m *MysqlClient) GetAll(model interface{}) (interface{}, error) {
	err := m.db.Find(model).Error
	if err != nil {
		return nil, err
	}
	return model, nil
}

func (m *MysqlClient) FindImageByID(id uint, model interface{}) (interface{}, error) {
	err := m.db.Where("id_user = ?", id).First(model).Error
	if err != nil {
		return nil, err
	}
	return model, nil
}

// Busca por um único campo
func (m *MysqlClient) FindByField(field string, value interface{}, out interface{}) (interface{}, error) {
	err := m.db.Where(fmt.Sprintf("%s = ?", field), value).Find(out).Error
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Busca por dois campos (ex: id e user_id)
func (m *MysqlClient) FindByTwoFields(field1 string, value1 interface{}, field2 string, value2 interface{}, out interface{}) (interface{}, error) {
	err := m.db.Where(fmt.Sprintf("%s = ? AND %s = ?", field1, field2), value1, value2).First(out).Error
	if err != nil {
		return nil, err
	}
	return out, nil
}