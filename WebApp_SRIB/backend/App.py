# using flask_restful 
from flask import Flask, jsonify, request, send_file
from flask_restful import Resource, Api 

import sys
sys.path.insert(1, './Data_Processing')
#print(sys.path)
from Data_Processing.main import handleNLUoutput

# creating the flask app 
app = Flask(__name__) 
# creating an API object 
api = Api(app) 

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response



##############################################################################################

import numpy as np

def handleQuery(postedData):

	if postedData["query"]==0:
		tup = (1, postedData["userFreq"], postedData["doorSensors"], postedData["motionSensors"], postedData["tempSensors"])

	else:
		input_string=postedData["query"]
		sys.path.insert(1, './chatbot')
		from nlu import process 
		tup=(1,10,5,5,5)
		tupp = process(input_string)
		if not tupp[0]:
			tup=tupp[1]

	handleNLUoutput(tup)
	filePath = 'output.csv'
	return filePath




def generateGraphData():

	dataX = np.loadtxt('data/CASAS_aruba_data_continuous_sensorT005.csv', delimiter = ",",skiprows = 1)
	dataX_hat = []
	total = 0
	for i in range(dataX.shape[0]):
		row = {'time':dataX[i,0]+total, 'value':dataX[i,1]}

		total = row['time']

		dataX_hat.append(row)

	return dataX_hat

##############################################################################################




# making a class for a particular resource 
# the get, post methods correspond to get and post requests 
# they are automatically mapped by flask_restful. 
# other methods include put, delete, etc. 
class Hello(Resource): 

	# corresponds to the GET request. 
	# this function is called whenever there 
	# is a GET request for this resource 
	def get(self): 

		return jsonify({'message': 'hello world, how are you'}) 

	# Corresponds to POST request 
	def post(self): 
		
		data = request.get_json()	 
		#return jsonify({'data': data})
		return jsonify({"data":data})


# another resource to calculate the square of a number 
class Square(Resource): 

	def get(self, num): 

		return jsonify({'square': num**2}) 


class Simulate(Resource):

	def post(self):
		
		postedData = request.get_json()

		filePath = handleQuery(postedData)

		return send_file(filePath,
                     mimetype='text/csv',
                     attachment_filename='Output.csv',
                     as_attachment=True)

class GraphData(Resource):

	def post(self):

		postedData = request.get_json()
		query = postedData["query"]

		arr = generateGraphData()
		return jsonify({"logs":arr})


# adding the defined resources along with their corresponding urls 
api.add_resource(Hello, '/') 
api.add_resource(Square, '/square/<int:num>') 
api.add_resource(Simulate, '/simulate')
api.add_resource(GraphData, '/graphdata')


# driver function 
if __name__ == '__main__': 

	app.run(debug = False) 
