from selenium import webdriver

def login():
    # initiate
    driver = webdriver.Firefox() # initiate a driver, in this case Firefox
    driver.get("http://ts5.travian.tw/?lang=tw") # go to the url

    # log in
    username_field = driver.find_element_by_name("name") # get the username field
    password_field = driver.find_element_by_name("password") # get the password field
    username_field.send_keys("JohnnyBGood") # enter in your username
    password_field.send_keys("a29103546") # enter in your password
    password_field.submit() # submit it

    # print HTML
    #source = driver.page_source
    return driver

def Upgrade(id_num):
    global origin_url, driver

    #木 1, 3, 14, 17
    #磚 5, 6, 16, 18
    #鐵 4, 7, 10, 11
    #田 2, 8, 9, 12, 13, 15
    
    driver.get(origin_url+'build.php?id='+str(id_num))
    page = driver.page_source

    str1 = '<button onclick="window.location.href'
    str2 = 'type="button">'
    begin = page.find(str1)
    if begin != -1:
        end = page.find(str2, begin)
        sub_str = page[begin:end+14]
        print(sub_str)

        beg = sub_str.find('dorf')
        end = sub_str.find('\';', beg)
        sub2 = sub_str[beg:end]
        sub2 = ''.join(sub2.split('amp;'))
        print(sub2)
        driver.get(origin_url+sub2)
        return True
    else:
        print("begin == -1")
        print("可能還有排程!")
        return False


origin_url = 'http://ts5.travian.tw/'
driver = login()    
Upgrade(1)
