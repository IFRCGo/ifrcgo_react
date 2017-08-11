from django.http import HttpResponse, HttpResponseRedirect
from .models import Dmis_field_report, Dmis_numericalreport, Dmis_countries, Dmis_disasters, surge_heops_deployments
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
import json, feedparser
import unicodecsv as csv
from datetime import datetime, timedelta

def index(request):
    return HttpResponse("Hello, hi world.")

@login_required(login_url='/login')
def data(request,rtype=None,value=7):
    response = '{}'
    if rtype=='latest':
        response = getLatest(int(value))
    if rtype=='report':
        response = getReport(int(value))
    if rtype=='country':
        response = getCountry(value)        
    if rtype== 'heops':
        response = getHeOps()
    return HttpResponse(response)

def getLatest(length):
    reports = Dmis_field_report.objects.filter(Inserted__gte=datetime.now()-timedelta(days=length)).order_by('-Inserted')
    response = []
    for r in reports:
        report = {}
        report['summary'] = r.Summary
        report['briefsummary'] = r.BriefSummary
        report['countryname']  = r.Country.all()[0].CountryName
        report['countryid'] = r.Country.all()[0].GMI_CNTRY
        report['disastertype'] = r.DisasterType.all()[0].DisasterTypeName
        report['injured'] = r.NumericalReport.all()[0].NumberOfInjured
        report['casualties'] = r.NumericalReport.all()[0].NumberOfCasualties
        report['missing'] = r.NumericalReport.all()[0].NumberOfMissing  
        report['affected'] = r.NumericalReport.all()[0].NumberOfAffected  
        report['staff'] = r.NumericalReport.all()[0].NumberOfLocalStaffInvolved
        report['volunteers'] = r.NumericalReport.all()[0].NumberOfVolunteersInvolved 
        report['displaced'] = r.NumericalReport.all()[0].NumberOfDisplaced 
        report['assisted'] = r.NumericalReport.all()[0].NumberOfAssistedByRC
        report['delegates'] = r.NumericalReport.all()[0].NumberOfExpatsDelegates
        report['date'] = str( r.Inserted )
        report['id'] = r.ReportID
        response.append(report)
    response = json.dumps(response)
    return response


#using reportID as the ID rather than ID in case we need to do anything inline with DMIS.  Should change at a later date.

def getReport(id):
    r = Dmis_field_report.objects.filter(ReportID=id)[0]
    report = {}
    report['summary'] = r.Summary
    report['briefsummary'] = r.BriefSummary
    report['countryname']  = r.Country.all()[0].CountryName
    report['countryid'] = r.Country.all()[0].GMI_CNTRY
    report['disastertype'] = r.DisasterType.all()[0].DisasterTypeName
    report['injured'] = r.NumericalReport.all()[0].NumberOfInjured
    report['casualties'] = r.NumericalReport.all()[0].NumberOfCasualties
    report['missing'] = r.NumericalReport.all()[0].NumberOfMissing  
    report['affected'] = r.NumericalReport.all()[0].NumberOfAffected  
    report['staff'] = r.NumericalReport.all()[0].NumberOfLocalStaffInvolved
    report['volunteers'] = r.NumericalReport.all()[0].NumberOfVolunteersInvolved 
    report['displaced'] = r.NumericalReport.all()[0].NumberOfDisplaced 
    report['assisted'] = r.NumericalReport.all()[0].NumberOfAssistedByRC
    report['delegates'] = r.NumericalReport.all()[0].NumberOfExpatsDelegates
    report['fact'] = r.ResponseTools.all()[0].FACT
    report['date'] = str( r.Inserted )
    report['actiontaken'] = r.ActionTaken
    report['actiontakenbyothers'] = r.ActionTakenByOthers
    report['actiontakenbypns'] = r.ActionTakenByPns
    report['actiontakenbyfederation'] = r.ActionTakenByFederation
    response = json.dumps(report)
    return response

def getCountry(id):
    reports = Dmis_field_report.objects.filter(CountryID=id).order_by('-Inserted')
    response = []
    for r in reports:
        report = {}
        if len(r.NumericalReport.all())>0:
            report['summary'] = r.Summary
            report['briefsummary'] = r.BriefSummary
            report['countryname']  = r.Country.all()[0].CountryName
            report['countryid'] = r.Country.all()[0].GMI_CNTRY
            report['disastertype'] = r.DisasterType.all()[0].DisasterTypeName
            report['injured'] = r.NumericalReport.all()[0].NumberOfInjured
            report['casualties'] = r.NumericalReport.all()[0].NumberOfCasualties
            report['missing'] = r.NumericalReport.all()[0].NumberOfMissing  
            report['affected'] = r.NumericalReport.all()[0].NumberOfAffected  
            report['staff'] = r.NumericalReport.all()[0].NumberOfLocalStaffInvolved
            report['volunteers'] = r.NumericalReport.all()[0].NumberOfVolunteersInvolved 
            report['displaced'] = r.NumericalReport.all()[0].NumberOfDisplaced 
            report['assisted'] = r.NumericalReport.all()[0].NumberOfAssistedByRC
            report['delegates'] = r.NumericalReport.all()[0].NumberOfExpatsDelegates
            report['date'] = str( r.Inserted )
            report['id'] = r.ReportID
            response.append(report)
    response = json.dumps(response)
    return response

def getHeOps():
    deploys = surge_heops_deployments.objects.all()
    response = []
    for d in deploys:
        deploy = {}
        deploy['startdate'] = str( d.startdate )
        deploy['startdate_accuracy'] =d.startdate_accuracy
        deploy['enddate'] = str( d.enddate )
        deploy['enddate_accuracy'] = d.enddate_accuracy
        deploy['zone'] = d.zone
        deploy['country'] = d.country
        deploy['disaster'] = d.disaster
        deploy['name'] = d.name
        deploy['deployed_role'] = d.deployed_role
        deploy['comments'] = d.comments
        response.append(deploy)
    response = json.dumps(response)
    return response

@login_required(login_url='/login/')
def field_reports_overview(request):
    return render(request, 'main/field_reports_overview.html')

@login_required(login_url='/login/')
def field_report(request,id):
    data = {}
    data['id'] = id
    return render(request, 'main/field_report.html',data)

@login_required(login_url='/login/')
def country_report(request,id):
    data = {}
    data['iso'] = id
    data['id'] = Dmis_countries.objects.filter(GMI_CNTRY = id)[0].CountryID
    data['name'] = Dmis_countries.objects.filter(GMI_CNTRY = id)[0].CountryName
    return render(request, 'main/country_report.html',data)

def open_field_reports_api(request,value):
    reports = Dmis_field_report.objects.filter(Inserted__gte=datetime.now()-timedelta(days=int(value))).order_by('-Inserted')
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="fieldreports.csv"'
    writer = csv.writer(response)
    writer.writerow(['Title', 'Country', 'Country Code', 'Crisis type','date','url'])
    writer.writerow(['#meta+title', '#country+name', '#country+code', '#crisis+type','#date','#meta+url'])
    for r in reports:
        report = []
        report.append(r.Summary)
        report.append(r.Country.all()[0].CountryName)
        report.append(r.Country.all()[0].GMI_CNTRY)
        report.append(r.DisasterType.all()[0].DisasterTypeName)
        report.append(str( r.Inserted ))
        report.append('https://'+request.get_host()+'/fieldreport/'+str(r.ReportID))
        writer.writerow(report)

    return response

def open_gdacs(request):
    feed = feedparser.parse('http://www.gdacs.org/xml/rss.xml')
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="fieldreports.csv"'
    writer = csv.writer(response)
    writer.writerow(['Title', 'URL'])
    writer.writerow(['#meta+title','#meta+url'])
    for item in feed['entries']:
        print item
        writer.writerow([item['title'],item['link']])
    return response

def user_login(request):
    data = {}
    data['next'] = "/fieldreports"

    if request.GET:
        data['next'] = request.GET['next']

    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        next = request.POST['next']
        user = authenticate(username=username, password=password)
        if user:           
            login(request, user)
            return HttpResponseRedirect(next)
        else:
            return HttpResponse("Invalid login details supplied.")
    else:
        return render(request,'registration/login.html',data)

def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/login')

@login_required(login_url='/login/')
def heops(request):
    return render(request, 'main/heops.html')

@login_required(login_url='/login/')
def eru_readiness(request):
    return render(request, 'main/eru_readiness.html')

@login_required(login_url='/login/')
def food_crisis(request):
    return render(request, 'main/food_crisis.html')

@login_required(login_url='/login/')
def security_alerts(request):
    return render(request, 'main/security_alerts.html')



def disaster_taxonomy_overview(request):
    disastertypes = Dmis_disasters.objects.all()
    output = [];
    for dis in disastertypes:
        count = Dmis_field_report.objects.filter(DisasterType=dis).count()
        output.append({'Type':dis.DisasterTypeName,'Count':count})
    response = json.dumps(output)
    return HttpResponse(response)
