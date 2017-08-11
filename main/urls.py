from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^data/$', views.data),
    url(r'^data/(?P<rtype>\w+)/$', views.data),
    url(r'^data/(?P<rtype>\w+)/(?P<value>\d+)$', views.data),
    url(r'^data/(?P<rtype>\w+)/(?P<value>\w+)$', views.data),
    url(r'^open/fieldreports/(?P<value>\d+)$',views.open_field_reports_api),
    url(r'^open/gdacs',views.open_gdacs),
    url(r'^fieldreports$', views.field_reports_overview),
    url(r'^fieldreport/(?P<id>\d+)$', views.field_report),
    url(r'^fieldreport/country/(?P<id>\w+)$', views.country_report),
    url(r'^heops/$', views.heops),
    url(r'^eru_readiness/$', views.eru_readiness),
    url(r'^open/disaster_taxonomy_overview/$', views.disaster_taxonomy_overview)
]