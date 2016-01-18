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
            write(url_List, Topic_List)
        else:
            print("url_List and Topic_List is empty!")
            sys.exit(1)
        
    except urllib.error.HTTPError as e:
        e.printStackTrace()

def write(url_List, Topic_List):
    global page
    
    file_path = 'News/News_'+str(int(page/100))+'.txt'
    isfile = os.path.isfile(file_path)
    if isfile:
        file = open(file_path, 'a', encoding='utf-8')
    else:
        file = open(file_path, 'w', encoding='utf-8')   

    file_path2 = 'News/News_topic.txt'
    isfile2 = os.path.isfile(file_path2)
    if isfile2:
        file2 = open(file_path2, 'a', encoding='utf-8')
    else:
        file2 = open(file_path2, 'w', encoding='utf-8')
    file2.write("page: "+str(page)+'\n')
    
    for num in range(len(url_List)):
        #print(url_List[num])
        file.write(urllib.parse.quote(url_List[num])+'\n')
        file.write(Topic_List[num]+'\n')
        file2.write(Topic_List[num]+'\n')
        print(Topic_List[num])
        
    file.close()
    file2.close()


url = 'http://search.appledaily.com.tw/appledaily/search/'
page = 203

while True:
    print("====================")
    print("page: "+str(page))
    print("====================")
    
    values = { 'searchMode' : '',
                'searchType' : 'text',
                'ExtFilter' : '',
                'sorttype' : '1',
                'keyword' :' 政治',
                'rangedate' : '[20151107 TO 20151231999:99]',
                'totalpage' : '2071',
                'page' : str(page)}
    
    
    data = urllib.parse.urlencode(values).encode('utf-8')
    req = urllib.request.Request(url, data)
    Catch_News(req)
    page += 1
    if page == 209:
        break
print("End!")


