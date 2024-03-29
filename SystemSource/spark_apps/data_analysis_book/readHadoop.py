from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum as sum_spark, rank, collect_list
from pyspark.sql.window import Window
import time
import requests
import json

# Initialize SparkSession with Hadoop configurations
spark = SparkSession.builder \
    .appName("ReadFromHDFS") \
    .config("fs.defaultFS", "hdfs://1aebc5323a6c:8020") \
    .getOrCreate()
input_folder = '/product/'

# Read the text file from HDFS into a DataFrame
df = spark.read.format("json") \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .load(input_folder)

# Show the DataFrame contents
df.printSchema()

# Get and calculate all point of every (user_id, category_id) since one week ago
one_week_ago_timestamp = (time.time() - (7*24*60*60)) * 1000
df = df.where(f"timestamp > {one_week_ago_timestamp}").groupBy("user_id", "category_id").agg(sum_spark("point").alias("total_points"))

# Get top2 category by totalpoint of userid
windowSpec = Window.partitionBy("user_id").orderBy(df["total_points"].desc())
ranked_df = df.withColumn("rank", rank().over(windowSpec))
top_two_records = ranked_df.filter(ranked_df["rank"] <= 2).drop("rank")

# Group all candidate categories of individual user into a collect list
grouped_df = top_two_records.groupby("user_id").agg(collect_list("category_id").alias("category_array"))

rows = grouped_df.collect()
# print(rows)
for row in rows:
    recommended_products = []
    user_id = row['user_id']
    categories = row['category_array']
    for category_id in categories:
        # Get candidated recommended products in a category
        params = {
            "limit" : 3,
            "sort" : '-rating_average',
            "category" : category_id
        }
        res = requests.get(f"http://192.168.1.160:3052/api/v1/product/", params=params)
        if res.status_code != 200:
            continue
        data = res.json().get("data", {}).get("data", [])
        # print(data)
        for product in data:
            recommended_products.append(product)
        
    body = {
        "recommend_products": recommended_products
    }
    print(recommended_products)

    # Store infomation in persistent data-store (Cassandra)
    # res = requests.post(url=f"http://192.168.1.195:8080/{user_id}", json=body)
    print(f"Updating a recommended product list to user {user_id} with status_code: {res.status_code}")


# Stop the SparkSession (optional, depending on your use case)
spark.stop()