import numpy as np
import random
import math
from engine import *

def handleNLUoutput(tup):
    #Give input tuple as tup
    # elements of tuple
    # tup[0]-> whether to generate data or not
    # tup[0]-> number of users
    # tup[0]-> number of Door sensors
    # tup[0]-> number of Motion sensors
    # tup[0]-> number of Temperature sensors

    #tup = (1, 10,5,5,0)

    D_size=1 #number of Door sensors for which data is available
    M_size=5 #number of Motion sensors for which data is available
    T_size=5 #number of Temperature sensors for which data is available


    Generate_Data(tup,D_size,M_size,T_size)
    # return '/output.csv'
