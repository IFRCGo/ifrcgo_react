# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-23 12:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Dmis_field_report',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ReportID', models.IntegerField()),
                ('CountryID', models.IntegerField()),
                ('StatusID', models.IntegerField()),
                ('DisasterTypeID', models.IntegerField()),
                ('Summary', models.CharField(max_length=255)),
                ('BriefSummary', models.CharField(max_length=255)),
                ('ActionTakenID', models.IntegerField()),
                ('ActionTaken', models.CharField(max_length=255)),
                ('ActionTakenByOthers', models.CharField(max_length=255)),
                ('Originator', models.CharField(max_length=255)),
                ('PrimaryContact', models.CharField(max_length=255)),
                ('SecondaryContact', models.CharField(max_length=255)),
                ('TertiaryContact', models.CharField(max_length=255)),
                ('Inserted', models.DateField(null=True)),
                ('RelatedReportNumber', models.CharField(max_length=255)),
                ('ReportGUID', models.IntegerField()),
                ('GovRequestsInternAssistance', models.CharField(max_length=255)),
                ('ActionTakenByPns', models.CharField(max_length=255)),
                ('ActionTakenByFederation', models.CharField(max_length=255)),
            ],
        ),
    ]
