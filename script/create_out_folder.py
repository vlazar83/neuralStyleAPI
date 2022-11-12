import sys
import os


def createFolder(directory):
    try:
        print('Creating directory. ' + directory)
        if not os.path.exists(directory):
            os.makedirs(directory)
        if os.path.exists(directory):
            print('Created directory. ' + directory)
    except OSError:
        print('Error: Creating directory. ' + directory)


createFolder('public/images/out/' + sys.argv[2])
createFolder('public/images/in/' + sys.argv[2])
