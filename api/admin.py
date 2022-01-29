from django.contrib import admin
from .models import CurrentData, Hint, Video, Playlist


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['id', 'title']

@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ['id', 'created']

@admin.register(CurrentData)
class CurrentDatatAdmin(admin.ModelAdmin):
    list_display = ['updated']

@admin.register(Hint)
class CurrentDatatAdmin(admin.ModelAdmin):
    list_display = ['name', 'rating', 'updated']