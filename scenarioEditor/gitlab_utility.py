import os

import gitlab
import ConfigParser
import base64

def get_config():
    configParser = ConfigParser.RawConfigParser()   
    configFilePath = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'gitlab.cnf')
    configParser.read(configFilePath)
    return (configParser.get('contents', 'url'), configParser.get('contents', 'token'))

def login():
    config = get_config()
    return gitlab.Gitlab(config[0], config[1])
    

def get_project_id_by_name(project_name):
    git = login()
    proj_id = -1
    for project in git.getprojects():
        if project['name'] == project_name:
            proj_id = project['id']

    if proj_id == -1:
        raise ValueError('Invalid Project Name')
    return proj_id
    
    
def create_file(project_name, branch, file, file_contents, encoding):
    git = login()
    proj_id = get_project_id_by_name(project_name)
    if encoding == "base64":
        file_contents = base64.b64encode(file_contents)
    return git.createfile(proj_id, file, branch, file_contents, "Content Created", encoding)
    
    
def update_file(project_name, branch, file, file_contents, encoding):
    git = login()
    proj_id = get_project_id_by_name(project_name)
    if encoding == "base64":
        file_contents = base64.b64encode(file_contents)
    return git.updatefile(proj_id, file, branch, file_contents, "Content Updated", encoding)
    

def delete_file(file, branch):
    git = login()
    project_name = get_project_name()
    proj_id = get_project_id_by_name(project_name)
    return git.deletefile(proj_id, file, branch, 'Content Deleted')


def get_project_url():
    configParser = ConfigParser.RawConfigParser()
    configFilePath = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'gitlab.cnf')
    configParser.read(configFilePath)
    proj = configParser.get('contents', 'project')
    username = configParser.get('contents', 'username')
    url = configParser.get('contents', 'url')
    return url + "/" + username + "/" + proj

def get_project_name():
    configParser = ConfigParser.RawConfigParser()
    configFilePath = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'gitlab.cnf')
    configParser.read(configFilePath)
    return configParser.get('contents', 'project')


def create_branch_if_not_exists(name):
     git = login()
     branches = git.getbranches(get_project_id_by_name(get_project_name()))
     if name not in branches:
         git.createbranch(get_project_id_by_name(get_project_name()), name, "master")