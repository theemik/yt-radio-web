import isodate
import requests
import random
import time
from .models import Playlist, Video
from django.conf import settings
from django.shortcuts import get_object_or_404
from background_task import background
from .models import Video, Playlist, CurrentData
from django.utils import timezone
from background_task.models import CompletedTask, Task


def playlists_update():
    '''Get videos from YT api, (returns all updated videos id's)'''

    yt_url = 'https://youtube.googleapis.com/youtube/v3/videos'
    region_codes = ['PL', 'US', 'JP', 'GB', 'FR', 'KR', 'CA', 'AU', 'BR']
    main_playlist, created = Playlist.objects.update_or_create(
        region_code='ALL')
    # select regions that should be in main playlist
    main_playlist_region_codes = ['PL', 'US', 'CA', 'GB', 'BR']

    for region_code in region_codes:
        playlist = Playlist.objects.create(region_code=region_code)

        # filter regions of main playlist
        if region_code in main_playlist_region_codes:
            add_video = True
        else:
            add_video = False

        data_params = {
            'part': ['snippet', 'contentDetails', 'statistics'],
            'chart': 'mostPopular',
            'regionCode': region_code,
            'videoCategoryId': 10,
            'maxResults': 10,
            'key': settings.YT_KEY
        }

        data = requests.get(yt_url, params=data_params)
        items = data.json()['items']

        # add or update videos from new playlist if already exists
        for result in items:
            video, created = Video.objects.update_or_create(yt_id=result['id'], defaults={'yt_id': result['id'],
                                                                                          'title': result['snippet']['title'],
                                                                                          'channel_id': result['snippet']['channelId'],
                                                                                          'channel_name': result['snippet']['channelTitle'],
                                                                                          'thumbnail_url': result['snippet']['thumbnails']['high']['url'],
                                                                                          'duration': int(isodate.parse_duration(result['contentDetails']['duration']).total_seconds()),
                                                                                          'published': result['snippet']['publishedAt'],
                                                                                          'view_count': result['statistics']['viewCount']})
            playlist.videos.add(video)

            if add_video:
                main_playlist.videos.add(video)

    return main_playlist


@background(schedule=0)
def update(videos_ids_left=[], all_videos_ids=[]):
    ''' Updating videos from current playlist '''
    if videos_ids_left:
        video_id = videos_ids_left.pop()   # select current video
        video = Video.objects.get(id=video_id)
        print(video_id, ' : ', video.duration, flush=True)

        # get previous video id
        try:
            id = all_videos_ids[all_videos_ids.index(video_id) + 1]
            previous = Video.objects.get(id=id)
        except IndexError:
            previous = None

        # get next video id
        try:
            id = all_videos_ids[all_videos_ids.index(video_id) - 1]
            next = Video.objects.get(id=id)
        except IndexError:
            next = None

        CurrentData.objects.update_or_create(pk=1, defaults={
            'video': video,
            'previous_video': previous,
            'next_video': next})

        # for x in range(video.duration):
        #     print(x)
        #     time.sleep(1)
        time.sleep(video.duration)
        update(videos_ids_left, all_videos_ids, verbose_name='update')
    else:
        # clean old tasks
        Task.objects.all().delete()
        CompletedTask.objects.all().delete()
        
        # get all videos id's from main playlist
        today = timezone.now().date()

        try:
            last = Playlist.objects.last().created.date()
        except (AttributeError, ValueError):
            last = None

        if last != today:
            playlist = playlists_update()
        else:
            playlist = get_object_or_404(Playlist, region_code='ALL')

        videos_ids = [video.id for video in playlist.videos.all()]
        random.shuffle(videos_ids)

        update(videos_ids, videos_ids, verbose_name='upadte')
