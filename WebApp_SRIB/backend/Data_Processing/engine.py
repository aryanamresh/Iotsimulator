import numpy as np
import random
import math

#function for generating random numbers
def Generate_Randoms(num, start = 1, end = 10000):
    arr = []

    for x in range(num):
        tmp = random.randint(start, end)
        arr.append(tmp)

    # arr.sort()
    return arr

# This function generates data for a particular sensor
def Get_Sensor_Data (len_,sz_,sensor_id,res_):
    data_ind = Generate_Randoms(len_,0,sz_-1)
    for i in data_ind:
        s = 'Data_Processing/data/'+sensor_id+str(i)+'.txt'
        name = sensor_id+ str(i)
        #print(s)
        data_part=np.loadtxt(s, delimiter="\t", skiprows=1)
        num=random.randint(0,len(data_part)-1001)
        #print(num)
        data_to_load=[]
        for i in range (num,num+1000):
            data_to_load.append(data_part[i])
        final_data=[]
        for j in data_to_load:
            list_1=[]
            list_1.append(j[0])
            list_1.append(str(name))
            list_1.append(j[2])
            final_data.append(list_1)
        res_.append(final_data)

#function for generating time stamps from cumulative time
def Generate_Time_Stamp(diff, pre_stamp):
    stamp ='s'
    return stamp


def Generate_Data(tup,D_size,M_size,T_size):

    no_of_users = tup[1]
    # if no_of_users>900000 or no_of_device==0 or device_type<no_of_device:
    # Exception
    len_D = tup[2]
    len_M = tup[3]
    len_T = tup[4]

    res_T = []
    res_M = []
    res_D = []
    # Temperature Sensor
    Get_Sensor_Data(len_T,T_size,'T',res_T)

    # Motion Sensor
    Get_Sensor_Data(len_M,M_size,'M',res_M)

    # Door Sensor
    Get_Sensor_Data(len_D,D_size,'D',res_D)

    Final_res = []

    # length = max(len(res_T), len(res_M), len(res_D))

    for i in range(1000):

        for j in res_T:
            Final_res.append(j[i])
        for j in res_M:
            Final_res.append(j[i])
        for j in res_D:
            Final_res.append(j[i])

    user_id = random.sample(range(100000, 999999), no_of_users)

    outF = open('output.csv', "w")
    # print (len(Final_res))
    for i in range(no_of_users):
        Random_ind = random.sample(range(1, len(Final_res)-1), 1000)
        s = 'USER_ID#'+str(user_id[i])
        outF.write(s)
        outF.write('\n')
        for ind in Random_ind:
            for line in Final_res[ind]:
                outF.write(str(line))
                # if x!=line[0]:
                    # outF.write(str(x))
                # else:
                    # outF.write(Generate_Time_Stamp(line[0],pre))
                outF.write(',')
            outF.write('\n')
        outF.write('\n')
    outF.close()