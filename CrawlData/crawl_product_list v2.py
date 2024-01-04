import pandas as pd
import requests
from tqdm import tqdm
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from concurrent.futures import ThreadPoolExecutor
import json
import time
import random
import csv

session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)


cookies = {
    'TIKI_GUEST_TOKEN': '8jWSuIDBb2NGVzr6hsUZXpkP1FRin7lY',
    'TOKENS': '{%22access_token%22:%228jWSuIDBb2NGVzr6hsUZXpkP1FRin7lY%22%2C%22expires_in%22:157680000%2C%22expires_at%22:1763654224277%2C%22guest_token%22:%228jWSuIDBb2NGVzr6hsUZXpkP1FRin7lY%22}',
    'amp_99d374': 'eSc-_0HT1um7cb57E7dwA0...1enloc6a2.1enlohtdv.3.2.5',
    'amp_99d374_tiki.vn': 'eSc-_0HT1um7cb57E7dwA0...1enloc6a2.1enlocds8.0.1.1',
    '_gcl_au': '1.1.559117409.1605974236',
    '_ants_utm_v2': '',
    '_pk_id.638735871.2fc5': 'b92ae025fbbdb31f.1605974236.1.1605974420.1605974236.',
    '_pk_ses.638735871.2fc5': '*',
    '_trackity': '70e316b0-96f2-dbe1-a2ed-43ff60419991',
    '_ga_NKX31X43RV': 'GS1.1.1605974235.1.1.1605974434.0',
    '_ga': 'GA1.1.657946765.1605974236',
    'ai_client_id': '11935756853.1605974227',
    'an_session': 'zizkzrzjzlzizqzlzqzjzdzizizqzgzmzkzmzlzrzmzgzdzizlzjzmzqzkznzhzhzkzdzhzdzizlzjzmzqzkznzhzhzkzdzizlzjzmzqzkznzhzhzkzdzjzdzhzqzdzizd2f27zdzjzdzlzmzmznzq',
    'au_aid': '11935756853',
    'dgs': '1605974411%3A3%3A0',
    'au_gt': '1605974227146',
    '_ants_services': '%5B%22cuid%22%5D',
    '__admUTMtime': '1605974236',
    '__iid': '749',
    '__su': '0',
    '_bs': 'bb9a32f6-ab13-ce80-92d6-57fd3fd6e4c8',
    '_gid': 'GA1.2.867846791.1605974237',
    '_fbp': 'fb.1.1605974237134.1297408816',
    '_hjid': 'f152cf33-7323-4410-b9ae-79f6622ebc48',
    '_hjFirstSeen': '1',
    '_hjIncludedInPageviewSample': '1',
    '_hjAbsoluteSessionInProgress': '0',
    '_hjIncludedInSessionSample': '1',
    'tiki_client_id': '657946765.1605974236',
    '__gads': 'ID=ae56424189ecccbe-227eb8e1d6c400a8:T=1605974229:RT=1605974229:S=ALNI_MZFWYf2BAjzCSiRNLC3bKI-W_7YHA',
    'proxy_s_sv': '1605976041662',
    'TKSESSID': '8bcd49b02e1e16aa1cdb795c54d7b460',
    'TIKI_RECOMMENDATION': '21dd50e7f7c194df673ea3b717459249',
    '_gat': '1',
    'cto_bundle': 'i6f48l9NVXNkQmJ6aEVLcXNqbHdjcVZoQ0k2clladUF2N2xjZzJ1cjR6WG43UTVaRmglMkZXWUdtRnJTNHZRbmQ4SDAlMkZwRFhqQnppRHFxJTJCSEozZXBqRFM4ZHVxUjQ2TmklMkJIcnhJd3luZXpJSnBpcE1nJTNE',
    'TIKI_RECENTLYVIEWED': '58259141',
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'vi-VN,vi;q=0.8,en-US;q=0.5,en;q=0.3',
    'Referer': 'https://tiki.vn/dien-thoai-samsung-galaxy-m31-128gb-6gb-hang-chinh-hang-p58259141.html?src=category-page-1789&2hi=0',
    'x-guest-token': '8jWSuIDBb2NGVzr6hsUZXpkP1FRin7lY',
    'Connection': 'keep-alive',
    'TE': 'Trailers',
}

params = (
    ('platform', 'web'),
    ('version', 3),
    ('spid', 187266106)
    #('include', 'tag,images,gallery,promotions,badges,stock_item,variants,product_links,discount_tag,ranks,breadcrumbs,top_features,cta_desktop'),
)

def parser_product(jsonData):
  try:
    if(jsonData):  
        d = dict()
        d['id'] = jsonData.get('id')
        d['sku'] = jsonData.get('sku')
        d['short_description'] = jsonData.get('short_description')
        d['price'] = jsonData.get('price')
        d['list_price'] = jsonData.get('list_price')
        d['discount'] = jsonData.get('discount')
        d['discount_rate'] = jsonData.get('discount_rate')
        d['review_count'] = jsonData.get('review_count')
        d['inventory_status'] = jsonData.get('inventory_status')
        # d['stock_item_qty'] = jsonData.get('stock_item').get('qty')
        # d['stock_item_max_sale_qty'] = jsonData.get('stock_item').get('max_sale_qty')
        d['name'] = jsonData.get('name')
        d['brand_id'] = jsonData.get('brand', {}).get('id')
        d['brand_name'] = jsonData.get('brand', {}).get('name')
        d['categories'] = jsonData.get('categories')
        d['rating_average'] = jsonData.get('rating_average')
        # d['quantity_sold'] = jsonData.get('quantity_sold').get('value')
        d['images'] = jsonData.get('images')
        d['thumbnail_url'] = jsonData.get('thumbnail_url')
        quantity_sold = jsonData.get('quantity_sold')
        if quantity_sold:
            d['quantity_sold'] = quantity_sold.get('value')
        return d
  except Exception as err:
    print(err)
  return None

df_id = pd.read_csv('product_id_list.csv')
product_ids = df_id.id.to_list()

result = [] # product list
csv_file_path = 'crawled_product_list_v5.csv'


num_workers = 20

def fetch_product_data(product_id, retry_count=0):
  try:
    response = session.get(
     'https://tiki.vn/api/v2/products/{}'.format(product_id), 
      headers=headers, 
      params=params, 
      cookies=cookies
    )
    if response.status_code == 200:
      responseData = response.json()
      # print(response.text)
      # responseData = response.json()
      if responseData:
        print('Crawl data {} success !!!'.format(product_id))
        product_data = parser_product(responseData)
        if product_data:
          append_to_csv(product_data, csv_file_path)

      if response.status_code == 429 and retry_count < 5:
        delay = 2 ** retry_count
        print(f"Received 429. Retrying in {delay} seconds.")
        time.sleep(delay + random.randrange(1, 5))
        return fetch_product_data(product_id, retry_count + 1)

    time.sleep(random.randrange(3, 15))
  except Exception as e:
    print(f"Error fetching data for product {product_id}: {e}")
    time.sleep(random.randrange(3, 15))
  return None

def append_to_csv(product_data, csv_file_path):
  try:
    with open(csv_file_path, mode='a', newline='', encoding='utf-8') as file:
      writer = csv.DictWriter(file, fieldnames=product_data.keys())

      # Check if the CSV file is empty and write headers if needed
      if file.tell() == 0:
          writer.writeheader()

      writer.writerow(product_data)
      print(f"Data for product {product_data['id']} appended to CSV.")
  except Exception as e:
      print(f"Error appending data to CSV: {e}")


with ThreadPoolExecutor(max_workers=num_workers) as executor:
  for product_data in tqdm(executor.map(fetch_product_data, product_ids), total=len(product_ids)):
    if product_data:
      result.append(product_data)

# df_product_list = pd.DataFrame(result)
# df_product_list.to_csv('crawled_product_list_v2.csv', index=False)