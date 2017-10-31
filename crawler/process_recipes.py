#! /usr/bin/env python3

import pickle
import re
import string
from fractions import Fraction
import sys
import inflect
import uuid
import copy

p = inflect.engine()

def save_obj(obj, name):
    with open('obj/'+ name + '.pkl', 'wb') as f:
        pickle.dump(obj, f, pickle.HIGHEST_PROTOCOL)

def load_obj(name ):
    with open('obj/' + name + '.pkl', 'rb') as f:
        return pickle.load(f)


units = set(['cup','clove','tablespoon','teaspoon','ounce','halves','half','pint','pound',
'package','head','can','packet','envelope','jar','container','dash','bottle',
'small','medium','large','stalk','quart','slice','whole'])


numeric_regex = re.compile('\d')
punctuation_strip = str.maketrans(dict.fromkeys(string.punctuation.replace('-.','')))

# test_recipe = 'Baked Teriyaki Chicken Recipe - Allrecipes.com'

modifier_list = set(['skinless','boneless','fresh','hot','cold','raw','black','green','red','dry','thick','mild','taste'])
modifier_exclude = {'half-and-half'}
vowel_unmatch = '(?<![aeou]|^r)'
find_verb = re.compile('({}ed|ground|{}(?<![hk])en|ly$|.+-.+)[,)]?$'.format(vowel_unmatch,vowel_unmatch))
def is_modifier(token):
    return token not in modifier_exclude and (find_verb.search(token) or token in modifier_list)


paren_regex = re.compile('\(|\)')
def is_paren(token):
    return paren_regex.search(token)

tr_regex = re.compile('^or$|^to$|^and$|^for$|,$|^-$|^with$')
def is_trigger(token):
    return tr_regex.search(token)

def is_unit(token):
    return (token in units or token[0:-1] in units)

def is_numeric(token):
    return numeric_regex.search(token)

def singularize(token):
    token_singular = p.singular_noun(token)
    return token if not token_singular else token_singular

def read_fraction(token):
    return float(sum([Fraction(frag) for frag in token.split()]))

NULL_FLAG = -1 # should never match
MODIFIER_FLAG = 1
MEASUREMENT_FLAG = 2
UNIT_FLAG = 3
ADVERB_FLAG = 4
PAREN_FLAG = 5
TRIGGER_FLAG = 6
def categorize_token(token):
    if is_modifier(token):
        if token[-2:] == 'ly':
            return ADVERB_FLAG
        else:
            return MODIFIER_FLAG
    if is_numeric(token):
        return MEASUREMENT_FLAG
    if is_unit(token):
        return UNIT_FLAG
    if is_trigger(token):
        return TRIGGER_FLAG
    return 0 # default token flag

def organize_token(range,token_list,clean_token_list,core_flag,and_flag,ingredient_info,additional_info,prev_cat):
    if prev_cat == 0 and core_flag == -2: # core ingredient name
        ingredient_info['name'] = singularize(str.join(' ',clean_token_list[range[0]:range[1]]))
    elif prev_cat == 0 and and_flag:
        additional_info.append(singularize(str.join(' ',clean_token_list[range[0]:range[1]])))
        # print('got here')
    elif prev_cat == MEASUREMENT_FLAG:
        ingredient_info['amount']['measurement'] = ingredient_info['amount']['measurement'] + read_fraction(str.join(' ',token_list[range[0]:range[1]]))
    elif prev_cat == UNIT_FLAG and not ingredient_info['amount']['unit']:
        ingredient_info['amount']['unit'] = singularize(str.join(' ',clean_token_list[range[0]:range[1]]))
    else:
        ingredient_info['modifiers'].append(singularize(str.join(' ',clean_token_list[range[0]:range[1]])))

def extract_ingredient_info_2(ingredient_string,recipe_string):
    raw_tokens = re.sub(r'[^\x00-\x7f]',r'', ingredient_string.lower()).split()
    san_tokens = re.sub(r'[^\x00-\x7f]',r'', ingredient_string.translate(punctuation_strip).lower()).split()

    info = {'name':None,'amount':{'unit':None,'measurement':0},'modifiers':[],'og':ingredient_string}

    categorized = [categorize_token(token) for token in san_tokens]
    marker = 0
    prev = categorized[0]
    comma_flag = False
    paren_flag = False
    override_flag = False
    core_flag = -2
    and_flag = False
    additional = []
    i=1
    for i in range(1,len(categorized)):
        if is_paren(raw_tokens[i]):
            categorized[i] = PAREN_FLAG
            if prev == PAREN_FLAG:
                override_flag = True
                continue

        # print('prev: ' + str(prev))
        # print('curr: ' + str(categorized[i]))
        if categorized[i] == MODIFIER_FLAG or categorized[i] != prev or comma_flag or override_flag:
            # print('grouped: ' + str.join(' ',san_tokens[marker:i]))

            # put previous markers in the right place
            if marker < i and prev != TRIGGER_FLAG:
                organize_token((marker,i),raw_tokens,san_tokens,core_flag,and_flag,info,additional,prev)
                if prev == 0 and core_flag == -2: # core ingredient name
                    core_flag = i-1
           
            if categorized[i] == TRIGGER_FLAG:
                marker = i+1
                if san_tokens[i] == 'and':
                    if i-1 == core_flag:
                        and_flag = True
            else:
                marker = i

            override_flag = False

        prev = categorized[i]

        if raw_tokens[i][-1] == ',':
            comma_flag = True
        else:
            comma_flag = False

    i = i+1
    organize_token((marker,i),raw_tokens,san_tokens,core_flag,and_flag,info,additional,prev)
    infos = []

    for addition in additional:
        duplicated = copy.deepcopy(info)
        duplicated['name'] = addition
        infos.append(duplicated)

    infos.append(info)

    # if additional:
    #     print(infos)
    #     print(categorized)

    return infos

def process_scraper_file(filename): 
    all_ingredients = {}
    all_recipes = {}
    recipes = load_obj(filename)
    for recipe in recipes:
        trunc_recipe = recipe[0:-17]
        all_recipes[trunc_recipe] = {'directions':recipes[recipe]['directions'],'ingredients':[]}
        for ingredient in recipes[recipe]['ingredients']:
            ingredient_infos = extract_ingredient_info_2(ingredient,trunc_recipe)
            for ingredient_info in ingredient_infos:
                if ingredient_info['name'] in all_ingredients:
                    all_ingredients[ingredient_info['name']].append(trunc_recipe)
                else:
                    all_ingredients[ingredient_info['name']] = [trunc_recipe]
                all_recipes[trunc_recipe]['ingredients'].append(ingredient_info)
    return all_recipes,all_ingredients

# print(str.join('\n',[all_ingredients[ingredient][0]['name'] for ingredient in all_ingredients]))
# print(all_ingredients['salt'])

# print(extract_ingredient_info_2('1 (3 pound) whole chicken, cut into pieces'))

if __name__ == '__main__':
    all_recipes,all_ingredients = process_scraper_file('recipes_pages_1_to_10')
    _ingredients = sys.argv[1:]
    print('\n\nRecipes Containing: \'{}\'\n\n'.format(str.join('\' and \'',_ingredients)))
    recipe_list = [info for _ingredient in _ingredients for info in all_ingredients[singularize(_ingredient)]]
    recipe_counter = dict()
    for recipe in recipe_list:
        if recipe in recipe_counter:
            recipe_counter[recipe] = recipe_counter[recipe] + 1
        else:
            recipe_counter[recipe] = 1
    search_results = [str(_recipe[0]) + '\n' if _recipe[1] > len(sys.argv)-2 else '' for _recipe in recipe_counter.items()]
    print(str.join('',search_results))
# print(str.join('\n',[_ingredient for _ingredient in all_ingredients]))
# print(str.join('\n',[str([categorize_token(_token) for _token in _ingredient['og'].split()]) for _ingredient in all_recipes['Dijon Pork with Apples and Cabbage Recipe']['ingredients']]))
# print(str.join('\n',[str(_ingredient) for _ingredient in all_recipes['Spinach Tomato Tortellini Recipe']['ingredients']]))







