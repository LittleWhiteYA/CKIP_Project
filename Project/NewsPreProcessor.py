# -*- coding: utf-8 -*-
import urllib.parse
import urllib.request
from html.parser import HTMLParser
import sys
import os


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


file_num = 0

'''
user_agent =  'Mozilla/5.0 (Windows; U; Windows NT 5.1; it; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11'
user_agent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64)'
headers = { 'User-Agent' : user_agent }
'''
def change_agent():
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

while True:
    if file_num == 1:
        break
    file = open('News/News2_'+str(file_num)+'.txt', 'r', encoding='utf-8')
    #file = open('tmp.txt', 'r', encoding='utf-8')
    urlList = []
    topicList = []
    num = -1
    Parser = News_ContentParser()
    
    while True:
        url = file.readline()
        urlList.append(url)
        if url == '':
            break  
        topic = file.readline()
        topicList.append(topic)
        num += 1
        print(str(num)+" "+topic, end='')
        url = urllib.parse.unquote(url)
        index = url.rfind('applesearch/')
        if index != -1:
            url_l = url[:index+12]
            url_r = url[index+12:]

        headers = { 'User-Agent' : change_agent() }
        url = url_l + urllib.parse.quote(url_r)
        req = urllib.request.Request(url, headers=headers)
        #req.add_header('User-agent', 'Custom user agent')
        
        page = urllib.request.urlopen(req)
        text = page.read().decode('utf-8', 'ignore')
        page.close()
        
        Parser.feed(text)

    ContentDict = Parser.getContentDict()
    Parser.close()
    file.close()
    print("Rewrite!")
    file2 = open('News2-'+str(file_num)+'.txt', 'w', encoding='utf-8')
    for num in range(len(urlList)):
        if urlList[num] != '':
            print(urlList[num], end= '', file=file2)
            print(topicList[num], end='', file=file2)
            print(ContentDict.get(num), file=file2)
    file2.close()
    file_num += 1

print("End!")
    

