#! /usr/bin/env python3

import pickle
import re
import string
from fractions import Fraction
import sys
import inflect

p = inflect.engine()

def save_obj(obj, name):
    with open('obj/'+ name + '.pkl', 'wb') as f:
        pickle.dump(obj, f, pickle.HIGHEST_PROTOCOL)

def load_obj(name ):
    with open('obj/' + name + '.pkl', 'rb') as f:
        return pickle.load(f)

recipes = load_obj('recipes_pages_1_to_10')

units = set(['cup','clove','tablespoon','teaspoon','ounce','halves','half','pint','pound',
'package','head','can','packet','taste','envelope','jar','container','dash','bottle',
'small','medium','large','stalk','quart'])


numeric_regex = re.compile('\d')
punctuation_strip = str.maketrans(dict.fromkeys(string.punctuation.replace('-.','')))

test_recipe = 'Baked Teriyaki Chicken Recipe - Allrecipes.com'

modifier_list = set(['skinless','boneless','fresh','hot','cold','raw','black','dry'])
modifier_exclude = {'half-and-half'}
vowel_unmatch = '(?<![aeou]|^r)'
find_verb = re.compile('({}ed|ground|{}(?<![hk])en|ly$|.+-.+)$'.format(vowel_unmatch,vowel_unmatch))
def is_modifier(token):
    return token not in modifier_exclude and (find_verb.search(token) or token in modifier_list)


paren_regex = re.compile('\(|\)')
def is_paren(token):
    return paren_regex.search(token)

tr_regex = re.compile('^to$|^and$|^for$|,$|^-$|^with$')
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
    return float(Fraction(token))

# def extract_ingredient_info_2(ingredient_string):
#     print('\n' + ingredient_string)
#     sanitized = re.sub(r'[^\x00-\x7f]',r'', ingredient_string.translate(punctuation_strip).lower()).split()
#     raw_split = re.sub(r'[^\x00-\x7f]',r'', ingredient_string.lower()).split()

#     # numeric_tokens = [True if is_numeric(token) else False for token in raw_split]
#     # unit_tokens    = [True if is_unit(token) else False for token in sanitized]
#     # trigger_tokens = [True if is_trigger(token) else False for token in raw_split]
#     # modifier_tokens= [i if is_modifier(sanitized[i-1]) else 0 for i in range(1,len(sanitized)+1)]
#     # paren_token    = [True if is_paren(token) else False for token in raw_split]

#     info = {'name':None,'amount':{'unit':None,'measurement':0,'alt':[]},'modifiers':[],'og':[]}
#     # use a state system to parse ingredients
#     MMT_STATE = 0 # state 0: parse amount
#     ING_STATE = 1 # state 1: parse ingredient and modifiers

#     END_STATE = -1

#     state = MMT_STATE # start off looking for a measurement
#     i = 0

#     in_parenthesis = -1 # track if we are inside a parenthetical statement
#     marker = -1
#     or_switch = False
#     and_switch = False
#     adverb_switch = ''
#     paren_switch = False
#     comma_switch = False
#     while(i < len(raw_split)):
#         token = raw_split[i]
#         clean_token = singularize(sanitized[i])
#         # check token and change state if necessary
#         if clean_token == 'or':
#             or_switch = True
#             continue
#         elif clean_token == 'and':
#             and_switch = True
#             continue

#         if is_paren(token):
#             if in_parenthesis == -1:
#                 in_parenthesis = i
#                 continue
#             else: # close off parenthetical block
#                 # group the block and treat the whole this as a 'token'
#                 token = str.join(' ',sanitized[in_parenthesis:i+1]) 
#                 paren_switch = True # set the parenthesis switch for anyone who cares
#                 in_parenthesis = -1 # no longer in block
        
#         if in_parenthesis != -1:
#             continue #dont process this token
#         if is_unit(singularize(token)):
#             info['unit'] = clean_token
#             # if sanitized[i+1] != 'or': # move to ingredient parse state if no more measurement info found
#             #     state = ING_STATE
#             # else:
#             # i = i + 1 # skip the or token
#         if state == MMT_STATE: # looking for a measurement
#             if is_numeric(token):
#                 info['amount']['measurement'] = read_fraction(token) + info['amount']['measurement']
#                 state = ING_STATE
#             else:
#                 info['amount']['alt'].append(token)
#         elif state == ING_STATE:
#             if is_modifier(clean_token) or paren_switch: # check if adverb
#                 if clean_token[-2:-1] == 'ly':
#                     adverb_switch = clean_token + ' '
#                 else: # regular verb
#                     # append the adverb switch if there is one
#                     info['modifiers'].append(adverb_switch + clean_token)
#                     adverb_switch = ''
#                 paren_switch = False # consume the paren_switch if there is one
#             else: # part of the core ingredient name
#                 if marker == -1:
#                     marker = i
#                 if token[-1] == ',':
#                     if comma_switch:
#                         info['modifiers'].append(sanitized[marker:i+1])
#                     else:
#                         info['name'] = str.join(' ',sanitized[marker:i+1])
#                     marker = i
#         i = i + 1
#     final_string = str.join(' ',sanitized[marker:i])
#     if final_string:
#         if comma_switch:
#             info['modifiers'].append(final_string)
#         else:
#             info['name'] = final_string

#     print(info['name'])
#     return [info]


def extract_ingredient_info(ingredient_string):
    # print('\n' + ingredient_string)
    sanitized = re.sub(r'[^\x00-\x7f]',r'', ingredient_string.translate(punctuation_strip).lower()).split()
    raw_split = re.sub(r'[^\x00-\x7f]',r'', ingredient_string.lower()).split()
    ing_name = [];
    counter = 0
    triggered = False

    numeric_tokens = [True if is_numeric(token) else False for token in raw_split]
    unit_tokens    = [True if is_unit(token) else False for token in sanitized]
    trigger_tokens = [True if is_trigger(token) else False for token in raw_split]
    modifier_tokens= [i if is_modifier(sanitized[i-1]) else 0 for i in range(1,len(sanitized)+1)]
    paren_token    = [True if is_paren(token) else False for token in raw_split]

    # find pairs of parenthesis
    toggle = 0
    for i in range(0,len(paren_token)):
        if paren_token[i]:
            if not toggle:
                toggle = i
                modifier_tokens[i] = i
            else:
                modifier_tokens[i] = toggle
                toggle = 0
        elif toggle:
            modifier_tokens[i] = toggle

    toggle = 0
    modifier_strings = []
    modifier_string  = []
    measurement = 0
    unit = ''
    ingredient_string_tokens = []
    ingredient_final = ''
    for i in range(0,len(paren_token)):
        if triggered:
            if trigger_tokens[i] and modifier_string:
                modifier_strings.append(str.join(' ',modifier_string))
                modifier_string = []
                if sanitized[i] != 'and':
                    modifier_tokens[i] = toggle
            else:
                modifier_tokens[i] = toggle
        if trigger_tokens[i] and not modifier_tokens[i]: 
            # print('[' + raw_split[i] + ']' + raw_split[i][-1])   
            if raw_split[i][-1] == ',':
                # print('got here')
                ingredient_string_tokens.append(sanitized[i])
            triggered = True
            toggle = i+1
            if modifier_string:
                modifier_strings.append(str.join(' ',modifier_string))
                modifier_string = []
        elif modifier_tokens[i]:
            if modifier_tokens[i] == toggle:
                modifier_string.append(sanitized[i])
            else:
                if modifier_string:
                    modifier_strings.append(str.join(' ',modifier_string))
                modifier_string = [sanitized[i]]
                toggle = modifier_tokens[i]
        elif numeric_tokens[i] and sanitized[i].isdigit():
            measurement = float(Fraction(raw_split[i])) + measurement
        elif unit_tokens[i]:
            unit = sanitized[i]
        elif not ingredient_final:
            ingredient_string_tokens.append(sanitized[i])


    if modifier_string:
        modifier_strings.append(str.join(' ',modifier_string))

    ingredient_final = singularize(str.join(' ',ingredient_string_tokens))



    # print(ingredient_final)
    # print(raw_split)
    # print('modifier: ' + str(modifier_tokens))
    # print('numeric: '  + str(numeric_tokens))
    # print('paren: '    + str(paren_token))
    ingredient = {'original':ingredient_string,
        'name':ingredient_final,
        'amount':{'measurement':measurement,'unit':unit},
        'modifiers':modifier_strings}
    # print(ingredient)
    return ingredient

# extract_ingredient_info(recipes[test_recipe]['ingredients'][8])
all_ingredients = {}
all_recipes = {}
for recipe in recipes:
    trunc_recipe = recipe[0:-17]
    all_recipes[trunc_recipe] = {'directions':recipes[recipe]['directions'],'ingredients':[]}
    for ingredient in recipes[recipe]['ingredients']:
        ingredient_info = extract_ingredient_info(ingredient)
        ingredient_info['recipe'] = trunc_recipe
        if ingredient_info['name'] in all_ingredients:
            all_ingredients[ingredient_info['name']].append(ingredient_info)
        else:
            all_ingredients[ingredient_info['name']] = [ingredient_info]
        all_recipes[trunc_recipe]['ingredients'].append(ingredient_info)

# print([all_ingredients['vegetable oil']])
_ingredients = sys.argv[1:]
print('\n\nRecipes Containing: \'{}\'\n\n'.format(str.join('\' and \'',_ingredients)))
recipe_list = [info['recipe'] for _ingredient in _ingredients for info in all_ingredients[singularize(_ingredient)]]
recipe_counter = dict()
for recipe in recipe_list:
    if recipe in recipe_counter:
        recipe_counter[recipe] = recipe_counter[recipe] + 1
    else:
        recipe_counter[recipe] = 1
print(str.join('',[_recipe[0] + '\n' if _recipe[1] > len(sys.argv)-2 else '' for _recipe in recipe_counter.items()]))
print(str.join('\n',[_ingredient for _ingredient in all_ingredients]))
print(all_ingredients['thai chili sauce or sauce'])







