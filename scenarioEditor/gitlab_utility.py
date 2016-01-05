import gitlab
import ConfigParser
import base64

def get_config():
    configParser = ConfigParser.RawConfigParser()   
    configFilePath = "gitlab.cnf"
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
    
    
def create_file(project_name, file, file_contents, encoding):
    git = login()
    proj_id = get_project_id_by_name(project_name)
    if encoding == "base64":
        file_contents = base64.b64encode(file_contents)
    return git.createfile(proj_id, file, "master", file_contents, "Content Created", encoding)
    
    
def update_file(project_name, file, file_contents, encoding):
    git = login()
    proj_id = get_project_id_by_name(project_name)
    if encoding == "base64":
        file_contents = base64.b64encode(file_contents)
    return git.updatefile(proj_id, file, "master", file_contents, "Content Updated", encoding)
    

def get_project_url(project_name):
    git = login()
    for project in git.getprojects():
        if project['name'] == project_name:
            return project["web_url"]