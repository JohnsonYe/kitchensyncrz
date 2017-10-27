#! /usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import time

# content = requests.get('http://allrecipes.com/recipe/23847/pasta-pomodoro/?internalSource=staff%20pick&referringId=17562&referringContentType=recipe%20hub');
# content = requests.get('http://allrecipes.com/recipe/15679/asian-beef-with-snow-peas/?internalSource=staff%20pick&referringId=17562&referringContentType=recipe%20hub')


ALLRECIPES_BASE = 'http://allrecipes.com'
def scrape_recipe(url,session=requests.Session()):
    # time.sleep(1)
    content = session.get(ALLRECIPES_BASE + url)
    soup = BeautifulSoup(content.text,'html.parser')
    title = soup.title.get_text()
    ingredients = [ingredient.get_text() for ingredient in soup.select('span[class="recipe-ingred_txt added"]')]
    directions = [step.get_text() for step in soup.select('span[class="recipe-directions__list--item"]')]
    return {'title':title,'ingredients':ingredients,'directions':directions,'url':url}


if __name__ == '__main__':
    recipe = scrape_recipe("/recipe/68868/chicken-florentine-casserole/?internalSource=recipe hub&referringId=80&referringContentType=recipe hub&clickId=cardslot 69")
    title = recipe['title']
    ingredients = recipe['ingredients']
    directions = recipe['directions']
    print('\nRECIPE: {}\n'.format(title))
    print('INGREDIENTS:')
    [print('* ' + ingredients[i]) for i in range(0,len(ingredients)-1)]
    print('\nDIRECTIONS:')
    [print('* ' + directions[i]) for i in range(0,len(directions)-1)]
    print()

