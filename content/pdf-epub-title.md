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

{%- if publication.title -%}
  <h1 class="scores-title">{{ publication.title | markdownify }}{% if publication.subtitle %}: {{ publication.subtitle | markdownify }}{% endif %}
  {% if publication.reading_line %}<br /><br />{{ publication.reading_line | markdownify }}{% endif %}</h1>
{%- endif -%}

{%- if publication.contributor_as_it_appears -%}
  <p class="scores-contributor">{{ publication.contributor_as_it_appears | markdownify }}</p>
{%- else -%}
  <p class="scores-contributor">{% contributors context=publicationContributors type="primary" format="string" %}</p>
{%- endif -%}

</section>

<section class="scores-publisher-block">

{%- for publisher in publication.publisher -%}
  {%- if publisher.name -%}
    <p class="scores-publisher">{{ publisher.name }}{% if publisher.location %}, {{ publisher.location }}{% endif %}</p>
  {%- endif %}
{%- endfor -%}

</section>
