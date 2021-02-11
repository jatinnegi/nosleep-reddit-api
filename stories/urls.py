from django.urls import path
from . import views

app_name = 'stories'

urlpatterns = [
    path('', views.index, name='index'),
    path('submission/<str:submission_id>/',
         views.get_submission, name='submission'),
    path('<str:sort_by>/<int:page>/',
         views.get_10_more_submissions, name='next_submissions'),
    path('search/', views.search, name='search'),
]
