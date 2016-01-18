import codecs
import urllib.request
import sys
sys.setrecursionlimit(10000)
from html.parser import HTMLParser
import http.client
import os

#import urllib.request as urllib2

class html_Parser(HTMLParser):
    def __init__(self, topiclist):
        self.urlList = []
        self.record_con = False
        self.content = ''
        self.contentList = []
        self.re_id = False
        self.id = ''
        self.idList = []
        self.re_date = False
        self.date = ''
        self.dateList = []
        self.re_topic = False
        self.topic = ''
        self.re_hotpage = False
        self.topiclist = topiclist
        HTMLParser.__init__(self)
        
    def handle_starttag(self, tag, attrs):
        
        #print("1.", end="")
        if tag == 'a' and self.re_hotpage == False:
            for name, value in attrs:
                if name == 'href' and value.find("topicdetail") != -1 \
                   and value.find("f="+str(self.topiclist)) != -1 \
                    and value[-3:] != "p=1" and self.skip(value) == False:
                    self.urlList.append(value)
        elif tag == 'h1':
            for name, value in attrs:
                if name == 'class' and value == 'topic':
                    self.re_topic = True
        elif tag == 'div':
            for name, value in attrs:
                if name == 'class' and value == "fn":
                    self.re_id = True
                elif name == 'class' and value == 'date':
                    self.re_date = True
                elif name == 'class' and value == "single-post-content":
                    self.record_con = True
                elif name == 'class' and value == 'panel note ' \
                    or name == 'class' and value == 'Selection-article':
                    self.re_hotpage = True

    def handle_data(self, data):
        if self.record_con:
            self.content += data
        elif self.re_topic:
            self.topic += data
        elif self.re_id:
            self.id += data
        elif self.re_date:
            self.date += data

    def handle_endtag(self, tag):
        #print("3.", end=" ")

        '''
        if tag == 'a':
            #self.linkname = ''.join(self.linkname.split())
            self.linkname1=self.linkname1.strip()
            if self.linkname1:
                self.data.append(self.linkname1)
                #print(self.linkname1)
            self.linkname1=''
            self.href=0
        '''

        if tag == 'div':
            if self.record_con:
                self.content = self.content.strip() #strip 為移除字元，預設為空白字元
                self.contentList.append(self.content)
                #print(self.content)
                #print("-------------------------------")
                self.content = ''
                self.record_con = False
            elif self.re_id:
                #print(self.id)
                self.id = self.id.replace("\n", "\t")
                self.idList.append(self.id)
                self.id = ''
                self.re_id = False
            elif self.re_date:
                self.dateList.append(self.date)
                self.date = ''
                self.re_date = False
            elif self.re_hotpage:
                self.re_hotpage = False
        if tag == 'h1' and self.re_topic == True:
            self.topic = self.topic.replace("\n", "\t")
            self.re_topic = False

    def skip(self, value):
        skip_arr = ["login", "#pb", "mailto", "2369097", "2777982"]
        for str1 in skip_arr:
            if value.find(str1) != -1:
                return True
        
        return False
    def get_urlList(self):
        return self.urlList
    def get_contentList(self):
        return self.contentList
    def get_idList(self):
        return self.idList
    def get_dateList(self):
        return self.dateList
    def get_topic(self):
        return self.topic
    
#-----------------------------------------------------------------------------------
    
class Parser:
    def __init__(self, topiclist, page_num, new_url):
        self.url_before = []
        self.topiclist = topiclist
        self.page_num = page_num
        self.new_url = new_url
        self.choose = ''
        
    def Catch_Mobile01(self, start_url):

        global error_num
        try:
            req = urllib.request.Request(start_url)
            #req.add_header('User-agent', 'Mozilla 5.10')
            page = urllib.request.urlopen(req)

            text = page.read().decode('UTF-8', 'ignore')
            Parser = html_Parser(self.topiclist)
            Parser.feed(text)
            page.close()
            url_l = Parser.get_urlList()
            con_l = Parser.get_contentList()
            id_l = Parser.get_idList()
            dt_l = Parser.get_dateList()
            topic = Parser.get_topic()
            Parser.close()
            
            global origin_url
            
            index = 0
            id1 = self.get_id(start_url)
            while index < len(url_l):
                if id1 != "list" and id1 != "" and url_l[index].find(id1) == -1:
                    #print("id: "+id1+", Check url: " +url_l[index])            
                    #print("Remove!")
                    url_l.remove(url_l[index])
                    continue
                else:
                    if url_l[index].find(origin_url) == -1:
                        url_l[index] = origin_url + url_l[index]            
                    index += 1

            return url_l, con_l, id_l, dt_l, topic
        
        except urllib.error.HTTPError as e:
            print("HTTPError!")
            error_num = error_num+1
            error_file = open('data/HTTPError_'+str(error_num)+'.txt', 'w', encoding="utf-8")
            error_file.write(start_url+"\n")
            error_file.write(str(e.code)+"\n")
            error_file.write(e.read().decode('UTF-8')+"\n")
            error_file.close()
            return "", "", "", "", ""
        except urllib.error.URLError as e:
            print("URLError!")
            error_num = error_num+1        
            error_file = open('data/URLError_'+str(error_num)+'.txt', 'w', encoding="utf-8")
            error_file.write(start_url+"\n")
            error_file.write(str(e.reason))
            error_file.close()
        
        except http.client.IncompleteRead as e:
            print("InCompleteRead")
            #print(''.join(e.partial))
            return "", "", "", "", ""
            
    def Recursive_Catch(self, start_url):
        
        print("--------------------")
        print("url: " + start_url)
        url_List, content_List, id_List, date_List, topic = self.Catch_Mobile01(start_url)
        
        if(url_List == '' and content_List == '' and id_List == ''):
            print("HTTP Error! Not write File!")
        else:
            self.write_infile(start_url, content_List, id_List, date_List, topic)
            print("page: " + str(self.page_num))

            for url in url_List:
                if url not in self.url_before:
                    self.url_before.append(url)
                    self.Recursive_Catch(url)


    def write_infile(self, start_url, content_List, id_List, date_List, topic):
        if start_url.find("&p=") != -1 and start_url.find("#") == -1:
            subpage = start_url[start_url.find("&p=")+3:]
        else:
            subpage = 1

        if topic == '':
            file_path = 'E:/CKIP_data/iphone_data/page_'+str(self.page_num)+'.txt'
            print("No topic("+topic+")! page_"+str(self.page_num))
        else:
            topic = self.special_handle(topic)
            file_path = 'E:/CKIP_data/iphone_data/'+topic+"_"+str(subpage)+'.txt'
            print(topic+"_"+str(subpage))

        
        isfile = os.path.isfile(file_path)
        if isfile:
            print(file_path+" File Exist!")
            print("Not overwrite!")
        else:
            file = open(file_path, 'wb')

            #file.write(str(len(start_url).to_bytes(8, byteorder='big')))
            #file.write(str(len(topic).to_bytes(8, byteorder='big')))
            file.write(len(origin_url.encode('utf-8')).to_bytes(8, byteorder='big'))
            file.write(len(topic.encode('utf-8')).to_bytes(8, byteorder='big'))
            file.write(len(start_url.encode('utf-8')).to_bytes(8, byteorder='big'))    


            #file.write("start URL:\n" + start_url + "\n\n")

            #file.write(str(start_url.encode('utf-8')))
            #file.write(str(topic.encode('utf-8')))
            file.write(origin_url.encode('utf-8'))
            file.write(topic.encode('utf-8'))
            file.write(start_url.encode('utf-8'))

            #file.write("\n")
            file.write(b'\r\n')

                
            for num1 in range(len(id_List)):
                #file.write("\n==========\nid: "+id_List[num1]+"\n")
                #file.write("date: "+date_List[num1]+"\n")
                #file.write(content_List[num1])
                
                #file.write(str(len(id_List[num1]).to_bytes(8, byteorder='big')))
                #file.write(str(len(date_List[num1]).to_bytes(8, byteorder='big')))
                #file.write(str(len(content_List[num1]).to_bytes(8, byteorder='big')))
                #file.write(str(id_List[num1].encode('utf-8')))
                #file.write(str(date_List[num1].encode('utf-8')))
                #file.write(str(content_List[num1].encode('utf-8')))
                #file.write("\n")
                try:
                    file.write(len(id_List[num1].encode('utf-8')).to_bytes(8, byteorder='big'))
                    file.write(len(date_List[num1].encode('utf-8')).to_bytes(8, byteorder='big'))
                    file.write(len(content_List[num1].encode('utf-8')).to_bytes(8, byteorder='big'))
                    file.write(id_List[num1].encode('utf-8'))
                    file.write(date_List[num1].encode('utf-8'))
                    file.write(content_List[num1].encode('utf-8'))
                    file.write(b'\r\n')
                except IndexError as e:
                    print(e)
                    for err in content_List:
                        print(err)
            file.close()

    def get_id(self, url):
        check_id = url.find("&t=")
        id1 = ""
        if check_id != -1:
            check_page = url.find("&p=")
            if check_page != -1:
                id1 = url[check_id+3:check_page]
            else:
                id1 = url[check_id+3:]
        elif check_id == -1 and url.find("topiclist") != -1:
            id1 = "list"
        return id1
    def special_handle(self, str1):
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
        str1 = ''.join(str1.split('\x1b')) #Esc
        str1 = ''.join(str1.split('\t'))
        str1 = ''.join(str1.split('\b'))
        str1 = ''.join(str1.split('\x0b'))
        str1 = ''.join(str1.split('\x1c'))
        str1 = ''.join(str1.split('\r'))
        return str1
    
    def start(self):
        
        new_url = self.new_url
        
        while True:
            self.Recursive_Catch(new_url)

            self.page_num += 1
            if self.page_num > 2766:
                break

            cut = new_url[new_url.find("&p=")+3:]
            new_url = new_url.strip(cut)
            new_url = new_url + str(self.page_num)
            self.new_url = new_url
            print("=========================")
            print("new_url: "+new_url)
            print("=========================")

        return "End Parser! "+str(self.page+num)+" "++str(new_url)

'''
import threading, time

class Thread (threading.Thread): # 繼承 Thread 類別
    def __init__(self, topiclist, page):
        threading.Thread.__init__(self)
        self.topiclist = topiclist
        self.page = page
    def run(self):
        global origin_url
        new_url = origin_url + "topiclist.php?f=" + str(self.topiclist) \
            + "&p="+ str(self.page)
        
        parse = Parser(self.topiclist, self.page, new_url)
        parse.start()           



def multi_thread():
    page1 = 1
    topiclist1 = 568
    thread1 = Thread(topiclist1, page1)
    thread1.start()
    page2 = 1
    topiclist2 = 588
    thread2 = Thread(topiclist2, page2)

origin_url = "http://www.mobile01.com/"
error_num = 0
multi_thread()
'''

def parser_start():
    page1 = 2766
    topiclist1 = 383
    global origin_url
    new_url = origin_url + "topiclist.php?f=" + str(topiclist1) \
        + "&p="+ str(page1)
    
    parse = Parser(topiclist1, page1, new_url)
    parse.start()

origin_url = "http://www.mobile01.com/"
error_num = 0
parser_start()

print("End!")

