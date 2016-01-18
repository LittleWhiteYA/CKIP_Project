import java.io.File;
import java.io.IOException;
import java.util.Arrays;


public class Hello {

	
	public static void main(String[] args) throws IOException {

		File path = new File("tmp");
		File[] files = null;
		if(path.isDirectory()){
			files = path.listFiles();
		}
		Arrays.sort(files);

		for(int i=0; i<files.length; ++i){
			System.out.println(files[i]);
		}
		

				
	}

}



