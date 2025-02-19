import os
from django.conf import settings

OUTPUTS_DIR = os.path.join(settings.BASE_DIR, 'output')

print(f"OUTPUTS_DIR: {OUTPUTS_DIR}")
