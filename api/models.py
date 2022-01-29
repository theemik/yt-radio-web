from django.db import models
import datetime
from django.db.models.expressions import OrderBy
from django.utils import timezone


class Video(models.Model):
    yt_id = models.CharField(max_length=100)        # videos id on YouTube
    title = models.TextField()
    channel_id = models.CharField(max_length=100)
    channel_name = models.CharField(max_length=100)
    thumbnail_url = models.URLField(max_length=250)
    duration = models.IntegerField()
    published = models.DateTimeField()              # date published on YouTube
    updated = models.DateTimeField(auto_now=True)   # last update in database
    view_count = models.IntegerField()

    def __str__(self):
        return self.title

    def get_url(self):
        return 'https://www.youtube.com/watch?v={}'.format(self.yt_id)


class Playlist(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    videos = models.ManyToManyField(Video, related_name='playlists')
    region_code = models.CharField(max_length=3)

    class Meta:
        ordering = ['created']


class CurrentData(models.Model):
    video = models.ForeignKey(
        Video, related_name='playing', on_delete=models.CASCADE)
    previous_video = models.ForeignKey(
        Video, related_name='previous', on_delete=models.CASCADE, null=True, blank=True)
    next_video = models.ForeignKey(
        Video, related_name='next', on_delete=models.CASCADE, null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)

    def time_passed(self):
        ''' get the time since video playback started '''
        ends = self.updated + \
            datetime.timedelta(0, self.video.duration)  # when video should end
        now = timezone.now()

        if ends > now:
            return (now - self.updated).seconds
        else:
            return False


class Hint(models.Model):
    name = models.CharField(max_length=150)
    rating = models.IntegerField(default=1)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating']

