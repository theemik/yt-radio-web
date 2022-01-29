from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import CurrentData, Hint, Video, Playlist


class PlaylistSerializer(ModelSerializer):
    videos_data = serializers.SerializerMethodField('get_videos')

    class Meta:
        model = Playlist
        fields = ('created', 'videos_data')

    def get_videos(self, playlist):
        videos = []
        fields = ['id', 'yt_id', 'title', 'thumbnail_url', 'view_count']
        for video in playlist.videos.all():
            data = {field: getattr(video, field) for field in fields}
            data['url'] = video.get_url()
            videos.append(data)
        return videos


class VideoSerializer(ModelSerializer):
    url = serializers.SerializerMethodField('get_url')

    class Meta:
        model = Video
        fields = '__all__'

    def get_url(self, video):
        return video.get_url()


class CurrentDataSerializer(ModelSerializer):
    video = VideoSerializer()
    previous_video = VideoSerializer()
    next_video = VideoSerializer()
    time = serializers.SerializerMethodField('get_time')

    class Meta:
        model = CurrentData
        fields = ('video', 'time', 'previous_video', 'next_video')

    def get_time(self, data):
        return data.time_passed()


class VideosSerializer(ModelSerializer):

    class Meta:
        model = Video
        fields = ('id', 'title', 'thumbnail_url')


class HintSerializer(ModelSerializer):
    
    class Meta:
        model = Hint
        fields = '__all__'
