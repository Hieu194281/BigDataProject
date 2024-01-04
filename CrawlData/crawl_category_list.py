import requests
import re
import pandas as pd
from collections import deque

mainCategoryList = pd.read_csv('main_category_list.csv').to_dict('records')

print(type(mainCategoryList))
# print(mainCategoryList[0])

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
    'limit': '40',
    'include': 'sale-attrs,badges,product_links,brand,category,stock_item,advertisement',
    'aggregations': '2',
    'version': 'home-persionalized',
    'trackity_id': '18c259dc-259c-4179-5239-54f845e5b4bc',
    'category': '1789',
    'page': '1',
    'src': 'c1883',
    'urlKey':  'dien-thoai-may-tinh-bang',
}

# category_list = []

def getSubCategoryList(parentCategory):
  print('_____________________')
  # print('Get sub category of: ' + parentCategory.get('name'))
  params['category'] = parentCategory.get('id')
  params['src'] = 'c' + str(parentCategory.get('id'))
  params['urlKey'] = parentCategory.get('urlKey')
  print('params: ', params['urlKey'])
  response = requests.get('https://tiki.vn/api/personalish/v1/blocks/listings', headers=headers, params=params)
  categories = []
  if response.status_code == 200:
    try:
      filterReponse = response.json().get('filters')
      if filterReponse[0].get('query_name') == 'category':
        tmp_categories = filterReponse[0].get('values')
        categories = [
          {
            'name': item.get('display_value', ''), 
            'id': item.get('query_value', ''), 
            'url': item.get('url_path', ''), 
            'urlKey': item.get('url_key', ''),
            'p_id': parentCategory.get('id')
          }
          for item in tmp_categories
        ]
        print(categories)
        # print(type(categories[0]))
    except Exception as err:
      print(err)
    # print(response.json().get('filters'))

  return categories

def getCategoryList(mainCategoryList):
  category_list = []

  queue = deque(mainCategoryList)
  while queue:
    parent_cate = queue.popleft()
    sub_category_list = getSubCategoryList(parent_cate)
    category_list.extend(sub_category_list)
    queue.extend(sub_category_list)
  return category_list

category_list = getCategoryList(mainCategoryList)
df = pd.DataFrame(category_list)
df.to_csv('sub_category_list.csv', index=False)
