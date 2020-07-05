import numpy as np
import random
import math
from engine import *

#Give input tuple as tup
# elements of tuple
# tup[0]-> whether to generate data or not
# tup[1]-> number of users
# tup[2]-> number of Door sensors
# tup[3]-> number of Motion sensors
# tup[4]-> number of Temperature sensors

# tup = (1, 1,0,0,1)
def handleNLUoutput(tup):   
    D_size=1 #number of Door sensors for which data is available
    M_size=5 #number of Motion sensors for which data is available
    T_size=5 #number of Temperature sensors for which data is available

    log_count = 1000 #number of logs required for a particular user
    start_date = [4,7,2020,14,50,20.5] # start_date is a list of numbers in format [dd,mm,yy,hr,mn,sec]


    Generate_Data(tup,start_date,D_size,M_size,T_size,log_count)
    # return '/output.csv'
