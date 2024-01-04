package main

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gocql/gocql"
	"github.com/spf13/viper"
)

const CONFIGPATH = "./config.env"

var session *gocql.Session

type Categories struct {
	ID     int    `cql:"id" json:"id"`
	Name   string `cql:"name" json:"name"`
	IsLeaf bool   `cql:"is_leaf" json:"is_leaf"`
}

type Image struct {
	BaseUrl      string `cql:"base_url" json:"base_url"`
	IsGallery    bool   `cql:"is_gallery" json:"is_gallery"`
	Label        string `cql:"label" json:"label"`
	LargeUrl     string `cql:"large_url" json:"large_url"`
	MediumUrl    string `cql:"medium_url" json:"medium_url"`
	Position     string `cql:"position" json:"position"`
	SmallURl     string `cql:"small_url" json:"small_url"`
	ThumbnailUrl string `cql:"thumbnail_url" json:"thumbnail_url"`
}

type RecommendProduct struct {
	ID               int     `cql:"id" json:"id"`
	SKU              int     `cql:"sku" json:"sku"`
	ShortDescription string  `cql:"short_description" json:"short_description"`
	Price            int     `cql:"price" json:"price"`
	ListPrice        int     `cql:"list_price" json:"list_price"`
	Discount         int     `cql:"discount" json:"discount"`
	DiscountRate     int     `cql:"discount_rate" json:"discount_rate"`
	ReviewCount      int     `cql:"review_count" json:"review_count"`
	InventoryStatus  string  `cql:"inventory_status" json:"inventory_status"`
	Name             string  `cql:"product_name" json:"product_name"`
	BrandID          int     `cql:"brand_id" json:"brand_id"`
	BrandName        string  `cql:"brand_name" json:"brand_name"`
	RatingAverage    float32 `cql:"rating_average" json:"rating_average"`
	ThumbnailUrl     string  `cql:"thumbnail_url" json:"thumbnail_url"`
	QuantitySold     int     `cql:"quantity_sold" json:"quantity_sold"`
	// Categories       Categories `cql:"categories" json:"categories"`
	// Images []Image `cql:"images" json:"images"`
}

type RecommendProducts struct {
	Products []RecommendProduct `cql:"recommend_products" json:"recommend_products"`
}

func main() {
	loadConfig()
	fmt.Println("Loaded configuration")

	session = getSession(strings.Split(viper.GetString("CASSANDRA_HOST"), ","), viper.GetString("KEYSPACE"))
	defer session.Close()
	fmt.Println("Connected to Cassandra")

	router := gin.Default()
	router.GET("/:userID", getRecommendation)
	router.POST("/:userID", addRecommendation)

	router.Run(fmt.Sprintf(":%d", viper.GetInt("PORT")))
}

func loadConfig() {
	viper.SetConfigFile(CONFIGPATH)
	err := viper.ReadInConfig()
	if err != nil {
		panic(err)
	}
}

func getSession(hosts []string, keyspace string) *gocql.Session {
	cluster := gocql.NewCluster(strings.Join(hosts, ","))
	cluster.Keyspace = keyspace
	cluster.Consistency = gocql.Quorum

	session, err := cluster.CreateSession()
	if err != nil {
		panic(err)
	}

	return session
}

func getRecommendation(c *gin.Context) {
	var recommendProducts RecommendProducts

	userID := c.Param("userID")
	query := `SELECT recommend_products FROM recommendations WHERE user_id = ? limit 1;`
	ctx := context.Background()

	if err := session.Query(query, userID).WithContext(ctx).Scan(&recommendProducts.Products); err != nil {
		if errors.Is(err, gocql.ErrNotFound) {
			c.JSON(404, err.Error())
			return
		}
		c.JSON(500, err.Error())
		return
	}

	c.JSON(200, recommendProducts)
}

func addRecommendation(c *gin.Context) {
	userID := c.Param("userID")
	var recommendProducts RecommendProducts
	if err := c.ShouldBindJSON(&recommendProducts); err != nil {
		fmt.Println(err.Error())
		c.JSON(400, err.Error())
		return
	}

	ctx := context.Background()
	query := `INSERT INTO recommendations (user_id, recommend_products, created_time) 
		VALUES (?, ?, ?);`

	err := session.Query(query, userID, recommendProducts.Products, time.Now()).WithContext(ctx).Exec()
	if err != nil {
		c.JSON(500, err.Error())
		return
	}

	c.JSON(201, gin.H{})
}
