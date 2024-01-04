import pymongo
from tqdm import tqdm
import pandas as pd
import requests

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'vi-VN,vi;q=0.8,en-US;q=0.5,en;q=0.3',
    'Referer': 'https://tiki.vn/?src=header_tiki',
    'x-guest-token': 'zmYAN3nCIaE7g1dsMVx8PRHvDiSTWoqF',
    'Connection': 'keep-alive',
    'TE': 'Trailers',
}

params = {
    'limit': '48',
    'include': 'sale-attrs,badges,product_links,brand,category,stock_item,advertisement',
    'aggregations': '2',
    'version': 'home-persionalized',
    'trackity_id': '18c259dc-259c-4179-5239-54f845e5b4bc',
    'category': None,
    'page': '1',
    'src': None,
    'urlKey':  None,
}

myClient = pymongo.MongoClient("mongodb+srv://tienanh15122001:Aomg15122001@cluster0.xur9vj8.mongodb.net/?retryWrites=true&w=majority")
myDB = myClient['big-data-project']
myCol = myDB['categories']

category_list = list(myCol.find({ "id": { "$nin": myCol.distinct("parentId") } }))

product_id_list = []

def getListIdOfCategory(category):
  product_ids = []
  for i in range(1,2):
    try:
      params['page'] = i
      params['src'] = 'c' + str(category['id'])
      params['urlKey'] = category['urlKey']
      params['category'] = category['id']

      response = requests.get('https://tiki.vn/api/personalish/v1/blocks/listings', headers=headers, params=params)#, cookies=cookies)
      if response.status_code == 200:
        print('request success!!!')
        for record in response.json().get('data'):
          product_ids.append({'id': record.get('id')})
    except Exception as err:
      print(err)

  return product_ids

for category in category_list:
  res_ids = getListIdOfCategory(category)
  product_id_list.extend(res_ids)

# Save to CSV
df = pd.DataFrame(product_id_list)
df.to_csv('product_id_list.csv', index=False)

print(len(category_list))