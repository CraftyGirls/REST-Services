import gitlab
import ConfigParser
import base64

def get_private_token():
    configParser = ConfigParser.RawConfigParser()   
    configFilePath = "gitlab.cnf"
    configParser.read(configFilePath)
    return configParser.get('contents', 'token')
    
def login():
    return gitlab.Gitlab("gitlab.com", token=get_private_token())
    

def get_project_id_by_name(project_name):
    git = login()
    proj_id = -1
    for project in git.getprojects():
        if project['name'] == project_name:
            proj_id = project['id']

    if proj_id == -1:
        raise ValueError('Invalid Project Name')
    return proj_id
    
    
def create_file(project_name, file, file_contents, encoding):
    git = login()
    proj_id = get_project_id_by_name(project_name) 
    git.createfile(proj_id, file, "master", base64.b64encode(file_contents), "Content Created", encoding)
    
    
def update_file(project_name, file, file_contents, encoding):
    git = login()
    proj_id = get_project_id_by_name(project_name) 
    git.updatefile(proj_id, file, "master", file_contents, "Content Created", encoding)
    

def get_project_url(project_name):
    git = login()
    for project in git.getprojects():
        if project['name'] == project_name:
            return project["web_url"]