# Generated by Django 3.2.8 on 2021-12-22 23:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_hint_rating'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='hint',
            options={'ordering': ['name']},
        ),
    ]
