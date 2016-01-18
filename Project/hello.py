#coding=utf-8


'''
nameA = input("輸入A同學姓名: ")
scoreA = input("輸入A同學分數: ")
nameB = input("輸入B同學姓名: ")
scoreB = input("輸入B同學分數: ")
print("姓名\t分數")
print(nameA+"\t"+scoreA)
print(nameB+"\t"+scoreB)
'''

'''
money = 1000
for i in range(20):
	money *= 1.005
	
print(money)
print(1000*(1.005**20))
'''
'''
speed = 100*128
file = 256*1024
print(file/speed)
'''
'''
str = "PLEASE CONVERT THIS SENTENCE TO LOWER CASE."
print(str.lower())	#變小寫
'''
'''
born = input("出生")
now = input("現在")
age = int(now) - int(born)
print("%d" %age)
'''
'''
card = input("卡號: ")
print("%016d" %int(card))
'''
'''
year = input("年")
month = input("月")
day = input("日")
print("%d.%02d.%02d" %(int(year),int(month),int(day) ) )
'''

'''
test = "I can\n hi\t"
#(arr,arr2) = test.split('.')
arr = test.split()
print(arr)
#print(arr2)
'''

'''
arr = [123, "betty", 123.5, 'c']

for x in arr:
    print(x)
'''

'''
scores = {}
result_f = open("Result.txt")
for line in result_f:
    (name, score) = line.split()
    scores[score] = name
result_f.close()


for key in sorted(scores.keys(), reverse = True):
    print(scores[key] + " " + key)
#test print scores
#print("\n" + scores["7.81"])
'''

'''
def changeBarHelper(variable):
    variable = variable * 2
    return variable


bar = 20
print(bar)
bar = changeBarHelper(bar)
print(bar)
'''

'''
def outer(x, y):
    #def inner(a = x, b = y):
    #    print("1")
    #    return a*b

    #print("2")
    #return inner
    return lambda a = x, b = y: a*b

x = outer(2,4)
print ("output: " + str(x()))
'''

'''
def outer(x):
    fillin = [None]
    def inner(i, self = fillin):
        print(i)
        if i: self[0](i-1)

    fillin[0] = inner
    print("hi")
    inner(x)

print(outer(3))
'''

'''
class ThirdClass:
    def __init__(self, value):
        print("init")
        self.data = value
    def __add__(self, other):
        print("add")
        return ThirdClass(self.data + other)
    def __mul__(self, other):
        print("mul")
        #return ThirdClass(self.data * other)
        return ThirdClass(self.data + other)
    def display(self):
        print('Current value = "%s" ' %self.data)

        

a = ThirdClass("abc")
a.display()
print("----------")
b = a + 'xyz'
b.display()
#print("----------")
#b * 3
#b.display()
print("----------")
c = a*'xyz'
c.display()
'''
'''
import json #內建模組

jsondata = {"responseData": {"translatedText":"hello!"},
            "responseDetails": None,
            "responseStatus": 200}
encodetext = json.dumps(jsondata)
decode = json.loads(encodetext)

print(type(encodetext))
print(encodetext)

print(type(decode))
print(decode)

print(decode['responseData']['translatedText'])
print(decode["responseStatus"])
'''
'''
jsondata = '{"responseData": {"translatedText":"蟒蛇石頭！"}, "responseDetails": null, "responseStatus": 200}'
text = json.loads(jsondata)
print('翻譯結果:',text['responseData']['translatedText'])
'''

'''
num = 5
def change_dict(in_dict):
    global num
    in_dict[str(num)] = 'E'
    num += 1
    print("in: ", in_dict)

dict1 = {'1':'A', '2':'B', '3':'C', '4':'D'}
dict2 = dict()
for num2 in range(0,3):

    change_dict(dict2)
    dict1.update(dict2)

    print(dict2)
    #dict2.clear()

print(dict1)

dict 就算不傳進 function 也可以做修改
只是好像不太建議
'''

'''
dict1 = {'1':'A', '2':'B', '3':'C', '4':'D'}
print(len(dict1))
dict1['5'] = dict1.pop('1')
print(dict1)
print(len(dict1))
'''

'''
import os
import re

url = "/smw/index.php?title=Special:RecentChangesLinked"
str1 = os.path.splitext(url)[-1]
str2 = str1.find("?")
print(str1[:str2])
print(str2)
'''

'''
dict1 = {'1':'A', '2':'B', '3':'C'}
test = dict1.get('4')
print(test)
print(type(test))
'''

'''
file1 = open('test.txt', 'r', encoding='utf-8')
for content in file1.readlines():
    str1 = content

print(str1)
print(len(str1))

write_f = open('test2.txt', 'wb')
write_f.write(str1.encode('utf-8'))

write_f.close()
print("=====")
file2 = open('test2.txt', 'rb')

byte = file2.read(3)
while byte != b'':
    print(byte)
    print(byte.decode('UTF-8'))
    byte = file2.read(3)
'''

'''
str1 = "你給我試試看ㄚㄚㄚㄚ"
file3 = open('test3.txt', 'wb')
file3.write(str1.encode('utf-8'))

file3.close()
print("=====")
file4 = open('test3.txt', 'rb')

byte = file4.read(3)
while byte != b'':
    print(byte)
    print(byte.decode('UTF-8'))
    byte = file4.read(3)
'''

'''
test = "happy birthday"
test2 = test.find("y", 3)
print(test2)

c = "What is real? How do you define real? "
print(c.count("real", 10))
'''

'''
import threading, time

class Thread (threading.Thread): # 繼承 Thread 類別
       def __init__(self, no, interval):
              threading.Thread.__init__(self)
              self.no = no
              self.interval = interval

       def run(self):
           global test1
           test1()
           time.sleep(self.interval)
           print('Thread '+str(self.no))

def test1():
    print("hi")

source = "test"

def test():
    thread1 = Thread(1,5)
    thread2 = Thread(2,3)
    thread1.start()
    thread2.start()

if __name__ == '__main__':
    test()
'''

'''
import os
for f in os.listdir("data/"):
    print(type(f))
'''

str1 = '請問Note 4 跟 iphone 6 plus那個好呢？\n_1.txt'

def special_handle(str1):
    str1 = ''.join(str1.split('?'))
    str1 = ''.join(str1.split('\\'))
    str1 = ''.join(str1.split('/'))
    str1 = ''.join(str1.split(':'))
    str1 = ''.join(str1.split('|'))
    str1 = ''.join(str1.split('<'))
    str1 = ''.join(str1.split('>'))
    str1 = ''.join(str1.split('"'))
    str1 = ''.join(str1.split('*'))
    str1 = ''.join(str1.split('\n'))
    return str1

str1 = special_handle(str1)
print(type(str1))
print(str1)
