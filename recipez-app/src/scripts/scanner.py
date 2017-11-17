#! /usr/bin/env python
import boto3
import pickle

print('Hello World!')

def save_obj(obj, name):
    with open('obj/'+ name + '.pkl', 'wb') as f:
        pickle.dump(obj, f, pickle.HIGHEST_PROTOCOL)

def load_obj(name ):
    with open('obj/' + name + '.pkl', 'rb') as f:
        return pickle.load(f)


client = boto3.client('dynamodb',region_name='us-east-2')
# save_obj([item['Name']['S'] for item in client.scan(TableName='Ingredients',AttributesToGet=['Name'])['Items']],'keys')
# with open('ingredient.csv','w') as file:
#     file.write(str.join(',',load_obj('keys')))
# with open('../components/classes/Ingredient.zip','rb') as file:
#     ingredient_tree = file.read()
#     client.put_item(TableName='Miscellaneous',Item={'Name':{'S':'IngredientTree'},'Data':{'B':ingredient_tree}})
#     print(ingredient_tree)
with open('../components/classes/Ingredient_tst.zip','wb') as file:
    file.write(client.get_item(TableName='Miscellaneous',Key={'Name':{'S':'IngredientTree'}})['Item']['Data']['B'])
    