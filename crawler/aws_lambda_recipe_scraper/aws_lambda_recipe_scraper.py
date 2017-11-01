#! /usr/bin/env python3
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

def scrape_recipe(url):
    time.sleep(1)
    content = session.get(url) # use http session to pull html from given page
    soup = bs(content.text,'html.parser') # parse http we get back
    title = soup.title.get_text() # extract page name

    # extract ingredients list
    ingredients = [ingredient.get_text() for ingredient in soup.select('span[class="recipe-ingred_txt added"]')]
    
    # extract directions list
    directions = [step.get_text() for step in soup.select('span[class="recipe-directions__list--item"]')]
    print('Found recipe: {}'.format(title))
    return title[0:-24],ingredients,directions

def update_ingredient(recipe_name,ingredient_name,num_in_recipe):
    print('Updating: ' + ingredient_name)
    update_expression = 'SET #L = list_append(if_not_exists(#L,:new_list),:L)'
    expression_attribute_names = {'#L':'recipes'}
    expression_attribute_values = {':L':{'L':[{'M':{'Name':{'S':recipe_name},'Importance':{'N':str(1/num_in_recipe)}}}]},
                                    ':new_list':{'L':[]}}
    ingredient = {'Name':{'S':ingredient_name}}
    client.update_item(TableName='Ingredients',Key=ingredient,
        UpdateExpression=update_expression,ExpressionAttributeNames=expression_attribute_names,
        ExpressionAttributeValues=expression_attribute_values)

def lambda_handler(event, context):
    title,ingredients,directions = scrape_recipe(url)
    ingredient_info_list = []
    for ingredient in ingredients:
        extracted_ingredients = extract_ingredient_info_2(ingredient)
        for extracted_ingredient in extracted_ingredients:
            ingredient_info_list.append(extracted_ingredient)
    for ingredient_info in ingredient_info_list:
        update_ingredient(title,ingredient_info['name'],len(ingredient_info_list))

    # print(client.list_tables()['TableNames'])


    return event['key1']  # Echo back the first key value
    #raise Exception('Something went wrong')

# name = 'recipes_pages_1_to_10'
# with open('../obj/' + name + '.pkl', 'rb') as f:
#         print( pickle.load(f) )

base_url = 'https://allrecipes.com'
asian_chicken = '/recipe/61024/asian-orange-chicken/'
meatballs = '/recipe/21353/italian-spaghetti-sauce-with-meatballs/'
pork = '/recipe/132815/balsamic-roasted-pork-loin/'
title,ingredients,directions = scrape_recipe(base_url + asian_chicken)
ingredient_info_list = []
for ingredient in ingredients:
    extracted_ingredients = extract_ingredient_info_2(ingredient)
    for extracted_ingredient in extracted_ingredients:
        ingredient_info_list.append(extracted_ingredient)
for ingredient_info in ingredient_info_list:
    update_ingredient(title,ingredient_info['name'],len(ingredient_info))



