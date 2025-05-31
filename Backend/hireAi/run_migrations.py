import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hireAi.settings')
django.setup()

# Run migrations
from django.core.management import call_command

def run_migrations():
    print("Creating migrations...")
    call_command('makemigrations', 'candidate')
    print("\nApplying migrations...")
    call_command('migrate')
    print("\nMigrations completed!")

if __name__ == '__main__':
    run_migrations() 