#! /usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import time

# content = requests.get('http://allrecipes.com/recipe/23847/pasta-pomodoro/?internalSource=staff%20pick&referringId=17562&referringContentType=recipe%20hub');
# content = requests.get('http://allrecipes.com/recipe/15679/asian-beef-with-snow-peas/?internalSource=staff%20pick&referringId=17562&referringContentType=recipe%20hub')


ALLRECIPES_BASE = 'http://allrecipes.com'
def scrape_recipe(url,session=requests.Session()):
    time.sleep(1)
    content = session.get(ALLRECIPES_BASE + url) # use http session to pull html from given page
    soup = BeautifulSoup(content.text,'html.parser') # parse http we get back
    title = soup.title.get_text() # extract page name

    # extract ingredients list
    ingredients = [ingredient.get_text() for ingredient in soup.select('span[class="recipe-ingred_txt added"]')]
    
    # extract directions list
    directions = [step.get_text() for step in soup.select('span[class="recipe-directions__list--item"]')]
    print('Found recipe: {}'.format(title))
    return {'title':title,'ingredients':ingredients,'directions':directions,'url':url}


# if we run just this script, it will pull a single recipe from the url below
# good for lightweight testing of parse algorithms and such
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

