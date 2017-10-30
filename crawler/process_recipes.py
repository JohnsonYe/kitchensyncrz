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
'package','head','can','packet','taste','envelope','jar','container','dash','bottle',
'small','medium','large','stalk','quart'])

special = set(['sauce'])

counter = 0
numeric_regex = re.compile('\d')
punctuation_strip = str.maketrans(dict.fromkeys(string.punctuation.replace('-.','')))
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

modifier_list = set(['skinless','boneless','fresh','hot','cold','raw','black','dry'])
modifier_total = 0;
vowel_unmatch = '(?<![aeou]|^r)'
find_verb = re.compile('({}ed|ground|{}(?<![hk])en|ly$|.+-.+)$'.format(vowel_unmatch,vowel_unmatch))

test_recipe = 'Baked Teriyaki Chicken Recipe - Allrecipes.com'

modifier_exclude = {'half-and-half'}

for ingredient in ingredient_word_list:
    if find_verb.search(ingredient) and ingredient not in modifier_exclude:
        modifier_list.add(ingredient)
for modifier in modifier_list:
    # print(modifier + ' : ' + str(find_verb.search(modifier)))
    ingredient_words.pop(modifier)
# print(modifier_list)


all_ingredients = {}

triggers = set(['-','(','to'])
tr_regex = re.compile('^to$|^and$|^for$|,$|^-$|^with$')
paren_regex = re.compile('\(|\)')
articles = set(['or'])
adverb = re.compile('ly$')

# need processing for 'and' and 'or' modifiers
# better comma processing


def extract_ingredient_info(ingredient_string):
    print('\n' + ingredient_string)
    sanitized = re.sub(r'[^\x00-\x7f]',r'', ingredient_string.translate(punctuation_strip).lower()).split()
    raw_split = re.sub(r'[^\x00-\x7f]',r'', ingredient_string.lower()).split()
    ing_name = [];
    counter = 0
    triggered = False

    numeric_tokens = [True if numeric_regex.search(token) else False for token in raw_split]
    unit_tokens = [True if (token in units or token[0:-1] in units) else False for token in sanitized]
    trigger_tokens = [True if tr_regex.search(token) else False for token in raw_split]
    modifier_tokens= [i if sanitized[i-1] in modifier_list else 0 for i in range(1,len(sanitized)+1)]
    paren_token = [True if paren_regex.search(token) else False for token in raw_split]

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
            print('[' + raw_split[i] + ']' + raw_split[i][-1])   
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

    ingredient_final = str.join(' ',ingredient_string_tokens)


    # print(ingredient_final)
    # print(raw_split)
    print('modifier: ' + str(modifier_tokens))
    print('numeric: '  + str(numeric_tokens))
    print('paren: '    + str(paren_token))
    ingredient = {'original':ingredient_string,
        'ingredient':ingredient_final,
        'amount':{'measurement':measurement,'unit':unit},
        'modifiers':modifier_strings}
    print(ingredient)
    return ingredient

# extract_ingredient_info(recipes[test_recipe]['ingredients'][8])
all_ingredients = {}
for recipe in recipes:
    for ingredient in recipes[recipe]['ingredients']:
        ingredient_info = extract_ingredient_info(ingredient)
        if ingredient_info['ingredient'] in all_ingredients:
            all_ingredients[ingredient_info['ingredient']].append(ingredient_info)
        else:
            all_ingredients[ingredient_info['ingredient']] = [ingredient_info]

print([all_ingredients.keys()])
# print([all_ingredients['']])







