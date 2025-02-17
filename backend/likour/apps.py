from django.apps import AppConfig


class LikourConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'likour'

    def ready(self):
        import likour.signals
