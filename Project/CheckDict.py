# coding = 'utf-8'

f_good = 'dict/positive.txt'
f_bad = 'dict/negative.txt'
fg = open(f_good, 'r', encoding='utf-8')
fb = open(f_bad, 'r', encoding='utf-8')

fg_list = []
fb_list = []
while True:
    tmp = fg.readline()
    if tmp == '':
        break
    elif tmp[-1] == '\n':
        tmp = tmp[0:-1]
        
    fg_list.append(tmp)

while True:
    tmp = fb.readline()
    if tmp == '':
        break
    elif tmp[-1] == '\n':
        tmp = tmp[0:-1]

    fb_list.append(tmp)



def Check_dict(check):
    #print(check)
    Same = False
    for good in fg_list:
        if check == good:
            #print("\tGood: "+good)
            good_list.append(good)
            Same = True
            break
        
    if Same == False:
        for bad in fb_list:
            if check == bad:
                #print("\tBad: "+bad)
                bad_list.append(bad)
                break
scan = input('input: ')
f_num = 70
total_good = 0
total_bad = 0

while True:
    if f_num == 247:
        break
    filename = 'data/w_'+str(f_num)+'.txt'
    file = open(filename, 'r', encoding='utf-8')

    check_str = ''
    content = file.read()
    file.close()
    num = -1

    speech_str = ''
    speech = False
    topic = True
    #noun_dict = {}
    noun_list = []
    good_list = []
    bad_list = []

    while True:
        #print("num: "+str(num))
        #speech = False
        num = num+1
        if num == len(content):
            break
        
        str1 = content[num]
        #print("\tstr: "+str1)
        if str1 == '' or str1 == ' ' or str1 == '　' or str1 == '\n' or str1 == '-':
            continue
        elif str1 == '=':
            topic = False
        elif str1 != '(' and str1 != ')' and speech == False:
            check_str = check_str + str1
        elif str1 == '(' and content[num+1] != '(' and check_str != '':
            #print("check:"+check_str)
            Check_dict(check_str)
            speech = True
        elif str1 == ')':
            if speech_str == 'N' and topic == True:
                '''
                if check_str in noun_dict:
                    noun_dict[check_str] = noun_dict[check_str]+1
                else:
                    noun_dict[check_str] = 1
                '''
                noun_list.append(check_str)
            speech = False
            check_str = ''
            speech_str = ''
        elif speech == True:
            speech_str = speech_str + str1

    print("----------------------------")
    if scan in noun_list:
        print(f_num)
        #print(noun_dict)
        print(noun_list)
        print(good_list)
        print('good: '+str(len(good_list)))#, end = ' ')
        print(bad_list)
        print('bad: '+str(len(bad_list)))
        if len(good_list) > len(bad_list):
            total_good = total_good + 1
        elif len(bad_list) > len(good_list):
            total_bad = total_bad + 1

    f_num = f_num+1



print('good: '+str(total_good))
print('bad: '+str(total_bad))



