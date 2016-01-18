

num = 11

while True:
    if num == 12:
        break
    filename = 'data/'+str(num)+'.txt'
    file = open(filename, 'rb')
        
    source_len = int.from_bytes(file.read(8), byteorder='big')
    print(source_len)
    topic_len = int.from_bytes(file.read(8), byteorder='big')
    print(topic_len)
    url_len = int.from_bytes(file.read(8), byteorder='big')
    #print(source_len)
    #print(topic_len)
    #print(url_len)
    source = file.read(source_len).decode('utf-8')
    topic = file.read(topic_len).decode('utf-8')
    url = file.read(url_len).decode('utf-8')
    print(source)
    print(topic)
    print(url)
    file.read(2)    #new line \r\n

    '''
    2
    w_filename = 'w_'+str(num)+'.txt'
    w_file = open(w_filename, 'w', encoding='utf-8')
    w_file.write(topic)
    w_file.write('\n====================\n')
    '''

    w2_filename = 'w2_'+str(num)+'.txt'
    w2_file = open(w2_filename, 'w', encoding='utf-8')
    w2_file.write(topic+'\n')
    w2_file.write('====================\n')

    x = 0
    while True:
        id_len = int.from_bytes(file.read(8), byteorder='big')
        if id_len == 0:
            break
        time_len = int.from_bytes(file.read(8), byteorder='big')
        content_len = int.from_bytes(file.read(8), byteorder='big')
        print("----------------------------")
        #print(id_len)
        #print(time_len)
        #print(content_len)
        id1 = file.read(id_len).decode('utf-8')
        time = file.read(time_len).decode('utf-8')
        content = file.read(content_len).decode('utf-8')
        print("id:\n"+id1)
        print("time:\n"+time)
        print("content:\n"+content)
        file.read(2)

        '''
        2
        w_file.write(content)
        w_file.write('\n-----------------------------------\n')
        '''
        
        w2_file.write(id1+'\n')
        w2_file.write(content+'\n')
        w2_file.write('--------------------\n')
        
    file.close()
    num = num+1
    print("+++++++++++++++++++++++++++++++++++++++++++++++++++")




#w_file.close()
w2_file.close()


