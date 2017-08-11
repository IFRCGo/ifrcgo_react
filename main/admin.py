from django.contrib import admin

# Register your models here.

from .models import Dmis_countries,Dmis_disasters, Dmis_field_report, Dmis_numericalreport, Dmis_response_tools, surge_heops_deployments 

admin.site.register(Dmis_countries)
admin.site.register(Dmis_disasters)
admin.site.register(Dmis_field_report)
admin.site.register(Dmis_numericalreport)
admin.site.register(Dmis_response_tools)
admin.site.register(surge_heops_deployments)