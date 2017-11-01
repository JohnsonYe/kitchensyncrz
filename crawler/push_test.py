#! /usr/bin/env python3
import boto3
import json

print('Hello World!')

client = boto3.client('dynamodb',region_name='us-east-2')
print(client.describe_table(TableName='URLs'))
# recipe_list = {'recipe list':{'SS':['first recipe']}}
# update_expression = 'ADD #L + :L'
# expression_attribute_names = {'#L':'recipe list'}
# expression_attribute_values = {':L':{'SS':['first recipe']}}
# my_item = {'Ingredient ID':{'S':'hello'},'Ingredient name':{'S':'world'}}
# client.update_item(TableName='Ingredient',Key=my_item,
#     UpdateExpression=update_expression,ExpressionAttributeNames=expression_attribute_names,
#     ExpressionAttributeValues=expression_attribute_values)
# client = boto3.client('us-east-2')