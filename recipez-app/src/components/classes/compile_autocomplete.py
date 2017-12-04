#! /usr/bin/env python
import boto3
import sys
import subprocess
import zipfile

if(len(sys.argv) < 2):
    raise ValueError('No table specified')

tableName = sys.argv[1]
keyField = sys.argv[2] if len(sys.argv)>2 else 'Name'
client = boto3.client('dynamodb',region_name='us-east-2')
# get a list of database keys using scan
key_list = [item[keyField]['S'] for item in client.scan(TableName=tableName,AttributesToGet=[keyField])['Items']]
with open(tableName+'.csv','w') as file:
    file.write(str.join(',',key_list))

subprocess.call(['node','AutocompleteBuilder.js',tableName])

# with open(tableName+'.tst','r')
with zipfile.ZipFile(tableName+'.zip','w') as myzip:
    myzip.write(tableName+'.tst')

with open(tableName+'.zip','rb') as file:
    compressed_tree = file.read()
    client.put_item(TableName='Miscellaneous',Item={'Name':{'S':tableName+'Tree'},'Data':{'B':compressed_tree}})
    # print(ingredient_tree)