# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-23 23:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0014_auto_20161123_2255'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dmis_field_report',
            name='ActionTaken',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='dmis_field_report',
            name='BriefSummary',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='dmis_field_report',
            name='Summary',
            field=models.TextField(),
        ),
    ]
