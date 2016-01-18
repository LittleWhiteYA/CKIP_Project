/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import tw.cheyingwu.ckip.CKIP;
import tw.cheyingwu.ckip.Term;
import tw.cheyingwu.ckip.WordSegmentationService;


/**
 *
 * @author FleshWhiter
 */
public class CKIP_News {
    
    public static void main(String[] args){
        WordSegmentationService c = new CKIP( "140.109.19.104" , 1501, "ncku2015_3", "csie2015"); //輸入申請的IP、port、帳號、密碼

        int file_num = Integer.parseInt(args[0]);
		String type = args[2];
        while(file_num <= Integer.parseInt(args[1])){
	        System.out.println(file_num+" Read!");
	        ArrayList<ArrayList<String>> list = ReadFile(new File("News_apple/News_"+type+"/News_"+type+"_"+file_num+".txt"));
	        ArrayList<String> urls, topics, contents;
	        ArrayList<String> ckip_contents = new ArrayList<>();
	        
	        urls = list.get(0);
	        topics = list.get(1);
	        contents = list.get(2);
	        
	        
	        ArrayList<String> inputs = new ArrayList<>();
	        System.out.println("Send!");
	        for(int i=0; i<contents.size(); ++i){
	        	
	        	System.out.println(i+" "+topics.get(i));
	            c.setRawText(contents.get(i));
	            c.send(); //傳送至中研院斷詞系統服務使用            
	            
	            inputs.clear();
	            for(Term t: c.getTerm()){
	//            	System.out.println(t.getTerm()+"\t"+t.getTag());
	                if(t.getTag() != null && t.getTag().equals("N")){
	                    inputs.add(t.getTerm());
	                }
	            }
	            
	            String tmp = "";
	            for(String str2: inputs){
	            	tmp = tmp + str2 + " ";
	            }
	            ckip_contents.add(tmp);
	            
	        }
	        System.out.println("Write!");
	        System.out.println("urls: "+urls.size()+", contents: "+ckip_contents.size());
	        WriteFile(new File("News_apple/w_"+type+"/w_"+type+"_"+file_num+".txt"), urls, topics, ckip_contents);
			++file_num;
        }
        
    }
    
    
    static ArrayList<ArrayList<String>> ReadFile(File file){
        ArrayList<String> urls = new ArrayList<>();
        ArrayList<String> topics = new ArrayList<>();
        ArrayList<String> contents = new ArrayList<>();
        
        try(BufferedReader br = new BufferedReader(new FileReader(file))){
        	String url, topic, content;
        	while((url = br.readLine()) != null){
	            topic = br.readLine();
	            //System.out.println(topic);
	            content = br.readLine();
	            
	            urls.add(url);
	            topics.add(topic);
	            contents.add(content);
        	}
            
        } catch (FileNotFoundException ex) {
            ex.printStackTrace();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        
        ArrayList<ArrayList<String>> tmp = new ArrayList<>();
        tmp.add(urls);
        tmp.add(topics);
        tmp.add(contents);
        
        return tmp;
    }
    
    static void WriteFile(File filename, ArrayList<String> urls, ArrayList<String> topics, ArrayList<String> contents){

    	try(BufferedWriter bw = new BufferedWriter(new FileWriter(filename))){
            for(int i=0; i<urls.size(); ++i){
                bw.write(urls.get(i));  bw.newLine();
                bw.write(topics.get(i));    bw.newLine();
                bw.write(contents.get(i));	bw.newLine();
            }
            
        } catch (IOException ex) {
            System.out.println(ex);
        }
    }
}

