# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-28 18:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0017_auto_20161123_2339'),
    ]

    operations = [
        migrations.CreateModel(
            name='Dmis_reponse_tools',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ReportID', models.IntegerField()),
                ('RIT', models.CharField(max_length=255)),
                ('RDRT', models.CharField(max_length=255)),
                ('FACT', models.CharField(max_length=255)),
                ('ERU', models.CharField(max_length=255)),
                ('RFL', models.CharField(max_length=255)),
            ],
        ),
    ]
