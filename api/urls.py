from django.urls import path
from . import views
from .tasks import update

urlpatterns = [
    path('', views.get_routes, name='routers'),
    path('video/<int:id>/', views.get_video, name='video'),
    path('playlist/<str:region_code>/', views.get_playlist, name='playlist'),
    path('playlist/<str:region_code>/<int:year>/<int:month>/<int:day>/', views.get_playlist, name='playlist'),
    path('current_data/', views.get_current_data, name='current_data'),
    path('hints/<str:keywords>/', views.get_hints, name='hints'),
    path('search/<str:keywords>/', views.get_queryset, name='queryset'),
    path('history/<int:id>/', views.get_video_history, name='video_history'),
]
