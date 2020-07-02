'''
2019 NeurIPS Submission
Title: Time-series Generative Adversarial Networks
Authors: Jinsung Yoon, Daniel Jarrett, Mihaela van der Schaar

Last Updated Date: May 29th 2019
Code Author: Jinsung Yoon (jsyoon0823@gmail.com)

-----------------------------

Data loading
(1) Load CASAS aruba dataset
- Transform the raw data to preprocessed data

Inputs
(1) CASAS aruba dataset
- Raw data
- seq_length: Sequence Length

Outputs
- time-series preprocessed data
'''

#%% Necessary Packages
import numpy as np

#%% Min Max Normalizer

def MinMaxScaler(data):
    numerator = data - np.min(data, 0)
    denominator = np.max(data, 0) - np.min(data, 0)
    return numerator / (denominator + 1e-7)




# Load CASAS aruba dataset
def CASAS_data_loading (seq_length):

    # Load CASAS Data
    x = np.loadtxt('data/CASAS_aruba_data.csv', delimiter = ",",skiprows = 1)
    
    # Build dataset
    dataX = []
    
    # Cut data by sequence length
    for i in range(0, len(x) - seq_length):   #reduced data size
        _x = x[i:i + seq_length]
        dataX.append(_x)
        
        
        
    print("No. of sequences : ", len(dataX))
    
    
        
    # Mix Data (to make it similar to i.i.d)
    idx = np.random.permutation(len(dataX))
    
    outputX = []
    for i in range(len(dataX)):
        outputX.append(dataX[idx[i]])
    
    return outputX

