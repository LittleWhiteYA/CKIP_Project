

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.Scanner;

import tw.cheyingwu.ckip.CKIP;
import tw.cheyingwu.ckip.Term;
import tw.cheyingwu.ckip.WordSegmentationService;

/**
 *
 * @author FleshWhiter
 */
public class CKIP_HandleThread3 extends Thread {
        static WordSegmentationService c; //宣告一個class變數c
        
        static ArrayList<String> id_List = new ArrayList<>();   
        static ArrayList<String> time_List = new ArrayList<>();
        static ArrayList<String> content_List = new ArrayList<>();
        static ArrayList<String> ckip_contents = new ArrayList<>();
       
        static int File_start;
        static int File_end;
        
        CKIP_HandleThread3(int start, int end){
        	File_start = start;
        	File_end = end;
        }
        
        public static void main(String[] args) throws IOException {

			File_start = Integer.parseInt(args[0]);
			File_end = Integer.parseInt(args[1]);
			int port = 1501;
			int choose = Integer.parseInt(args[2]);
//			File_start = 0;
//			File_end = 10;
//			int port = 1501;
//			int choose = 1;
			String user = "";
			String passwd = "csie2015";
			if(choose == 1)
				user = "ncku2015_project";
			else if(choose == 2)
				user = "ncku2015";
			else if(choose == 3)
				user = "ncku2015_3";
			else
			{
				System.out.println("Wrong choose!");
				System.exit(1);
			}

            c = new CKIP( "140.109.19.104", port, user, passwd); //輸入申請的IP、port、帳號、密碼
            
            CKIP_HandleThread3 ckip = new CKIP_HandleThread3(File_start, File_end);
            ckip.start();

        }
       
		private static boolean stop = false; 
        public void run(){
            Date tmr = new Date();
            System.out.println(tmr);
			File dict = new File("data/iphone_data");
			if(dict.isDirectory())
			{
				File[] files = dict.listFiles();
				if(files.length < File_end)
					File_end = files.length;
				
				Arrays.sort(files);
				for(int i=File_start; i<File_end && stop == false; ++i)
				{
					System.out.print(i+"\t");
					Rewrite(files[i].getName());

					int hr, min;
					do
					{
						Calendar c = Calendar.getInstance();
						hr = c.get(Calendar.HOUR_OF_DAY);
						min = c.get(Calendar.MINUTE);
		
						try {
							if(hr == 5 || hr == 6){
								System.out.println(hr+":"+min+" Sleep");
								Thread.sleep(1000*60*10);
							}
						} catch (InterruptedException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}while(hr == 5 || hr == 6);
				}
			}
            
            System.out.println("End");
            
            Date end_tmr = new Date();
            long cost_time = end_tmr.getTime()-tmr.getTime();
            System.out.println(cost_time);
        }
        
		static boolean check;
        public static void Rewrite(String filename) {
			            
        	System.out.println(filename+"\t"+new Date());
        	String[] arr = ReadFile(filename);
        	String source, topic, url;
        	source = arr[0];
        	topic = arr[1];
        	url = arr[2];
        	
            ArrayList<String> inputList = new ArrayList<>(); //宣告動態陣列 存切詞的name
            ArrayList<String> TagList = new ArrayList<>();   //宣告動態陣列 存切詞的詞性
            ckip_contents.clear();
			check = false;
			for(int k=0; k<id_List.size(); ++k)
			{
				c.setRawText(content_List.get(k));
				c.send(); //傳送至中研院斷詞系統服務使用
				
				inputList.clear();
				TagList.clear();
				
				for (Term t : c.getTerm()) {
					inputList.add(t.getTerm()); // t.getTerm()會讀到斷詞的String，將其存到inputList陣列
					TagList.add(t.getTag());    // t.getTag() 會讀到斷詞的詞性，將其存到TagList陣列
				}
				
				if(c.getTerm().isEmpty())
				{
					if(check && k == id_List.size()-1)
					{
						System.out.println("No send Success!");
						System.exit(1);
					}
					check = true;
				}
				else
					check = false;
				
				String tmp = "";
				for(int i=0; i<inputList.size(); ++i){
					tmp = tmp + inputList.get(i)+"-"+TagList.get(i)+" ";
				}
								
				ckip_contents.add(tmp);				
			}
			
			writeFile(filename, source, topic, url);
			
		}
				

		@SuppressWarnings("resource")
		static void System_pause(){

			System.out.println("Press Enter to exit...");
			new Scanner(System.in).nextLine();
		}
		
		static long Show_usetime(Date tmr2, Date tmr, long count){
			count += tmr2.getTime()-tmr.getTime();
			//System.out.println(tmr2.getTime() - tmr.getTime());
			//System_pause();
			return count;
		}
		
		static String[] ReadFile(String filename){
			try(FileInputStream f_source = new FileInputStream(new File("data/iphone_data/"+filename))){
				byte[] array = new byte[8];
				
				f_source.read(array);
				int source_len = new BigInteger(array).intValue();
				f_source.read(array);
				int topic_len = new BigInteger(array).intValue();
				f_source.read(array);
				int url_len = new BigInteger(array).intValue();
				byte[] source_arr = new byte[source_len];
				byte[] topic_arr = new byte[topic_len];
				byte[] url_arr = new byte[url_len];
				f_source.read(source_arr);
				f_source.read(topic_arr);
				f_source.read(url_arr);
				
				String source = new String(source_arr);
				String topic = new String(topic_arr);
				String url = new String(url_arr);
				
				f_source.read(new byte[2]);
				
				id_List.clear();
				time_List.clear();
				content_List.clear();
				
				while(f_source.read(array) != -1)
				{
					int id_len = new BigInteger(array).intValue();
					f_source.read(array);
					int time_len = new BigInteger(array).intValue();
					f_source.read(array);
					int content_len = new BigInteger(array).intValue();
					byte[] id_arr = new byte[id_len];
					byte[] time_arr = new byte[time_len];
					byte[] con_arr = new byte[content_len];
							f_source.read(id_arr);
					f_source.read(time_arr);
					f_source.read(con_arr);
						
					f_source.read(new byte[2]);

					String id = new String(id_arr);
					String time = new String(time_arr);
					String content = new String(con_arr);
					
					id_List.add(id);
					time_List.add(time);
					content_List.add(content);
				}
				
				String[] tmp = {source, topic, url};
				return tmp;
				
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			System.out.println("Read Error!");
			System.exit(1);
			return null;
		}
		
		static void writeFile(String filename, String source, String topic, String url){
			File new_f = new File("w_data/iphone_w_data/w_"+filename);
			if(new_f.exists()){
				System.out.println(new_f+" Exists!");
			}
			else{
				try (BufferedWriter brw = new BufferedWriter(new FileWriter(new_f))) {
					brw.write(source);	brw.newLine();
					brw.write(topic);	brw.newLine();
					brw.write(url);	brw.newLine();
					
					for(int i=0; i<id_List.size(); ++i){
						brw.write(id_List.get(i));	brw.newLine();
						brw.write(time_List.get(i));	brw.newLine();
						brw.write(ckip_contents.get(i));	brw.newLine();
					}
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
		}
}


