__author__ = 'ryan'

class PrimaryReplicaRouter(object):

    def db_for_read(self, model, **hints):

        return 'primary'

    def db_for_write(self, model, **hints):

        return 'primary'

    def allow_relation(self, obj1, obj2, **hints):

        db_list = ('primary')
        if obj1._state.db in db_list and obj2._state.db in db_list:
            return True
        return None

    def allow_migrate(self, db, app_label, model=None, **hints):

        return True