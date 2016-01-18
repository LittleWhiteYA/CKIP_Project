def write_infile(start_url, url_List, content_List, id_List, date_List, topic):
    global num
    file = open(str(num)+'.txt', 'w', encoding='UTF-8')
    num += 1
    
    #file.write(str(bytes([len(start_url)])))
    #print(len(bytes([len(start_url)])))
    file.write(str(len(start_url).to_bytes(8, byteorder='big'))+" ")
    file.write(str(len(topic).to_bytes(8, byteorder='big'))+" ")
    count = 0
    for url_w in url_List:
        count += len(url_w)
    file.write(str(count.to_bytes(8, byteorder='big'))+" ")

    #file.write("start URL:\n" + start_url + "\n\n")
    file.write(str(start_url.encode('utf-8'))+" ")
    file.write(str(topic.encode('utf-8'))+" ")
    for url_w in url_List:
       #file.write(url_w+"\n")
        file.write(str(url_w.encode('utf-8')))

    file.write("\n")    

        
    for num1 in range(len(id_List)):
        #file.write("\n==========\nid: "+id_List[num1]+"\n")
        #file.write("date: "+date_List[num1]+"\n")
        #file.write(content_List[num1])
        file.write(str(len(id_List[num1]).to_bytes(8, byteorder='big'))+" ")
        file.write(str(len(date_List[num1]).to_bytes(8, byteorder='big'))+" ")
        file.write(str(len(content_List[num1]).to_bytes(8, byteorder='big'))+" ")
        file.write(str(id_List[num1].encode('utf-8')))
        file.write(str(date_List[num1].encode('utf-8')))
        file.write(str(content_List[num1].encode('utf-8')))
        file.write("\n")
               
    file.close()

num = 1
