#! /usr/bin/env python3

import pickle
import re
import string

def save_obj(obj, name):
    with open('obj/'+ name + '.pkl', 'wb') as f:
        pickle.dump(obj, f, pickle.HIGHEST_PROTOCOL)

def load_obj(name ):
    with open('obj/' + name + '.pkl', 'rb') as f:
        return pickle.load(f)

recipes = load_obj('recipes_pages_1_to_10')


units = ['cup','clove','tablespoon','teaspoon','ounce','halves','half','pint','pound']

special = ['sauce']

counter = 0
numeric_regex = re.compile('\d')
punctuation_strip = str.maketrans(dict.fromkeys(string.punctuation.replace('-','')))
ingredient_words = {}
for recipe in recipes:
    for ingredient in recipes[recipe]['ingredients']:
        for word in re.sub(r'[^\x00-\x7f]',r'', ingredient.translate(punctuation_strip).lower()).split():
            if numeric_regex.search(word):
                pass
            elif word in ingredient_words:
                ingredient_words[word]['count'] = ingredient_words[word]['count'] + 1
                ingredient_words[word]['sources'].append(counter)
            else:
                ingredient_words[word] = {'count':1,'sources':[counter]};
            counter = counter + 1

ingredient_word_list = list(ingredient_words.keys())

# strip 'unit' tokens out of ingredient tokens
for ingredient in ingredient_word_list:
    if ingredient in units or ingredient[0:-1] in units or ingredient in special:
        ingredient_words.pop(ingredient)

# print(sorted(ingredient_words.items(),key=lambda item: item[1]))

print(recipes['Baked Teriyaki Chicken Recipe - Allrecipes.com'])

# rank tokens in each ingredient string
# for ingredient in recipes['Baked Teriyaki Chicken Recipe - Allrecipes.com']['ingredients']:
#     print('unprocessed: ' + ingredient)
#     sanitized = re.sub(r'[^\x00-\x7f]',r'', ingredient.translate(punctuation_strip).lower());
#     print('sanitized: ' + sanitized)
#     print('ranked: ' + str.join(' ',[str(ingredient_words[token]['count']) if token in ingredient_words else '#' for token in sanitized.split()]))
#     print()

modifier_list = set()
modifier_total = 0;
vowel_unmatch = '(?<![aeiou])'
modifier_suffix = re.compile('({}ed|ground|{}(?<![hk])en)$'.format(vowel_unmatch,vowel_unmatch))

test_recipe = 'Baked Teriyaki Chicken Recipe - Allrecipes.com'

# for recipe in recipes:
#     for ingredient in recipes[recipe]['ingredients']:
#         sanitized = re.sub(r'[^\x00-\x7f]',r'', ingredient.translate(punctuation_strip).lower());
#         tokens = [token if token in ingredient_words else '#' for token in sanitized.split()]
#         for token in tokens:
#             if modifier_suffix.search(token):
#                 modifier_list.add(token)
        # ranked = sorted([(token,ingredient_words[token]['count']) if token in ingredient_words else ('#',0) for token in sanitized.split()],key=lambda ing: ing[1])
        # print((ranked[-1][0],ranked[-2][0]) if len(ranked)>1 and ranked[-2][0] != '#' else 'none')

for ingredient in ingredient_word_list:
    if modifier_suffix.search(ingredient):
        ingredient_words.pop(ingredient)
        modifier_list.add(ingredient)
# print(modifier_list)

for ingredient in recipes['Baked Teriyaki Chicken Recipe - Allrecipes.com']['ingredients']:
    print('unprocessed: ' + ingredient)
    sanitized = re.sub(r'[^\x00-\x7f]',r'', ingredient.translate(punctuation_strip).lower())
    raw_split = re.sub(r'[^\x00-\x7f]',r'', ingredient.lower()).split()
    print('sanitized: ' + sanitized)
    # ranked = [(token,ingredient_words[token]['count']) if token in ingredient_words else (token,0) for token in sanitized.split()]
    ing_name = [];
    ing_mods = [];
    ing_amt = {'unit':None,'measurement':None};
    counter = 0
    for item in sanitized.split():
        if item in ingredient_words:
            ing_name.append(raw_split[counter])
        elif item in modifier_list:
            ing_mods.append(raw_split[counter])
        elif numeric_regex.search(item):
            ing_amt['measurement'] = raw_split[counter]
        else:
            ing_amt['unit'] = raw_split[counter]
        counter = counter + 1
    # print('ranked: ' + str.join(' ',[item[0] for item in ranked]))

    # construct ingredient name from non-amount non-modifiers

    ingredient_struct = {'name':str.join(' ',ing_name),'amount':ing_amt,'modifiers':str.join(', ', ing_mods)}
    print('processed: ' + str(ingredient_struct))
    print()







