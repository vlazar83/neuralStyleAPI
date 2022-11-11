import sys
import shutil


def moveFilesIntoFolder(folderName, file1, file2):
    try:
        shutil.move("public/images/in/"+file1,
                    "public/images/in/"+folderName+"/"+file1)
        shutil.move("public/images/in/"+file2,
                    "public/images/in/"+folderName+"/"+file2)
    except OSError:
        print('Error moving input files into directory: ' + folderName)


moveFilesIntoFolder(sys.argv[2], sys.argv[4], sys.argv[6])

# shutil.move("../public/images/new1.txt","../public/images/in/zzz/new2.txt")
