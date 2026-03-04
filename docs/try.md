---
layout: page
title: Try Subprojects
permalink: /try/
---

Subprojects are auto-discovered from top-level folders that contain `try/index.html` or `try/index.md`.

{% assign entries = site.data.subprojects | sort: 'title' %}
{% if entries and entries.size > 0 %}
<div class="subproject-grid">
  {% for project in entries %}
  <article class="subproject-card">
    <h3>{{ project.title }}</h3>
    {% if project.summary %}<p>{{ project.summary }}</p>{% endif %}
    <ul>
      {% if project.repo_path %}<li><strong>Path:</strong> <code>{{ project.repo_path }}</code></li>{% endif %}
      {% if project.status %}<li><strong>Status:</strong> {{ project.status }}</li>{% endif %}
    </ul>
    <p><a href="{{ project.try_url | relative_url }}">Try it now →</a></p>
  </article>
  {% endfor %}
</div>
{% else %}
No subprojects with a `try/` entrypoint are published yet.
{% endif %}
