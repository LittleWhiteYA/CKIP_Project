/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import com.opencsv.CSVWriter;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Date;
import static java.lang.System.out;
import java.util.Arrays;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author FleshWhiter
 */
public class DataAnalysis {
        
        static ArrayList<String> fbad_List = new ArrayList<>();
        static ArrayList<String> fgood_List = new ArrayList<>();
//        static ArrayList<String> bad_word_l = new ArrayList<>();
//        static ArrayList<String> good_word_l = new ArrayList<>();
        static ArrayList<String> bad_id_List = new ArrayList<>();
        static ArrayList<String> good_id_List = new ArrayList<>();
        
//        static ArrayList<String> Word_List = new ArrayList<>();
//        static ArrayList<String> Tag_List = new ArrayList<>();     
        static File dict;
        static File[] files;
        static int end_num;
		static String subject;
        
        public static void main(String[] args) throws IOException {
            Date tmr = new Date();
            out.println(tmr);
            //int file_num = 0;
			int file_num = Integer.parseInt(args[0]);
            subject = args[1];
            SetDict();
            
            int num = file_num;
            do{
                dict = new File("w_data/"+subject+"_w_data");
                if(dict.isDirectory()){
                    files = dict.listFiles();
                    Arrays.sort(files);
                    end_num = files.length;
                    //end_num = 10000;
                    num = Analysis(num, end_num);
                }
            }while(num != file_num && num != 0);
            
            
            out.println("End");

            Date end_tmr = new Date();
            long cost_time = end_tmr.getTime()-tmr.getTime();
            out.println(cost_time);            
        }
        
        
        public static int Analysis(int file_num, int end_num) throws IOException {              

            try {
                BufferedWriter bw = new BufferedWriter(new FileWriter("result/rw_"+subject+".txt"));
                BufferedWriter bw_id = new BufferedWriter(new FileWriter("result/id_List_"+subject+".txt"));

                Writer wp = new FileWriter(new File("result/Post_"+subject+".csv"));
                CSVWriter csv_wp = new CSVWriter(wp, ',');
                String[] Post_type = {
                    "File_num", "Source", "attribute", "title", "link",
                    "Author", "athr_time", "athr_content",
                    "total_positiveWord_num", "total_negativeWord_num",
                    "total_id_num", "total_positive_id_num", "total_negative_id_num"};
                csv_wp.writeNext(Post_type);
                
                Writer wc = new FileWriter(new File("result/Comment_"+subject+".csv"));
                CSVWriter csv_wc = new CSVWriter(wc, ',');
                String[] Comment_type = {
                    "PostFile_num", "Comment_athr", "time", "content", 
                    "comm_positiveWord_num", "comm_negativeWord_num"
                };
                csv_wc.writeNext(Comment_type);
                
                
                
                ArrayList<String> id_List = new ArrayList<>();
                ArrayList<String> time_List = new ArrayList<>();
                ArrayList<String> content_List = new ArrayList<>();
                ArrayList<String> before_topic_List = new ArrayList<>();
                
                String[] data_arr;
                String source;
                String topic;
                String url;
                
                String author = null;
                String athr_time = null;
                String athr_content = null;
                String athr_link = null;
                String Next_topic;
                
                int count_Post_num = 1;
                
                while(file_num != end_num)
                {                         
                    data_arr = Read_File(file_num, id_List, time_List, content_List);
                    if(data_arr == null)
                        System.exit(1);
                    
                    source = data_arr[0];
                    topic = data_arr[1];
                    url = data_arr[2];
                    Next_topic = data_arr[3];
                    if(athr_link == null || athr_link.length() > url.length() || url.endsWith("p=1"))
                        athr_link = url;

                    if(!Next_topic.equals(topic) || Next_topic.equals("End"))
                    {
                        if(!id_List.isEmpty())
                        {                            
                            //判斷是否為此文章作者
                            for(int i=0; i<time_List.size(); ++i)
                            {
                                if(time_List.get(i).endsWith("#1"))
                                {                         
                                    author = id_List.get(i);
                                    athr_time = time_List.get(i);
                                    athr_content = content_List.get(i);
                                }
                            }
                            
                            if(author != null && !before_topic_List.contains(topic))
                            {
                                out.println("Write!");

                                bw.write(Integer.toString(file_num)+" "+topic);  bw.newLine();
                                bw.write(author);       bw.newLine();
                                bw.write(athr_time);    bw.newLine();

                                ArrayList<String> Word_List = new ArrayList<>();
                                ArrayList<String> Tag_List = new ArrayList<>();
                                String[] splitWord;
                                String[] split2;       

                                int total_positiveWord_num = 0;
                                int total_negativeWord_num = 0;                        

                                for(int i=0; i<id_List.size(); ++i)
                                {
                                    
                                    Word_List.clear();
                                    Tag_List.clear();

                                    if(content_List.get(i) != null)
                                    {
                                        splitWord = content_List.get(i).split(" ");
                                        for(int j=0; j<splitWord.length; ++j)
                                        {  
                                            split2 = splitWord[j].split("-");
                                            if(split2.length == 2)
                                            {
                                                Word_List.add(split2[0]);
                                                Tag_List.add(split2[1]);
                                            }
                                        }

                                        int[] arr = CheckWord(id_List.get(i), Word_List, Tag_List);
                                        total_positiveWord_num += arr[0];
                                        total_negativeWord_num += arr[1];
                                        
                                        String[] comm = {
                                            Integer.toString(count_Post_num),
                                            id_List.get(i),
                                            time_List.get(i),
                                            content_List.get(i),
                                            Integer.toString(arr[0]),
                                            Integer.toString(arr[1])
                                        };
                                        csv_wc.writeNext(comm);

//                                        Call_MySQL.UploadComment(
//                                            Post_num, id_List.get(i), time_List.get(i),
//                                            content_List.get(i), arr[0], arr[1]);
//                                        out.print(file_num);
                                    }
                                }

                                int total_positive_id_num = good_id_List.size();
                                int total_negative_id_num = bad_id_List.size();                        

                                bw.write("good id:");   bw.newLine();
                                for(int i=0; i<good_id_List.size(); ++i)
                                {
                                    bw.write("\t"+good_id_List.get(i));      bw.newLine();
                                    
                                    bw_id.write("good id:");            bw_id.newLine();
                                    bw_id.write(good_id_List.get(i));      bw_id.newLine();
                                }
                                bw.write("good id num: "+good_id_List.size());  bw.newLine();
                                bw.write("--------------------");            bw.newLine();
                                bw.write("bad id:");                         bw.newLine();
                                for(int j=0; j<bad_id_List.size(); ++j)
                                {
                                    bw.write("\t"+bad_id_List.get(j));          bw.newLine();
                                    
                                    bw_id.write("bad id:");                 bw_id.newLine();
                                    bw_id.write(bad_id_List.get(j));           bw_id.newLine();                        
                                }
                                bw.write("bad id num: "+bad_id_List.size());    bw.newLine();
                                bw.write("====================");            bw.newLine();

                                int total_id_num = total_positive_id_num + total_negative_id_num;
                                String[] strs = {
                                    Integer.toString(count_Post_num++),
                                    source, null,
                                    topic, athr_link,
                                    author, athr_time.substring(0, athr_time.length()-2), athr_content,
                                    Integer.toString(total_positiveWord_num),
                                    Integer.toString(total_negativeWord_num),
                                    Integer.toString(total_id_num),
                                    Integer.toString(total_positive_id_num),
                                    Integer.toString(total_negative_id_num)
                                    //,Integer.toString(file_num)
                                };
                                csv_wp.writeNext(strs);
                                
//                                Call_MySQL.UploadPost(Post_num, source, topic,
//                                    athr_link, author, athr_time, athr_content,
//                                    total_positiveWord_num, total_negativeWord_num,
//                                    total_id_num, total_positive_id_num, total_negative_id_num);

                            }
                            else{
                                out.println("Skip!");
                                out.println("Before topic contains or No author!");
                            }
                            
                            good_id_List.clear();
                            bad_id_List.clear();
                            id_List.clear();
                            time_List.clear();
                            content_List.clear();       
                            author = null;
                            athr_time = null;
                            athr_content = null;
                            athr_link = null;
                            before_topic_List.add(topic);
                        }
                    }

                    ++file_num;
                }


                bw.close();
                bw_id.close();
                csv_wp.close();
                csv_wc.close();

            }catch(Exception e){
                
                out.println(file_num + "\t" + e);
                System_pause();
                return file_num;
            }
            return 0;
        
        }
        private static void SetDict() throws IOException {
            try {
                FileReader bad_f = new FileReader("dict/negative.txt");
                BufferedReader bad_br = new BufferedReader(bad_f);
                while(bad_br.ready())   fbad_List.add(bad_br.readLine());

                FileReader good_f = new FileReader("dict/positive.txt");
                BufferedReader good_br = new BufferedReader(good_f);
                while(good_br.ready())  fgood_List.add(good_br.readLine());

            } catch(FileNotFoundException e){
                out.println(e);
            }
        }
        
        private static int[] CheckWord(String id, ArrayList<String> Word_List, ArrayList<String>Tag_List) {
//            good_word_l.clear();
//            bad_word_l.clear();
            
            int positive_word_num = 0;
            int negative_word_num = 0;

            for(int i=0;i<Word_List.size();i++)
            {
                String Check_str = Word_List.get(i);
//                            String Check_tag = TagList.get(i);
                boolean Same = false;
                for(int j=0; j<fgood_List.size(); ++j)
                {
                    String good = fgood_List.get(j);
                    if(good.equals(Check_str))
                    {
                        ++positive_word_num;
//                        good_word_l.add(Check_str);
                        Same = true;
                        break;
                    }
                }
                if(Same == false){
                    for(int j=0; j<fbad_List.size(); ++j) {
                        String bad = fbad_List.get(j);
                        if(bad.equals(Check_str)) {
                            ++negative_word_num;
//                            bad_word_l.add(Check_str);
                            break;
                        }
                    }
                }
            }
            
//            if(good_word_l.size() > bad_word_l.size()) {
//                good_id_List.add(id);
//            }
//            else if(good_word_l.size() < bad_word_l.size()) {
//                bad_id_List.add(id);
//            }   
            if(positive_word_num >= negative_word_num) {
                if(!good_id_List.contains(id))
                    good_id_List.add(id);
            }
            else if(positive_word_num < negative_word_num) {
                if(!bad_id_List.contains(id))
                    bad_id_List.add(id);
            }
            
            int[] arr = {positive_word_num, negative_word_num};
            return arr;
        }
        
        private static String[] Read_File (
                int file_num, ArrayList<String> id_List, 
                ArrayList<String> time_List,
                ArrayList<String> content_List)
        {
            String source;
            String topic;
            String url;
            
            out.println(file_num+"\t"+files[file_num]);
            try (BufferedReader br = new BufferedReader(new FileReader(files[file_num]))) {
                source = br.readLine();
                topic = br.readLine();
                url = br.readLine();

                String id;
                String time;
                String content;

                while( (id = br.readLine()) != null)
                {
                    time = br.readLine();
                    content = br.readLine();
                    if(!time_List.contains(time)){
                        id_List.add(id);
                        time_List.add(time);
                        content_List.add(content);
                    }
                }

                String Next_topic;                    
                try{
                    if(file_num+1 == end_num){
                        Next_topic = "End";
                    }
                    else{
                        BufferedReader br2 = new BufferedReader(new FileReader(files[file_num+1]));
                        br2.readLine();
                        Next_topic = br2.readLine();
                        br2.close();
                    }
                }catch(FileNotFoundException e){
                    out.println(e);
                    Next_topic = "End";
                }

                String[] data_arr = {source, topic, url, Next_topic};
                return data_arr;                
            } catch (FileNotFoundException ex) {
                out.println(ex);
                Logger.getLogger(DataAnalysis.class.getName()).log(Level.SEVERE, null, ex);
            } catch (IOException ex) {
                out.println(ex);
                Logger.getLogger(DataAnalysis.class.getName()).log(Level.SEVERE, null, ex);
            }
            
            return null;
        }
        static void System_pause(){
            Scanner input = new Scanner(System.in);
            out.println("Press Enter to exit...");
            input.nextLine();
        }
}

