# Generated by Django 3.2.8 on 2021-12-15 19:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_video_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='currentdata',
            name='next_video_id',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='currentdata',
            name='previous_video_id',
            field=models.IntegerField(),
        ),
    ]
