from django.core.management.base import BaseCommand
from django.urls import get_resolver, URLPattern, URLResolver


def extract_url_patterns(patterns, prefix=''):
    urls = []
    for pattern in patterns:
        if isinstance(pattern, URLPattern):
            full_url = prefix + str(pattern.pattern)
            urls.append(full_url)
        elif isinstance(pattern, URLResolver):
            nested_prefix = prefix + str(pattern.pattern)
            urls.extend(extract_url_patterns(pattern.url_patterns, prefix=nested_prefix))
    return urls


class Command(BaseCommand):
    help = "List all registered URL patterns in the Django project."

    def handle(self, *args, **kwargs):
        resolver = get_resolver()
        urls = extract_url_patterns(resolver.url_patterns)

        self.stdout.write(self.style.SUCCESS("📌 Registered URLs:"))
        for url in urls:
            self.stdout.write(f"- /{url}")
