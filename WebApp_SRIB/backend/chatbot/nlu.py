from rasa.core.agent import Agent
from rasa.core.interpreter import RasaNLUInterpreter
import asyncio
interpreter = RasaNLUInterpreter("/home/pulkit/bot/chatbot/models/nlu")
agent = Agent.load("/home/pulkit/bot/chatbot/models/20200706-002358.tar.gz",interpreter=interpreter)
async def inter(str):
    a=await agent.handle_text(str)
    # b=await interpreter.parse(str)
    c=await agent.parse_message_using_nlu_interpreter(str)
    # return (a,b,c)
    # return a,c
    first = a[0]['text']
    if not first or first[0]=='1':
        first=None
    second = None
    if not first :
        users = "100 users"
        ms = "10 motion"
        ds = "10 door"
        ts = "10 temperature"
        for x in c['entities'] :
            if x['extractor']=='CRFEntityExtractor' :
                if x['entity'] == "users" :
                    users = x['value']
                elif x['entity'] == "ms" :
                    ms = x['value']
                elif x['entity'] == "ds" :
                    ds = x['value']
                elif x['entity'] == "ts" :
                    ts = x['value']
        users = int(users.split(maxsplit=1)[0])
        ds = int(ds.split(maxsplit=1)[0])
        ms = int(ms.split(maxsplit=1)[0])
        ts = int(ts.split(maxsplit=1)[0])
        second=(1,users,ds,ms,ts)

    return first , second

# from rasa_nlu.model import Interpreter
# nlu_model = Interpreter.load('/home/pulkit/bot/chatbot/models/nlu')
# from asgiref.sync import async_to_sync
# print(a)
# @async_to_sync
# import asyncio
# async def inter (s):
#     a= await interpreter.parse(s)
#     return a

def process(str):

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(inter(str))
    return result

# str="Print IoT data for  100 temperature sensors "
# print(str)
# print(process(str))
# str= "Hello chatboot"
# print(str)
# print(process(str))
# str= "Good Bye"
# print(str)
# print(process(str))




