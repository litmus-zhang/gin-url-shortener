package main

import (
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

type Url struct {
	Id       uint   `json:"id"`
	Url      string `json:"url"`
	ShortUrl string `json:"shortUrl"`
}

const (
	URL_PREFIX = "http://localhost:8080/"
	base       = 62
	charset    = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
)

func ConvertToBase62(number int) string {
	if number == 0 {
		return string(charset[0])
	}

	base62 := ""
	for number > 0 {
		base62 = string(charset[number%base]) + base62
		number /= base
	}

	return base62
}

func (url *Url) Shorten() {
	url.Id = uint(time.Now().UTC().UnixMilli())
	id := url.Id
	short := ConvertToBase62(int(id))
	url.ShortUrl = short
}

func init() {
	var err error
	dsn := "host=localhost  user=root password=root dbname=example port=1000 sslmode=disable TimeZone=Asia/Taipei"
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		println(err.Error())
	}

	db.AutoMigrate(&Url{})

}

func shortenHandler(c *gin.Context) {
	var data map[string]string
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Bad Request",
		})
		return
	}

	var dbURL Url
	db.Where("url = ?", data["url"]).First(&dbURL)
	if dbURL.Url != "" {
		c.JSON(http.StatusAccepted, gin.H{
			"message": "Url already exist",
			"data":    dbURL.ShortUrl,
		})
		return
	}
	url := Url{Url: data["url"]}
	url.Shorten()
	db.Create(&url)

	c.JSON(http.StatusAccepted, gin.H{
		"message": "Url shortenen successfully",
		"data":    url.ShortUrl,
	})
}

func findUrlHandler(c *gin.Context) {
	id := c.Query("shorturl")
	var url Url
	db.Raw("SELECT * FROM urls WHERE short_url = ?", id).Scan(&url)
	if url.Url == "" {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Long Url not found",
		})
		return
	}

	c.Redirect(http.StatusTemporaryRedirect, url.Url)
}
func StatsHandler(c *gin.Context) {
	var urls []Url
	db.Find(&urls)
	c.JSON(http.StatusOK, gin.H{
		"message": "Stats",
		"Total":   len(urls),
		"data":    urls,
	})
}

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
	}))
	router.POST("api/v1/shorten", shortenHandler)
	router.GET("api/v1/shorturl", findUrlHandler)
	router.GET("/api/v1/stats", StatsHandler)

	router.Run(":8080")
}
