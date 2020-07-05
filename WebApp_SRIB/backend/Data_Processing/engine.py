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
def Get_Sensor_Data (len_,sz_,sensor_id,res_,log_count):
    data_ind = Generate_Randoms(len_,0,sz_-1)
    cnt=0
    for i in data_ind:
        cnt = cnt + 1
        s = 'data/'+sensor_id+str(i)+'.txt'
        name = sensor_id+ str(cnt)
        print(s)
        data_part=np.loadtxt(s, delimiter="\t", skiprows=1)
        num=random.randint(0,len(data_part)-2*log_count-1)
        # print(num)
        data_to_load=[]
        for i in range (num,num+2*log_count):
            data_to_load.append(data_part[i])
        final_data=[]
        for j in data_to_load:
            list_1=[]
            list_1.append(j[0])
            list_1.append(str(name))
            list_1.append(j[2])
            final_data.append(list_1)
        res_.append(final_data)

#function for generating time stamps from time difference
def is_leap (year):
    if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
        return True
    return False

day={}
day[1] = 31
day[2] = 28
day[3] = 31
day[4] = 30
day[5] = 31
day[6] = 30
day[7] = 31
day[8] = 31
day[9] = 30
day[10] = 31
day[11] = 30
day[12] = 31
day_leap=day
day_leap[2]=29

def Generate_Time_Stamp(diff, pre_stamp): # pre stamp is a list of numbers in format [dd,mm,yy,hr,mn,sec]
    val = math.floor(diff)
    for i in range(val):
        if pre_stamp[5]<59:
            pre_stamp[5]=pre_stamp[5]+1
        else:
            pre_stamp[5]=0
            if (pre_stamp[4])<59:
                pre_stamp[4]=pre_stamp[4]+1
            else:
                pre_stamp[4]=0
                if pre_stamp[3]<23:
                    pre_stamp[3]=pre_stamp[3]+1
                else:
                    pre_stamp[3]=0
                    if is_leap(pre_stamp[2]):
                        if pre_stamp[0]<day[pre_stamp[1]]:
                            pre_stamp[0]=pre_stamp[0]+1
                        else:
                            pre_stamp[0]=1
                            if pre_stamp[1]<12:
                                pre_stamp[1]=pre_stamp[1]+1
                            else:
                                pre_stamp[1]=1
                                pre_stamp[2]=pre_stamp[2]+1
                    else:
                        if pre_stamp[0]<day_leap[pre_stamp[1]]:
                            pre_stamp[0]=pre_stamp[0]+1
                        else:
                            pre_stamp[0]=1
                            if pre_stamp[1]<12:
                                pre_stamp[1]=pre_stamp[1]+1
                            else:
                                pre_stamp[1]=1
                                pre_stamp[2]=pre_stamp[2]+1
    pre_stamp[5]=pre_stamp[5]+diff-val
    return pre_stamp

def Generate_Data(tup,start_date,D_size,M_size,T_size,log_count=1000):

    no_of_users = tup[1]

    len_D = tup[2]
    len_M = tup[3]
    len_T = tup[4]

    res_T = []
    res_M = []
    res_D = []
    # Temperature Sensor
    Get_Sensor_Data(len_T,T_size,'T',res_T,log_count)

    # Motion Sensor
    Get_Sensor_Data(len_M,M_size,'M',res_M,log_count)

    # Door Sensor
    Get_Sensor_Data(len_D,D_size,'D',res_D,log_count)

    Final_res = []

    # length = max(len(res_T), len(res_M), len(res_D))

    for i in range(2*log_count):

        for j in res_T:
            Final_res.append(j[i])
        for j in res_M:
            Final_res.append(j[i])
        for j in res_D:
            Final_res.append(j[i])

    user_id = random.sample(range(10000000, 99999999), no_of_users)

    outF = open('output.csv', "w")
    # print (len(Final_res))
    for i in range(no_of_users):
        pre_stamp = start_date
        Random_ind = random.sample(range(1, len(Final_res)-1), log_count)
        s = 'USER_ID#'+str(user_id[i])
        outF.write(s)
        outF.write('\n')
        cnt=0
        for ind in Random_ind:
            for line in Final_res[ind]:
                stamp = ''
                if line==Final_res[ind][0]:
                    cnt=cnt+1
                    # print(cnt)
                    if cnt>1:
                        # print('line')
                        # print(line)
                        pre_stamp = Generate_Time_Stamp(line, pre_stamp)
                    # outF.write((str)(pre_stamp[0]))
                    stamp = (str)(pre_stamp[0])+'-'+(str)(pre_stamp[1])+'-'+(str)(pre_stamp[2])
                    stamp2 = (str)(pre_stamp[3])+'-'+(str)(pre_stamp[4])+'-'+(str)(pre_stamp[5])
                    # print(stamp)
                    outF.write(stamp)
                    outF.write(',')
                    outF.write(stamp2)
                    outF.write(',')
                else:
                    outF.write(str(line))
                    outF.write(',')
            outF.write('\n')
        outF.write('\n')
    outF.close()