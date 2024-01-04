import requests
import random

BASE_URL = "http://localhost:3902/v1/api/product"

class User(object):
    def __init__(self, user_id, category_ids) -> None:
        self.user_id = user_id
        self.category_ids = category_ids
        self.products = []
        self.key_search = []
    
    def make_candidate_products(self):
        for category_id in self.category_ids:
            res = requests.get(url=f"{BASE_URL}?category={category_id}&sort=-rating_average")
            if res.status_code != 200:
                continue        
            list_products = res.json()
            for product in list_products:
                if "product_id" in product:
                    self.products.append(product.get("product_id"))
                if "name" in product:
                    self.key_search.append(product.get("name"))


def find_all_products(user):
    headers = {
        'user_id': user.user_id,
        'Content-Type': 'application/json'
    }
    res = requests.get(url=BASE_URL, headers=headers)
    print(f"{user.user_id} - find_all_products: {res.status_code}")


def find_product(user):
    headers = {
        'user_id': user.user_id,
        'Content-Type': 'application/json'
    }
    product_id = random.choice(user.products)

    res = requests.get(url=f"{BASE_URL}/{product_id}", headers=headers)
    print(f"{user.user_id} - find_product({product_id}): {res.status_code}")


def search(user):
    headers = {
        'user_id': user.user_id,
        'Content-Type': 'application/json'
    }
    key_search = random.choice(user.key_search)

    res = requests.get(url=f"{BASE_URL}/search/{key_search}", headers=headers)
    print(f"{user.user_id} - search({key_search}): {res.status_code}")


def add_to_cart(user):
    number_of_product = random.randint(1, len(user.products)/2)
    list_products = random.sample(user.products, number_of_product)
    payload = {
        "product_ids": list_products
    }
    headers = {
        'user_id': user.user_id,
        'Content-Type': 'application/json'
    }

    res = requests.post(f"{BASE_URL}/add-to-cart", json=payload, headers=headers)
    print(f"{user.user_id} - add_to_cart({list_products}): {res.status_code}")


def checkout(user):
    number_of_product = random.randint(1, len(user.products)/2)
    list_products = random.sample(user.products, number_of_product)
    payload = {
        "product_ids": list_products
    }
    headers = {
        'user_id': user.user_id,
        'Content-Type': 'application/json'
    }

    res = requests.post(f"{BASE_URL}/checkout", json=payload, headers=headers)
    print(f"{user.user_id} - checkout({list_products}): {res.status_code}")


functions = [find_all_products, find_product, search, add_to_cart, checkout, find_product, search, add_to_cart, checkout]

def run(number_of_users):
    users = []
    for id in range(number_of_users):
        user = User(id, [])
        user.make_candidate_products()
        users.append(user)

    while True:
        for user in users:
            fn = random.choice(functions)
            fn(user=user)

run(10)

