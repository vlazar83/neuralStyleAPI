import sys
import os

def countProcesses():
    KEY_FOR_RUNNING_ENV = os.environ.get('RUNS_INSIDE_CONTAINER', False)
    try:
        if(KEY_FOR_RUNNING_ENV):
            count = os.popen("top -n1 -b | grep 'python3' | wc -l").read()
            print(int(count))
        else:
            count = os.popen("ps | grep 'python3 -u script/neural_style' | wc -l").read()
            print(int(count)-2) #somehow on my local MAC the returning number is min 2, therefore we subtract 2
    except OSError:
        print ('Error in OS command execution.')

countProcesses()