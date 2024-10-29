---
layout: base.11ty.js
classes:
  - scores-title-page
  - frontmatter
order: 3
outputs:
  - pdf
  - epub
toc: false
---

<section class="scores-title-block">

<h1 class="scores-title">{{ publication.title | markdownify }}
  {% if publication.pdf_epub_subtitle %}<span class="scores-subtitle">{{ publication.pdf_epub_subtitle | markdownify }}</span>{% endif %}</h1>

<div class="scores-contributor">
<p>Edited by</p>
{% contributors context=publicationContributors type="primary" format="name" %}
</div>

</section>

<section class="scores-publisher-block">

{%- for publisher in publication.publisher -%}
  {%- if publisher.name -%}
    <p class="scores-publisher">{{ publisher.name }}{% if publisher.location %}, {{ publisher.location }}{% endif %}</p>
  {%- endif %}
{%- endfor -%}

</section>
