---
layout: base.11ty.js
classes:
  - scores-half-title-page
  - frontmatter
order: 2
outputs:
  - epub
  - pdf
toc: false
---

<section class="scores-half-title">

{% if publication.short_title %}
  {{ publication.short_title | markdownify }}
{% elsif publication.title %}
  {{ publication.title | markdownify }}
{% endif %}

</section>
