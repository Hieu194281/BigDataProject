import requests
import re
from bs4 import BeautifulSoup
from collections import deque
import pandas as pd
from urllib.parse import urlparse

def extract_url_key(url):
    parsed_url = urlparse(url)
    path_segments = parsed_url.path.split('/')
    if len(path_segments) > 1:
        return path_segments[1]
    else:
        return None


category_list = []

def get_web(url):
    headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0',
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup

def fnGetMainCategoryList():
  soup = get_web('https://tiki.vn/')
  category_list_element = soup.find('div', class_=lambda x: x and x.startswith('styles__StyledCategoryList'))
  main_category_list = []
  categories = soup.find_all('div', {'class', 'styles__FooterSubheading-sc-32ws10-5 cNJLWI'})
  for c in categories:
    try:
      main_name = c.a.text
      main_url = c.a['href']
      main_id = re.findall('([1-9][0-9]*)', main_url)[0]
      main_parent_id = main_id
      main_urlKey = extract_url_key(main_url)
      main_category_list.append({
          "id": main_id,
          "name": main_name,
          "url": main_url,
          "urlKey": main_urlKey,
          "p_id": main_parent_id,
      })
    except Exception as err:
      print(err)
  return main_category_list

# def getSubCategoryList(parentCategory):
#   print('Get sub cate', parentCategory)
#   soup = get_web(parentCategory.get('url'))
#   sub_category_list = []

#   categories = soup.find_all('a', { 'class', 'item item--category' })
#   for c in categories:
#     try:
#       sub_name = c.text
#       sub_url = 'https://tiki.vn' + c['href']
#       print(c.a)
#       print(c.get('href'))
#       sub_id = re.findall('([1-9][0-9]*)', sub_url)[0]
#       sub_parent_id = parentCategory.get('id')
#       sub_category_list.append({
#         "id": sub_id,
#         "name": sub_name,
#         "url": sub_url,
#         "p_id": sub_parent_id,
#       })
#     except Exception as err:
#       print(err)

#   return sub_category_list

# def getSubCategoryList_V2(parentCategory):
#   return


# def getAllCategoryList(mainCategoryList):
#   global category_list
#   queue = deque(mainCategoryList)
#   while queue:
#     parent_cate = queue.popleft()
#     sub_category_list = getSubCategoryList(parent_cate)
#     print('Sub Categories:', sub_category_list)
#     queue.extend(sub_category_list)
#     category_list.extend(sub_category_list)

#   return

main_category_list = fnGetMainCategoryList()
df = pd.DataFrame(main_category_list)
df.to_csv('main_category_list.csv', index=False)

# category_list.extend(main_category_list)
# getAllCategoryList(main_category_list)

# print(category_list)

# df = pd.DataFrame(category_list)
# df.to_csv('category_list.csv', index=False)