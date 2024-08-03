# Generated by Django 5.0.6 on 2024-08-03 17:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_conversation_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deliverystatustype',
            name='description',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Transit', 'In transit'), ('Completed', 'Completed')], max_length=45),
        ),
    ]
