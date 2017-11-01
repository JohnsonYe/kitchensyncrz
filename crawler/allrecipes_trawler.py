#! /usr/bin/env python3

import requests
from bs4 import BeautifulSoup as bs
from bs4 import SoupStrainer 
import time
from multiprocessing import Pool
import pickle
from functools import partial
import random

from allrecipes_scraper import scrape_recipe

strainer = SoupStrainer('article',attrs={'class':'fixed-recipe-card'})
cookbook = dict()
session = requests.Session();
session.headers.update({'user-agent':'YandexBot'})

# this needs a 1s delay per request so we dont get blocked
def parse_page(page_number):
    # if random.randrange(10) < 2:
    #     time.sleep(5)
    time.sleep(1)
    # content = session.get("http://allrecipes.com/recipes/80/main-dish/?page={}".format(page_number));
    content = session.get("http://allrecipes.com/recipes/?page={}".format(page_number));
    soup = bs(content.text,'lxml',parse_only=strainer)
    recipes = soup.select('article[class="fixed-recipe-card"]')
    print('Found {} recipes!'.format(len(recipes)))
    return [recipe.find('a')['href'] for recipe in recipes]

def chunkify(list,segments): # split a list into chunks of approximately equal size
    return [list[i::segments] for i in xrange(segments)]

def save_obj(obj, name):
    with open('obj/'+ name + '.pkl', 'wb') as f:
        pickle.dump(obj, f, pickle.HIGHEST_PROTOCOL)

def load_obj(name ):
    with open('obj/' + name + '.pkl', 'rb') as f:
        return pickle.load(f)

if __name__ == '__main__':
    start_time = time.time()
    # try spoofing the googlebot user-agent
    num_processes = 1; # this is close to the max we can have before getting shut down
    with Pool(num_processes) as p: # be careful with multithreading http calls, you might get blocked for spamming
        
        # make one request per 'page' and divide up the requests between processes
        all_recipes = [recipe for recipe_page in p.map(parse_page,range(1,10)) for recipe in recipe_page]
        
        # make one request per recipe and divide up the requests between processes
        # compile recipes into a cookbook(dictionary) for easy access
        # time.sleep(3)
        recipe_dict = dict([(recipe['title'],recipe) for recipe in p.map(partial(scrape_recipe,session=session),all_recipes)])

    end_time = time.time()
    print('--> Found {} recipes in {} seconds'.format(len(all_recipes),end_time-start_time))
    # print(recipe_dict.keys())
    # save_obj(recipe_dict,'recipes_pages_1_to_10')
    # save_obj(all_recipes,'recipe_urls_pages_1_to_10')
    # print('Request Time: {}\nParse Time: {}\nSearch Time: {}'.format(request_time,parse_time,search_time))
