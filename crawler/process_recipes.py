#! /usr/bin/env python3

import pickle
import re
import string
from fractions import Fraction

def save_obj(obj, name):
    with open('obj/'+ name + '.pkl', 'wb') as f:
        pickle.dump(obj, f, pickle.HIGHEST_PROTOCOL)

def load_obj(name ):
    with open('obj/' + name + '.pkl', 'rb') as f:
        return pickle.load(f)

recipes = load_obj('recipes_pages_1_to_10')


units = set(['cup','clove','tablespoon','teaspoon','ounce','halves','half','pint','pound',
'package','head','can','packet','taste','envelope','jar','container','dash','bottle'])

special = set(['sauce'])

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
    if ingredient in units or ingredient[0:-1] in units:
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

modifier_list = set(['skinless','boneless','fresh','large','hot','cold'])
modifier_total = 0;
vowel_unmatch = '(?<![aeou])'
find_verb = re.compile('({}ed|ground|{}(?<![hk])en)$'.format(vowel_unmatch,vowel_unmatch))

test_recipe = 'Baked Teriyaki Chicken Recipe - Allrecipes.com'

for ingredient in ingredient_word_list:
    if find_verb.search(ingredient):
        modifier_list.add(ingredient)

for modifier in modifier_list:
    ingredient_words.pop(modifier)
# print(modifier_list)


# for ingredient in recipes['Baked Teriyaki Chicken Recipe - Allrecipes.com']['ingredients']:
#     print('unprocessed: ' + ingredient)
#     sanitized = re.sub(r'[^\x00-\x7f]',r'', ingredient.translate(punctuation_strip).lower())
#     raw_split = re.sub(r'[^\x00-\x7f]',r'', ingredient.lower()).split()
#     print('sanitized: ' + sanitized)
#     # ranked = [(token,ingredient_words[token]['count']) if token in ingredient_words else (token,0) for token in sanitized.split()]
#     ing_name = [];
#     ing_mods = [];
#     ing_amt = {'unit':None,'measurement':None};
#     counter = 0
#     for item in sanitized.split():
#         if item in ingredient_words:
#             ing_name.append(raw_split[counter])
#         elif item in modifier_list:
#             ing_mods.append(raw_split[counter])
#         elif numeric_regex.search(item):
#             ing_amt['measurement'] = float(sum(Fraction(s) for s in raw_split[counter].split()))
#         else:
#             ing_amt['unit'] = raw_split[counter]
#         counter = counter + 1
#     # print('ranked: ' + str.join(' ',[item[0] for item in ranked]))

#     # construct ingredient name from non-amount non-modifiers

#     name_string = str.join(' ',ing_name)
#     ingredient_struct = {'name':name_string,'amount':ing_amt,'modifiers':str.join(', ', ing_mods)}
 
#     print('processed: ' + str(ingredient_struct))
#     print()

all_ingredients = {}

triggers = set(['-','(','to'])
articles = set(['or'])
adverb = re.compile('ly$')

# need processing for 'and' and 'or' modifiers
# better comma processing

for recipe in recipes:
    for ingredient in recipes[recipe]['ingredients']:
        sanitized = re.sub(r'[^\x00-\x7f]',r'', ingredient.translate(punctuation_strip).lower())
        raw_split = re.sub(r'[^\x00-\x7f]',r'', ingredient.lower()).split()
        ing_name = [];
        counter = 0
        triggered = False
        for item in sanitized.split():
            if raw_split[counter][-1] == ')':
                triggered = False
            elif triggered:
                pass
            elif item in triggers:
                triggered = True
            elif adverb.search(item) or item in articles:
                pass
            elif raw_split[counter][0] in triggers:
                triggered = True # add to modifier list
            elif raw_split[counter][-1] in triggers:
                triggered = True # add to ingredient list
                if item in ingredient_words:
                    ing_name.append(item)
            elif item in ingredient_words:
                ing_name.append(raw_split[counter])
            counter = counter + 1
        name_string = str.join(' ',ing_name)

        if not name_string:
            print(ingredient)

        if name_string in all_ingredients:
            all_ingredients[name_string].append(recipe)
        else:
            all_ingredients[name_string] = [recipe]

# print(all_ingredients)
print([all_ingredients.keys()])
# print(all_ingredients[''])







