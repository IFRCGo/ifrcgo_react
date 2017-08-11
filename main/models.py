from __future__ import unicode_literals

from django.db import models

from django.utils.encoding import python_2_unicode_compatible
from django.contrib.auth.models import User

# DMIS imports

class Dmis_field_report(models.Model):
	ReportID = models.IntegerField() #IDs not used by Django, but rather DMIS.  USed to make initial join.
	CountryID = models.IntegerField() #IDs not used by Django, but rather DMIS.  USed to make initial join.
	StatusID = models.IntegerField() #IDs not used by Django, but rather DMIS.  USed to make initial join.
	DisasterTypeID = models.IntegerField() #IDs not used by Django, but rather DMIS.  USed to make initial join.
	Summary = models.TextField()
	BriefSummary = models.TextField()
	ActionTakenID = models.IntegerField(null=True)
	ActionTaken = models.TextField()
	ActionTakenByOthers = models.TextField()
	Originator = models.CharField(max_length=255)
	PrimaryContact = models.CharField(max_length=255)
	SecondaryContact = models.CharField(max_length=255)
	TertiaryContact = models.CharField(max_length=255)
	Inserted = models.DateField(null=True)
	RelatedReportNumber = models.CharField(max_length=255)
	ReportGUID = models.CharField(max_length=255,null=True)
	GovRequestsInternAssistance = models.CharField(max_length=255)
	ActionTakenByPns = models.TextField()
	ActionTakenByFederation = models.TextField()
	DisasterType = models.ManyToManyField("Dmis_disasters", blank=True)
	Country = models.ManyToManyField("Dmis_countries", blank=True)
	NumericalReport = models.ManyToManyField("Dmis_numericalreport", blank=True)
	ResponseTools = models.ManyToManyField("Dmis_response_tools", blank=True)

class Dmis_numericalreport(models.Model):
	NumericDetailsID = models.IntegerField() #IDs not used by Django, but rather DMIS.  USed to make initial join.
	ReportID = models.IntegerField() #IDs not used by Django, but rather DMIS.  USed to make initial join.
	NumberOfInjured = models.IntegerField()
	NumberOfCasualties = models.IntegerField()
	NumberOfMissing = models.IntegerField()
	NumberOfAffected = models.IntegerField()
	NumberOfLocalStaffInvolved = models.IntegerField()
	NumberOfVolunteersInvolved = models.IntegerField()
	NumberOfDisplaced = models.IntegerField()
	NumberOfAssistedByRC = models.IntegerField()
	NumberOfExpatsDelegates = models.IntegerField()

@python_2_unicode_compatible
class Dmis_countries(models.Model):
	Continent_GEO = models.CharField(max_length=255) #IDs not used by Django, but rather DMIS.  USed to make initial join.
	Continent_ID = models.IntegerField() #IDs not used by Django, but rather DMIS.  USed to make initial join.
	CountryID = models.IntegerField() #IDs not used by Django, but rather DMIS.  USed to make initial join.
	RegionID = models.IntegerField() #IDs not used by Django, but rather DMIS.  USed to make initial join.
	IFID = models.IntegerField() #IDs not used by Django, but rather DMIS.  USed to make initial join.
	FIPS_Cntry = models.CharField(max_length=255)
	GMI_CNTRY = models.CharField(max_length=255)
	CountryName = models.CharField(max_length=255)
	ISO = models.CharField(max_length=255)

	def __str__(self):
		return u"%s" % self.CountryName

@python_2_unicode_compatible
class Dmis_disasters(models.Model):
	DisasterTypeName = models.CharField(max_length=255)
	DisasterTypeNameFR = models.CharField(max_length=255)
	DisasterTypeNameES = models.CharField(max_length=255)
	DisasterTypeID = models.IntegerField() #IDs not used by Django, but rather DMIS.  USed to make initial join.

	def __str__(self):
		return u"%s" % self.DisasterTypeName

class Dmis_response_tools(models.Model):
	ReportID = models.IntegerField()
	RIT = models.CharField(max_length=255)
	RDRT = models.CharField(max_length=255)
	FACT = models.CharField(max_length=255)
	ERU = models.CharField(max_length=255)
	RFL = models.CharField(max_length=255)

@python_2_unicode_compatible
class surge_heops_deployments(models.Model):
	startdate = models.DateField(null=True)
	startdate_accuracy = models.CharField(max_length=255)
	enddate = models.DateField(null=True)
	enddate_accuracy = models.CharField(max_length=255)
	zone = models.CharField(max_length=255)
	country = models.CharField(max_length=255) #go back at later date and link to main country list
	disaster = models.CharField(max_length=255) #go back at later date and link to main disaster list
	name = models.CharField(max_length=255)
	deployed_role = models.CharField(max_length=255)
	comments = models.CharField(max_length=255)

	def __str__(self):
		return u"%s - %s" % (self.country, self.name) 


