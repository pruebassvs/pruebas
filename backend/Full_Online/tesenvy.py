from decouple import config

print("STRIPE_PUBLISHABLE_KEY:", config('STRIPE_PUBLISHABLE_KEY'))
print("EMAIL_HOST_USER:", config('EMAIL_HOST_USER'))
print("DB_PASSWORD", config('DB_PASSWORD'))