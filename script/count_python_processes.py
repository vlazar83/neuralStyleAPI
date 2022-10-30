import sys
import os

def countProcesses():
    try:
        count = os.popen("ps | grep 'python3 -u script/neural_style' | wc -l").read()
        print(int(count)-2)
    except OSError:
        print ('Error in OS command execution.')

countProcesses()