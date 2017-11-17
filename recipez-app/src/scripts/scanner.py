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


# client = boto3.client('dynamodb',region_name='us-east-2')
# save_obj([item['Name']['S'] for item in client.scan(TableName='Ingredients',AttributesToGet=['Name'])['Items']],'keys')
with open('ingredient.csv','w') as file:
    file.write(str.join(',',load_obj('keys')))
