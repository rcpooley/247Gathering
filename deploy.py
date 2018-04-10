import os
import subprocess
import shutil

ang_src = './ang-app/src'
dist_dir = './Server/build'

def rec_compile_sass(dir):
	if os.path.isdir(dir):
		for file in os.listdir(dir):
			rec_compile_sass(dir + '/' + file)
	elif dir.endswith('.scss'):
		print("Compiling " + dir)
		os.system('sass "' + dir + '" "' + dir[:-4] + 'css')
		
def shellCmd(cmd, dir):
	p = subprocess.Popen(cmd, cwd=dir, shell=True)
	p.wait()
	
def assertExists(dir):
	if not os.path.exists(dir):
		os.makedirs(dir)
		
rec_compile_sass(ang_src)

print("Updating 247-core packages")
shellCmd('npm update --dev', './247-core')
print("Updating Server packages")
shellCmd('npm update --dev', './Server')
print("Updating ang-app packages")
shellCmd('npm update --dev', './ang-app')

print("Building frontend")
shellCmd('npm run build', './ang-app')

print("Building backend")
shellCmd('npm run build', './Server')

print("Copying to dist directory")
assertExists(dist_dir)
shutil.rmtree(dist_dir)
shutil.copytree('./Server/dist/src', dist_dir)
shutil.copytree('./ang-app/dist', dist_dir + '/public')