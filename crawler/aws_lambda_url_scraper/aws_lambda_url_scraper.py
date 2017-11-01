import requests
import json
from bs4 import BeautifulSoup as bs
from bs4 import SoupStrainer
import time
import os
import boto3
from process_recipes import extract_ingredient_info_2

print('Loading function')
session = requests.Session();
client = boto3.client('dynamodb',region_name='us-east-2')
strainer = SoupStrainer('article',attrs={'class':'fixed-recipe-card'})
base_page = os.environ['base_page']

def scrape_scroller_page(source_page,page_number):
    content = session.get("{}?page={}".format(source_page,page_number));
    soup = bs(content.text,'html.parser',parse_only=strainer)
    recipes = soup.select('article[class="fixed-recipe-card"]')
    return [recipe.find('a')['href'] for recipe in recipes]

def scrape_recipe(url):
    time.sleep(1)
    content = session.get(base_page + url) # use http session to pull html from given page
    soup = bs(content.text,'html.parser') # parse http we get back
    title = soup.title.get_text() # extract page name

    # extract ingredients list
    ingredients = [ingredient.get_text() for ingredient in soup.select('span[class="recipe-ingred_txt added"]')]
    
    # extract directions list
    directions = [step.get_text() for step in soup.select('span[class="recipe-directions__list--item"]')]
    print('Found recipe: {}'.format(title))
    return title[0:-17],ingredients,directions

def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))
    source_page = os.environ['infinite_scroller']
    max_recipes = os.environ['recipes_to_scrape']
    num_recipes = 0
    page_number = 1

    while num_recipes < int(max_recipes):
        for url in scrape_scroller_page(source_page,page_number):
            title,ingredients,directions = scrape_recipe(url)
            ingredient_info_list = []
            for ingredient in ingredients:
                extracted_ingredients = extract_ingredient_info_2(ingredient)
                for extracted_ingredient in extracted_ingredients:
                    ingredient_info_list.append(extracted_ingredient)
            num_recipes = num_recipes + 1

    # print(client.list_tables()['TableNames'])
    recipe_list = {'recipe list':{'SS':['first recipe']}}
    update_expression = 'ADD #L :L'
    expression_attribute_names = {'#L':'recipe list'}
    expression_attribute_values = {':L':{'SS':['second recipe']}}
    my_item = {'Ingredient ID':{'S':'hello'},'Ingredient name':{'S':'world'}}
    client.update_item(TableName='Ingredient',Key=my_item,
        UpdateExpression=update_expression,ExpressionAttributeNames=expression_attribute_names,
        ExpressionAttributeValues=expression_attribute_values)

    return event['key1']  # Echo back the first key value
    #raise Exception('Something went wrong')