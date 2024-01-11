import requests
import random
import time

BASE_URL = "http://localhost:3052/api/v1/product"

class User(object):
    def __init__(self, user_id, category_ids) -> None:
        self.user_id = user_id
        self.category_ids = category_ids
        self.products = []
        self.key_search = []
    
    def make_candidate_products(self):
        for category_id in self.category_ids:
            res = requests.get(url=f"{BASE_URL}?category={category_id}")
            if res.status_code != 200:
                continue        
            list_products = res.json().get("data", {}).get("data", [])
            # print(list_products)
            for product in list_products:
                if "_id" in product:
                    self.products.append(product.get("_id"))
                if "name" in product:
                    self.key_search.append(product.get("name"))


def find_all_products(user):
    headers = {
        'user_id': str(user.user_id),
        'Content-Type': 'application/json'
    }
    res = requests.get(url=BASE_URL, headers=headers)
    print(f"{user.user_id} - find_all_products: {res.status_code}")


def find_product(user):
    headers = {
        'user_id': str(user.user_id),
        'Content-Type': 'application/json'
    }
    product_id = random.choice(user.products)

    res = requests.get(url=f"{BASE_URL}/{product_id}", headers=headers)
    print(f"{user.user_id} - find_product({product_id}): {res.status_code}")


def search(user):
    headers = {
        'user_id': str(user.user_id),
        'Content-Type': 'application/json'
    }
    key_search = random.choice(user.key_search)

    res = requests.get(url=f"{BASE_URL}/search/{key_search}", headers=headers)
    print(f"{user.user_id} - search({key_search}): {res.status_code}")


def add_to_cart(user):
    number_of_product = random.randint(1, int(len(user.products)/2))
    list_products = random.sample(user.products, number_of_product)
    payload = {
        "product_ids": list_products
    }
    headers = {
        'user_id': str(user.user_id),
        'Content-Type': 'application/json'
    }

    res = requests.post(f"{BASE_URL}/add-to-cart", json=payload, headers=headers)
    print(f"{user.user_id} - add_to_cart({list_products}): {res.status_code}")


def checkout(user):
    number_of_product = random.randint(1, int(len(user.products)/2))
    list_products = random.sample(user.products, number_of_product)
    payload = {
        "product_ids": list_products
    }
    headers = {
        'user_id': str(user.user_id),
        'Content-Type': 'application/json'
    }

    res = requests.post(f"{BASE_URL}/checkout", json=payload, headers=headers)
    print(f"{user.user_id} - checkout({list_products}): {res.status_code}")


functions = [find_all_products, find_product, search, add_to_cart, checkout, find_product, search, add_to_cart, checkout]
list_category = [
    [28574, 1795, 24200, 28892, 28856],
    [2657, 1836, 28682, 1794, 28856], 
    [28856, 11878, 8513, 2458, 29010], 
    [49640, 49620, 1637, 8351, 5410], 
    [29010, 28808, 5344, 5333, 49512], 
    [5344, 49542, 49552, 8193, 3422], 
    [49512, 49542, 49552, 49640, 49620], 
    [49552, 49640, 49620, 1948, 8193], 
    [49620, 1948, 8193, 3422, 1636], 
    [1637, 8351, 5410, 8400, 2657]]

def run(number_of_users):
    users = []
    for id in range(number_of_users):
        user = User(id, list_category[id])
        user.make_candidate_products()
        users.append(user)

    for i in range(3):
        for user in users:
            fn = random.choice(functions)
            fn(user=user)
            time.sleep(0.01)

run(10)

