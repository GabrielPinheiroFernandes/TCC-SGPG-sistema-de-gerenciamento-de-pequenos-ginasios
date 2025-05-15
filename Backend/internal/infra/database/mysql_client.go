package database


type MysqlClient interface {
	Insert(entity interface{}) (interface{}, error)
	DeleteByID(id uint, model interface{}) error
	Update(entity interface{}) error
	FindByID(id uint, model interface{}) (interface{}, error)
	GetAll(model interface{}) (interface{},error)
}