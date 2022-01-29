from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from .models import CurrentData, Hint, Video, Playlist
from . import serializers
from rest_framework.decorators import api_view
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
# from django.contrib.postgres.search import TrigramSimilarity, TrigramDistance


@api_view(['GET'])
def get_routes(request):
    routes = [
        {
            'Endpoint': '/playlist/<region code>/',
            'method': 'GET',
            'body': None,
            'description': 'Returns current playlist for selected region'
        },
        {
            'Endpoint': '/playlist/<region code>/<year>/<month>/<day>/',
            'method': 'GET',
            'body': None,
            'description': 'Returns playlist for selected region and date'
        },
        {
            'Endpoint': '/video/<id>/',
            'method': 'GET',
            'body': None,
            'description': 'Returns video with passed id'
        },
        {
            'Endpoint': '/current_data/',
            'method': 'GET',
            'body': None,
            'description': 'Returns current video data info'
        },
        {
            'Endpoint': '/search/<keywords>/?page=<int>',
            'method': 'GET',
            'body': None,
            'description': 'Returns list of videos (in pages), which titles contains passed keywords'
        },
        {
            'Endpoint': '/hints/<keywords>/',
            'method': 'GET',
            'body': None,
            'description': 'Returns list of most searched hints that starts with passed keywords'
        },
        {
            'Endpoint': '/history/<id>/',
            'method': 'GET',
            'body': None,
            'description': 'Returns playlist that contains selected video'
        },
    ]
    return Response(routes)


@api_view(['GET'])
def get_current_data(request):
    if (CurrentData.objects.exists()):
        data = CurrentData.objects.last()
        serializer = serializers.CurrentDataSerializer(data, many=False)
        return Response(serializer.data)
    else:
        return Response({'error': 'No current data'}, status=400)


@api_view(['GET'])
def get_playlist(request, region_code, year=None, month=None, day=None):
    if year and month and day:
        playlist = Playlist.objects.filter(region_code=region_code.upper(),
                                           created__year=year,
                                           created__month=month,
                                           created__day=day).last()
    else:
        playlist = Playlist.objects.filter(
            region_code=region_code.upper()).last()

    serializer = serializers.PlaylistSerializer(playlist, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def get_video(request, id):
    video = Video.objects.filter(id=id).last()
    if video:
        serializer = serializers.VideoSerializer(video, many=False)
        return Response(serializer.data)
    else:
        return Response({})


@api_view(['GET'])
def get_hints(request, keywords):
    # hints = Hint.objects.annotate(similarity=TrigramSimilarity('name', keywords)).filter(similarity__gt=0.7).order_by('-similarity')
    hints = Hint.objects.filter(name__istartswith=keywords)[:10]
    serializer = serializers.HintSerializer(hints, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_queryset(request, keywords):
    videos = Video.objects.filter(
        title__icontains=keywords).order_by('-view_count')
    all_pages = Paginator(videos, 20)

    page_nr = request.GET.get('page', 1)

    try:
        page = all_pages.page(page_nr)
    except PageNotAnInteger:
        page = None
    except EmptyPage:
        page = None

    # save search keywords as hint, or increment it's rating if already exists
    if (page_nr == '1') and page and ((len(keywords) - keywords.count(' ')) > 2):
        try:
            hint = Hint.objects.get(name=keywords)
            hint.rating += 1
            hint.save()
        except ObjectDoesNotExist:
            Hint.objects.create(name=keywords)

    serializer = serializers.VideosSerializer(page, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_video_history(request, id):
    sorted_history = {}
    playlists = Playlist.objects.filter(
        videos__id__exact=id).exclude(region_code='ALL')
    for playlist in playlists:
        # sorting video occurrence in playlists by region_code => year => month
        code = playlist.region_code
        year = playlist.created.year
        month = playlist.created.month
        if code not in sorted_history:
            sorted_history[code] = {}
        if year not in sorted_history[code]:
            sorted_history[code][year] = {}
        if month not in sorted_history[code][year]:
            sorted_history[code][year][month] = []
        for index, video in enumerate(playlist.videos.all()):
            if video.id == id:
                sorted_history[code][year][month].append({'date': playlist.created.date(),
                                                          'index': index + 1})

    return Response(sorted_history)
