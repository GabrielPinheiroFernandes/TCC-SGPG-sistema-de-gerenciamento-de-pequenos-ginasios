package gateway


type AuthRepository interface {
	GenerateAccessToken(userID int) (string, error)
	ValidateAccessToken(token string) (int, error) 
	// GenerateRefreshToken(userID int) (string, error)
	// ValidateRefreshToken(token string) (int, error)
}