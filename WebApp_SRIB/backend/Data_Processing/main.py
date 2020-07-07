import numpy as np
import random
import math
from engine import *

#Give input tuple as tup
# elements of tuple
# tup[0]-> 0 for CGAN, 1 for TGAN
# tup[1]-> number of users
# tup[2]-> number of Door sensors
# tup[3]-> number of Motion sensors
# tup[4]-> number of Temperature sensors

# tup = (1, 10,5,10,15)
def handleNLUoutput(tup):   
    D_size_TGAN=1 #number of Door sensors for which data is available
    M_size_TGAN=5 #number of Motion sensors for which data is available
    T_size_TGAN=5 #number of Temperature sensors for which data is available

    D_size_CGAN=1 #number of Door sensors for which data is available
    M_size_CGAN=8 #number of Motion sensors for which data is available
    T_size_CGAN=5 #number of Temperature sensors for which data is available

    log_count = 1000 #number of logs required for a particular user should not exceed 2500 as of now
    start_date = [6,7,2020,14,50,20.5] # start_date is a list of numbers in format [dd,mm,yy,hr,mn,sec]

    if tup[0]==1:
        Generate_Data(tup,start_date,D_size_TGAN,M_size_TGAN,T_size_TGAN,log_count)
    else:
        Generate_Data(tup,start_date,D_size_CGAN,M_size_CGAN,T_size_CGAN,log_count)
    # return '/output.csv'
# handleNLUoutput(tup)