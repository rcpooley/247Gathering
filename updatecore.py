import subprocess
import json

def shellCmd(cmd, dir):
	p = subprocess.Popen(cmd, cwd=dir, shell=True)
	p.wait()

def getCurVersion():
    with open('./247-core/package.json', 'r') as myfile:
        data = myfile.read()
        j = json.loads(data)
        return j['version']

def getNewVersion(curVersion):
    spl = curVersion.split('.')
    spl[2] = str(int(spl[2]) + 1)
    return '.'.join(spl)

curVersion = getCurVersion()
newVersion = getNewVersion(curVersion)

shellCmd('npm run tsc', './247-core')
shellCmd('npm version ' + newVersion, './247-core')
shellCmd('npm update', './Server')
shellCmd('npm update', './ang-app')