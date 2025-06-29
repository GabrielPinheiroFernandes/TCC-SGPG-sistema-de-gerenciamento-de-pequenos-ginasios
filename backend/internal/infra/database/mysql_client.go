package database


type MysqlClient interface {
	Insert(entity interface{}) (interface{}, error)
	DeleteByID(id uint, model interface{}) error
	Update(entity interface{}) error
	FindByID(id uint, model interface{}) (interface{}, error)
	FindImageByID(id uint, model interface{}) (interface{}, error)
	GetAll(model interface{}) (interface{},error)
	FindByField(field string, value interface{}, out interface{}) (interface{}, error)
	FindByTwoFields(field1 string, value1 interface{}, field2 string, value2 interface{}, out interface{}) (interface{}, error)
}