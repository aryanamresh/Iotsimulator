'''
2019 NeurIPS Submission
Title: Time-series Generative Adversarial Networks
Authors: Jinsung Yoon, Daniel Jarrett, Mihaela van der Schaar

Last Updated Date: May 29th 2019
Code Author: Jinsung Yoon (jsyoon0823@gmail.com)

-----------------------------

Main Function
- Import Dataset
- Generate Synthetic Dataset
- Evaluate the performances in three ways
(1) Visualization (t-SNE, PCA)
(2) Discriminative Score
(3) Predictive Score

Inputs
- Dataset
- Network Parameters

Outputs
- time-series synthetic data
- Performances
(1) Visualization (t-SNE, PCA)
(2) Discriminative Score
(3) Predictive Score
'''

#%% Necessary Packages

import numpy as np
import sys

#%% Functions
# 1. Models
from tganWithCheckpointing import tgan

# 2. Data Loading
from data_loading import CASAS_data_loading

# 3. Metrics
sys.path.append('metrics')
from discriminative_score_metrics import discriminative_score_metrics
from visualization_metrics import PCA_Analysis, tSNE_Analysis
from predictive_score_metrics import predictive_score_metrics


#%% Main Parameters
# Data
data_set = ['casas']
data_name = data_set[0]

# Experiments iterations
Iteration = 1
Sub_Iteration = 3

#%% Data Loading
seq_length = 24

if data_name == 'casas':
    dataX = CASAS_data_loading(seq_length)

print(data_name + ' dataset is ready.')


#%% Newtork Parameters
parameters = dict()

parameters['checkpointFileName'] = "checkpoint.chk"  #for saving model weights and biases

parameters['hidden_dim'] = len(dataX[0][0,:]) * 4
parameters['num_layers'] = 3
parameters['iterations'] = 50001
parameters['batch_size'] = 128
parameters['module_name'] = 'gru'   # Other options: 'lstm' or 'lstmLN'
parameters['z_dim'] = len(dataX[0][0,:]) 

print('Parameters are ' + str(parameters))

#%% Experiments
# Output Initialization
Discriminative_Score = list()
Predictive_Score = list()



def MinMaxScaler(dataX):
    
    min_val = np.min(np.min(dataX, axis = 0), axis = 0)
    dataXNorm = dataX - min_val
    
    max_val = np.max(np.max(dataXNorm, axis = 0), axis = 0)
    dataXNorm = dataXNorm / (max_val + 1e-7)
    
    return dataXNorm, min_val, max_val




print('Start iterations') 
    
# Each Iteration
for it in range(Iteration):
    
    # Synthetic Data Generation
    dataX_hat = tgan(dataX, parameters)
    
    dataXNorm, min_val_dataX, max_val_dataX = MinMaxScaler(dataX)
    dataX_hatNorm, min_val_dataX_hat, max_val_dataX_hat = MinMaxScaler(dataX_hat)
      
    print('Finish Synthetic Data Generation')

    #%% Performance Metrics
    
    # 1. Discriminative Score
    Acc = list()
    for tt in range(Sub_Iteration):
        Temp_Disc = discriminative_score_metrics (dataXNorm, dataX_hatNorm)
        Acc.append(Temp_Disc)
    
    Discriminative_Score.append(np.mean(Acc))
    
    # 2. Predictive Performance
    MAE_All = list()
    for tt in range(Sub_Iteration):
        MAE_All.append(predictive_score_metrics (dataXNorm, dataX_hatNorm))
        
    Predictive_Score.append(np.mean(MAE_All))    
    
print('Finish TGAN iterations')

        
#%% 3. Visualization
PCA_Analysis (dataXNorm, dataX_hatNorm)
tSNE_Analysis (dataXNorm, dataX_hatNorm)

# Print Results
print('Discriminative Score - Mean: ' + str(np.round(np.mean(Discriminative_Score),4)) + ', Std: ' + str(np.round(np.std(Discriminative_Score),4)))
print('Predictive Score - Mean: ' + str(np.round(np.mean(Predictive_Score),4)) + ', Std: ' + str(np.round(np.std(Predictive_Score),4)))


#Rounding off the device ids and their values
dataX_hat[:,:,1:] = np.round(dataX_hat[:,:,1:])

#Combining all samples
allSamples = [dataX_hat[i,j,:] for i in range(dataX_hat.shape[0]) for j in range(dataX_hat.shape[1])]
allSamples = np.array(allSamples)

#For sorting allSamples on the basis of time
sortedIndex = allSamples[:,0].argsort()
allSamples = allSamples[sortedIndex]

#For saving the generated data as csv file
np.savetxt("output.csv", allSamples, delimiter=",")