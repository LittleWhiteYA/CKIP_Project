# -*- coding: utf-8 -*-
import urllib.parse
import urllib.request
from html.parser import HTMLParser
import sys
import os

class News_HTMLParser(HTMLParser):
    def __init__(self):
        self.Page = ''
        self.isPage = False
        self.Topic = ''
        self.isTopic = False
        self.TopicList = []
        self.urlList = []
        HTMLParser.__init__(self)

    def handle_starttag(self, tag, attrs):
        if tag == 'div':
            for name, value in attrs:
                if name == 'class' and value == 'tbb':
                    self.isPage = True
        elif self.isPage and tag == 'a':
            for name, value in attrs:
                if name == 'href':
                    self.urlList.append(value)
                    self.isTopic = True
    def handle_data(self, data):
        if self.isTopic:
            self.Topic += data

    def handle_endtag(self, tag):
        if self.isPage and tag == 'div':
            self.isPage = False
        elif self.isTopic and tag == 'a':
            self.TopicList.append(self.Topic)
            self.Topic = ''
            self.isTopic = False
            self.isPage = False

    def get_TopicList(self):
        return self.TopicList
    def get_urlList(self):
        return self.urlList

class News_ContentParser(HTMLParser):
    def __init__(self):
        self.Content = ''
        self.isContent = False
        self.ContentDict = {}
        HTMLParser.__init__(self)

    def handle_starttag(self, tag, attrs):
        if tag == 'p':
            for name, value in attrs:
                if name == 'id' and \
                    (value == 'summary' or value == 'introid' or value == 'bcontent'):
                    self.isContent = True

    def handle_data(self, data):
        if self.isContent:
            self.Content += data

    def handle_endtag(self, tag):
        if tag == 'p' and self.isContent:
            global num
            self.Content = ''.join(self.Content.split('\n'))
            self.Content = ''.join(self.Content.split('\r'))
            if self.ContentDict.get(num) == None:
                self.ContentDict[num] = self.Content
            else:
                self.ContentDict[num] = self.ContentDict[num]+" "+self.Content

            self.Content = ''
            self.isContent = False

    def getContentDict(self):
        return self.ContentDict


def Catch_News(req):
    try:
        page = urllib.request.urlopen(req)
        text = page.read().decode('UTF-8')
        #print(text)
        Parser = News_HTMLParser()
        Parser.feed(text)
        url_List = Parser.get_urlList()
        Topic_List = Parser.get_TopicList()
        Parser.close()
        
        if len(url_List) != 0 and len(Topic_List) != 0:
            contentdict = {}
            contentdict = Parse_Content(url_List)
            write(url_List, Topic_List, contentdict)
        else:
            print("url_List and Topic_List is empty!")
            sys.exit(1)
        
    except urllib.error.HTTPError as e:
        e.printStackTrace()

num = 0
def Parse_Content(url_List):
    global num
    num = -1
    ContentParser = News_ContentParser()
    
    for url in url_List:
        
        num += 1
        print(str(num)+" "+url)
        index = url.rfind('applesearch/')
        if index != -1:
            url_l = url[:index+12]
            url_r = url[index+12:]
    
        headers = { 'User-Agent' : change_agent() }
        url = url_l + urllib.parse.quote(url_r)
        req = urllib.request.Request(url, headers=headers)
        page = urllib.request.urlopen(req)
        text = page.read().decode('utf-8')

        ContentParser.feed(text)

    ContentDict = ContentParser.getContentDict()
    ContentParser.close()
    return ContentDict

def change_agent():
    global num
    if num%5 <= 1:
        user_agent =  'Mozilla/5.0 (Windows; U; Windows NT 5.1; it; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11'
    elif num%5 <= 2:
        user_agent = 'Mozilla/5.0 (Linux; U; Android 4.0.4; en-gb; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
    elif num%5 <= 3:
        user_agent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64)'
    elif num%5 <= 4:
        user_agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:12.0) Gecko/20100101 Firefox/12.0'
    else:
        user_agent = 'Custom user agent'
    return user_agent
    
def write(url_List, Topic_List, ContentDict):
    global page_num
    print("Write!")
    
    file_path = 'News/News_htc_'+str(int(page_num/100))+'.txt'
    isfile = os.path.isfile(file_path)
    if isfile:
        file = open(file_path, 'a', encoding='utf-8')
    else:
        file = open(file_path, 'w', encoding='utf-8')     


    file_path2 = 'News/News_htc_topic.txt'
    isfile2 = os.path.isfile(file_path2)
    if isfile2:
        file2 = open(file_path2, 'a', encoding='utf-8')
    else:
        file2 = open(file_path2, 'w', encoding='utf-8')
    file2.write("page_num: "+str(page_num)+'\n')
    
    for num in range(len(url_List)):
        #print(url_List[num])
        if ContentDict.get(num) == None:
            continue
        file.write(urllib.parse.quote(url_List[num])+'\n')
        file.write(Topic_List[num]+'\n')
        file.write(ContentDict.get(num)+'\n')
        file2.write(Topic_List[num]+'\n')
        print(Topic_List[num])
        
    file.close()
    file2.close()


url = 'http://search.appledaily.com.tw/appledaily/search/'
page_num = 209
page_end = 392

while True:
    print("====================")
    print("page: "+str(page_num)+" end: "+str(page_end))
    print("====================")
    
    values = { 'searchMode' : '',
                'searchType' : 'text',
                'ExtFilter' : '',
                'sorttype' : '1',
                'keyword' :' 宏達電 AND 手機',
                'rangedate' : '[20030502 TO 20151231999:99]',
                'totalpage' : '3908',
                'page' : str(page_num)}
    
    
    data = urllib.parse.urlencode(values).encode('utf-8')
    req = urllib.request.Request(url, data)
    Catch_News(req)
    page_num += 1
    if page_num >= page_end:
        break
print("End!")


