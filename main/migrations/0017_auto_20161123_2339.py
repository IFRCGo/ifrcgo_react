# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-23 23:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0016_auto_20161123_2320'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dmis_field_report',
            name='ReportGUID',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
